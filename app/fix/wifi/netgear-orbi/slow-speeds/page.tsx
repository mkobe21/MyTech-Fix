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
import { Wifi, Activity, MapPin, Users } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Netgear Orbi Showing Slow Speeds? Here's How to Fix It | MyTech-Fix",
  description:
    "Orbi WiFi feeling slow? Start with an Ethernet speed test to the modem to rule out your ISP, then check which band and backhaul your devices are using.",
  alternates: {
    canonical: `${BASE}/fix/wifi/netgear-orbi/slow-speeds`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'WiFi & Networking', href: '/fix/wifi' },
  { label: 'Netgear Orbi', href: '/fix/wifi/netgear-orbi' },
  { label: 'Orbi Slow Speeds' },
];

const TLDR = [
  "First test: Ethernet directly to modem — if it's slow there, it's your ISP, not the Orbi.",
  'Check which band (2.4 GHz vs 5 GHz) your slow device is on in the Orbi app under Attached Devices.',
  'Satellite backhaul strength matters — a satellite far from the router delivers slower speeds to clients.',
  'Wired backhaul (Ethernet between router and satellite) is significantly faster than wireless backhaul.',
];

const CAUSES = [
  {
    icon: Wifi,
    title: 'Device connected to 2.4 GHz instead of 5 GHz',
    description:
      '2.4 GHz has a longer range but much lower throughput — typically 50–150 Mbps versus 300–500+ Mbps on 5 GHz. Devices at range limits, or those whose 5 GHz signal is weak, often latch onto 2.4 GHz and stay there.',
    likelihood: 'likely' as const,
  },
  {
    icon: Activity,
    title: "ISP speed doesn't match your plan",
    description:
      "Your Orbi may be delivering exactly what your internet connection allows — and the problem is the connection itself. Always test via Ethernet directly to your modem before troubleshooting WiFi. If it's slow at the modem too, contact your ISP.",
    likelihood: 'common' as const,
  },
  {
    icon: MapPin,
    title: 'Satellite too far from the router — weak backhaul',
    description:
      "Orbi satellites use a dedicated WiFi band to communicate with the main router (the backhaul). The farther the satellite from the router, the weaker this backhaul connection — and the slower the speeds for devices connected to that satellite. The Orbi app shows backhaul signal strength per satellite.",
    likelihood: 'common' as const,
  },
  {
    icon: Users,
    title: 'Multiple bandwidth-heavy devices running simultaneously',
    description:
      "4K streaming, large cloud backups (iCloud, Google Photos, Backblaze), and simultaneous downloads can consume most of your internet plan's bandwidth. Even a fast Orbi setup will feel slow if 3–4 devices are each pulling 50+ Mbps.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Run a speed test via Ethernet directly to your modem',
    description:
      "Plug a laptop into your modem (bypassing the Orbi router) and run a speed test at fast.com or speedtest.net. If the result is significantly below your plan's advertised speed, call your ISP — the Orbi is not the problem. If it matches your plan, the bottleneck is in your WiFi setup.",
    tip: "This single test eliminates the ISP as a variable and saves hours of router troubleshooting. Do it first.",
  },
  {
    title: 'Check which band your slow device is on',
    description:
      "Open the Orbi app and go to Attached Devices. Find the slow device and tap it — it shows the connected band (2.4 GHz or 5 GHz) and its signal strength. If it shows 2.4 GHz and your device supports 5 GHz, move it closer to the nearest Orbi unit to get band-steered onto 5 GHz.",
  },
  {
    title: "Check your satellite's backhaul signal strength",
    description:
      "If the slow device is connecting to a satellite rather than the main router, check that satellite's backhaul strength in the Orbi app. A weak backhaul connection means the satellite itself has low bandwidth to distribute. Move the satellite closer to the router, or connect it via Ethernet for wired backhaul.",
    tip: 'Wired backhaul (Ethernet cable between router and satellite) typically delivers 2–3× better speeds than wireless backhaul over the same distance.',
  },
  {
    title: 'Check Attached Devices for bandwidth hogs',
    description:
      "In the Orbi app, review the Attached Devices list for anything using heavy bandwidth — large downloads, active cloud backups, 4K streams. You can temporarily pause a specific device's access directly from the app to see if speeds improve for other devices.",
  },
  {
    title: 'Restart the router and satellites in the correct order',
    description:
      "Restart the Orbi router first — unplug, wait 30 seconds, plug back in, wait 2 minutes. Then restart satellites in the same way. A full ordered restart clears backhaul congestion and renegotiates the satellite connections at maximum strength.",
  },
  {
    title: 'Consider wired backhaul if a satellite is consistently slow',
    description:
      "If one satellite area is always slower than the rest of the house, run an Ethernet cable from the router to that satellite. This converts it to wired backhaul — no wireless overhead, no distance degradation. Even a 50-foot Ethernet run through a wall or floor dramatically improves speeds for that satellite's clients.",
  },
];

