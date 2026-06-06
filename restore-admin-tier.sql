-- Run this in Supabase SQL Editor to restore your admin account to Small Business Plus.
-- Replace 'YOUR_ADMIN_EMAIL@example.com' with the actual email of the admin account.

-- Ensure required columns exist on profiles and user_tiers.
-- These columns (stripe_customer_id for billing, images_used/sessions_used/full_name etc.
-- for image tracking + name sync + tier) were added in later migrations (image_generation,
-- full_name_to_user_tiers, stripe_customer_id, and the ensure + user_tiers_on_signup migrations)
-- but may be missing if migrations were never applied, applied partially, or the DB was set up before them.
-- This makes the restore script (and its verify queries) robust so it doesn't 42703.
--
-- For the full "new user automatically gets user_tiers row" behavior, also apply the
-- dedicated trigger migration: 202604_create_user_tiers_row_on_signup.sql (after the ensure).
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- (Optional but recommended) Add an index for webhook lookups by customer id.
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id 
ON public.profiles(stripe_customer_id);

-- Ensure profiles has image usage columns (from 202604_add_image_generation.sql)
-- plus updated_at/created_at (assumed in many app UPDATEs and the restore itself)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS images_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_reset_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_profiles_images_used ON public.profiles(images_used);
CREATE INDEX IF NOT EXISTS idx_profiles_image_reset_date ON public.profiles(image_reset_date);

-- Ensure user_tiers table + all columns exist (base from image_generation migration;
-- full_name added later). CREATE TABLE IF NOT EXISTS is safe; ALTERs add anything missing
-- if the table was created in a partial/older state.
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

-- Ensure the tier CHECK constraint includes 'business_plus' (fixes 23514 violations if table was created with older CHECK).
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

-- Ensure user_id column + unique for our upserts (ON CONFLICT (user_id)) in case table pre-existed with different PK (e.g. 'id' from UI editor).
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
            -- non-fatal; user can fix dups if any
            RAISE NOTICE 'Note: Could not enforce unique on user_id (may have dups or already handled).';
        END;
    END IF;
END $$;

-- Normalize PK to user_id (the table may have been created with 'id' as PK via the Supabase dashboard)
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

-- Ensure FK on user_id
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

-- Re-apply RLS policies (keyed on user_id)
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

-- Helpful indexes (safe IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_user_tiers_user_id ON public.user_tiers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tiers_image_reset_date ON public.user_tiers(image_reset_date);
CREATE INDEX IF NOT EXISTS idx_user_tiers_full_name ON public.user_tiers(full_name);
CREATE INDEX IF NOT EXISTS idx_user_tiers_tier ON public.user_tiers(tier);

-- 1. Ensure a profiles row exists for this auth user (critical after complete_supabase_rebuild.sql,
-- which drops profiles; the handle_new_user trigger only fires for *new* signups).
-- This uses auth.users to find the id by email (standard Supabase auth table), then inserts or upgrades the tier.
-- After this, /account and /dashboard will load the correct tier from profiles.tier without hitting auto-create or showing wrong plan.
INSERT INTO public.profiles (id, email, tier, sessions_used, images_used, created_at, updated_at)
SELECT 
  u.id,
  u.email,
  'business_plus',
  0,
  0,
  COALESCE(p.created_at, NOW()),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'YOUR_ADMIN_EMAIL@example.com'
ON CONFLICT (id) DO UPDATE 
SET 
  tier = EXCLUDED.tier,
  updated_at = NOW();

-- 2. Restore/sync in user_tiers (to keep consistent with image generation tracking + name).
-- Now safe because the profile ensure above guarantees a source row for the SELECT.
-- Use ON CONFLICT upsert so the row is created if it doesn't exist yet.
INSERT INTO public.user_tiers (user_id, tier, images_used, sessions_used, updated_at)
SELECT 
  p.id, 
  'business_plus', 
  COALESCE(p.images_used, 0),
  COALESCE(p.sessions_used, 0),
  NOW()
FROM public.profiles p
WHERE p.email = 'YOUR_ADMIN_EMAIL@example.com'
ON CONFLICT (user_id) DO UPDATE 
SET 
  tier = EXCLUDED.tier,
  updated_at = EXCLUDED.updated_at;

-- 3. (Optional) Clear stripe_customer_id if you don't want future Stripe webhooks 
--    (e.g. subscription deletes from test data) to affect this admin account again.
-- UPDATE public.profiles 
-- SET stripe_customer_id = NULL
-- WHERE email = 'YOUR_ADMIN_EMAIL@example.com';

-- 4. Verify
SELECT id, email, tier, stripe_customer_id, created_at 
FROM public.profiles 
WHERE email = 'YOUR_ADMIN_EMAIL@example.com';

SELECT user_id, tier, images_used 
FROM public.user_tiers 
WHERE user_id = (
  SELECT id FROM public.profiles 
  WHERE email = 'YOUR_ADMIN_EMAIL@example.com'
);

-- After running, log out and log back in (or refresh dashboard) to see the updated tier.
-- Note: We have improved the code so business_plus is fully supported in checkout/upgrade/webhook,
-- and downgrades on cancel now go to 'single_use' instead of free_trial, plus sync user_tiers.
