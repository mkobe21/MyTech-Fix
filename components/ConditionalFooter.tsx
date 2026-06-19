'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import Footer from './Footer';

const ALWAYS_HIDE = [
  '/chat', '/dashboard', '/account', '/my-devices', '/history',
  '/diagnostics', '/teams', '/upgrade', '/inventory', '/docs',
  '/',
];

const AUTH_HIDE = ['/fix', '/setup', '/productivity'];

export default function ConditionalFooter() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isProductivitySeoPage =
    pathname !== '/productivity' && pathname?.startsWith('/productivity/');

  const alwaysHide =
    !isProductivitySeoPage &&
    ALWAYS_HIDE.some(p => pathname === p || pathname?.startsWith(p + '/'));

  const authHide =
    !!user && AUTH_HIDE.some(p => pathname === p || pathname?.startsWith(p + '/'));

  if (alwaysHide || authHide) return null;
  return <Footer />;
}
