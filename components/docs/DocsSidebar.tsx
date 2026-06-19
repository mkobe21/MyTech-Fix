'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, LayoutDashboard, BookOpen, X } from 'lucide-react';
import { DOC_SECTIONS } from '@/lib/docs-navigation';
import { useAuth } from '@/components/AuthProvider';
import DocsSearch from './DocsSearch';

interface Props {
  onClose?: () => void;
}

export default function DocsSidebar({ onClose }: Props) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Determine active section from pathname
  const activeSection = pathname.split('/')[2] ?? '';
  const activeSlug = pathname.replace('/docs/', '').replace(/^\//, '');

  // Sections that are expanded — start with active section open
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const s of DOC_SECTIONS) {
      init[s.slug] = s.slug === activeSection;
    }
    return init;
  });

  const toggleSection = (slug: string) => {
    setExpanded(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const handleLink = () => {
    onClose?.();
  };

  return (
    <div className="h-full flex flex-col bg-[#060D1A] border-r border-white/[0.07] w-64">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.07] flex-shrink-0">
        <Link href="/docs" onClick={handleLink} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm shadow">
            🔧
          </div>
          <span className="font-sora font-semibold text-sm text-slate-100">Docs</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-slate-600 hover:text-slate-400">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-3 py-3 flex-shrink-0">
        <DocsSearch size="sm" placeholder="Search docs…" />
      </div>

      {/* Back links */}
      <div className="px-3 pb-2 flex-shrink-0 space-y-0.5">
        {user && (
          <Link
            href="/dashboard"
            onClick={handleLink}
            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] rounded-lg transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Back to app
          </Link>
        )}
        <Link
          href="/fix"
          onClick={handleLink}
          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] rounded-lg transition-all"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Troubleshooting guides
        </Link>
      </div>

      <div className="h-px bg-white/[0.06] mx-3 mb-2 flex-shrink-0" />

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {DOC_SECTIONS.map(section => {
          const isExpanded = expanded[section.slug];
          const isSectionActive = activeSection === section.slug;

          return (
            <div key={section.slug}>
              <button
                onClick={() => toggleSection(section.slug)}
                className={`w-full flex items-center justify-between text-left pl-3 pr-3 py-2 rounded-lg text-sm transition-all group ${
                  isSectionActive ? 'text-blue-400 bg-blue-500/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <span className="text-base leading-none">{section.icon}</span>
                  {section.title}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                />
              </button>

              {isExpanded && (
                <ul className="mt-0.5 mb-1 space-y-0.5">
                  {section.items.map(item => {
                    const isActive = activeSlug === item.slug;
                    return (
                      <li key={item.slug}>
                        <Link
                          href={`/docs/${item.slug}`}
                          onClick={handleLink}
                          className={`block text-left pl-6 pr-3 py-1.5 text-sm rounded-lg transition-all ${
                            isActive
                              ? 'text-blue-400 bg-blue-500/10 font-medium border-l-2 border-blue-400'
                              : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
