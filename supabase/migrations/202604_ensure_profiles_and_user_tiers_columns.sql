-- ============================================================
-- MyTech-Fix - Ensure profiles + user_tiers columns (safety net)
-- Date: April 2026
-- 
-- This migration ensures all columns that the app and restore scripts expect are
-- present on profiles and user_tiers. 
--
-- Background:
-- - Core profiles table + tier/sessions were set up in early team migrations.
-- - images_used + image_reset_date + user_tiers table created in 202604_add_image_generation.sql
-- - full_name added to user_tiers in 202604_add_full_name_to_user_tiers.sql
-- - stripe_customer_id added in 202604_add_stripe_customer_id_to_profiles.sql
--
-- If any of those migrations were skipped, applied out-of-order, or the DB was
-- manually initialized with a minimal schema, columns like images_used on user_tiers
-- (or stripe_customer_id on profiles) would be missing → 42703 errors on SELECTs
-- (e.g. in restore-admin-tier.sql verifies) or runtime failures in dashboard, chat,
-- image gen, billing portal, webhooks, etc.
--
-- This file acts as a late "ensure" migration (idempotent ADD COLUMN IF NOT EXISTS +
-- CREATE TABLE IF NOT EXISTS) so the schema is always complete.
-- ============================================================

-- 1. Profiles image columns (used for usage tracking + image gen limits)
-- plus updated_at/created_at (used by app code on almost every profile update)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS images_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_reset_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_profiles_images_used ON public.profiles(images_used);
CREATE INDEX IF NOT EXISTS idx_profiles_image_reset_date ON public.profiles(image_reset_date);

-- 2. Profiles stripe column (for Customer Portal + subscription webhooks)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id 
ON public.profiles(stripe_customer_id);

-- 3. user_tiers base table + all columns
CREATE TABLE IF NOT EXISTS public.user_tiers (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free_trial', 'single_use', 'home', 'business', 'business_plus')),
  images_used INTEGER NOT NULL DEFAULT 0,
  image_reset_date TIMESTAMPTZ,
  sessions_used INTEGER NOT NULL DEFAULT 0,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_tiers 
ADD COLUMN IF NOT EXISTS images_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_reset_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS sessions_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure the tier CHECK constraint is up-to-date and includes 'business_plus'.
-- If the table pre-existed (from partial migration, manual creation in Table Editor which may add 'id' PK etc.,
-- or older CREATE without business_plus), the old constraint "user_tiers_tier_check" may reject 'business_plus'.
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

-- Ensure user_id is present and unique (our code relies on ON CONFLICT (user_id) and .eq('user_id') .
-- Supabase Table Editor often creates an 'id' PK by default; we add user_id as the logical key.
ALTER TABLE public.user_tiers ADD COLUMN IF NOT EXISTS user_id UUID;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname LIKE '%user_id%' AND conrelid = 'public.user_tiers'::regclass
          AND contype = 'u'  -- unique
    ) THEN
        -- Try to add unique; if duplicate data exists this may fail, user can clean manually.
        BEGIN
            ALTER TABLE public.user_tiers ADD CONSTRAINT user_tiers_user_id_key UNIQUE (user_id);
        EXCEPTION WHEN unique_violation THEN
            RAISE NOTICE 'Could not add unique on user_id due to existing duplicates; please resolve data and re-run.';
        END;
    END IF;
END $$;

-- Normalize PK to user_id if the table was pre-created with 'id' as PK (common when using Supabase Table Editor).
-- Our CREATE TABLEs, RLS policies, app code, ON CONFLICT(user_id), and joins all assume user_id is the key.
DO $$
DECLARE
    current_pk text;
BEGIN
    SELECT pg_get_constraintdef(oid) INTO current_pk
    FROM pg_constraint 
    WHERE conrelid = 'public.user_tiers'::regclass AND contype = 'p' LIMIT 1;

    IF current_pk IS NOT NULL AND current_pk LIKE '%(id)%' THEN
        ALTER TABLE public.user_tiers DROP CONSTRAINT IF EXISTS user_tiers_pkey;
        -- user_id unique was ensured earlier in this file
        ALTER TABLE public.user_tiers ADD PRIMARY KEY (user_id);
        RAISE NOTICE 'Normalized PK from id to user_id';
    END IF;
END $$;

-- Ensure the FK on user_id (in case the column was added without the reference)
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
            RAISE NOTICE 'Could not (re)add FK on user_id: %', SQLERRM;
        END;
    END IF;
END $$;

-- 4. Indexes (idempotent)
CREATE INDEX IF NOT EXISTS idx_user_tiers_user_id ON public.user_tiers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tiers_image_reset_date ON public.user_tiers(image_reset_date);
CREATE INDEX IF NOT EXISTS idx_user_tiers_full_name ON public.user_tiers(full_name);
CREATE INDEX IF NOT EXISTS idx_user_tiers_tier ON public.user_tiers(tier);

-- Re-ensure RLS policies (drop + recreate for safety, in case created with wrong assumptions or partial run).
ALTER TABLE public.user_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own tier data" ON public.user_tiers;
CREATE POLICY "Users can view their own tier data"
ON public.user_tiers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own tier data (limited)" ON public.user_tiers;
CREATE POLICY "Users can update their own tier data (limited)"
ON public.user_tiers
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Deny direct insert from clients" ON public.user_tiers;
CREATE POLICY "Deny direct insert from clients"
ON public.user_tiers
FOR INSERT
TO authenticated
WITH CHECK (false);

-- 6. Comments (for documentation)
COMMENT ON COLUMN public.profiles.images_used IS 'Number of AI images generated in current period (or lifetime for one-time tiers)';
COMMENT ON COLUMN public.profiles.image_reset_date IS 'When the current image usage period resets (monthly for subs, far future for one-time)';
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 
  'Stripe Customer ID. Set on successful checkout. Used for Customer Portal and subscription webhooks.';

COMMENT ON TABLE public.user_tiers IS 'Optional separate table for detailed per-user tier + usage tracking (synced from profiles)';

-- Note: The reset_image_usage_if_needed function and the original backfill are in the main 
-- 202604_add_image_generation.sql migration.
-- 
-- For complete ongoing support (new signups automatically get a user_tiers row), also apply:
--   202604_create_user_tiers_row_on_signup.sql  (updates handle_new_user trigger + backfill)
--
-- Running the ensure migration + the (updated) restore-admin-tier.sql is usually enough to
-- unblock column errors and get the tier/image feature working for existing users.

-- After applying, you can safely run restore-admin-tier.sql (with your email) to fix admin tiers
-- without column-missing errors.