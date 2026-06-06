-- ============================================================
-- MyTech-Fix - Create user_tiers row on new user signup + backfill
-- Date: April 2026
--
-- The image generation feature (and tier sync) relies on a row existing in
-- user_tiers for every user (to mirror tier, images_used, sessions_used, full_name etc.).
--
-- Previously:
-- - Only profiles row was created in handle_new_user() (in 202604_..._teams and update_tiers migrations).
-- - user_tiers rows were only created by the one-time backfill inside 202604_add_image_generation.sql
--   (at the moment that migration was applied) or manually (e.g. restore script).
--
-- This meant:
-- - Users who signed up *after* the image_generation migration had no user_tiers row.
-- - Direct .update() calls on user_tiers in webhooks / image APIs would affect 0 rows.
-- - Fallbacks in dashboard/chat (pickHighestTier) made things mostly work by reading from profiles,
--   but full sync, RLS expectations, and future cron/function use were broken.
--
-- This migration:
-- 1. Updates the handle_new_user() trigger to also INSERT a corresponding row into user_tiers
--    (with matching free_trial defaults). Uses ON CONFLICT DO NOTHING for safety.
-- 2. Runs a backfill for any existing profiles that are missing their user_tiers row.
-- 3. Re-applies the trigger.
--
-- Run this after the image generation + ensure migrations so the columns exist.
-- Idempotent / safe to re-run.
-- ============================================================

-- Ensure the user_tiers columns exist (in case this migration is run on a DB where the table
-- was pre-created without the image-related columns, e.g. partial previous attempts).
-- This prevents the same 42703 error on the backfill INSERT below (and ensures the trigger
-- function's INSERT will succeed for future signups).
ALTER TABLE public.user_tiers 
ADD COLUMN IF NOT EXISTS images_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_reset_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS sessions_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure the tier CHECK constraint includes 'business_plus' (in case pre-existing table had old constraint without it).
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_tiers_tier_check' 
        AND table_name = 'user_tiers'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.user_tiers DROP CONSTRAINT user_tiers_tier_check;
    END IF;
END $$;

ALTER TABLE public.user_tiers 
ADD CONSTRAINT user_tiers_tier_check 
CHECK (tier IN ('free_trial', 'single_use', 'home', 'business', 'business_plus'));

-- Ensure user_id unique (for ON CONFLICT and code assumptions) if table pre-existed differently.
ALTER TABLE public.user_tiers ADD COLUMN IF NOT EXISTS user_id UUID;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname LIKE '%user_id%' AND conrelid = 'public.user_tiers'::regclass AND contype = 'u'
    ) THEN
        BEGIN
            ALTER TABLE public.user_tiers ADD CONSTRAINT user_tiers_user_id_key UNIQUE (user_id);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Note: could not add unique user_id (data issue possible).';
        END;
    END IF;
END $$;

-- Normalize PK to user_id if needed (for consistency with trigger INSERTs and app code)
DO $$
DECLARE
    current_pk text;
BEGIN
    SELECT pg_get_constraintdef(oid) INTO current_pk
    FROM pg_constraint 
    WHERE conrelid = 'public.user_tiers'::regclass AND contype = 'p' LIMIT 1;

    IF current_pk IS NOT NULL AND current_pk LIKE '%(id)%' THEN
        ALTER TABLE public.user_tiers DROP CONSTRAINT IF EXISTS user_tiers_pkey;
        ALTER TABLE public.user_tiers ADD PRIMARY KEY (user_id);
        RAISE NOTICE 'Normalized PK from id to user_id';
    END IF;
END $$;

-- Ensure FK
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_tiers_user_id_fkey' 
          AND conrelid = 'public.user_tiers'::regclass
    ) THEN
        BEGIN
            ALTER TABLE public.user_tiers 
            ADD CONSTRAINT user_tiers_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add FK: %', SQLERRM;
        END;
    END IF;
END $$;

-- 1. Update the signup trigger to also create the user_tiers row for every new auth user.
--    This must be done with CREATE OR REPLACE because the function was defined in an earlier migration.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Always ensure a profiles row (original behavior)
  INSERT INTO public.profiles (id, email, tier, sessions_used, created_at, updated_at)
  VALUES (NEW.id, NEW.email, 'free_trial', 0, NOW(), NOW())
  ON CONFLICT (id) DO UPDATE 
    SET email = EXCLUDED.email,
        updated_at = NOW();

  -- NEW: Also ensure a user_tiers row for image usage + tier sync (the image generation feature)
  INSERT INTO public.user_tiers (
    user_id, 
    tier, 
    images_used, 
    sessions_used, 
    image_reset_date,
    full_name,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id, 
    'free_trial', 
    0, 
    0, 
    '2099-12-31'::timestamptz,   -- far future for one-time tiers (matches image migration logic)
    NULL,
    NOW(), 
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Record free trial claim for this email (enforces one-time free trial)
  IF NEW.email IS NOT NULL THEN
    INSERT INTO public.free_trial_claims (email, claimed_at)
    VALUES (NEW.email, NOW())
    ON CONFLICT (email) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Re-attach the trigger (drop + create is the standard pattern used in prior migrations)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. One-time backfill for any users who signed up before this migration (or before image_generation)
--    and therefore have a profiles row but no user_tiers row.
--    This is safe and matches the style of the backfill in 202604_add_image_generation.sql.
INSERT INTO public.user_tiers (user_id, tier, images_used, image_reset_date, sessions_used, full_name, created_at, updated_at)
SELECT 
  p.id, 
  COALESCE(p.tier, 'free_trial'),
  COALESCE(p.images_used, 0),
  COALESCE(p.image_reset_date, CASE 
    WHEN COALESCE(p.tier, 'free_trial') IN ('home', 'business', 'business_plus') THEN NOW() + INTERVAL '1 month'
    ELSE '2099-12-31'::timestamptz 
  END),
  COALESCE(p.sessions_used, 0),
  p.full_name,
  COALESCE(p.created_at, NOW()),
  COALESCE(p.updated_at, NOW())
FROM public.profiles p
LEFT JOIN public.user_tiers ut ON ut.user_id = p.id
WHERE ut.user_id IS NULL;

-- 3. Optional: If some user_tiers rows exist but are missing newer columns (full_name etc.), this is
--    already handled by the ensure migration's ADD COLUMN IF NOT EXISTS. No extra backfill needed here.

COMMENT ON FUNCTION public.handle_new_user() IS 
  'Creates profiles + user_tiers rows (and free_trial_claim) for every new auth user. Updated to support image generation feature.';

-- After running this migration:
-- - All future signups will have a user_tiers row.
-- - Existing users are backfilled.
-- - You can still run restore-admin-tier.sql safely (its own upsert is redundant but harmless).
-- - Image usage, limits, resets, and tier sync will be consistent between profiles and user_tiers.
