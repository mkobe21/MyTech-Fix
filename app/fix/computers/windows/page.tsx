import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import FinalCTA from '@/components/seo/FinalCTA';
import { ArrowRight, Monitor } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Windows Troubleshooting Guides | MyTech-Fix',
  description:
    'Common Windows issues — and how to fix them. WiFi disconnects, slow performance, blue screen errors, and failed updates, step by step.',
  alternates: {
    canonical: `${BASE}/fix/computers/windows`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Computers', href: '/fix/computers' },
  { label: 'Windows' },
];

const WINDOWS_GUIDES = [
  {
    title: 'Windows WiFi Keeps Disconnecting',
    description:
      "Power management is almost always the culprit — it silently turns off your WiFi adapter. Here's how to stop it for good.",
    href: '/fix/computers/windows/wifi-keeps-disconnecting',
    time: '10 min fix',
  },
  {
    title: 'Windows Running Slow',
    description:
      'Startup bloat and a full drive are behind most slow PCs. Six steps to speed it back up — no reinstall required.',
    href: '/fix/computers/windows/running-slow',
    time: '10 min fix',
  },
  {
    title: 'Windows Blue Screen Error (BSOD)',
    description:
      'A recently installed driver is the most common cause. Identify the exact error code and find the real culprit.',
    href: '/fix/computers/windows/blue-screen-error',
    time: '15 min fix',
  },
  {
    title: "Windows Won't Install Updates",
    description:
      'Corrupted update components are the usual cause. Reset them and get updates flowing again.',
    href: '/fix/computers/windows/wont-install-updates',
    time: '15 min fix',
  },
];

export default function WindowsHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Breadcrumb items={BREADCRUMBS} />

        <header className="mb-12">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-5">
            <Monitor className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="font-sora text-4xl font-bold text-slate-50 tracking-tight mb-3">
            Windows Troubleshooting Guides
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
            Common Windows issues — and how to fix them.
          </p>
          <span className="inline-block mt-3 text-xs font-medium text-emerald-400">
            4 guides
          </span>
        </header>

        <section className="mb-12">
          <div className="grid sm:grid-cols-2 gap-4">
            {WINDOWS_GUIDES.map((guide) => (
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

        <FinalCTA
          heading="Still having trouble with your Windows PC?"
          body="Our AI can diagnose connectivity, performance, crash, and update issues specific to your setup."
          chatLink="/chat?device=windows"
        />
      </div>
    </div>
  );
}
