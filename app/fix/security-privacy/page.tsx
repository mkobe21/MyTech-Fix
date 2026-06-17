import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import FinalCTA from '@/components/seo/FinalCTA';
import { ArrowRight, Clock, Shield } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Security & Privacy Guides | MyTech-Fix',
  description:
    'Practical steps to keep your devices, accounts, and home network secure. Guides on 2FA, suspicious logins, router passwords, smart cameras, and more.',
  alternates: {
    canonical: `${BASE}/fix/security-privacy`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Security & Privacy' },
];

const SECURITY_GUIDES = [
  {
    slug: 'suspicious-login-alert',
    title: "Got a Suspicious Login Alert? Here's What to Do",
    description:
      "Most alerts are precautionary — triggered by a new device or VPN. Here's how to tell if it's real and what to do if it is.",
    readTime: '5 min read',
  },
  {
    slug: 'router-default-password-risk',
    title: "Still Using Your Router's Default Password? Here's the Risk",
    description:
      "Default router credentials are publicly documented for every model. Here's how to change yours in under 5 minutes.",
    readTime: '4 min read',
  },
  {
    slug: 'smart-camera-privacy-settings',
    title: 'Smart Camera Privacy Settings Checklist',
    description:
      "A quick review of your Ring, Nest, Wyze, or Arlo settings to confirm cameras are secured and not oversharing.",
    readTime: '5 min read',
  },
  {
    slug: 'wifi-network-hacked-signs',
    title: 'Signs Your WiFi Network Has Been Hacked (And What to Do)',
    description:
      "Unfamiliar devices in your router's connected list and an admin password that stopped working are the clearest signs.",
    readTime: '5 min read',
  },
  {
    slug: 'two-factor-authentication-setup',
    title: 'How to Set Up Two-Factor Authentication (And Why You Should)',
    description:
      "2FA stops most account takeovers even when your password is known. Here's how to enable it on your most important accounts.",
    readTime: '5 min read',
  },
];

export default function SecurityPrivacyCategoryHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Breadcrumb items={BREADCRUMBS} />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-emerald-400">5 guides</span>
          </div>
          <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
            Security &amp; Privacy Guides
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Practical steps to keep your devices, accounts, and home network secure — written
            in plain English with clear action steps.
          </p>
        </header>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sora text-lg font-semibold text-slate-200">
              All guides — {SECURITY_GUIDES.length} topics
            </h2>
          </div>
          <div className="space-y-3">
            {SECURITY_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/fix/security-privacy/${guide.slug}`}
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

        <FinalCTA
          heading="Worried about a specific security issue?"
          body="Our AI can walk you through account recovery, router security, and threat-specific steps — describe what you're seeing for a targeted response."
          chatLink="/chat?category=security-privacy"
        />

        <div className="mt-8 text-center">
          <Link
            href="/fix"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← All Guides
          </Link>
        </div>
      </div>
    </div>
  );
}
