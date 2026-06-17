import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { ArrowRight, Clock, Smartphone } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'iPhone Troubleshooting Guides | MyTech-Fix',
  description:
    'Step-by-step fixes for the most common iPhone problems: WiFi not connecting, Bluetooth pairing failures, battery draining fast, and storage full errors.',
  alternates: {
    canonical: `${BASE}/fix/phone-tablet/iphone`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Phone & Tablet', href: '/fix/phone-tablet' },
  { label: 'iPhone' },
];

const IPHONE_GUIDES = [
  {
    slug: 'wont-connect-to-wifi',
    title: "iPhone Won't Connect to WiFi? Here's How to Fix It",
    description:
      "A wrong or cached password is the most common cause. Forget the network and reconnect, then check for router-side issues if it still fails.",
    readTime: '5 min read',
  },
  {
    slug: 'bluetooth-wont-pair',
    title: "iPhone Bluetooth Won't Pair? Here's the Fix",
    description:
      "The device you're trying to pair is most likely still connected to another phone or computer. Here's how to disconnect it and pair successfully.",
    readTime: '5 min read',
  },
  {
    slug: 'battery-draining-fast',
    title: "iPhone Battery Draining Fast? Here's How to Fix It",
    description:
      "Check Battery Usage by App first — one app running excessive background activity is the most common cause and the easiest to identify.",
    readTime: '5 min read',
  },
  {
    slug: 'storage-full-error',
    title: "iPhone Storage Full? Here's How to Free Up Space Fast",
    description:
      "Photos and videos are almost always the biggest culprit. Enable Optimize iPhone Storage and check the Recommendations section first.",
    readTime: '5 min read',
  },
];

export default function IPhoneHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Breadcrumb items={BREADCRUMBS} />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Smartphone className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">iPhone</span>
          </div>
          <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
            iPhone Troubleshooting Guides
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Common iPhone issues — and how to fix them. Each guide covers the likeliest causes,
            walks you through the fix, and links to our AI if you need more help.
          </p>
        </header>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sora text-lg font-semibold text-slate-200">
              All guides — {IPHONE_GUIDES.length} fixes
            </h2>
          </div>
          <div className="space-y-3">
            {IPHONE_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/fix/phone-tablet/iphone/${guide.slug}`}
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

        <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-6 text-center">
          <h2 className="font-sora text-xl font-bold text-slate-100 mb-2">
            Still having trouble with your iPhone?
          </h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Our AI can walk you through a fix specific to your iPhone model, iOS version, and
            setup — describe what&rsquo;s happening and get a targeted answer.
          </p>
          <Link
            href="/chat?device=iphone"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 transition-colors text-sm"
          >
            Ask MyTech-Fix AI
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/fix/phone-tablet"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Phone &amp; Tablet guides
          </Link>
        </div>
      </div>
    </div>
  );
}
