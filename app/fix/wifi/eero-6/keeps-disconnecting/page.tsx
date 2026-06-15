import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import TLDRBox from '@/components/seo/TLDRBox';
import CauseCard from '@/components/seo/CauseCard';
import StepItem from '@/components/seo/StepItem';
import MidCTA from '@/components/seo/MidCTA';
import FAQItem from '@/components/seo/FAQItem';
import RelatedGrid from '@/components/seo/RelatedGrid';
import FinalCTA from '@/components/seo/FinalCTA';
import SeoSchema from '@/components/seo/SeoSchema';
import { RefreshCw, Power, Wifi, Thermometer } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Eero 6 Keeps Disconnecting? Here's How to Fix It | MyTech-Fix",
  description:
    'Eero 6 randomly dropping connections? Outdated firmware and device power-saving mode are the most common culprits. Here are the step-by-step fixes.',
  alternates: {
    canonical: `${BASE}/fix/wifi/eero-6/keeps-disconnecting`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Eero', href: '/fix/wifi/eero' },
  { label: 'Eero 6 Keeps Disconnecting' },
];

const TLDR = [
  "Outdated firmware is the most common cause — Eero regularly ships bug fixes for random disconnects.",
  "Check if only one device is dropping or all of them — one device points to power-saving mode, not the Eero.",
  'The Eero app\'s "Restart Network" forces a fresh channel selection and clears congestion buildup.',
  'Overheating causes silent reboots — the Eero needs open airflow, not a cabinet or media shelf.',
];

const CAUSES = [
  {
    icon: RefreshCw,
    title: 'Outdated Eero firmware',
    description:
      'Eero regularly ships firmware updates that specifically address intermittent disconnect bugs. If auto-update is off or a recent update is pending, you may be running a version with a known reconnect issue.',
    likelihood: 'likely' as const,
  },
  {
    icon: Power,
    title: 'Device power-saving mode',
    description:
      "Phones and laptops aggressively suspend their WiFi adapter when idle to save battery. This looks like the Eero is dropping the connection, but the network is fine — the device itself cut the link. Check if other devices on the same Eero stay connected.",
    likelihood: 'common' as const,
  },
  {
    icon: Wifi,
    title: 'Channel interference',
    description:
      "Neighboring WiFi networks, microwave ovens (when in use), 2.4 GHz cordless phones, and baby monitors can all disrupt 2.4 GHz connections. The Eero's \"Restart Network\" triggers a fresh channel scan that often resolves this.",
    likelihood: 'common' as const,
  },
  {
    icon: Thermometer,
    title: 'Eero overheating',
    description:
      'If the Eero is enclosed in a cabinet, stacked with other gear, or in a hot room, it may overheat and silently reboot — appearing as a brief disconnect. The Eero should be warm to the touch, but not hot.',
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Check for a pending firmware update',
    description:
      "Open the Eero app, go to Settings → Eero Network → Software Version. If an update is available, install it. Enable auto-update while you're there so future fixes apply overnight without manual intervention.",
    tip: 'Firmware updates install automatically between 2–4 AM by default. Check that auto-update is toggled on in the Eero app settings.',
  },
  {
    title: 'Identify whether one device or all devices are disconnecting',
    description:
      "If only one specific device drops (your phone, your laptop), the problem is almost certainly power-saving mode on that device — not the Eero. If all devices disconnect simultaneously, the issue is the Eero or your internet connection.",
  },
  {
    title: 'Disable WiFi power-saving on the affected device',
    description:
      "On Windows: Device Manager → Network Adapters → right-click your WiFi adapter → Properties → Power Management → uncheck 'Allow the computer to turn off this device to save power.' On Android: Settings → Battery → Battery Optimization → find your WiFi or network settings app and set to 'Don't optimize.' On iPhone, this setting isn't exposed — try Settings → General → Transfer or Reset iPhone → Reset → Reset Network Settings.",
    tip: 'On macOS, WiFi power-saving is controlled by the OS and cannot be disabled — but it rarely causes the persistent drops seen on Windows.',
  },
  {
    title: 'Restart the Eero network to pick a cleaner channel',
    description:
      "In the Eero app: Settings → Eero Network → Restart. This is different from unplugging — it performs a clean restart of all nodes and re-evaluates channel selection. Most interference-related disconnect issues resolve after this step.",
  },
  {
    title: 'Check physical placement and ventilation',
    description:
      'Make sure the Eero has at least 2 inches of clearance on all sides. Move it out of enclosed cabinets, off TV shelving, and away from cable boxes or game consoles that generate heat. If it feels hot, not just warm, ventilation is the issue.',
  },
  {
    title: 'Forget the network on the affected device and reconnect fresh',
    description:
      "If a specific device keeps dropping even after the steps above, tell that device to forget the WiFi network entirely, then rejoin. On iPhone: Settings → WiFi → tap the network → Forget. On Windows: Settings → Network → WiFi → Manage known networks → Remove. Then reconnect from scratch.",
  },
];

