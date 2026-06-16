'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { guides, type Guide } from '@/lib/guides';
import { cn } from '@/lib/utils';

function rankGuides(query: string): Guide[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const exact: Guide[] = [];
  const partial: Guide[] = [];

  for (const guide of guides) {
    const title = guide.title.toLowerCase();
    const matchesKeyword = guide.keywords.some((k) => k.toLowerCase().includes(q));

    if (title.includes(q) || matchesKeyword) {
      if (title.startsWith(q)) {
        exact.push(guide);
      } else {
        partial.push(guide);
      }
    }
  }

  return [...exact, ...partial].slice(0, 8);
}

export default function GuidesSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => rankGuides(query), [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function goToResult(guide: Guide) {
    setIsOpen(false);
    setQuery('');
    router.push(guide.href);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[activeIndex] ?? results[0];
      if (target) goToResult(target);
    }
  }

  return (
    <div ref={containerRef} className="relative max-w-[600px] mx-auto mb-12">
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl border bg-card/60 px-4 py-3.5 transition-colors',
          isOpen ? 'border-blue-500/50' : 'border-white/10'
        )}
      >
        <Search className="w-5 h-5 text-slate-500 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search guides... e.g. 'Eero red light' or 'printer offline'"
          aria-label="Search troubleshooting guides"
          className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setActiveIndex(-1);
            }}
            aria-label="Clear search"
            className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && query.trim() && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-card/95 backdrop-blur-sm shadow-xl overflow-hidden z-50">
          {results.length > 0 ? (
            <ul>
              {results.map((guide, i) => (
                <li key={guide.href}>
                  <button
                    onClick={() => goToResult(guide)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      'w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors border-b border-white/[0.05] last:border-0',
                      i === activeIndex ? 'bg-blue-500/10' : 'hover:bg-white/[0.03]'
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{guide.title}</p>
                      <p className="text-xs text-slate-500">{guide.category}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 text-center">
              <p className="text-sm text-slate-400 mb-1">No results found.</p>
              <a
                href="/chat"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Try asking our AI →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
