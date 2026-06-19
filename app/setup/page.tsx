import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import FinalCTA from '@/components/seo/FinalCTA';
import { ArrowRight, BookOpen, Camera, Home, Wifi } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Device Setup Guides | MyTech-Fix',
  description:
    'Step-by-step setup guides for routers, smart home devices, security cameras, and more — written for first-time installation with no technical background required.',
  alternates: {
    canonical: `${BASE}/setup`,
  },
};

const BREADCRUMBS = [{ label: 'Home', href: '/' }, { label: 'Setup Guides' }];

const WIFI_GUIDES = [
  {
    title: 'How to Set Up an Eero 6 Mesh Network',
    description:
      'From modem connection to full multi-unit mesh coverage — including app pairing, satellite placement, and your first speed test.',
    href: '/setup/eero-6-mesh-network',
    time: '~20 min setup',
  },
  {
    title: 'How to Set Up a Netgear Orbi Mesh Network',
    description:
      'Connect your Orbi router to your modem, configure the app, add satellites, and verify coverage across your home.',
    href: '/setup/netgear-orbi-mesh-network',
    time: '~20 min setup',
  },
  {
    title: 'How to Set Up a TP-Link Deco Mesh Network',
    description:
      'From modem connection to verified whole-home coverage — including adding satellite units and confirming speeds.',
    href: '/setup/tp-link-deco-mesh',
    time: '~20 min setup',
  },
];

const SMART_HOME_GUIDES = [
  {
    title: 'How to Set Up a Nest Thermostat with Google Home',
    description:
      'Install the thermostat, connect it to your 2.4 GHz network, link it to the Google Home app, and test voice control.',
    href: '/setup/nest-thermostat-with-google-home',
    time: '~30 min setup',
  },
  {
    title: 'How to Set Up a Ring Doorbell with Alexa',
    description:
      'Get your Ring Doorbell online, connect it to your WiFi, link the Ring Skill to Alexa, and configure motion alerts.',
    href: '/setup/ring-doorbell-with-alexa',
    time: '~25 min setup',
  },
  {
    title: 'How to Set Up a Philips Hue Starter Kit',
    description:
      'Connect the Bridge, pair your bulbs, organize rooms, and create your first scene — complete Hue setup from unboxing.',
    href: '/setup/philips-hue-starter-kit',
    time: '~20 min setup',
  },
  {
    title: 'How to Set Up an Ecobee Thermostat',
    description:
      'Wiring, WiFi connection, app configuration, room sensors, and voice assistant integration in one complete walkthrough.',
    href: '/setup/ecobee-thermostat',
    time: '~35 min setup',
  },
];

const SECURITY_GUIDES = [
  {
    title: 'How to Set Up an Arlo Camera System',
    description:
      'Base station connection, camera sync, mounting placement, motion detection configuration, and alert setup.',
    href: '/setup/arlo-camera-system',
    time: '~30 min setup',
  },
];

function GuideCard({
  title,
  description,
  href,
  time,
}: {
  title: string;
  description: string;
  href: string;
  time: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-card/60 px-5 py-4 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all"
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-sora font-semibold text-slate-100 group-hover:text-blue-300 transition-colors mb-1 leading-snug">
          {title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-2">{description}</p>
        <span className="text-xs font-medium text-emerald-400">{time}</span>
      </div>
      <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
    </Link>
  );
}

export default function SetupHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Breadcrumb items={BREADCRUMBS} />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-emerald-400">8 guides</span>
          </div>
          <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
            Device Setup Guides
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Just bought something new? Here&rsquo;s how to get it set up right the first time —
            step by step, no technical background required.
          </p>
        </header>

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Wifi className="w-4 h-4 text-slate-500" />
            <h2 className="font-sora text-sm font-semibold text-slate-400 uppercase tracking-widest">
              WiFi &amp; Networking
            </h2>
          </div>
          <div className="space-y-3">
            {WIFI_GUIDES.map((g) => (
              <GuideCard key={g.href} {...g} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-4 h-4 text-slate-500" />
            <h2 className="font-sora text-sm font-semibold text-slate-400 uppercase tracking-widest">
              Smart Home
            </h2>
          </div>
          <div className="space-y-3">
            {SMART_HOME_GUIDES.map((g) => (
              <GuideCard key={g.href} {...g} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-4 h-4 text-slate-500" />
            <h2 className="font-sora text-sm font-semibold text-slate-400 uppercase tracking-widest">
              Security Cameras
            </h2>
          </div>
          <div className="space-y-3">
            {SECURITY_GUIDES.map((g) => (
              <GuideCard key={g.href} {...g} />
            ))}
          </div>
        </section>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 mb-10 text-sm text-slate-400">
          <span className="font-semibold text-slate-300">More setup guides coming soon.</span>{' '}
          Google Nest WiFi, SimpliSafe, August Smart Lock, Sonos, and Roku are in the next batch.
          If your device isn&apos;t listed yet,{' '}
          <Link href="/chat" className="text-blue-400 hover:text-blue-300 transition-colors">
            our AI can walk you through setup directly →
          </Link>
        </div>

        <FinalCTA
          heading="Setting up something else?"
          body="Our AI knows the setup process for hundreds of devices — describe what you have and it will guide you through installation step by step."
          chatLink="/chat"
        />

        <div className="mt-8 text-center">
          <Link
            href="/fix"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            Looking for troubleshooting guides instead? →
          </Link>
        </div>
      </div>
    </div>
  );
}
