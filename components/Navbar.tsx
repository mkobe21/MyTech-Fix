'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import UserMenu from './UserMenu';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl shadow-md text-white ring-1 ring-white/20">
              🔧
            </div>
            <div>
              <span className="font-semibold text-3xl tracking-tight">MyTech-Fix</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link href="/chat" className="text-muted-foreground hover:text-foreground transition-colors">Chat</Link>
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
          <Link href="/account" className="text-muted-foreground hover:text-foreground transition-colors">Account</Link>
          <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
          <Link href="/what-we-fix" className="text-muted-foreground hover:text-foreground transition-colors">What We Fix</Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}