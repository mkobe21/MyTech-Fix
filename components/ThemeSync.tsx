'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { supabaseBrowser } from '@/lib/supabase';

/**
 * ThemeSync: Loads the logged-in user's theme_preference from the DB (profiles)
 * and applies it via next-themes setTheme. This makes the DB the source of truth
 * for authenticated users while next-themes handles instant localStorage + system
 * for the initial paint and anonymous users.
 *
 * Runs on mount and re-syncs on auth state changes (login).
 * Non-fatal on any error (graceful fallback to whatever next-themes resolved).
 */
export function ThemeSync() {
  const { setTheme, theme: currentTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    const loadAndApply = async () => {
      try {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (!user || cancelled) return;

        const { data } = await supabaseBrowser
          .from('profiles')
          .select('theme_preference')
          .eq('id', user.id)
          .maybeSingle();

        const pref = data?.theme_preference as 'light' | 'dark' | 'system' | undefined;
        if (pref && pref !== currentTheme) {
          setTheme(pref);
        }
      } catch (e) {
        // non-fatal (e.g. column not yet added, network, RLS edge)
      }
    };

    loadAndApply();

    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // re-sync when a user logs in (different account may have different saved pref)
        loadAndApply();
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [setTheme]); // intentionally omit currentTheme to avoid re-run loops

  return null;
}
