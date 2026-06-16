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
import { Wifi, Activity, Users, MapPin } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Eero 6 Showing Slow Speeds? Here\'s How to Fix It | MyTech-Fix',
  description:
    'Eero 6 WiFi feeling slow? The fix usually starts with one question: is the device on 2.4 GHz or 5 GHz? Step-by-step diagnosis and fixes here.',
  alternates: {
    canonical: `${BASE}/fix/wifi/eero-6/slow-speeds`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'WiFi & Networking', href: '/fix/wifi' },
  { label: 'Eero', href: '/fix/wifi/eero' },
  { label: 'Eero 6 Slow Speeds' },
];

const TLDR = [
  'First test: plug directly into your modem with Ethernet — if it\'s slow there too, the issue is your ISP, not the Eero.',
  '2.4 GHz has far lower speeds than 5 GHz — check which band your device is on in the Eero app.',
  'Moving closer to the Eero (or to a different node) often instantly improves speeds by switching the device to 5 GHz.',
  'Background bandwidth hogs (4K streaming, cloud backup) can saturate even fast internet connections.',
];

const CAUSES = [
  {
    icon: Wifi,
    title: 'Device connected to 2.4 GHz instead of 5 GHz',
    description:
      '2.4 GHz has a longer range but much lower throughput — typically 50–150 Mbps in real-world conditions vs 300–500 Mbps on 5 GHz. If your device is at the edge of coverage, or the 5 GHz signal is weak, it may have latched onto 2.4 GHz.',
    likelihood: 'likely' as const,
  },
  {
    icon: Activity,
    title: "ISP speed doesn't match your plan",
    description:
      "The slowness may have nothing to do with your Eero. If your internet plan is 100 Mbps and you're getting 90 Mbps over WiFi, that's normal. Test directly via Ethernet to your modem to isolate whether the bottleneck is your internet connection or your WiFi.",
    likelihood: 'common' as const,
  },
  {
    icon: Users,
    title: 'Network congestion from bandwidth-heavy activity',
    description:
      '4K video streaming, large cloud backup jobs (Backblaze, iCloud, Google Photos sync), and simultaneous downloads can consume most of your bandwidth. One device saturating the connection affects speeds for everything else on the network.',
    likelihood: 'common' as const,
  },
  {
    icon: MapPin,
    title: 'Eero node placed too far from the device',
    description:
      "WiFi signal strength decreases with distance and through walls and floors. If your device is connecting to an Eero node that's far away (or on the other side of multiple walls), even 5 GHz won't deliver full speed.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Run a speed test via Ethernet directly to your modem',
    description:
      "Plug a laptop into your modem (bypassing the Eero entirely) and run a speed test at fast.com or speedtest.net. If the speed is significantly lower than your plan, the issue is your internet connection — contact your ISP. If it matches your plan, the Eero or WiFi is the bottleneck.",
    tip: "If you don't have an Ethernet port on your laptop, most USB-C adapters include one. This one test saves a lot of troubleshooting time.",
  },
  {
    title: 'Check which band the slow device is connected to',
    description:
      "Open the Eero app and tap \"Devices.\" Find the slow device and tap it — it shows which Eero node it's connected to and the band (2.4 GHz or 5 GHz). If it shows 2.4 GHz and the device supports 5 GHz, that's almost certainly the speed bottleneck.",
  },
  {
    title: 'Move the device closer to the Eero to get on 5 GHz',
    description:
      '5 GHz has a shorter range than 2.4 GHz but dramatically higher speeds. If your device is far from the nearest Eero node, moving it — even temporarily — within 20–30 feet should cause the Eero to steer it onto 5 GHz. You\'ll see the speed improvement almost immediately.',
    tip: "Eero uses automatic band steering. You can't manually lock a device to 5 GHz, but getting a stronger signal naturally steers it there.",
  },
  {
    title: 'Check the Activity view for bandwidth hogs',
    description:
      "In the Eero app, tap \"Activity\" to see which devices are using the most bandwidth right now. If you see a device consuming most of your plan's bandwidth, pause that device or schedule its backup/download for off-peak hours.",
  },
  {
    title: 'Restart the Eero network',
    description:
      "Settings → Eero Network → Restart. This clears any congestion buildup, renegotiates backhaul connections between nodes, and performs a fresh channel scan. Give it 2–3 minutes after restart before testing again.",
  },
  {
    title: 'Consider adding an Eero node if coverage is the issue',
    description:
      "If the slow areas are consistently far from any Eero node, an additional node placed between the gap (not in the slow area itself) will improve signal. Eero recommends placing nodes 40–50 feet apart on the same floor, or one floor apart for multi-story homes.",
  },
];

const FAQS = [
  {
    question: 'What speed should I expect from Eero 6 on 5 GHz?',
    answer:
      "The Eero 6 is a WiFi 6 (802.11ax) router with a theoretical 5 GHz speed of 1,200 Mbps. Real-world throughput for a single device is typically 300–600 Mbps depending on distance and the device's own WiFi 6 support. Devices that only support WiFi 5 will top out at lower speeds regardless of the Eero's capability.",
  },
  {
    question: 'How do I know if slow speeds are my Eero or my ISP?',
    answer:
      "Plug a device directly into your modem with an Ethernet cable — bypassing the Eero entirely — and run a speed test. If it matches your plan, your internet is fine and the issue is WiFi. If it's also slow via Ethernet, your ISP is the bottleneck, not the Eero.",
  },
  {
    question: 'Why does my device keep connecting to 2.4 GHz instead of 5 GHz?',
    answer:
      "Eero's band steering moves devices to 5 GHz automatically when signal strength is good enough. If a device keeps landing on 2.4 GHz, it's usually because the 5 GHz signal is too weak at that location — either it's too far from the nearest node, or there's significant wall/floor attenuation. Moving the device closer to an Eero node or adding a node will resolve it.",
  },
  {
    question: 'Does Eero 6 support WiFi 6?',
    answer:
      "Yes — Eero 6 is a WiFi 6 (802.11ax) router. To benefit from WiFi 6 speeds, the connecting device must also support WiFi 6. Older devices connect at WiFi 5 (802.11ac) or WiFi 4 (802.11n) rates regardless of the router's capability. Check your device's spec sheet to see which standard it supports.",
  },
];

const RELATED = [
  {
    category: 'Eero 6',
    title: 'Eero 6 Keeps Disconnecting',
    href: '/fix/wifi/eero-6/keeps-disconnecting',
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

export default function EeroSlowSpeedsPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Eero 6 Slow Speeds"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Eero 6 Showing Slow Speeds? Here&apos;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Slow WiFi usually comes down to one thing: which band your device is on. Here&apos;s
              how to diagnose it and get back to full speed.
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
            chatLink="/chat?device=eero-6&issue=slow-speeds"
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
            heading="Need a deeper look at your network?"
            body="Our AI runs real diagnostics — speed, latency, DNS, packet loss — and gives you a specific fix for your setup."
            chatLink="/chat?device=eero-6"
          />
        </div>
      </div>
    </>
  );
}
