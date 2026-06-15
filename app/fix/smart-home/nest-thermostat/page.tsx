import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { ArrowRight, Clock, Thermometer } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Nest Thermostat Troubleshooting Guides | MyTech-Fix',
  description:
    'Step-by-step fixes for the most common Nest Thermostat problems: offline errors, WiFi connection issues, app not responding, and firmware update problems.',
  alternates: {
    canonical: `${BASE}/fix/smart-home/nest-thermostat`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Nest Thermostat' },
];

const NEST_GUIDES = [
  {
    slug: 'offline',
    title: "Nest Thermostat Showing Offline? Here's How to Fix It",
    description:
      "Usually a dropped WiFi connection or a C-wire power issue. Check the thermostat display first — if it's blank, power is the culprit. Otherwise, a quick network reconnect fixes it.",
    readTime: '5 min read',
  },
  {
    slug: 'wont-connect-to-wifi',
    title: "Nest Thermostat Won't Connect to WiFi? Here's the Fix",
    description:
      "Nest requires 2.4 GHz WiFi — connecting to a 5 GHz SSID is the most common failure. A careful password re-entry and a 'Forget network' reset resolve most remaining cases.",
    readTime: '4 min read',
  },
  {
    slug: 'not-responding-in-app',
    title: 'Nest Thermostat Not Responding in the App? Try This',
    description:
      "The thermostat is likely still controlling your HVAC. Force-close the Google Home app, log out and back in, then check the thermostat's WiFi status directly on the device.",
    readTime: '4 min read',
  },
  {
    slug: 'firmware-update-stuck',
    title: "Nest Thermostat Firmware Update Stuck? Here's What to Do",
    description:
      "Most 'stuck' updates are staged rollout pauses — the device just hasn't been selected yet. Check WiFi signal strength and wait 24–48 hours before requesting a forced push.",
    readTime: '4 min read',
  },
];

export default function NestThermostatHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Breadcrumb items={BREADCRUMBS} />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Thermometer className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">Nest Thermostat</span>
          </div>
          <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
            Nest Thermostat Troubleshooting Guides
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Step-by-step fixes for the most common Nest Thermostat problems. Each guide covers
            the likeliest causes, walks you through the fix, and links to our AI if you need more
            help.
          </p>
        </header>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sora text-lg font-semibold text-slate-200">
              All guides — {NEST_GUIDES.length} fixes
            </h2>
          </div>
          <div className="space-y-3">
            {NEST_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/fix/smart-home/nest-thermostat/${guide.slug}`}
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
            Still having trouble with your Nest Thermostat?
          </h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Our AI can run a live diagnostic on your network and help pinpoint what&rsquo;s wrong
            with your specific thermostat model and setup.
          </p>
          <Link
            href="/chat?device=nest-thermostat"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 transition-colors text-sm"
          >
            Ask MyTech-Fix AI
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/fix"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← All troubleshooting guides
          </Link>
        </div>
      </div>
    </div>
  );
}
