-- =====================================================
-- Small Business Tier: Teams, Members, Devices
-- Run this in Supabase SQL Editor or via migration
-- =====================================================

-- 1. Teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Team members (with roles)
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')) DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 3. Devices (Business Device Inventory)
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  device_type TEXT,                    -- Laptop, Printer, Router, POS, Camera, etc.
  location TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT,
  last_troubleshot_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Extend chat_sessions for team context
ALTER TABLE public.chat_sessions
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id),
  ADD COLUMN IF NOT EXISTS device_id UUID REFERENCES public.devices(id),
  ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON public.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_team_id ON public.devices(team_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_team_id ON public.chat_sessions(team_id);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Teams: Users can see teams they are members of
CREATE POLICY "Users can view their teams"
  ON public.teams FOR SELECT
  USING (id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid()));

-- Team members: Users can see members of teams they belong to
CREATE POLICY "Users can view team members"
  ON public.team_members FOR SELECT
  USING (team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid()));

-- Admins/owners can manage team members
CREATE POLICY "Admins can manage team members"
  ON public.team_members FOR ALL
  USING (team_id IN (
    SELECT team_id FROM public.team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Devices: Team members can manage devices in their team
CREATE POLICY "Team members can manage devices"
  ON public.devices FOR ALL
  USING (team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid()));

-- Note: chat_sessions policies should also be updated later to respect team visibility

-- =====================================================
-- Updated trigger to support business onboarding
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, tier, sessions_used, created_at)
  VALUES (NEW.id, NEW.email, 'free_trial', 0, NOW())
  ON CONFLICT (id) DO UPDATE 
    SET email = EXCLUDED.email;

  -- Record free trial claim
  IF NEW.email IS NOT NULL THEN
    INSERT INTO public.free_trial_claims (email, claimed_at)
    VALUES (NEW.email, NOW())
    ON CONFLICT (email) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Re-attach trigger if needed
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON TABLE public.teams IS 'Teams for Small Business plan users';
COMMENT ON TABLE public.team_members IS 'Team membership with role-based access';
COMMENT ON TABLE public.devices IS 'Business device inventory for Small Business plan';