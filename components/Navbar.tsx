'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Menu, X } from 'lucide-react';
import UserMenu from './UserMenu';
import { useAuth } from './AuthProvider';

const AUTH_LINKS = [
  { href: '/chat', label: 'Chat' },
  { href: '/dashboard', label: 'Dashboard' },
];

const PUBLIC_LINKS = [
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/what-we-fix', label: 'What We Fix' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const visibleLinks = user ? [...AUTH_LINKS, ...PUBLIC_LINKS] : PUBLIC_LINKS;
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0A0F1E]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-lg shadow-md">
            🔧
          </div>
          <span className="font-sora font-bold text-lg text-slate-50">
            MyTech<span className="text-blue-400">Fix</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-100 transition-colors">
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          {visibleLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-slate-400 hover:text-slate-100 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <UserMenu />
          {!user && (
            <Link
              href="/chat"
              className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors shadow-md shadow-blue-900/40"
            >
              Start Free
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.07] bg-[#0A0F1E]/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1 text-sm font-medium">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-2 py-3 text-slate-400 hover:text-slate-100 transition-colors border-b border-white/[0.05]"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            {visibleLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="py-3 text-slate-400 hover:text-slate-100 transition-colors border-b border-white/[0.05] last:border-0"
              >
                {item.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/chat"
                onClick={closeMobileMenu}
                className="mt-3 flex items-center justify-center px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors"
              >
                Start Free — 5 Chats
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
