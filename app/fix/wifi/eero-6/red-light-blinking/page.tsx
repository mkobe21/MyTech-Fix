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
import { AlertCircle, Cable, WifiOff, RefreshCw } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Eero 6 Red Light Blinking? Here's How to Fix It | MyTech-Fix",
  description:
    'Eero 6 showing a solid or blinking red light? Learn the most common causes and step-by-step fixes to get your mesh WiFi back online fast.',
  alternates: {
    canonical: `${BASE}/fix/wifi/eero-6/red-light-blinking`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Eero', href: '/fix/wifi/eero' },
  { label: 'Eero 6 Red Light Blinking' },
];

const TLDR = [
  'A red light almost always means the Eero cannot see an internet connection upstream.',
  'Always restart your modem first, wait 2 full minutes, then restart the Eero.',
  'Check the Ethernet cable between modem and Eero is firmly clicked in on both ends.',
  'Factory reset is a last resort — try the restart order and cable first.',
];

const CAUSES = [
  {
    icon: RefreshCw,
    title: 'Modem and Eero restarted in the wrong order',
    description:
      'After a power outage or deliberate restart, if the Eero powers on before the modem has established an upstream internet connection, it will show red. The Eero needs to detect an active connection on its WAN port before it turns white.',
    likelihood: 'likely' as const,
  },
  {
    icon: Cable,
    title: 'Loose or faulty Ethernet cable',
    description:
      'The cable connecting your modem to the Eero\'s WAN (internet) port may have come loose, been partially unplugged, or developed an internal fault. This is especially common after moving furniture or vacuuming near the equipment.',
    likelihood: 'common' as const,
  },
  {
    icon: WifiOff,
    title: 'ISP outage or maintenance window',
    description:
      'Your internet service provider may be experiencing a local outage or scheduled maintenance. If your modem also shows no internet connection, the problem is upstream of your home network entirely.',
    likelihood: 'common' as const,
  },
  {
    icon: AlertCircle,
    title: 'Interrupted firmware update',
    description:
      'If the Eero lost power or lost its connection mid-way through a firmware update, it may be stuck in a partial update state. In this case the light may pulse red/white. A factory reset usually resolves this.',
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Check your modem\'s lights first',
    description:
      'Look at the indicator lights on your modem — not the Eero. If the modem shows no internet ("online," "internet," or a similar light is red or off), the problem is upstream. Your Eero is working correctly but has no internet to connect to.',
    tip: 'Contact your ISP if the modem shows no internet connection and unplugging it for 60 seconds doesn\'t help.',
  },
  {
    title: 'Restart the modem first — wait 2 full minutes',
    description:
      'Unplug your modem from power (the small box your ISP gave you). Wait a full 2 minutes — this forces the modem to fully release and renew its DHCP lease with your ISP. Plug it back in and wait until all status lights stabilize.',
  },
  {
    title: 'Then restart the Eero',
    description:
      'Once the modem is fully online, unplug the Eero from power. Wait 30 seconds, then plug it back in. The Eero will cycle through colors — give it 60–90 seconds to settle on a solid white light (connected).',
    tip: 'Always restart modem first, Eero second. If you do them simultaneously, the Eero may win the race and show red again.',
  },
  {
    title: 'Check the Ethernet cable between modem and Eero',
    description:
      'Press both ends of the cable firmly into the modem\'s LAN port and the Eero\'s WAN (internet) port until you hear or feel a click. Inspect the cable for kinks or sharp bends. If you have a spare cable, swap it in.',
  },
  {
    title: 'Check the Eero app for a specific error message',
    description:
      'Open the Eero app and tap the device showing red. The app often surfaces a specific error (e.g., "No internet," "Double NAT detected," "Upstream issue") that narrows down the cause significantly.',
  },
  {
    title: 'Last resort: factory reset',
    description:
      'If all other steps fail, factory reset the Eero. Hold the reset button (small pinhole on the bottom or back) for 10 seconds until the light flashes yellow, then white. This erases your network and you\'ll need to set it up fresh in the Eero app.',
    tip: 'Factory reset removes all settings including your WiFi name and password. All other Eeros in the network will also be reset.',
  },
];

const FAQS = [
  {
    question: 'What does a red light on Eero 6 mean?',
    answer:
      'A red light on the Eero 6 means the device cannot establish an internet connection. It has power and is functioning, but it cannot detect an active upstream internet source — usually because the modem hasn\'t finished reconnecting or there\'s an ISP outage.',
  },
  {
    question: 'Do I need to factory reset to fix a red light?',
    answer:
      'No — factory reset is a last resort. In the vast majority of cases, restarting your modem first (waiting 2 full minutes), then restarting the Eero, and checking the cable between them will resolve a red light without any data loss or reconfiguration.',
  },
  {
    question: 'How long should I wait after restarting the modem?',
    answer:
      'Wait at least 2 full minutes. Modems can take that long to re-establish a DHCP lease with your ISP and fully sync. If you power the Eero back on too early, it won\'t detect an internet connection and will show red again.',
  },
  {
    question: 'Why does my Eero show red after every power outage?',
    answer:
      'After a power outage, both the modem and Eero lose power simultaneously. When power returns, if the Eero powers on before the modem finishes reconnecting to your ISP, it will show red. A quick fix: after a power outage, unplug the Eero, wait until the modem is fully online, then plug the Eero back in. A longer-term fix: use a UPS (battery backup) so your modem stays powered through brief outages.',
  },
];

const RELATED = [
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

export default function EeroRedLightPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Eero 6 Red Light"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Eero 6 Red Light Blinking? Here&apos;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A red light means the Eero can&apos;t reach the internet. Here&apos;s how to
              diagnose and fix it in under 10 minutes.
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
            heading="Still showing red after all these steps?"
            body="Our AI runs a live diagnostic on your network and tells you exactly what's wrong — usually in under 60 seconds."
            chatLink="/chat?device=eero-6&issue=red-light"
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
            body="Describe your setup in the chat and our AI will walk you through a fix specific to your network — no account needed to start."
            chatLink="/chat?device=eero-6"
          />
        </div>
      </div>
    </>
  );
}
