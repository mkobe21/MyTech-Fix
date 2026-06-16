import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import FinalCTA from '@/components/seo/FinalCTA';
import { ArrowRight, Monitor } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Computer Troubleshooting Guides | MyTech-Fix',
  description:
    'Fix Windows, Mac, and Chromebook issues step by step. WiFi disconnects, slow performance, blue screen errors, and failed updates.',
  alternates: {
    canonical: `${BASE}/fix/computers`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Computers' },
];

const BRAND_HUBS = [
  {
    name: 'Windows',
    description: 'WiFi disconnects, slow performance, blue screen errors, and failed updates.',
    href: '/fix/computers/windows',
    guideCount: 4,
    icon: Monitor,
  },
];

export default function ComputersCategoryHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Breadcrumb items={BREADCRUMBS} />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Monitor className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-emerald-400">4 guides</span>
          </div>
          <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
            Computer Troubleshooting Guides
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            Fix Windows, Mac, and Chromebook issues — step by step.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Brand Guides
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {BRAND_HUBS.map((hub) => (
              <Link
                key={hub.href}
                href={hub.href}
                className="group rounded-2xl border border-white/10 bg-card/60 hover:border-blue-500/30 hover:bg-blue-500/5 p-6 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <hub.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                </div>
                <h3 className="font-sora font-semibold text-slate-100 group-hover:text-blue-300 transition-colors mb-1">
                  {hub.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-3">{hub.description}</p>
                <span className="text-xs font-medium text-emerald-400">
                  {hub.guideCount} guides
                </span>
              </Link>
            ))}
          </div>
        </section>

        <FinalCTA
          heading="Having a computer issue not listed here?"
          body="Our AI can diagnose performance, connectivity, crash, and update problems specific to your computer."
          chatLink="/chat?category=computers"
        />
      </div>
    </div>
  );
}
