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
import { RefreshCw, Users, Wifi, Thermometer } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Netgear Orbi Keeps Disconnecting? Here's How to Fix It | MyTech-Fix",
  description:
    'Orbi randomly dropping connections? Outdated firmware and device power-saving are the most common culprits. Step-by-step fixes here.',
  alternates: {
    canonical: `${BASE}/fix/wifi/netgear-orbi/keeps-disconnecting`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'WiFi & Networking', href: '/fix/wifi' },
  { label: 'Netgear Orbi', href: '/fix/wifi/netgear-orbi' },
  { label: 'Orbi Keeps Disconnecting' },
];

const TLDR = [
  'Outdated firmware is the most common cause — check for updates in the Orbi app first.',
  'Power cycle in the right order: router fully online first, then satellites.',
  "Check if it's all devices dropping or just one — one device points to power-saving mode, not the Orbi.",
  'Manually setting a less congested channel often resolves interference-related drops.',
];

const CAUSES = [
  {
    icon: RefreshCw,
    title: 'Outdated Orbi firmware',
    description:
      "Netgear regularly ships firmware updates that fix connectivity and disconnect bugs. If auto-update is off or a recent update hasn't been applied, you may be on a version with a known stability issue.",
    likelihood: 'likely' as const,
  },
  {
    icon: Users,
    title: 'Too many devices congesting a single band',
    description:
      "When many devices pile onto 2.4 GHz — especially in apartments with dense WiFi environments — the band becomes congested. Affected devices disconnect intermittently as the router struggles to service them all. Newer devices on 5 GHz see this far less often.",
    likelihood: 'common' as const,
  },
  {
    icon: Wifi,
    title: 'Channel interference from nearby networks',
    description:
      "Overlapping 2.4 GHz channels from neighboring networks, active microwave ovens, cordless phones, and baby monitors all cause interference that can knock devices off WiFi momentarily. Manually selecting a less-used channel (1, 6, or 11) often resolves this.",
    likelihood: 'common' as const,
  },
  {
    icon: Thermometer,
    title: 'Orbi unit overheating',
    description:
      "If the Orbi router or a satellite is enclosed in a cabinet, stacked with other electronics, or in a hot room, it may overheat and reboot silently. This appears as a brief whole-network dropout. Orbi units run warm — that's normal — but hot to the touch in an enclosed space is not.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Check for a firmware update in the Orbi app',
    description:
      "Open the Orbi app and go to Settings → Firmware Update. If an update is available, install it. Also check that automatic firmware updates are enabled so future stability fixes apply without manual intervention.",
    tip: 'Firmware updates usually install overnight. Check that your Orbi is powered on during the 2–4 AM window when NETGEAR typically pushes updates.',
  },
  {
    title: 'Identify whether one device or all devices are disconnecting',
    description:
      "Check the Orbi app's Attached Devices list after a disconnect to see which devices were affected. If only one device drops repeatedly, check that device's WiFi adapter power-saving settings — it's almost certainly not the Orbi. If all devices drop simultaneously, proceed with the steps below.",
  },
  {
    title: 'Power cycle in the correct order',
    description:
      "Unplug the Orbi router from power. Wait 30 seconds. Plug it back in and wait 2 full minutes for it to fully reconnect to your ISP. Only then restart any satellites — unplug each one, wait 30 seconds, plug back in. Getting the order wrong can cause satellites to show red or reconnect unstably.",
    tip: 'Router always first, satellites after. If you restart them at the same time, satellites may attempt to sync before the router is ready.',
  },
  {
    title: 'Try manually selecting a less congested WiFi channel',
    description:
      "In the Orbi app: Settings → WiFi Settings → Advanced → change the 2.4 GHz channel from Auto to either 1, 6, or 11 (whichever your neighbors aren't using). For 5 GHz, channels 149–161 are typically less congested in residential areas.",
    tip: 'Use a free app like WiFi Analyzer (Android) or Network Radar (Mac) to see which channels nearby networks are using before picking yours.',
  },
  {
    title: 'Check physical placement and ventilation',
    description:
      "Make sure each Orbi unit has at least 2 inches of clearance on all sides. Move units out of enclosed cabinets, off cable boxes, and away from other heat-generating equipment. Orbi units run warm — that's normal — but they shouldn't be hot.",
  },
  {
    title: 'Forget and rejoin the network on affected devices',
    description:
      "If specific devices keep disconnecting even after the steps above, have those devices forget the WiFi network entirely, then reconnect fresh. On iPhone: Settings → WiFi → tap network → Forget. On Windows: Settings → Network → WiFi → Manage known networks → Remove. Then reconnect and enter the password.",
  },
];

const FAQS = [
  {
    question: 'How do I know if my Orbi or my device is causing the disconnects?',
    answer:
      "The key test: do all devices drop at the same time, or just one? If it's just one device, check that device's WiFi adapter power-saving settings — phones and laptops often cut their WiFi connection when idle to save battery. If all devices disconnect simultaneously, the issue is the Orbi or your internet connection.",
  },
  {
    question: 'Does Orbi auto-update its firmware?',
    answer:
      "Netgear can push firmware updates automatically, but the default behavior depends on your model and current firmware version. Open the Orbi app and go to Settings → Firmware Update to see whether auto-update is enabled. Turning it on means stability fixes apply overnight without manual action.",
  },
  {
    question: 'What channel should I use on my Orbi to reduce interference?',
    answer:
      "For 2.4 GHz: channels 1, 6, and 11 are the only non-overlapping options. Most routers default to 6. If neighbors are also on 6, try 1 or 11. For 5 GHz: channels 149–161 tend to see less interference in residential areas than lower channels. A free WiFi analyzer app shows you which channels nearby networks are using.",
  },
  {
    question: 'Can my Orbi overheat and cause disconnects?',
    answer:
      "Yes, though it's uncommon with normal open-air placement. If your Orbi is enclosed in a media cabinet, stacked on a cable box, or in a room regularly above 95°F, it may thermal-throttle or reboot silently. Move it to an open, ventilated location. The units should feel warm to the touch — if they feel hot, airflow is insufficient.",
  },
];

const RELATED = [
  {
    category: 'Netgear Orbi',
    title: 'Orbi Red Light or Red Ring',
    href: '/fix/wifi/netgear-orbi/red-light-blinking',
  },
  {
    category: 'Netgear Orbi',
    title: "Orbi Won't Connect to App",
    href: '/fix/wifi/netgear-orbi/wont-connect-to-app',
  },
  {
    category: 'Netgear Orbi',
    title: 'Orbi Slow Speeds',
    href: '/fix/wifi/netgear-orbi/slow-speeds',
  },
  {
    category: 'Orbi Guides',
    title: 'All Orbi troubleshooting guides →',
    href: '/fix/wifi/netgear-orbi',
  },
];

export default function OrbiKeepsDisconnectingPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Netgear Orbi Keeps Disconnecting"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Netgear Orbi Keeps Disconnecting? Here&apos;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Random drops are almost always firmware or interference. Here&apos;s how to identify
              which one and get back to a stable connection.
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
            body="Our AI runs a live diagnostic — speed, latency, and packet loss — and tells you exactly what's causing the drops."
            chatLink="/chat?device=netgear-orbi&issue=disconnecting"
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
            heading="Still having trouble with your Orbi?"
            body="Describe your setup in the chat — which devices drop, how often, and when — and our AI will give you a targeted fix."
            chatLink="/chat?device=netgear-orbi"
          />
        </div>
      </div>
    </>
  );
}
