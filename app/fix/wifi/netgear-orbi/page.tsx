import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import FinalCTA from '@/components/seo/FinalCTA';
import { ArrowRight, Wifi } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Netgear Orbi Troubleshooting Guides | MyTech-Fix',
  description:
    'Step-by-step fixes for the most common Netgear Orbi router and satellite problems — red ring errors, satellite sync issues, slow speeds, and more.',
  alternates: {
    canonical: `${BASE}/fix/wifi/netgear-orbi`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'WiFi & Networking', href: '/fix/wifi' },
  { label: 'Netgear Orbi' },
];

const ORBI_GUIDES = [
  {
    title: 'Netgear Orbi Red Light or Red Ring',
    description:
      "Red ring on the router means no internet. Red ring on a satellite means it's lost sync. The fix is different for each — here's how to handle both.",
    href: '/fix/wifi/netgear-orbi/red-light-blinking',
    time: '10 min fix',
  },
  {
    title: "Netgear Orbi Won't Connect to the App",
    description:
      "App can't find your router? Your phone's network connection is almost always the culprit — not the router itself.",
    href: '/fix/wifi/netgear-orbi/wont-connect-to-app',
    time: '5 min fix',
  },
  {
    title: 'Netgear Orbi Keeps Disconnecting',
    description:
      'Random drops are almost always firmware or interference. Here\'s how to tell which — and how to fix it without a factory reset.',
    href: '/fix/wifi/netgear-orbi/keeps-disconnecting',
    time: '10 min fix',
  },
  {
    title: 'Netgear Orbi Slow Speeds',
    description:
      'Start with an Ethernet test to the modem to rule out your ISP, then check the band your device is on and your satellite backhaul strength.',
    href: '/fix/wifi/netgear-orbi/slow-speeds',
    time: '5 min fix',
  },
];

export default function NetgearOrbiHubPage() {
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
            Netgear Orbi Troubleshooting Guides
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
            Common issues with Orbi routers and satellites — and how to fix them step by step.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">
            Orbi Mesh System
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {ORBI_GUIDES.map((guide) => (
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
          <span className="font-semibold text-slate-300">More Orbi guides coming soon.</span>{' '}
          We&apos;re adding coverage for double NAT with ISP-provided modems, satellite placement
          optimization, and Orbi Pro for business users. Can&apos;t find your issue?{' '}
          <Link href="/chat" className="text-blue-400 hover:text-blue-300 transition-colors">
            Ask our AI directly →
          </Link>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4 mb-8 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-300">
            <span className="font-semibold">New to Orbi?</span> See our complete setup guide — router to satellite to verified coverage.
          </p>
          <Link
            href="/setup/netgear-orbi-mesh-network"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 whitespace-nowrap transition-colors"
          >
            Setup guide →
          </Link>
        </div>

        <FinalCTA
          heading="Still having trouble with your Orbi?"
          body="Our AI runs a live diagnostic on your network and gives you a fix specific to your setup — no account required to start."
          chatLink="/chat?device=netgear-orbi"
        />
      </div>
    </div>
  );
}
