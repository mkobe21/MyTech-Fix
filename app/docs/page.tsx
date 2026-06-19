import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DOC_SECTIONS } from '@/lib/docs-navigation';
import DocsSearch from '@/components/docs/DocsSearch';

export const metadata: Metadata = {
  title: 'Documentation — MyTech-Fix',
  description: 'Everything you need to know about using MyTech-Fix — from first setup to advanced features.',
};

const QUICK_LINKS = [
  { title: 'What is MyTech-Fix?', slug: 'getting-started/what-is-mytech-fix' },
  { title: 'How sessions work', slug: 'billing/how-sessions-work' },
  { title: 'Getting the best AI results', slug: 'fix/getting-the-best-results' },
  { title: 'Privacy and your data', slug: 'privacy/data-and-privacy' },
];

export default function DocsHomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="font-sora text-4xl font-bold text-slate-50 tracking-tight mb-3">
          MyTech-Fix Documentation
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
          Everything you need to know about using MyTech-Fix — from first setup to advanced features.
        </p>

        {/* Search */}
        <div className="max-w-xl mx-auto">
          <DocsSearch size="lg" placeholder="Search documentation…" />
        </div>
      </div>

      {/* Section cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {DOC_SECTIONS.map(section => (
          <Link
            key={section.slug}
            href={`/docs/${section.slug}`}
            className="group p-5 rounded-2xl border border-white/[0.07] bg-card/40 hover:border-white/20 hover:bg-card/70 transition-all"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl leading-none flex-shrink-0">{section.icon}</span>
              <div>
                <h2 className="font-sora font-semibold text-slate-100 group-hover:text-white transition-colors text-sm leading-snug">
                  {section.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {section.items.length} {section.items.length === 1 ? 'article' : 'articles'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{section.description}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="border border-white/[0.07] rounded-2xl p-6">
        <h2 className="font-sora font-semibold text-slate-200 text-sm mb-4">Popular articles</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {QUICK_LINKS.map(link => (
            <Link
              key={link.slug}
              href={`/docs/${link.slug}`}
              className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl hover:bg-white/[0.04] text-sm text-slate-400 hover:text-slate-200 transition-all group"
            >
              {link.title}
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <p className="text-sm text-slate-500 mb-3">
          Couldn&apos;t find what you&apos;re looking for?
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
          >
            Ask the AI <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-sm transition-colors"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
