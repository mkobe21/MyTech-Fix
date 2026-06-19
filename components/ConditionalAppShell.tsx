'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import AppShell from './layout/AppShell';

// Always get the sidebar (middleware enforces auth on these paths).
const PROTECTED_PATHS = [
  '/chat', '/dashboard', '/account', '/my-devices', '/history',
  '/diagnostics', '/teams', '/upgrade', '/inventory',
];

// Get the sidebar only when the user is logged in (public pages that gain sidebar on auth).
const AUTH_CONDITIONAL_PATHS = ['/fix', '/setup', '/productivity'];

export default function ConditionalAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Exclude /productivity/* SEO sub-pages — only the hub page gets the shell.
  const isProductivitySeoPage =
    pathname !== '/productivity' && pathname.startsWith('/productivity/');

  const isProtected =
    !isProductivitySeoPage &&
    PROTECTED_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));

  const isAuthConditional =
    !!user && AUTH_CONDITIONAL_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));

  if (isProtected || isAuthConditional) {
    return <AppShell>{children}</AppShell>;
  }

  return <>{children}</>;
}
