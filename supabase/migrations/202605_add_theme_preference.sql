-- ============================================================
-- THEME PREFERENCE: User-selectable light/dark/system
-- Adds column to profiles (personal UI pref, not needed on user_tiers).
-- Updates handle_new_user so new signups get a default.
-- Backfills existing users to 'dark' (preserves current experience).
-- Also documents update to complete_supabase_rebuild.sql .
-- ============================================================

-- 1. Add column to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS theme_preference TEXT NOT NULL DEFAULT 'dark';

-- Constrain values (safe even if some rows pre-exist; run after add)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_theme_preference_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_theme_preference_check 
      CHECK (theme_preference IN ('light','dark','system'));
  END IF;
END $$;

-- Backfill any pre-existing rows (including those that had NULL before the default kicked in)
UPDATE public.profiles 
SET theme_preference = 'dark' 
WHERE theme_preference IS NULL OR theme_preference NOT IN ('light','dark','system');

-- Optional index (small table, not critical but nice for future admin queries)
CREATE INDEX IF NOT EXISTS idx_profiles_theme_preference ON public.profiles(theme_preference);

-- 2. Update handle_new_user (the live trigger) to initialize the new column
-- This is the same function updated previously for diagnostics; we extend the INSERTs.
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

-- (Re)create trigger (safe)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Quick verification
SELECT column_name, data_type, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'theme_preference';

-- Expect at least one row with 'dark'
SELECT id, email, theme_preference FROM public.profiles LIMIT 5;