const FAQS = [
  {
    question: 'How do I know if my Eero is disconnecting or my device is?',
    answer:
      "Check whether other devices on the same Eero network stay connected when your device drops. If they do, it's the device — usually power-saving mode or a stale network profile. If all devices drop at the same time, it's the Eero or your internet connection.",
  },
  {
    question: 'Will updating Eero firmware automatically fix random disconnects?',
    answer:
      "Often yes. Eero frequently ships firmware specifically targeting intermittent disconnect bugs. Enable auto-update in the Eero app (Settings → Eero Network → Software Version) so fixes apply automatically in the early morning without disrupting your day.",
  },
  {
    question: 'What household electronics cause WiFi interference?',
    answer:
      "Microwave ovens (while cooking), 2.4 GHz cordless phones, baby monitors, older Bluetooth devices, and neighboring WiFi networks on overlapping channels are the most common sources. 5 GHz WiFi is far less susceptible — if your device supports it and you're close enough to the Eero, it's worth prioritizing.",
  },
  {
    question: 'Can the Eero overheat and cause disconnects?',
    answer:
      "Yes, though it's uncommon with normal placement. If the Eero is warm to the touch but not hot, it's fine. If it's enclosed in a cabinet, stacked on other equipment, or in a room above 100°F, it may thermal-throttle and reboot silently. Moving it to open air and letting it cool usually resolves the issue immediately.",
  },
];

const RELATED = [
  {
    category: 'Eero 6',
    title: 'Eero 6 Slow Speeds',
    href: '/fix/wifi/eero-6/slow-speeds',
  },
  {
    category: 'Eero 6',
    title: 'Eero 6 Red Light Blinking',
    href: '/fix/wifi/eero-6/red-light-blinking',
  },
  {
    category: 'Eero 6',
    title: "Eero 6 Won't Connect to App",
    href: '/fix/wifi/eero-6/wont-connect-to-app',
  },
  {
    category: 'Eero Guides',
    title: 'All Eero troubleshooting guides →',
    href: '/fix/wifi/eero',
  },
];

export default function EeroKeepsDisconnectingPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Eero 6 Keeps Disconnecting"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Eero 6 Keeps Disconnecting? Here&apos;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Random drops are almost always firmware or power-saving mode. Here&apos;s how to
              diagnose which one and fix it.
            </p>
          </header>

          <TLDRBox points={TLDR} />

          <section className="mb-10">
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-4">Common Causes</h2>
            <div className="space-y-3">
              {CAUSES.map((cause) => (
                <CauseCard key={cause.title} {...cause} />
              ))}
            </div>
          </section>

          <section className="mb-2">
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-6">
              Step-by-Step Fix
            </h2>
            <div>
              {STEPS.map((step, i) => (
                <StepItem key={i} step={i + 1} {...step} />
              ))}
            </div>
          </section>

          <MidCTA
            heading="Still dropping connections after all these steps?"
            body="Our AI runs a live diagnostic on your network — speed, latency, and packet loss — and tells you exactly what's causing the drops."
            chatLink="/chat?device=eero-6&issue=disconnecting"
          />

          <section className="mb-10">
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="rounded-2xl border border-white/10 bg-card/60 px-6 py-2">
              {FAQS.map((faq) => (
                <FAQItem key={faq.question} {...faq} />
              ))}
            </div>
          </section>

          <RelatedGrid items={RELATED} />

          <FinalCTA
            heading="Still having trouble with your Eero?"
            body="Describe your setup in the chat — which devices drop, how often, and when — and our AI will give you a targeted fix."
            chatLink="/chat?device=eero-6"
          />
        </div>
      </div>
    </>
  );
}
