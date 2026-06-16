import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { ArrowRight, Clock, Printer } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Canon PIXMA Troubleshooting Guides | MyTech-Fix',
  description:
    'Step-by-step fixes for the most common Canon PIXMA problems: offline errors, print queue stuck, WiFi connection issues, and printer not printing.',
  alternates: {
    canonical: `${BASE}/fix/printers/canon-pixma`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Printers', href: '/fix/printers' },
  { label: 'Canon PIXMA' },
];

const CANON_PIXMA_GUIDES = [
  {
    slug: 'offline',
    title: 'Canon PIXMA Showing Offline in Windows? Fix It Fast',
    description:
      "Windows marks the printer offline when it loses communication — usually the Print Spooler or a changed IP address. Restart the service and you'll be printing in minutes.",
    readTime: '4 min read',
  },
  {
    slug: 'wont-print',
    title: "Canon PIXMA Says Ready But Won't Print? Try This",
    description:
      "A stuck job in the queue blocks everything behind it. Clear the queue, power cycle, and re-seat the cartridges — three steps that fix most 'Ready but won't print' cases.",
    readTime: '5 min read',
  },
  {
    slug: 'wont-connect-to-wifi',
    title: "Canon PIXMA Won't Connect to WiFi? Here's the Fix",
    description:
      "Start with the WiFi indicator light — if the radio is off, nothing else will work. Most PIXMA models support only 2.4 GHz, and the IJ Network Device Setup Utility handles the rest.",
    readTime: '5 min read',
  },
  {
    slug: 'print-queue-stuck',
    title: 'Canon PIXMA Print Queue Stuck? How to Clear It',
    description:
      "Jobs that won't cancel need the Print Spooler restarted. For truly stuck queues, stop the service, delete the spool files manually, and restart — takes under 2 minutes.",
    readTime: '4 min read',
  },
];

export default function CanonPixmaHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Breadcrumb items={BREADCRUMBS} />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Printer className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">Canon PIXMA</span>
          </div>
          <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
            Canon PIXMA Troubleshooting Guides
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Step-by-step fixes for the most common Canon PIXMA problems. Each guide covers the
            likeliest causes, walks you through the fix, and links to our AI if you need more help.
          </p>
        </header>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sora text-lg font-semibold text-slate-200">
              All guides — {CANON_PIXMA_GUIDES.length} fixes
            </h2>
          </div>
          <div className="space-y-3">
            {CANON_PIXMA_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/fix/printers/canon-pixma/${guide.slug}`}
                className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-card/60 px-5 py-4 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-sora font-semibold text-slate-100 group-hover:text-blue-300 transition-colors mb-1 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span className="text-xs text-slate-500">{guide.readTime}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-6 text-center">
          <h2 className="font-sora text-xl font-bold text-slate-100 mb-2">
            Problem not listed here?
          </h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Describe your Canon PIXMA issue to our AI — it can diagnose error codes, walk through
            driver reinstalls, and troubleshoot models not covered by these guides.
          </p>
          <Link
            href="/chat?device=canon-pixma"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 transition-colors text-sm"
          >
            Ask MyTech-Fix AI
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/fix/printers"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Printer guides
          </Link>
        </div>
      </div>
    </div>
  );
}
