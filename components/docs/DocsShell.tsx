'use client';

import { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import Link from 'next/link';
import DocsSidebar from './DocsSidebar';

export default function DocsShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DocsSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex-shrink-0 h-12 border-b border-white/[0.07] bg-[#0A0F1E]/80 backdrop-blur-xl flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
            aria-label="Open docs navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/docs" className="font-sora font-semibold text-sm text-slate-100">
            MyTech-Fix Docs
          </Link>
          <Link
            href="/docs"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
            aria-label="Search docs"
          >
            <Search className="w-5 h-5" />
          </Link>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
