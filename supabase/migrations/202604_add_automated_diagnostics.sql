-- ============================================================
-- AUTOMATED DIAGNOSTICS: Schema additions (run on existing DB)
-- Adds usage tracking mirroring images_used / image_reset_date pattern.
-- New results table. RLS. Updates to new-user trigger so fresh users start at 0.
-- Also updates the handle_new_user inside complete_rebuild style for future clean rebuilds.
-- ============================================================

-- 1. Add columns to profiles (usage + monthly reset date, like images)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS diagnostics_used INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS diagnostic_reset_date TIMESTAMPTZ;

-- Backfill for any old rows (safe)
UPDATE public.profiles SET diagnostics_used = 0 WHERE diagnostics_used IS NULL;
UPDATE public.profiles SET diagnostic_reset_date = NOW() + INTERVAL '1 month' 
  WHERE diagnostic_reset_date IS NULL AND tier IN ('home','business','business_plus');

CREATE INDEX IF NOT EXISTS idx_profiles_diagnostics_used ON public.profiles(diagnostics_used);
CREATE INDEX IF NOT EXISTS idx_profiles_diagnostic_reset_date ON public.profiles(diagnostic_reset_date);

-- 2. Same for user_tiers (sync table)
ALTER TABLE public.user_tiers
  ADD COLUMN IF NOT EXISTS diagnostics_used INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS diagnostic_reset_date TIMESTAMPTZ;

UPDATE public.user_tiers SET diagnostics_used = 0 WHERE diagnostics_used IS NULL;
UPDATE public.user_tiers SET diagnostic_reset_date = NOW() + INTERVAL '1 month' 
  WHERE diagnostic_reset_date IS NULL AND tier IN ('home','business','business_plus');

CREATE INDEX IF NOT EXISTS idx_user_tiers_diagnostics_used ON public.user_tiers(diagnostics_used);
CREATE INDEX IF NOT EXISTS idx_user_tiers_diagnostic_reset_date ON public.user_tiers(diagnostic_reset_date);

-- 3. New table for storing every diagnostic run + AI analysis (jsonb for flexibility)
CREATE TABLE IF NOT EXISTS public.user_diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  run_type TEXT NOT NULL DEFAULT 'full',           -- 'full' | 'internet' | 'latency' etc (for future individuals)
  results JSONB NOT NULL,                          -- full { internet: {...}, wifi: {...}, latency: {...}, packetLoss: {...}, dns: {...}, system: {...}, overall: 'good'|'fair'|'poor', timestamp }
  summary TEXT,                                    -- short e.g. "Fair - high latency detected"
  overall_status TEXT,                             -- 'good' | 'fair' | 'poor' (for list badges)
  ai_analysis TEXT,                                -- the Fix Grok text (populated on demand)
  tier_at_run TEXT,                                -- snapshot for context
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for dashboard history queries (user + recent)
CREATE INDEX IF NOT EXISTS idx_user_diagnostics_user_created ON public.user_diagnostics(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_diagnostics_overall ON public.user_diagnostics(overall_status);

COMMENT ON TABLE public.user_diagnostics IS 'Stores network diagnostic runs (client-measured) + optional Fix Grok AI analysis. results jsonb holds raw metrics.';

-- 4. RLS (users own their rows only; server routes use user-session client so RLS applies; service_role bypasses for admin if ever needed)
ALTER TABLE public.user_diagnostics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own diagnostics" ON public.user_diagnostics;
CREATE POLICY "Users can view own diagnostics"
  ON public.user_diagnostics FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own diagnostics" ON public.user_diagnostics;
CREATE POLICY "Users can insert own diagnostics"
  ON public.user_diagnostics FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own diagnostics (e.g. ai_analysis)" ON public.user_diagnostics;
CREATE POLICY "Users can update own diagnostics (e.g. ai_analysis)"
  ON public.user_diagnostics FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 5. Update handle_new_user (critical for new signups to have the usage cols at 0; profiles + user_tiers)
-- This matches the style in complete_supabase_rebuild.sql and 202604_create_user_tiers_row_on_signup.sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, tier, sessions_used, images_used, diagnostics_used, theme_preference, created_at, updated_at)
  VALUES (NEW.id, NEW.email, 'free_trial', 0, 0, 0, 'dark', NOW(), NOW())
  ON CONFLICT (id) DO UPDATE 
    SET email = EXCLUDED.email,
        updated_at = NOW();

  INSERT INTO public.user_tiers (user_id, tier, images_used, sessions_used, diagnostics_used, image_reset_date, created_at, updated_at)
  VALUES (NEW.id, 'free_trial', 0, 0, 0, '2099-12-31'::timestamptz, NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING;

  IF NEW.email IS NOT NULL THEN
    INSERT INTO public.free_trial_claims (email, claimed_at)
    VALUES (NEW.email, NOW())
    ON CONFLICT (email) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- (Re)create trigger if missing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. (Optional but recommended for future clean rebuilds) Also apply same changes inside supabase/diagnostics/complete_supabase_rebuild.sql
--    - In the profiles CREATE TABLE: add the two diagnostics cols (DEFAULT 0)
--    - In user_tiers CREATE: same
--    - In the handle_new_user() inside the rebuild: add to the two INSERTs (like above)
--    - Add the user_diagnostics CREATE + indexes + RLS policies block near the other tables
--    - Add the columns to any ALTER/ADD COLUMN blocks if present in that file
-- Run the full rebuild only for fresh DBs; the SQL above is for incremental on your current project.

-- 7. Quick verification queries (run after the block above)
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name IN ('profiles','user_tiers') AND column_name LIKE '%diagnostic%';
-- 
-- SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename='user_diagnostics';
--
-- Test a new profile row would get 0s (the trigger will handle on next real signup)
