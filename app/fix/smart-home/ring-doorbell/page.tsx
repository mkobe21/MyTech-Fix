import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { ArrowRight, Clock, Bell } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Ring Doorbell Troubleshooting Guides | MyTech-Fix',
  description:
    'Step-by-step fixes for the most common Ring Doorbell problems: offline errors, WiFi connection issues, motion detection not working, and fast battery drain.',
  alternates: {
    canonical: `${BASE}/fix/smart-home/ring-doorbell`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Smart Home', href: '/fix/smart-home' },
  { label: 'Ring Doorbell' },
];

const RING_GUIDES = [
  {
    slug: 'offline',
    title: "Ring Doorbell Showing Offline? Here's How to Fix It",
    description:
      "Usually weak WiFi signal at the doorbell's location or a power issue. Check Device Health in the Ring app — signal strength and battery level are both visible there.",
    readTime: '5 min read',
  },
  {
    slug: 'wont-connect-to-wifi',
    title: "Ring Doorbell Won't Connect to WiFi? Here's the Fix",
    description:
      "Ring requires 2.4 GHz — connecting to a 5 GHz SSID is the most common setup failure. Signal is also stricter during pairing, so move the doorbell close to your router first.",
    readTime: '4 min read',
  },
  {
    slug: 'motion-detection-not-working',
    title: 'Ring Doorbell Motion Detection Not Working? Try This',
    description:
      "Usually a single setting — a toggle, a zone boundary, or a Ring Mode configuration. Check Motion Settings first, then verify the current Mode has alerts enabled.",
    readTime: '4 min read',
  },
  {
    slug: 'battery-draining-fast',
    title: "Ring Doorbell Battery Draining Fast? Here's Why and How to Fix It",
    description:
      "High motion event volume, cold weather, and weak WiFi are the three main drains. Adjusting Motion Zones and improving signal are the highest-impact fixes.",
    readTime: '5 min read',
  },
];

export default function RingDoorbellHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Breadcrumb items={BREADCRUMBS} />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Bell className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">Ring Doorbell</span>
          </div>
          <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
            Ring Doorbell Troubleshooting Guides
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Step-by-step fixes for the most common Ring Doorbell problems. Each guide covers the
            likeliest causes, walks you through the fix, and links to our AI if you need more help.
          </p>
        </header>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sora text-lg font-semibold text-slate-200">
              All guides — {RING_GUIDES.length} fixes
            </h2>
          </div>
          <div className="space-y-3">
            {RING_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/fix/smart-home/ring-doorbell/${guide.slug}`}
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

        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Cross-Ecosystem
          </p>
          <Link
            href="/fix/smart-home/ring-doorbell-not-working-with-alexa"
            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-blue-500/20 hover:bg-blue-500/5 px-4 py-3 transition-all group"
          >
            <span className="text-sm text-slate-300 group-hover:text-blue-300 transition-colors">
              Ring Doorbell Not Working with Alexa
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 flex-shrink-0" />
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Ring Products
          </p>
          <Link
            href="/fix/security-cameras/ring-camera"
            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-blue-500/20 hover:bg-blue-500/5 px-4 py-3 transition-all group"
          >
            <span className="text-sm text-slate-300 group-hover:text-blue-300 transition-colors">
              Looking for Ring Camera help instead? →
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 flex-shrink-0" />
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-300">
            <span className="font-semibold">Setting up a new Ring Doorbell?</span> See our complete setup and Alexa linking guide.
          </p>
          <Link
            href="/setup/ring-doorbell-with-alexa"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 whitespace-nowrap transition-colors"
          >
            Setup guide →
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-6 text-center">
          <h2 className="font-sora text-xl font-bold text-slate-100 mb-2">
            Still having trouble with your Ring Doorbell?
          </h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Describe your issue to our AI — it can walk you through a fix specific to your
            doorbell model, network setup, and home configuration.
          </p>
          <Link
            href="/chat?device=ring-doorbell"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 transition-colors text-sm"
          >
            Ask MyTech-Fix AI
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/fix/smart-home"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Smart Home guides
          </Link>
        </div>
      </div>
    </div>
  );
}
