-- Add full_name to user_tiers for consistency with profiles (personal display name)
ALTER TABLE public.user_tiers 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Backfill from profiles
UPDATE public.user_tiers ut
SET full_name = p.full_name
FROM public.profiles p
WHERE ut.user_id = p.id;

-- Optional index if searching names
CREATE INDEX IF NOT EXISTS idx_user_tiers_full_name ON public.user_tiers(full_name);