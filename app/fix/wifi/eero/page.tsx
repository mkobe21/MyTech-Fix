import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import FinalCTA from '@/components/seo/FinalCTA';
import { ArrowRight, Wifi } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Eero Troubleshooting Guides | MyTech-Fix',
  description:
    'Step-by-step fixes for the most common Eero router and mesh network problems — red light errors, app connection issues, slow speeds, and more.',
  alternates: {
    canonical: `${BASE}/fix/wifi/eero`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Eero' },
];

const EERO_6_GUIDES = [
  {
    title: 'Eero 6 Red Light Blinking',
    description:
      "Red or blinking red light means the Eero can't reach the internet. Usually a modem restart in the right order fixes it in under 5 minutes.",
    href: '/fix/wifi/eero-6/red-light-blinking',
    time: '5 min fix',
  },
  {
    title: "Eero 6 Won't Connect to App",
    description:
      "Can't add your Eero 6 in the app during setup? Bluetooth access and app state are almost always the cause.",
    href: '/fix/wifi/eero-6/wont-connect-to-app',
    time: '10 min fix',
  },
  {
    title: 'Eero 6 Keeps Disconnecting',
    description:
      'Random drops are almost always firmware or power-saving mode on the affected device. Here\'s how to tell which and fix it.',
    href: '/fix/wifi/eero-6/keeps-disconnecting',
    time: '10 min fix',
  },
  {
    title: 'Eero 6 Slow Speeds',
    description:
      'Slow WiFi usually comes down to which band your device is on. Check 2.4 GHz vs 5 GHz first before anything else.',
    href: '/fix/wifi/eero-6/slow-speeds',
    time: '5 min fix',
  },
];

export default function EeroHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Breadcrumb items={BREADCRUMBS} />

        <header className="mb-12">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-5">
            <Wifi className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="font-sora text-4xl font-bold text-slate-50 tracking-tight mb-3">
            Eero Troubleshooting Guides
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
            Common issues with Eero routers and mesh systems — and how to fix them step by step.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">
            Eero 6
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {EERO_6_GUIDES.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group rounded-2xl border border-white/10 bg-card/60 hover:border-blue-500/30 hover:bg-blue-500/5 p-6 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors leading-snug">
                    {guide.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-3">{guide.description}</p>
                <span className="text-xs font-medium text-emerald-400">{guide.time}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 mb-12 text-sm text-slate-400 leading-relaxed">
          <span className="font-semibold text-slate-300">More Eero guides coming soon.</span>{' '}
          We&apos;re adding coverage for dead zones, double NAT, node placement, and advanced mesh
          settings. Can&apos;t find your issue?{' '}
          <Link href="/chat" className="text-blue-400 hover:text-blue-300 transition-colors">
            Ask our AI directly →
          </Link>
        </div>

        <FinalCTA
          heading="Still having trouble with your Eero?"
          body="Our AI runs a live diagnostic on your network and gives you a fix specific to your setup — no account required to start."
          chatLink="/chat?device=eero-6"
        />
      </div>
    </div>
  );
}
