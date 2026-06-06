// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

// This is the ONLY client safe to use in Client Components (like UserMenu, Chat, etc.)
export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);