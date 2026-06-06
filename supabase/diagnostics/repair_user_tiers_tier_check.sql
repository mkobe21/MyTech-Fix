-- Comprehensive repair for user_tiers schema issues.
-- Run this in Supabase SQL Editor.
--
-- From diagnostics output you shared:
-- - key_columns_present: "id, user_id"
-- - primary_key_def: PRIMARY KEY (id)   <--- this is the root problem (our code expects user_id as key/PK)
-- - has_user_id_unique: true
-- - distinct_tiers: "business, single_use" (missing business_plus, hence 23514)
-- - row_count: 2
--
-- This script:
-- 1. Ensures columns exist (user_id, images_used, etc.)
-- 2. Fixes the tier CHECK to allow business_plus (and all tiers)
-- 3. Normalizes PK to user_id (drops old PK on 'id', sets PK on user_id)
-- 4. Ensures UNIQUE + FK on user_id
-- 5. Re-creates RLS policies correctly (they key on user_id)
-- 6. Verifies

-- 1. Ensure all expected columns (safe if already present)
ALTER TABLE public.user_tiers 
ADD COLUMN IF NOT EXISTS user_id UUID,
ADD COLUMN IF NOT EXISTS tier TEXT,
ADD COLUMN IF NOT EXISTS images_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_reset_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS sessions_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Fix tier CHECK constraint
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_tiers_tier_check' 
        AND table_name = 'user_tiers'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.user_tiers DROP CONSTRAINT user_tiers_tier_check;
        RAISE NOTICE 'Dropped old user_tiers_tier_check';
    END IF;
END $$;

ALTER TABLE public.user_tiers 
ADD CONSTRAINT user_tiers_tier_check 
CHECK (tier IN ('free_trial', 'single_use', 'home', 'business', 'business_plus'));

-- 3. Ensure user_id unique (for ON CONFLICT)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_tiers_user_id_key' 
          AND conrelid = 'public.user_tiers'::regclass
    ) THEN
        BEGIN
            ALTER TABLE public.user_tiers 
            ADD CONSTRAINT user_tiers_user_id_key UNIQUE (user_id);
            RAISE NOTICE 'Added UNIQUE on user_id';
        EXCEPTION WHEN unique_violation THEN
            RAISE NOTICE 'Could not add UNIQUE on user_id (duplicates exist). Clean data manually.';
        WHEN OTHERS THEN
            RAISE NOTICE 'Error adding unique: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'user_id unique already present';
    END IF;
END $$;

-- 4. Normalize PRIMARY KEY to user_id (critical fix)
-- Current PK is on 'id' (from UI creation). Our entire codebase (migrations, RLS, app queries, upserts, trigger) assumes user_id.
DO $$
DECLARE
    current_pk text;
BEGIN
    SELECT pg_get_constraintdef(oid) INTO current_pk
    FROM pg_constraint 
    WHERE conrelid = 'public.user_tiers'::regclass AND contype = 'p';

    IF current_pk LIKE '%(id)%' THEN
        -- Drop old PK on id
        ALTER TABLE public.user_tiers DROP CONSTRAINT IF EXISTS user_tiers_pkey;
        RAISE NOTICE 'Dropped old PK on id';

        -- Add PK on user_id (unique already ensured)
        ALTER TABLE public.user_tiers ADD PRIMARY KEY (user_id);
        RAISE NOTICE 'Set PRIMARY KEY on user_id';
    ELSE
        RAISE NOTICE 'PK is already not on id (current: %)', current_pk;
    END IF;
END $$;

-- 5. Ensure FK on user_id to auth.users
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
            RAISE NOTICE 'Added FK user_id -> auth.users(id)';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add FK (data may violate or already partial): %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'FK on user_id already present';
    END IF;
END $$;

-- 6. Re-ensure RLS policies (in case they were created against wrong key or missing)
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

-- 7. Verify the structure now
SELECT '=== After repair ===' AS status;

SELECT 
    (SELECT string_agg(column_name, ', ') FROM information_schema.columns 
     WHERE table_schema='public' AND table_name='user_tiers' AND column_name IN ('id','user_id')) AS key_columns_present,
    (SELECT pg_get_constraintdef(oid) FROM pg_constraint 
     WHERE conrelid = 'public.user_tiers'::regclass AND contype='p') AS primary_key_def,
    (SELECT bool_or(conname = 'user_tiers_user_id_key') FROM pg_constraint 
     WHERE conrelid = 'public.user_tiers'::regclass) AS has_user_id_unique,
    (SELECT pg_get_constraintdef(oid) FROM pg_constraint 
     WHERE conrelid = 'public.user_tiers'::regclass AND conname LIKE '%tier_check%') AS tier_check,
    (SELECT string_agg(DISTINCT tier, ', ') FROM public.user_tiers) AS distinct_tiers_in_data,
    (SELECT count(*) FROM public.user_tiers) AS row_count;

-- After repair, if you want to remove the now-redundant auto 'id' column (safe only if no external queries/UI rely on it and row count is small):
-- ALTER TABLE public.user_tiers DROP COLUMN IF EXISTS id;

SELECT 'Repair complete. Re-run your failing migration/restore/INSERT for business_plus. Then re-run diagnostics to confirm.' AS next_step;