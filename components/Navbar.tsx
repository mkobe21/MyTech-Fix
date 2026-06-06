'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Menu, X } from 'lucide-react';
import UserMenu from './UserMenu';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/chat', label: 'Chat' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/account', label: 'Account' },
    { href: '/how-it-works', label: 'How it Works' },
    { href: '/what-we-fix', label: 'What We Fix' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
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

        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side actions + Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - drops down on small screens */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1 text-sm font-medium">
            <Link 
              href="/" 
              onClick={closeMobileMenu}
              className="flex items-center gap-2 py-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={closeMobileMenu}
                className="py-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}