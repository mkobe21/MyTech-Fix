-- ============================================================
-- MyTech-Fix - Add AI Image Generation Limits & Tracking
-- Date: April 2026
-- Adds support for AI-generated images in chat with strict tiered limits.
-- ============================================================

-- 1. Add image tracking columns to profiles (primary place for user data)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS images_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_reset_date TIMESTAMPTZ;

-- Optional: backfill image_reset_date for existing users (set to now for monthly tiers)
UPDATE public.profiles 
SET image_reset_date = NOW()
WHERE image_reset_date IS NULL 
  AND tier IN ('home', 'business', 'business_plus');

-- For one-time tiers, we can leave reset_date far in future or handle in code as "total"
UPDATE public.profiles 
SET image_reset_date = '2099-12-31'::timestamptz
WHERE image_reset_date IS NULL 
  AND tier IN ('free_trial', 'single_use');

-- 2. Create user_tiers table (as specified) for per-user tier details / usage if we want to separate from profiles
-- This can hold tier-specific overrides or detailed usage.
CREATE TABLE IF NOT EXISTS public.user_tiers (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free_trial', 'single_use', 'home', 'business', 'business_plus')),
  images_used INTEGER NOT NULL DEFAULT 0,
  image_reset_date TIMESTAMPTZ,
  sessions_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist even if the table was pre-created (e.g. from partial/earlier runs of restore,
-- ensure migration, manual SQL, or out-of-order applies). This prevents "column does not exist"
-- errors on the backfill INSERT below.
ALTER TABLE public.user_tiers 
ADD COLUMN IF NOT EXISTS images_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_reset_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS sessions_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure the tier CHECK constraint is up-to-date and includes 'business_plus' (in case table pre-existed with older constraint).
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

-- Ensure user_id for consistency with upserts (in case pre-existing table from UI had 'id' PK instead).
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
            RAISE NOTICE 'Note: unique on user_id not enforced (duplicates or pre-existing).';
        END;
    END IF;
END $$;

-- Normalize PK to user_id (if pre-created with 'id' PK via UI)
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
        RAISE NOTICE 'Normalized PK from id to user_id in image_generation migration';
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

-- Enable RLS
ALTER TABLE public.user_tiers ENABLE ROW LEVEL SECURITY;

-- Policies: users can only see/update their own row (service role for admin updates).
-- Use DROP POLICY IF EXISTS first so this migration is safe to re-run.
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

-- Deny direct insert from clients (use service role or trigger)
DROP POLICY IF EXISTS "Deny direct insert from clients" ON public.user_tiers;
CREATE POLICY "Deny direct insert from clients"
ON public.user_tiers
FOR INSERT
TO authenticated
WITH CHECK (false);

-- 3. Backfill user_tiers from profiles if needed (for existing users)
-- This is optional; we can keep using profiles primarily and sync if desired.
-- For now, insert missing rows
INSERT INTO public.user_tiers (user_id, tier, images_used, image_reset_date, sessions_used)
SELECT 
  p.id, 
  p.tier, 
  COALESCE(p.images_used, 0),
  p.image_reset_date,
  COALESCE(p.sessions_used, 0)
FROM public.profiles p
LEFT JOIN public.user_tiers ut ON ut.user_id = p.id
WHERE ut.user_id IS NULL;

-- 4. Add indexes for performance on usage checks
-- (safe because we ensured columns above; IF NOT EXISTS makes re-runs ok)
CREATE INDEX IF NOT EXISTS idx_profiles_images_used ON public.profiles(images_used);
CREATE INDEX IF NOT EXISTS idx_profiles_image_reset_date ON public.profiles(image_reset_date);
CREATE INDEX IF NOT EXISTS idx_user_tiers_user_id ON public.user_tiers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tiers_image_reset_date ON public.user_tiers(image_reset_date);

-- 5. Function to reset image counts if needed (can be called from app or cron)
-- For monthly tiers: if reset_date < now, reset images_used=0 and set new reset_date = now + 1 month
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
  -- Get from profiles (primary source)
  SELECT tier, image_reset_date INTO v_tier, v_reset_date
  FROM public.profiles WHERE id = p_user_id;

  IF v_tier IS NULL THEN
    RETURN;
  END IF;

  -- Only reset for monthly subscription tiers
  IF v_tier IN ('home', 'business', 'business_plus') THEN
    IF v_reset_date IS NULL OR v_reset_date < NOW() THEN
      v_new_reset := NOW() + INTERVAL '1 month';

      UPDATE public.profiles 
      SET images_used = 0, 
          image_reset_date = v_new_reset,
          updated_at = NOW()
      WHERE id = p_user_id;

      -- Also sync to user_tiers if row exists
      UPDATE public.user_tiers 
      SET images_used = 0, 
          image_reset_date = v_new_reset,
          updated_at = NOW()
      WHERE user_id = p_user_id;
    END IF;
  END IF;
END;
$$;

-- Grant execute to authenticated (so app can call it)
GRANT EXECUTE ON FUNCTION public.reset_image_usage_if_needed(UUID) TO authenticated;

-- Note: For one-time tiers (free_trial, single_use), we treat images_used as lifetime total.
-- The app code will enforce the hard caps without resetting.

-- 6. Update RLS comments / ensure profiles RLS allows the new columns (usually SELECT/UPDATE own row)
-- Assuming existing policies on profiles allow users to read/update their row.
-- If not, add:
-- (Example - adjust to your existing policies)
-- CREATE POLICY "Users can update own profile images usage" ON public.profiles
-- FOR UPDATE TO authenticated USING (id = auth.uid());

COMMENT ON COLUMN public.profiles.images_used IS 'Number of AI images generated in current period (or lifetime for one-time tiers)';
COMMENT ON COLUMN public.profiles.image_reset_date IS 'When the current image usage period resets (monthly for subs, far future for one-time)';

COMMENT ON TABLE public.user_tiers IS 'Optional separate table for detailed per-user tier + usage tracking (synced from profiles)';

-- 7. Optional: Add image pack purchase metadata support (for future Stripe one-time image packs)
-- We will handle crediting in webhook by decreasing images_used (or adding negative credit).

-- Done. Run this migration, then update .env if needed, and app code for enforcement.