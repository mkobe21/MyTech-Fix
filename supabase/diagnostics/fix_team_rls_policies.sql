-- ============================================================
-- IMMEDIATE FIX: Run this in Supabase SQL Editor to replace the bad recursive
-- team RLS policies with safe non-recursive ones.
--
-- This is the logic from the updated 202604_team_policies.sql .
-- Run it to stop infinite recursion (42P17) and permission problems
-- when viewing/managing teams, members, devices, or invites.
--
-- After running, re-test team features (e.g. dashboard team buttons, /teams, invites).
-- ============================================================

-- Drop the exact bad policies you showed + all known variants + the ones from the latest error
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Team admins can manage members" ON public.team_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.team_members;
DROP POLICY IF EXISTS "Users can view members of their teams" ON public.team_members;
DROP POLICY IF EXISTS "Users can view their own team memberships" ON public.team_members;
DROP POLICY IF EXISTS "Users can view team members" ON public.team_members;

DROP POLICY IF EXISTS "Users can view teams they belong to" ON public.teams;
DROP POLICY IF EXISTS "Users can view their teams" ON public.teams;
DROP POLICY IF EXISTS "Team members can view their teams" ON public.teams;
DROP POLICY IF EXISTS "Users can view teams they are members of" ON public.teams;
DROP POLICY IF EXISTS "Users can view their own teams" ON public.teams;

DROP POLICY IF EXISTS "Team members can manage devices" ON public.devices;

DROP POLICY IF EXISTS "Team admins can view invites" ON public.team_invites;
DROP POLICY IF EXISTS "Team admins can create invites" ON public.team_invites;
DROP POLICY IF EXISTS "Team admins can delete invites" ON public.team_invites;
DROP POLICY IF EXISTS "Public can view invite by token" ON public.team_invites;

-- Additional policies from previous manual runs or old migrations (the ones causing the current drop error)
DROP POLICY IF EXISTS "Team admins can manage invites" ON public.team_invites;
DROP POLICY IF EXISTS "Admins can add team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can update member roles" ON public.team_members;
DROP POLICY IF EXISTS "Admins can remove members" ON public.team_members;

-- Dynamically drop ALL remaining policies on our custom tables (bulletproof cleanup)
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename IN ('team_members', 'teams', 'devices', 'team_invites', 'profiles', 'user_tiers', 'free_trial_claims', 'chat_sessions', 'chat_messages')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', pol.policyname, pol.tablename);
        RAISE NOTICE 'Dropped policy % on table %', pol.policyname, pol.tablename;
    END LOOP;
END $$;

-- Drop any old/ambiguous versions of the helper functions (this fixes "function is_team_admin(uuid) is not unique")
-- Use CASCADE to handle any remaining dependents
DROP FUNCTION IF EXISTS public.is_team_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_team_admin(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_team_member(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_team_member(uuid, uuid) CASCADE;

-- Create (or replace) the safe helper functions
CREATE OR REPLACE FUNCTION public.is_team_member(p_team_id uuid, p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = p_team_id AND user_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_team_admin(p_team_id uuid, p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = p_team_id 
      AND user_id = p_user_id
      AND role IN ('owner', 'admin')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_team_admin(uuid, uuid) TO authenticated;

-- Recreate safe policies

-- team_members
CREATE POLICY "Users can view their own team memberships"
  ON public.team_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage team members"
  ON public.team_members FOR ALL
  USING (
    is_team_admin(team_id, auth.uid()) OR 
    EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.owner_id = auth.uid())
  )
  WITH CHECK (
    is_team_admin(team_id, auth.uid()) OR 
    EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.owner_id = auth.uid())
  );

-- teams
CREATE POLICY "Users can view teams they are members of"
  ON public.teams FOR SELECT
  USING (is_team_member(id, auth.uid()));

CREATE POLICY "Users can create teams (as owner)"
  ON public.teams FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can manage their own teams"
  ON public.teams FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- devices
CREATE POLICY "Team members can manage devices"
  ON public.devices FOR ALL
  USING (is_team_member(team_id, auth.uid()));

-- team_invites
CREATE POLICY "Team admins can view invites"
  ON public.team_invites FOR SELECT
  USING (is_team_admin(team_id, auth.uid()));

CREATE POLICY "Team admins can create invites"
  ON public.team_invites FOR INSERT
  WITH CHECK (is_team_admin(team_id, auth.uid()));

CREATE POLICY "Team admins can delete invites"
  ON public.team_invites FOR DELETE
  USING (is_team_admin(team_id, auth.uid()));

CREATE POLICY "Public can view invite by token"
  ON public.team_invites FOR SELECT
  USING (true);

-- Ensure RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- Verify (run this to see the new safe policies)
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('team_members', 'teams', 'devices', 'team_invites')
ORDER BY tablename, policyname;

SELECT 'RLS policies fixed. Test team management / invites / dashboard team features now.' AS status;