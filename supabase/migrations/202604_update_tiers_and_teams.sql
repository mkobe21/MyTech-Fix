-- ============================================================
-- MyTech-Fix - Tier & Team Schema Update
-- Date: April 2026
-- This script updates the database to support the current tier structure:
-- free_trial, single_use, home, business, business_plus
-- + Team features for Small Business plans
-- ============================================================

-- 1. Ensure profiles.tier accepts all current values
-- Drop old constraint if it exists, then re-add with new values
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_tier_check' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_tier_check;
    END IF;
END $$;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_tier_check 
CHECK (tier IN ('free_trial', 'single_use', 'home', 'business', 'business_plus'));

-- 2. Create / Update free_trial_claims table (one-time free trial enforcement)
CREATE TABLE IF NOT EXISTS public.free_trial_claims (
  email TEXT PRIMARY KEY,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.free_trial_claims ENABLE ROW LEVEL SECURITY;

-- Deny all access from normal clients (only accessible via service_role)
CREATE POLICY "Deny all for anon and authenticated" 
ON public.free_trial_claims
FOR ALL
TO anon, authenticated
USING (false);

-- 3. Teams table (for Small Business plans)
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Team members with roles
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')) DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 5. Devices table (Business device inventory)
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  device_type TEXT,
  location TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT,
  last_troubleshot_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Extend chat_sessions for team context
ALTER TABLE public.chat_sessions
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id),
  ADD COLUMN IF NOT EXISTS device_id UUID REFERENCES public.devices(id),
  ADD COLUMN IF NOT EXISTS tags TEXT[];

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON public.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_team_id ON public.devices(team_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_team_id ON public.chat_sessions(team_id);
CREATE INDEX IF NOT EXISTS idx_free_trial_claims_email ON public.free_trial_claims(email);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Teams: Users can only see teams they belong to
CREATE POLICY "Users can view their own teams"
  ON public.teams FOR SELECT
  USING (id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  ));

-- Team Members
CREATE POLICY "Users can view members of their teams"
  ON public.team_members FOR SELECT
  USING (team_id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  ));

-- Admins can manage team members
CREATE POLICY "Team admins can manage members"
  ON public.team_members FOR ALL
  USING (team_id IN (
    SELECT team_id FROM public.team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- Devices
CREATE POLICY "Team members can manage devices"
  ON public.devices FOR ALL
  USING (team_id IN (
    SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
  ));

-- =====================================================
-- Updated Trigger (supports new tiers + free trial claims)
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

  -- Record free trial claim for this email (enforces one-time free trial)
  IF NEW.email IS NOT NULL THEN
    INSERT INTO public.free_trial_claims (email, claimed_at)
    VALUES (NEW.email, NOW())
    ON CONFLICT (email) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Re-create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- Optional: Plans lookup table (recommended for future)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.plans (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  price_monthly NUMERIC,
  max_users INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed current plans
INSERT INTO public.plans (key, label, price_monthly, max_users) VALUES
  ('free_trial', 'Free Trial', 0, 1),
  ('single_use', 'Single Use', 9.99, 1),
  ('home', 'Home Plan', 9.99, 1),
  ('business', 'Small Business', 29.99, 5),
  ('business_plus', 'Small Business Plus', 59.99, 15)
ON CONFLICT (key) DO UPDATE 
  SET label = EXCLUDED.label,
      price_monthly = EXCLUDED.price_monthly,
      max_users = EXCLUDED.max_users;

COMMENT ON TABLE public.plans IS 'Centralized plan definitions for Small Business tier support';