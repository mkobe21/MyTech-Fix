-- Supabase Diagnostics: Export current schema for user_tiers table
-- Run this entire script in the Supabase SQL Editor.
-- IMPORTANT: This is pure SQL (no psql \echo commands). 
-- Each section starts with a SELECT '=== HEADER ===' AS section_header; 
-- so you get clear labeled result sets.
-- Copy the FULL output (every result grid) and paste it back for analysis.
-- This helps debug CHECK violations (23514), wrong columns, extra 'id' PKs, missing business_plus in constraint, etc.

SELECT '=== 1. Table Columns (information_schema) ===' AS section_header;

SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable, 
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'user_tiers'
ORDER BY ordinal_position;

SELECT '=== 2. Table Constraints (including the tier_check) ===' AS section_header;

-- More robust query for constraints (works well in Supabase)
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint 
WHERE conrelid = 'public.user_tiers'::regclass
ORDER BY conname;

SELECT '=== 3. Indexes on user_tiers ===' AS section_header;

SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' AND tablename = 'user_tiers';

SELECT '=== 4. RLS Policies on user_tiers ===' AS section_header;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_tiers' AND schemaname = 'public';

SELECT '=== 5. Current data sample (first 5 rows, to see what values are there) ===' AS section_header;

SELECT * FROM public.user_tiers LIMIT 5;

SELECT '=== 6. Current CHECK constraint on tier (look for business_plus) ===' AS section_header;

-- This shows the exact current CHECK definition for the tier column
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS current_tier_check_definition
FROM pg_constraint 
WHERE conrelid = 'public.user_tiers'::regclass 
  AND conname LIKE '%tier_check%';

SELECT '=== 7. Full "CREATE TABLE" reconstruction attempt (approximate) ===' AS section_header;

-- Note: This is best-effort; for exact, use pg_dump or Supabase CLI.
SELECT 
    'CREATE TABLE public.user_tiers (' || chr(10) || '  ' ||
    string_agg(
        column_name || ' ' || 
        data_type || 
        coalesce('(' || character_maximum_length || ')', '') ||
        case when is_nullable = 'NO' then ' NOT NULL' else '' end ||
        coalesce(' DEFAULT ' || column_default, ''),
        ',' || chr(10) || '  '
    ) || chr(10) || ');' as reconstructed_create
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'user_tiers'
GROUP BY table_name;

SELECT '=== 8. Any triggers on user_tiers or related to user creation ===' AS section_header;

SELECT 
    trigger_name, 
    event_manipulation, 
    action_timing, 
    action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'user_tiers' OR event_object_table = 'auth.users';

SELECT '=== End of diagnostics. Please copy ALL result sets / output above and share it. ===' AS section_header;

-- Additional tips (shown as a result row):
SELECT 'Also run in Supabase CLI if possible: supabase db dump --schema public --table user_tiers --schema-only' AS cli_tip
UNION ALL
SELECT 'Or use Dashboard Table Editor to view columns/constraints manually.'; 

SELECT '=== 9. Quick health check: PK, unique on user_id, and tier values in use ===' AS section_header;

-- This helps spot if table was created via UI (has separate "id" PK) or if tier values are bad
SELECT 
    (SELECT string_agg(column_name, ', ') FROM information_schema.columns 
     WHERE table_schema='public' AND table_name='user_tiers' AND column_name IN ('id','user_id')) AS key_columns_present,
    (SELECT pg_get_constraintdef(oid) FROM pg_constraint 
     WHERE conrelid = 'public.user_tiers'::regclass AND contype='p') AS primary_key_def,
    (SELECT bool_or(conname = 'user_tiers_user_id_key') FROM pg_constraint 
     WHERE conrelid = 'public.user_tiers'::regclass) AS has_user_id_unique,
    (SELECT string_agg(DISTINCT tier, ', ') FROM public.user_tiers) AS distinct_tiers_in_data,
    (SELECT count(*) FROM public.user_tiers) AS row_count;