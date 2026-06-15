'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';

const NAV_LINKS = [
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/what-we-fix', label: 'What We Fix' },
  { href: '/fix', label: 'Guides' },
  { href: '/pricing', label: 'Pricing' },
];

export default function MarketingNavBar() {
  const [open, setOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'signIn' | 'signUp' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });

    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0A0F1E]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-lg shadow-md">
              🔧
            </div>
            <span className="font-sora font-bold text-lg text-slate-50">
              MyTech<span className="text-blue-400">Fix</span>
            </span>
          </Link>

          {/* Desktop nav links — hidden below 900px */}
          <div className="hidden min-[900px]:flex items-center gap-7 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-400 hover:text-slate-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden min-[900px]:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 transition-colors font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/chat"
                  className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors shadow-md shadow-blue-900/40"
                >
                  Open Chat
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAuthModal('signIn')}
                  className="text-sm text-slate-400 hover:text-slate-100 font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModal('signUp')}
                  className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors shadow-md shadow-blue-900/40"
                >
                  Start Free
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="min-[900px]:hidden p-2 text-slate-400 hover:text-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="min-[900px]:hidden border-t border-white/[0.07] bg-[#0A0F1E]/95 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-slate-400 hover:text-slate-100 transition-colors text-sm font-medium border-b border-white/[0.05] last:border-0"
                >
                  {link.label}
                </a>
              ))}

              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="mt-3 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/[0.12] text-slate-200 hover:bg-white/5 text-sm font-medium transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/chat"
                    onClick={() => setOpen(false)}
                    className="mt-2 flex items-center justify-center px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors"
                  >
                    Open Chat
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setOpen(false); setAuthModal('signIn'); }}
                    className="mt-3 flex items-center justify-center px-5 py-3 rounded-xl border border-white/[0.12] text-slate-200 hover:bg-white/5 text-sm font-semibold transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setOpen(false); setAuthModal('signUp'); }}
                    className="mt-2 flex items-center justify-center px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors"
                  >
                    Start Free — 5 Chats
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={authModal !== null}
        onClose={() => setAuthModal(null)}
        mode={authModal ?? 'signIn'}
      />
    </>
  );
}
