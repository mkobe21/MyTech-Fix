import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { ArrowRight, Clock, Globe } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Windows VPN Troubleshooting Guides | MyTech-Fix',
  description:
    'Step-by-step fixes for the most common Windows VPN problems: connection failures, repeated disconnects, slow speeds, and VPN blocking internet access.',
  alternates: {
    canonical: `${BASE}/fix/vpn-remote-work/windows-vpn`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'VPN & Remote Work', href: '/fix/vpn-remote-work' },
  { label: 'Windows VPN' },
];

const WINDOWS_VPN_GUIDES = [
  {
    slug: 'wont-connect',
    title: "Windows VPN Won't Connect? Here's How to Fix It",
    description:
      "Stale credentials and Windows Firewall blocks are the two most common causes. Here's how to diagnose which one is stopping your connection.",
    readTime: '5 min read',
  },
  {
    slug: 'keeps-disconnecting',
    title: "Windows VPN Keeps Disconnecting? Here's the Fix",
    description:
      "Windows power management suspending your network adapter is the most common cause of regular VPN drops — here's how to fix it permanently.",
    readTime: '5 min read',
  },
  {
    slug: 'slow-speeds',
    title: "Windows VPN Slow? Here's How to Speed It Up",
    description:
      "A distant or congested server is almost always the cause. Switching server and protocol gives you the fastest result with the least effort.",
    readTime: '5 min read',
  },
  {
    slug: 'blocking-internet-access',
    title: "VPN Blocking Internet Access? Here's How to Fix It",
    description:
      "The kill switch blocking traffic while the tunnel isn't fully established is the most common cause. Here's how to identify and resolve it.",
    readTime: '5 min read',
  },
];

export default function WindowsVpnHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Breadcrumb items={BREADCRUMBS} />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">Windows VPN</span>
          </div>
          <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
            Windows VPN Troubleshooting Guides
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Common VPN connection issues on Windows — and how to fix them. Each guide covers
            the likeliest causes, walks you through the fix, and links to our AI if you need
            more help.
          </p>
        </header>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sora text-lg font-semibold text-slate-200">
              All guides — {WINDOWS_VPN_GUIDES.length} fixes
            </h2>
          </div>
          <div className="space-y-3">
            {WINDOWS_VPN_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/fix/vpn-remote-work/windows-vpn/${guide.slug}`}
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
            Still having VPN trouble?
          </h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Describe your VPN client, error message, and what you&rsquo;ve already tried — our AI
            can walk you through a targeted fix for your specific setup.
          </p>
          <Link
            href="/chat?category=vpn"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 transition-colors text-sm"
          >
            Ask MyTech-Fix AI
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/fix/vpn-remote-work"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← VPN &amp; Remote Work guides
          </Link>
        </div>
      </div>
    </div>
  );
}
