'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { DOCS_SEARCH_INDEX, type DocSearchItem } from '@/lib/docs-search-index';

interface Props {
  size?: 'sm' | 'lg';
  placeholder?: string;
}

export default function DocsSearch({ size = 'sm', placeholder = 'Search docs…' }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DocSearchItem[]>([]);
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fuse = useRef(
    new Fuse(DOCS_SEARCH_INDEX, {
      keys: ['title', 'description', 'section'],
      threshold: 0.4,
      includeMatches: true,
    })
  );

  const search = useCallback((q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const hits = fuse.current.search(q, { limit: 8 });
    setResults(hits.map(h => h.item));
  }, []);

  useEffect(() => {
    search(query);
    setFocusedIdx(-1);
    setOpen(query.length >= 2);
  }, [query, search]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); setQuery(''); return; }
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && focusedIdx >= 0) {
      router.push(`/docs/${results[focusedIdx].slug}`);
      setOpen(false);
      setQuery('');
    }
  };

  const inputClass = size === 'lg'
    ? 'w-full bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-base text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all'
    : 'w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-8 pr-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 transition-all';

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className={`absolute left-${size === 'lg' ? '4' : '2.5'} top-1/2 -translate-y-1/2 text-slate-500 ${size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder={placeholder}
          className={inputClass}
          aria-label="Search documentation"
          aria-expanded={open}
          aria-haspopup="listbox"
          role="combobox"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-[#0D1526] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          {results.length > 0 ? (
            <ul>
              {results.map((item, idx) => (
                <li key={item.slug} role="option" aria-selected={focusedIdx === idx}>
                  <Link
                    href={`/docs/${item.slug}`}
                    onClick={() => { setOpen(false); setQuery(''); }}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors border-b border-white/[0.05] last:border-0 ${
                      focusedIdx === idx ? 'bg-blue-500/10' : 'hover:bg-white/[0.04]'
                    }`}
                    onMouseEnter={() => setFocusedIdx(idx)}
                  >
                    <span className="text-lg flex-shrink-0 mt-0.5">{item.sectionIcon}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-100 truncate">{item.title}</div>
                      <div className="text-xs text-slate-500 truncate">{item.section}</div>
                      {item.description && (
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.description}</div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-slate-400 mb-3">No results for &ldquo;{query}&rdquo;</p>
              <Link
                href={`/chat?q=${encodeURIComponent(query)}`}
                onClick={() => setOpen(false)}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Try asking the AI instead →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
