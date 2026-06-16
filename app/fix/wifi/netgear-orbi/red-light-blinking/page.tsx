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
import { WifiOff, MapPin, CloudOff, RefreshCw } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Netgear Orbi Showing Red Light or Red Ring? What It Means | MyTech-Fix',
  description:
    "Orbi router or satellite showing a red ring? It means no internet (router) or lost sync (satellite). Here's how to fix both in minutes.",
  alternates: {
    canonical: `${BASE}/fix/wifi/netgear-orbi/red-light-blinking`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'WiFi & Networking', href: '/fix/wifi' },
  { label: 'Netgear Orbi', href: '/fix/wifi/netgear-orbi' },
  { label: 'Orbi Red Light or Red Ring' },
];

const TLDR = [
  'Red ring on the main router = no internet connection. Check your modem and ISP first.',
  'Red ring on a satellite = lost sync with the router. Move it closer temporarily to re-sync.',
  'Always restart the modem first (wait 2 minutes), then the router, then satellites — order matters.',
  'A slow pulsing ring during a firmware update is normal — wait 15 minutes before troubleshooting.',
];

const CAUSES = [
  {
    icon: WifiOff,
    title: 'Main router has no internet connection',
    description:
      "The Orbi router's red ring is its way of saying it can't see an upstream internet source. This is almost always a modem issue or an ISP outage — the Orbi itself is working fine. Fix the modem first before troubleshooting the Orbi.",
    likelihood: 'likely' as const,
  },
  {
    icon: MapPin,
    title: 'Satellite is too far from the router',
    description:
      "Orbi satellites maintain a wireless backhaul connection to the main router. If a satellite moves out of range — or the router restarts without the satellite reconnecting — the satellite loses sync and shows red. Moving it into the same room as the router temporarily re-establishes the connection.",
    likelihood: 'common' as const,
  },
  {
    icon: CloudOff,
    title: 'ISP outage or scheduled maintenance',
    description:
      "If your ISP is experiencing a local outage or running maintenance, your modem will have no internet, which makes the Orbi router show red. Check if your modem also has no internet light, or visit your ISP's outage map.",
    likelihood: 'common' as const,
  },
  {
    icon: RefreshCw,
    title: 'Firmware update in progress',
    description:
      'Orbi units occasionally update firmware automatically. During this process, the ring light may pulse in amber or red. This typically takes 10–15 minutes — do not unplug the unit during an update. Leave it alone and check again afterward.',
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Identify which unit is showing red — router or satellite',
    description:
      "The fix is completely different depending on which unit has the red ring. The main router is the box connected to your modem by Ethernet. Satellites are the other units placed around your home. Check each unit's ring color.",
    tip: "The Orbi app's home screen shows the status of each unit — look for any showing as 'Offline' or 'No Internet.'",
  },
  {
    title: 'If the router is red: restart your modem first',
    description:
      "Unplug your modem (the box from your ISP) from power and wait 2 full minutes. This forces the modem to re-establish its connection with your ISP. Plug it back in and wait for all its status lights to stabilize before doing anything else.",
  },
  {
    title: 'Then restart the Orbi router',
    description:
      "Once the modem is fully online, power-cycle the Orbi router — unplug it, wait 30 seconds, plug it back in. Give it 90 seconds to fully boot. The ring should cycle from red → white/blue/magenta → solid white or the color you've set.",
    tip: 'Always restart modem before router. If you restart them simultaneously, the router may win the race and still show red.',
  },
  {
    title: 'If a satellite is red: move it closer to the router to re-sync',
    description:
      'Unplug the red satellite and move it into the same room as the main router. Plug it back in and wait 2–3 minutes. Once the ring turns solid white (or your custom color), the satellite has re-synced. You can then move it back to its original spot — but if it goes red again, that location may be too far from the router.',
  },
  {
    title: 'Use the Orbi app to check status and identify the problem unit',
    description:
      "Open the Orbi app and tap the map or device list. It shows each unit's connection status, signal strength to the router, and any error messages. This is the fastest way to confirm which unit has the issue and whether it's a sync or internet problem.",
  },
  {
    title: 'Last resort: factory reset the affected satellite',
    description:
      "If a satellite keeps showing red even after re-syncing, factory reset it. Use a pin to press and hold the reset button on the bottom of the satellite for 10 seconds until the ring flashes amber. Then re-add it through the Orbi app's 'Add Satellite' flow.",
    tip: 'Factory reset only the satellite — not the main router. Resetting the router will erase your entire network configuration.',
  },
];

const FAQS = [
  {
    question: 'What does a red ring on the Netgear Orbi router mean vs a satellite?',
    answer:
      "On the main router, a red ring means it has no internet connection — the modem isn't providing an upstream connection, or there's an ISP outage. On a satellite, a red ring means it has lost its wireless backhaul sync with the router — it's powered and working, but can't communicate with the main unit.",
  },
  {
    question: 'How do I resync an Orbi satellite that shows red?',
    answer:
      "The quickest method: move the satellite into the same room as the router, let it reconnect (2–3 minutes, ring turns white), then move it back. If the ring goes red again at the original location, the satellite is out of range — try a midpoint location. You can also use the Orbi app's sync button or the physical WPS/Sync button on the router.",
  },
  {
    question: 'How long does an Orbi firmware update take?',
    answer:
      "Most Orbi firmware updates complete within 10–15 minutes. During the update, the ring may pulse amber, red, or white in patterns that look like an error. Do not unplug the unit during this process — it can corrupt the firmware and brick the device. If it's still showing unusual lights after 20 minutes, then troubleshoot.",
  },
  {
    question: 'Can I use my Netgear Orbi without any satellites?',
    answer:
      "Yes. The Orbi router functions as a standard standalone router without any satellites. You only need satellites to extend coverage to areas of your home that the router alone can't reach. If you remove all satellites, the router continues to provide WiFi to its normal coverage area.",
  },
];

const RELATED = [
  {
    category: 'Netgear Orbi',
    title: "Orbi Won't Connect to App",
    href: '/fix/wifi/netgear-orbi/wont-connect-to-app',
  },
  {
    category: 'Netgear Orbi',
    title: 'Orbi Keeps Disconnecting',
    href: '/fix/wifi/netgear-orbi/keeps-disconnecting',
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

export default function OrbiRedLightPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Netgear Orbi Red Light or Red Ring"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Netgear Orbi Showing Red Light or Red Ring? What It Means
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The fix depends on which unit is red — router or satellite. Here&apos;s how to
              diagnose and resolve either case in minutes.
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
            heading="Still showing red after these steps?"
            body="Our AI can run a live diagnostic on your network and identify exactly where the connection is breaking down."
            chatLink="/chat?device=netgear-orbi&issue=red-light"
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
            body="Describe your setup in the chat — which unit is red, what your modem shows — and our AI will walk you through a targeted fix."
            chatLink="/chat?device=netgear-orbi"
          />
        </div>
      </div>
    </>
  );
}
