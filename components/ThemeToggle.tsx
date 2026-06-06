'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from './AuthProvider';
import { supabaseBrowser } from '@/lib/supabase';

/**
 * Compact theme toggle for nav bars.
 * Cycles: light -> dark -> system -> light
 *
 * IMPORTANT for hydration:
 * We only decide the icon based on resolvedTheme *after* the component has mounted on the client.
 * During SSR / first client render we use a stable icon (Moon, since defaultTheme="dark").
 * This prevents the server HTML from differing from the initial client render.
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user } = useAuth();

  // We must not branch the rendered icon on resolvedTheme until after mount.
  // Otherwise next-themes (which resolves on client from localStorage/system) causes hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = async () => {
    const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const current = (theme as 'light' | 'dark' | 'system') || 'dark';
    const next = modes[(modes.indexOf(current) + 1) % modes.length];

    setTheme(next);

    // Persist to DB for logged-in users (user preference is source of truth)
    if (user?.id) {
      try {
        await supabaseBrowser
          .from('profiles')
          .upsert(
            {
              id: user.id,
              theme_preference: next,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
      } catch {
        // Silent - preference is best-effort; the local theme (next-themes) still works.
      }
    }
  };

  // Stable choice for server render + very first client render (before effects).
  // We pick Moon because our defaultTheme="dark" and it matches the current branding.
  let Icon = Moon;

  if (mounted) {
    // Only after hydration do we trust resolvedTheme for the correct icon.
    Icon =
      resolvedTheme === 'dark'
        ? Moon
        : resolvedTheme === 'light'
        ? Sun
        : Monitor;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label="Cycle theme (light / dark / system)"
      className="text-muted-foreground hover:text-foreground"
      title={`Current theme: ${theme || 'dark'} (click to cycle)`}
      suppressHydrationWarning
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
