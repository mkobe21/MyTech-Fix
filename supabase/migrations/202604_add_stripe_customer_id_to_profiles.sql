-- ============================================================
-- MyTech-Fix - Add stripe_customer_id to profiles
-- Date: April 2026
-- This column links a user profile to their Stripe Customer for:
--   - Billing portal (account page "Manage Billing")
--   - Webhook handlers (subscription created/updated/deleted by customer id)
-- It was referenced in API routes + restore script but omitted from earlier
-- profiles schema/migrations (hence 42703 errors when running restores or
-- using Stripe features).
-- ============================================================

-- 1. Add the column (idempotent)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- 2. Index for efficient lookups in webhooks (e.g. customer.subscription.deleted)
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id 
ON public.profiles(stripe_customer_id);

-- 3. Comment for docs
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 
  'Stripe Customer ID. Set on successful checkout. Used for Customer Portal and subscription webhooks.';

-- Note: No backfill needed (column was never populated before; new checkouts will set it).
-- The handle_new_user() trigger INSERT does not reference it (NULL is correct for new users).
-- RLS: service_role (used in /api/stripe/*) bypasses RLS; client code never directly exposes it.
