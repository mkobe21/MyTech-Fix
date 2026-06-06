-- Team Invites table for managing pending team invitations
CREATE TABLE IF NOT EXISTS public.team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member', 'viewer')) DEFAULT 'member',
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, email)
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_team_invites_token ON public.team_invites(token);
CREATE INDEX IF NOT EXISTS idx_team_invites_email ON public.team_invites(email);

-- Create helper functions here so invites policies can use them safely (non-recursive).
-- (team_policies migration will also ensure them later)
DROP FUNCTION IF EXISTS public.is_team_admin(uuid);
DROP FUNCTION IF EXISTS public.is_team_admin(uuid, uuid);
DROP FUNCTION IF EXISTS public.is_team_member(uuid);
DROP FUNCTION IF EXISTS public.is_team_member(uuid, uuid);

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

-- RLS
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- Team owners/admins can view invites for their team (using safe helper to avoid recursion)
CREATE POLICY "Team admins can view invites"
  ON public.team_invites FOR SELECT
  USING (is_team_admin(team_id, auth.uid()));

-- Team owners/admins can create invites
CREATE POLICY "Team admins can create invites"
  ON public.team_invites FOR INSERT
  WITH CHECK (is_team_admin(team_id, auth.uid()));

-- Team owners/admins can delete invites
CREATE POLICY "Team admins can delete invites"
  ON public.team_invites FOR DELETE
  USING (is_team_admin(team_id, auth.uid()));

-- Anyone can view an invite by token (for acceptance flow)
CREATE POLICY "Public can view invite by token"
  ON public.team_invites FOR SELECT
  USING (true);  -- We'll control access via the token in the API
