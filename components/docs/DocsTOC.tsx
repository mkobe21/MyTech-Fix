'use client';

import { useEffect, useState } from 'react';
import type { TOCHeading } from '@/lib/docs-content';

interface Props {
  headings: TOCHeading[];
}

export default function DocsTOC({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-8 self-start" aria-label="On this page">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        On this page
      </p>
      <ul className="space-y-0.5">
        {headings.map(({ id, title, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block py-1 text-sm transition-colors leading-snug ${
                level === 3 ? 'pl-3' : ''
              } ${
                activeId === id
                  ? 'text-blue-400 font-medium'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                setActiveId(id);
              }}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
