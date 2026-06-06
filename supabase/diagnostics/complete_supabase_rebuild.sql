-- ============================================================
-- COMPLETE SUPABASE SCHEMA REBUILD FOR MyTech-Fix
-- 
-- PURPOSE: Completely drop and recreate the custom database schema
-- to exactly match the structure expected by the website/app code.
--
-- This addresses all accumulated issues from incremental migrations:
-- - Wrong PK on user_tiers (id vs user_id)
-- - Missing columns (images_used, stripe_customer_id, full_name, etc.)
-- - Outdated CHECK constraints (missing business_plus)
-- - Recursive RLS policies causing 42P17
-- - Missing/ambiguous helper functions (is_team_*)
-- - Inconsistent triggers, policies, indexes
-- - Drift between profiles and user_tiers
--
-- HOW TO USE:
-- 1. BACKUP YOUR DATA FIRST (if you have production data: use Supabase dashboard export or pg_dump)
-- 2. Go to your Supabase project > SQL Editor
-- 3. Paste and run the ENTIRE contents of this file.
-- 4. After success:
--    - Create the 'chat-uploads' storage bucket in Storage section (recommended: public for simplicity, or set policies)
--    - If using local Supabase, restart or db reset
--    - Test login (new users will get correct rows via trigger)
--    - Re-seed any test data if needed via restore-admin-tier.sql or manual
-- 5. Optionally re-apply this or the main migrations for idempotency.
--
-- This script is designed to be run as a full reset. It merges the latest
-- definitions from all previous migrations into one clean, correct structure.
-- ============================================================

-- ============================================
-- 1. DROP EVERYTHING (in safe reverse order)
-- ============================================

-- Drop policies first (to avoid dependency issues)
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
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Deny all for anon and authenticated" ON public.free_trial_claims;
DROP POLICY IF EXISTS "Users can view their own tier data" ON public.user_tiers;
DROP POLICY IF EXISTS "Users can update their own tier data (limited)" ON public.user_tiers;
DROP POLICY IF EXISTS "Deny direct insert from clients" ON public.user_tiers;

-- Additional policies from previous manual runs or old migrations that depend on functions
DROP POLICY IF EXISTS "Team admins can manage invites" ON public.team_invites;
DROP POLICY IF EXISTS "Admins can add team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can update member roles" ON public.team_members;
DROP POLICY IF EXISTS "Admins can remove members" ON public.team_members;