const FAQS = [
  {
    question: 'What is the difference between wireless and wired backhaul on Orbi?',
    answer:
      "Backhaul is how your Orbi satellite communicates with the main router. Wireless backhaul uses a dedicated 5 GHz radio between the units — convenient but affected by distance and interference. Wired backhaul connects them via Ethernet cable — stable, fast, and unaffected by distance within normal cable runs. If you can run a cable from your router to a satellite, wired backhaul is always the better choice.",
  },
  {
    question: 'How do I check which band my device is using on Orbi?',
    answer:
      "Open the Orbi app and go to Attached Devices. Tap your device in the list — it shows the connected band (2.4 GHz or 5 GHz) and signal strength. If it's on 2.4 GHz and your device supports 5 GHz, move the device closer to the nearest Orbi unit. Orbi uses automatic band steering — getting a stronger signal naturally pulls the device to 5 GHz.",
  },
  {
    question: 'What speeds should I expect from Netgear Orbi?',
    answer:
      "This depends on your internet plan and how far the device is from the Orbi unit. Within 15–20 feet on 5 GHz with a clear line of sight, you should see 60–85% of your plan's speed. Through walls, floors, or via wireless satellite backhaul, expect lower throughput. An Ethernet speed test to the modem shows your internet plan's actual delivered speed — use that as your baseline.",
  },
  {
    question: 'Why is my speed slower at a satellite than at the main router?',
    answer:
      "Satellites communicate with the router via wireless backhaul — an additional WiFi hop that adds overhead and is affected by distance. Even with Orbi's dedicated backhaul band, the backhaul link has limited bandwidth that's shared among all clients connected to that satellite. Moving the satellite closer to the router or using wired backhaul resolves this.",
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
    title: 'Orbi Keeps Disconnecting',
    href: '/fix/wifi/netgear-orbi/keeps-disconnecting',
  },
  {
    category: 'Orbi Guides',
    title: 'All Orbi troubleshooting guides →',
    href: '/fix/wifi/netgear-orbi',
  },
];

export default function OrbiSlowSpeedsPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Netgear Orbi Slow Speeds"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Netgear Orbi Showing Slow Speeds? Here&apos;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Orbi speed issues usually trace back to either your ISP or the band your device
              is on. Here&apos;s how to diagnose and fix both.
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
            heading="Still seeing slow speeds after these steps?"
            body="Our AI runs a live speed and latency test on your network and tells you exactly where the bottleneck is."
            chatLink="/chat?device=netgear-orbi&issue=slow-speeds"
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
            heading="Need a deeper look at your Orbi network?"
            body="Our AI runs real diagnostics — speed, latency, DNS, packet loss — and gives you a specific fix for your setup."
            chatLink="/chat?device=netgear-orbi"
          />
        </div>
      </div>
    </>
  );
}
