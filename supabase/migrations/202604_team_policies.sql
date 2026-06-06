-- ============================================================
-- CLEAN RLS POLICIES FOR TEAMS (No Recursion) + Helper Functions
-- Run this (or re-apply) to fix "infinite recursion detected in policy for relation team_members"
-- and permission issues with teams/members/devices/invites.
-- 
-- The root cause of recursion is policies on team_members/devices/invites that do
-- subqueries back into team_members (e.g. "team_id IN (SELECT ... FROM team_members)").
-- Those subqueries re-trigger the policy, causing infinite recursion (42P17).
--
-- Solution: SECURITY DEFINER helper functions that bypass RLS for the membership check.
-- ============================================================

-- 1. Drop ALL known variants of policies on team-related tables
-- (covers names from small_business_teams, update_tiers_and_teams, team_invites, previous policies, and the ones you showed)
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

-- Additional policies that may depend on the functions (from the latest error)
DROP POLICY IF EXISTS "Team admins can manage invites" ON public.team_invites;
DROP POLICY IF EXISTS "Admins can add team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can update member roles" ON public.team_members;
DROP POLICY IF EXISTS "Admins can remove members" ON public.team_members;

-- Dynamically drop ALL remaining policies on custom tables to ensure no dependents on functions
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
    END LOOP;
END $$;

-- Drop any old/ambiguous versions of the helper functions (this fixes "function is_team_admin(uuid) is not unique")
DROP FUNCTION IF EXISTS public.is_team_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_team_admin(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_team_member(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_team_member(uuid, uuid) CASCADE;

-- 2. Create helper functions (SECURITY DEFINER = bypasses RLS, no recursion)
-- These are safe to call from policies and app code.
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

-- Grant so authenticated users (and policies) can call them
GRANT EXECUTE ON FUNCTION public.is_team_member(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_team_admin(uuid, uuid) TO authenticated;

-- 3. Safe policies for team_members
-- View: only your own membership rows (no subquery recursion)
CREATE POLICY "Users can view their own team memberships"
  ON public.team_members FOR SELECT
  USING (user_id = auth.uid());

-- Manage (insert/update/delete): only if you are owner/admin of that team
-- Uses the helper function (runs as definer, no RLS on inner team_members query)
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

-- 4. Safe policies for teams
CREATE POLICY "Users can view teams they are members of"
  ON public.teams FOR SELECT
  USING (is_team_member(id, auth.uid()));

CREATE POLICY "Users can create teams (as owner)"
  ON public.teams FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Owners can manage (update/delete) their own teams (for completeness)
CREATE POLICY "Owners can manage their own teams"
  ON public.teams FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- 5. Safe policies for devices
CREATE POLICY "Team members can manage devices"
  ON public.devices FOR ALL
  USING (is_team_member(team_id, auth.uid()));

-- 6. Safe policies for team_invites (override the ones created in 202604_team_invites.sql)
-- Admins of a team can view/create/delete invites for it
CREATE POLICY "Team admins can view invites"
  ON public.team_invites FOR SELECT
  USING (is_team_admin(team_id, auth.uid()));

CREATE POLICY "Team admins can create invites"
  ON public.team_invites FOR INSERT
  WITH CHECK (is_team_admin(team_id, auth.uid()));

CREATE POLICY "Team admins can delete invites"
  ON public.team_invites FOR DELETE
  USING (is_team_admin(team_id, auth.uid()));

-- Public (token-based) access for invite acceptance flow (controlled in API by token, not RLS)
CREATE POLICY "Public can view invite by token"
  ON public.team_invites FOR SELECT
  USING (true);

-- 7. Ensure RLS enabled
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- Note: Also ensure the helper functions + policies are in place for any other tables
-- (e.g. chat_sessions with team_id) if you add team-scoped chat visibility later.

-- Chat RLS (added for full functionality: personal + team-scoped chats, messages, deletes from history)
-- These complement the teams policies.
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own or team chat sessions"
  ON public.chat_sessions FOR SELECT
  USING (
    user_id = auth.uid() 
    OR (team_id IS NOT NULL AND is_team_member(team_id, auth.uid()))
  );

CREATE POLICY "Users can insert own chat sessions"
  ON public.chat_sessions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own chat sessions"
  ON public.chat_sessions FOR DELETE
  USING (user_id = auth.uid());

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in own/team sessions"
  ON public.chat_messages FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM public.chat_sessions 
      WHERE user_id = auth.uid() 
         OR (team_id IS NOT NULL AND is_team_member(team_id, auth.uid()))
    )
  );

CREATE POLICY "Users can insert messages to own or team sessions"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM public.chat_sessions 
      WHERE user_id = auth.uid() 
         OR (team_id IS NOT NULL AND is_team_member(team_id, auth.uid()))
    )
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can delete messages from own sessions"
  ON public.chat_messages FOR DELETE
  USING (
    session_id IN (
      SELECT id FROM public.chat_sessions WHERE user_id = auth.uid()
    )
  );
