'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  // Hide footer on full-bleed experiences like chat
  const hideOnPaths = ['/chat', '/'];
  const shouldHide = hideOnPaths.some(p => pathname?.startsWith(p));
  
  if (shouldHide) return null;
  return <Footer />;
}
