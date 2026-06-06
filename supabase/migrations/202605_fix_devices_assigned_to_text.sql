-- ============================================================
-- FIX: devices.assigned_to column type (was UUID in early migrations)
-- This resolves the persistent 22P02 "invalid input syntax for type uuid" errors
-- when the frontend tries to store free-text values (names, emails, "John's laptop", etc.)
-- ============================================================

-- 1. Drop any foreign key constraint on assigned_to FIRST (this must happen before the type change)
DO $$
DECLARE
  constraint_name text;
BEGIN
  -- Find foreign key constraints involving the assigned_to column
  SELECT c.conname INTO constraint_name
  FROM pg_constraint c
  JOIN pg_attribute a ON a.attrelid = c.conrelid 
                      AND a.attnum = ANY(c.conkey)
  WHERE c.conrelid = 'public.devices'::regclass
    AND a.attname = 'assigned_to'
    AND c.contype = 'f';   -- 'f' = foreign key

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.devices DROP CONSTRAINT %I', constraint_name);
    RAISE NOTICE 'Dropped foreign key constraint: %', constraint_name;
  ELSE
    RAISE NOTICE 'No foreign key constraint found on devices.assigned_to (this is expected and good)';
  END IF;
END $$;

-- 2. Now safely change the column to TEXT
ALTER TABLE public.devices 
  ALTER COLUMN assigned_to 
  TYPE TEXT 
  USING assigned_to::text;

-- 3. Rebuild the index (in case it was tied to the old type)
DROP INDEX IF EXISTS idx_devices_assigned_to;
CREATE INDEX IF NOT EXISTS idx_devices_assigned_to 
  ON public.devices(assigned_to);

-- 4. Update the column comment
COMMENT ON COLUMN public.devices.assigned_to IS 
  'Free-text assignee (name, email, "Front desk", or any identifier). Not a foreign key.';

-- ============================================================
-- IMPORTANT POST-STEPS (do these after the script succeeds):
-- 
-- 1. In Supabase Dashboard:
--    - Go to Database → Replication
--    - Click the "Refresh Schema Cache" button
--    (This tells PostgREST that the column is now TEXT instead of UUID)
--
-- 2. Hard refresh your browser on the /inventory page:
--    Windows/Linux: Ctrl + Shift + R
--    Mac: Cmd + Shift + R
--
-- The inventory page code has already been cleaned up and will now send
-- the "Assigned To" value as normal text.
-- ============================================================