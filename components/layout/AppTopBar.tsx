'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, LogOut, User, CreditCard } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import NotificationBell from '@/components/NotificationBell';

const PAGE_TITLES: Record<string, string> = {
  '/chat': 'Chat',
  '/dashboard': 'Dashboard',
  '/my-devices': 'Devices',
  '/history': 'Chat History',
  '/diagnostics': 'Diagnostics',
  '/productivity': 'Productivity',
  '/productivity/excel-formula-help': 'Excel Formula Help',
  '/productivity/word-document-help': 'Word Document Help',
  '/productivity/new-device-setup-help': 'New Device Setup',
  '/account': 'Account',
  '/account/notifications': 'Notifications',
  '/teams': 'Teams',
  '/upgrade': 'Upgrade Plan',
  '/inventory': 'Inventory',
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Dynamic route fallback: title-case the last path segment
  const last = pathname.split('/').filter(Boolean).pop() ?? '';
  return last.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

interface Props {
  onMenuClick: () => void;
}

export default function AppTopBar({ onMenuClick }: Props) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    await supabaseBrowser.auth.signOut();
    window.location.href = '/';
  };

  const initials = user
    ? (user.user_metadata?.full_name as string | undefined)
        ?.split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? user.email?.[0]?.toUpperCase() ?? 'U'
    : 'U';

  return (
    <header className="h-14 flex-shrink-0 border-b border-white/[0.07] bg-[#0A0F1E]/80 backdrop-blur-xl flex items-center px-4 gap-4 z-20">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-base font-semibold text-slate-100 flex-1 truncate">{pageTitle}</h1>

      {user && <NotificationBell userId={user.id} />}

      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
            aria-label="User menu"
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-[#0D1526] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-3 py-2.5 border-b border-white/[0.07]">
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
              <Link
                href="/account"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <User className="w-4 h-4" />
                Account Settings
              </Link>
              <Link
                href="/upgrade"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Billing
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