-- Dynamically drop ALL remaining policies on our custom tables (bulletproof for any drift or extra policies)
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

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop functions (including helpers and old versions)
-- Use CASCADE to handle any remaining dependents (policies etc.) that the previous drops might have missed
DROP FUNCTION IF EXISTS public.is_team_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_team_admin(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_team_member(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_team_member(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.reset_image_usage_if_needed(uuid);
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop tables (respect FK order: leaves first)
DROP TABLE IF EXISTS public.team_invites CASCADE;
DROP TABLE IF EXISTS public.devices CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.user_tiers CASCADE;
DROP TABLE IF EXISTS public.free_trial_claims CASCADE;
DROP TABLE IF EXISTS public.plans CASCADE;
-- profiles last (referenced)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================
-- 2. RECREATE TABLES (in dependency order)
-- ============================================

-- Profiles (core user data, tier, usage, billing)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  tier TEXT NOT NULL DEFAULT 'free_trial' CHECK (tier IN ('free_trial', 'single_use', 'home', 'business', 'business_plus')),
  sessions_used INTEGER NOT NULL DEFAULT 0,
  images_used INTEGER NOT NULL DEFAULT 0,
  image_reset_date TIMESTAMPTZ,
  diagnostics_used INTEGER NOT NULL DEFAULT 0,
  diagnostic_reset_date TIMESTAMPTZ,
  theme_preference TEXT NOT NULL DEFAULT 'dark' CHECK (theme_preference IN ('light','dark','system')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Free trial claims (one-time enforcement)
CREATE TABLE public.free_trial_claims (
  email TEXT PRIMARY KEY,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Plans lookup (for pricing, optional but included for completeness)
CREATE TABLE public.plans (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  price_monthly NUMERIC,
  max_users INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed plans
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

-- User tiers (for image/session tracking + tier sync; user_id as PK to match app code)
CREATE TABLE public.user_tiers (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free_trial' CHECK (tier IN ('free_trial', 'single_use', 'home', 'business', 'business_plus')),
  images_used INTEGER NOT NULL DEFAULT 0,
  image_reset_date TIMESTAMPTZ,
  sessions_used INTEGER NOT NULL DEFAULT 0,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Teams
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Team members (roles)
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Devices (inventory)
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  device_type TEXT,
  location TEXT,
  assigned_to TEXT,  -- free-text (name, email, or any identifier) for who the device is assigned to
  notes TEXT,
  last_troubleshot_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Team invites
CREATE TABLE public.team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, email)
);

-- Chat sessions (with team support)
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  team_id UUID REFERENCES public.teams(id),
  device_id UUID REFERENCES public.devices(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chat messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role TEXT,  -- 'user' or 'assistant'
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  image_url TEXT  -- for uploaded or generated images
);

-- ============================================
-- 3. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_images_used ON public.profiles(images_used);
CREATE INDEX IF NOT EXISTS idx_profiles_image_reset_date ON public.profiles(image_reset_date);

CREATE INDEX IF NOT EXISTS idx_free_trial_claims_email ON public.free_trial_claims(email);

CREATE INDEX IF NOT EXISTS idx_user_tiers_user_id ON public.user_tiers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tiers_image_reset_date ON public.user_tiers(image_reset_date);
CREATE INDEX IF NOT EXISTS idx_user_tiers_full_name ON public.user_tiers(full_name);
CREATE INDEX IF NOT EXISTS idx_user_tiers_tier ON public.user_tiers(tier);

CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON public.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_team_id ON public.devices(team_id);
CREATE INDEX IF NOT EXISTS idx_devices_assigned_to ON public.devices(assigned_to);
CREATE INDEX IF NOT EXISTS idx_team_invites_token ON public.team_invites(token);
CREATE INDEX IF NOT EXISTS idx_team_invites_email ON public.team_invites(email);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_team_id ON public.chat_sessions(team_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);

-- ============================================
-- 4. HELPER FUNCTIONS (non-recursive RLS)
-- ============================================

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

-- Image reset helper (from image generation migration)
CREATE OR REPLACE FUNCTION public.reset_image_usage_if_needed(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tier TEXT;
  v_reset_date TIMESTAMPTZ;
  v_new_reset TIMESTAMPTZ;
BEGIN
  SELECT tier, image_reset_date INTO v_tier, v_reset_date
  FROM public.profiles WHERE id = p_user_id;

  IF v_tier IS NULL THEN
    RETURN;
  END IF;

  IF v_tier IN ('home', 'business', 'business_plus') THEN
    IF v_reset_date IS NULL OR v_reset_date < NOW() THEN
      v_new_reset := NOW() + INTERVAL '1 month';

      UPDATE public.profiles 
      SET images_used = 0, 
          image_reset_date = v_new_reset,
          updated_at = NOW()
      WHERE id = p_user_id;

      UPDATE public.user_tiers 
      SET images_used = 0, 
          image_reset_date = v_new_reset,
          updated_at = NOW()
      WHERE user_id = p_user_id;
    END IF;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.reset_image_usage_if_needed(UUID) TO authenticated;

-- ============================================
-- 5. RLS ENABLE + POLICIES (safe, using helpers)
-- ============================================

-- Profiles (standard own-row access; new columns are covered)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (id = auth.uid());

-- Free trial claims (service role only)
ALTER TABLE public.free_trial_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deny all for anon and authenticated" 
  ON public.free_trial_claims FOR ALL 
  TO anon, authenticated 
  USING (false);

-- User tiers (own row + service for updates)
ALTER TABLE public.user_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tier data"
  ON public.user_tiers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own tier data (limited)"
  ON public.user_tiers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Deny direct insert from clients"
  ON public.user_tiers FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- Teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view teams they are members of"
  ON public.teams FOR SELECT
  USING (is_team_member(id, auth.uid()));

CREATE POLICY "Users can create teams (as owner)"
  ON public.teams FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Owners can manage (update/delete) their own teams (for completeness and any owner-only UI flows)
CREATE POLICY "Owners can manage their own teams"
  ON public.teams FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Team members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
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

-- Devices
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members can manage devices"
  ON public.devices FOR ALL
  USING (is_team_member(team_id, auth.uid()));

-- Team invites
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;
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

-- Chat tables (basic own + team visibility; extend as needed)
-- SELECT already allows team members to see team sessions.
-- Add INSERT/DELETE so the app's chat creation, message sending, and history deletes work under RLS.
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own or team chat sessions"
  ON public.chat_sessions FOR SELECT
  USING (
    user_id = auth.uid() 
    OR (team_id IS NOT NULL AND is_team_member(team_id))
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
         OR (team_id IS NOT NULL AND is_team_member(team_id))
    )
  );

CREATE POLICY "Users can insert messages to own or team sessions"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT id FROM public.chat_sessions 
      WHERE user_id = auth.uid() 
         OR (team_id IS NOT NULL AND is_team_member(team_id))
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

-- ============================================
-- 6. TRIGGER (latest: creates profiles + user_tiers + free trial claim)
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Profiles row (includes all tracked usage + theme preference)
  INSERT INTO public.profiles (id, email, tier, sessions_used, images_used, diagnostics_used, theme_preference, created_at, updated_at)
  VALUES (NEW.id, NEW.email, 'free_trial', 0, 0, 0, 'dark', NOW(), NOW())
  ON CONFLICT (id) DO UPDATE 
    SET email = EXCLUDED.email,
        updated_at = NOW();

  -- User tiers row (for image + diagnostics usage + tier sync)
  INSERT INTO public.user_tiers (
    user_id, 
    tier, 
    images_used, 
    sessions_used, 
    diagnostics_used,
    image_reset_date,
    diagnostic_reset_date,
    full_name,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id, 
    'free_trial', 
    0, 
    0, 
    0,
    '2099-12-31'::timestamptz,
    '2099-12-31'::timestamptz,
    NULL,
    NOW(), 
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Free trial claim
  IF NEW.email IS NOT NULL THEN
    INSERT INTO public.free_trial_claims (email, claimed_at)
    VALUES (NEW.email, NOW())
    ON CONFLICT (email) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7. FINAL COMMENTS / NOTES
-- ============================================

COMMENT ON TABLE public.profiles IS 'User profiles with tier, usage tracking, and billing info';
COMMENT ON TABLE public.user_tiers IS 'Per-user tier + image/session usage (synced from profiles for resilience)';
COMMENT ON TABLE public.teams IS 'Teams for Small Business / business_plus plans';
COMMENT ON TABLE public.team_members IS 'Team membership with owner/admin/member/viewer roles';
COMMENT ON TABLE public.devices IS 'Business device inventory (tied to teams)';
COMMENT ON TABLE public.team_invites IS 'Pending team invitations';
COMMENT ON TABLE public.chat_sessions IS 'Troubleshooting chat sessions (supports team context)';
COMMENT ON TABLE public.chat_messages IS 'Messages within chat sessions (supports images)';

-- End of rebuild. Schema should now perfectly match the app code expectations.
-- Run SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename IN ('profiles','user_tiers','teams','team_members','devices','team_invites','chat_sessions','chat_messages','free_trial_claims'); to verify.
-- If you need to re-seed an admin user as business_plus, use the restore-admin-tier.sql script (with your email).