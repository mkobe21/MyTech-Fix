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
import { Wifi, Lock, MapPin, Shield } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Ring Doorbell Won't Connect to WiFi? Here's the Fix | MyTech-Fix",
  description:
    "Ring Doorbell won't connect to WiFi during setup? Most failures come down to the wrong band or weak signal during pairing. Here's the full fix.",
  alternates: {
    canonical: `${BASE}/fix/smart-home/ring-doorbell/wont-connect-to-wifi`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Smart Home', href: '/fix/smart-home' },
  { label: 'Ring Doorbell', href: '/fix/smart-home/ring-doorbell' },
  { label: "Ring Doorbell Won't Connect to WiFi" },
];

const TLDR = [
  "Ring doorbells require 2.4 GHz WiFi — a 5 GHz SSID is the most common cause of setup failures.",
  "Move the doorbell close to your router for initial setup — signal requirements are higher during pairing than normal use.",
  "Use 'Change WiFi Network' in the Ring app if previously paired, not a full re-pair from scratch.",
  "Temporarily disable MAC address filtering on your router during setup to rule out a blocked connection.",
];

const CAUSES = [
  {
    icon: Wifi,
    title: 'Connecting to a 5 GHz network instead of 2.4 GHz',
    description:
      "Most Ring Doorbell models support only 2.4 GHz WiFi. If your router broadcasts a combined SSID for both bands and the doorbell latches onto the 5 GHz broadcast, setup will fail or connect momentarily then drop. You may need to temporarily create a separate 2.4 GHz SSID in your router settings to give the doorbell a clear 2.4 GHz target during setup.",
    likelihood: 'likely' as const,
  },
  {
    icon: Lock,
    title: 'WiFi password entered incorrectly',
    description:
      "Ring's in-app password entry field is easy to mis-type — special characters, capital letters, and numbers all need to be entered exactly. Even one incorrect character causes a silent setup failure. The app may show a generic 'Could not connect' error without indicating a password mismatch specifically.",
    likelihood: 'common' as const,
  },
  {
    icon: MapPin,
    title: 'Doorbell too far from the router during initial setup',
    description:
      "Signal requirements are higher during the initial pairing process than during normal operation — the doorbell needs a strong connection to complete the setup handshake. If you're trying to pair the doorbell at its permanent mount location and that location has weak signal, the setup will fail even if the device would work fine once paired. Move the doorbell close to the router just for the initial setup.",
    likelihood: 'common' as const,
  },
  {
    icon: Shield,
    title: 'Router firewall or MAC address filtering is blocking the device',
    description:
      "If your router has MAC address filtering enabled (also called an 'allow list' or 'device access control'), new devices are blocked until you add their MAC address to the allowed list. Some router firewalls also block IoT devices by default. Temporarily disabling these features during setup — then re-enabling with the doorbell added — resolves this class of failures.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Confirm you are connecting to a 2.4 GHz network',
    description:
      "During Ring app setup, on the WiFi selection screen, look for a network name without '5G' or '5GHz' in the label. If your router uses a single combined SSID for both bands, log into your router's admin panel and either temporarily disable the 5 GHz band or create a separate 2.4 GHz SSID. Connect the doorbell to the 2.4 GHz SSID specifically, then you can re-enable your normal setup afterward.",
    tip: "After initial setup, the Ring doorbell maintains its connection independently — you can re-merge your SSIDs or re-enable the 5 GHz band without affecting the doorbell.",
  },
  {
    title: 'Re-enter your WiFi password carefully',
    description:
      "In the Ring app's WiFi password field, type your password slowly. Passwords are case-sensitive. If your password includes special characters (!, @, #, etc.), double-check each one. The app offers a 'Show password' toggle (eye icon) — use it to confirm what's been entered before tapping Connect.",
  },
  {
    title: 'Move the doorbell closer to the router for setup',
    description:
      "If you're pairing the doorbell at its permanent front-door mount location and setup keeps failing, bring the doorbell inside next to your router. Complete the setup there — the doorbell only needs to be near the router for the initial pairing. Once paired, you can move it to the permanent mount location and it will reconnect on its own.",
  },
  {
    title: "Use 'Change WiFi Network' if the doorbell was previously paired",
    description:
      "If the doorbell was previously connected to a different network, don't try to pair it from scratch. In the Ring app, go to your doorbell > Device Settings > Device Health > Change WiFi Network. This walks you through switching networks while preserving all settings, recordings, and sharing permissions.",
  },
  {
    title: 'Restart both the router and the doorbell, then retry',
    description:
      "Power off your router, wait 30 seconds, and power it back on. For the doorbell, remove the battery (battery models) or press and hold the orange setup button on the back until the light pattern changes. Wait for both devices to fully restart. Then attempt setup again in the Ring app.",
  },
  {
    title: 'Temporarily disable MAC filtering and router firewall',
    description:
      "Log into your router's admin panel and temporarily disable MAC address filtering or any device access controls. Attempt setup. If it succeeds, re-enable MAC filtering and add the doorbell's MAC address to the allowed list — find it in the Ring app under Device Health after setup completes.",
  },
];

const FAQS = [
  {
    question: 'Why does Ring Doorbell require 2.4 GHz WiFi for setup?',
    answer:
      "Most Ring Doorbell models support only 2.4 GHz because it has better range and wall penetration than 5 GHz — which matters for a device mounted at the far end of a home. During initial setup, signal requirements are stricter than during normal operation, so the doorbell needs a particularly strong 2.4 GHz signal to complete the pairing handshake. That's why moving it close to the router during setup often resolves failures that wouldn't happen in normal use.",
  },
  {
    question: 'How do I change the WiFi network on my Ring Doorbell without resetting it?',
    answer:
      "Open the Ring app, tap on your doorbell's device card, go to Device Settings > Device Health > Change WiFi Network. The app guides you through connecting to a new network without a factory reset, preserving all your settings, zones, and history. This is the correct process whenever you replace your router or change your WiFi password.",
  },
  {
    question: 'My Ring Doorbell is stuck in setup mode — what should I do?',
    answer:
      "If the doorbell is stuck in setup mode (spinning white light or pulsing), press and hold the orange setup button on the back of the device for 10 seconds until the light changes, then release. Wait 30 seconds for the doorbell to restart. Open the Ring app and start the setup process again from the beginning. Ensure you're within 10 feet of your router during this attempt.",
  },
  {
    question: 'Can Ring Doorbell connect to a mesh WiFi network?',
    answer:
      "Yes. Ring doorbells work with mesh WiFi systems as long as the mesh broadcasts a 2.4 GHz SSID. Most mesh systems appear as a single SSID to the doorbell, and the mesh manages which node serves it. For the best initial setup experience, stand near the mesh node closest to where the doorbell will be mounted — this gives the strongest signal during the pairing handshake.",
  },
];

const RELATED = [
  {
    category: 'Ring Doorbell',
    title: 'Ring Doorbell Showing Offline',
    href: '/fix/smart-home/ring-doorbell/offline',
  },
  {
    category: 'Ring Doorbell',
    title: 'Ring Doorbell Motion Detection Not Working',
    href: '/fix/smart-home/ring-doorbell/motion-detection-not-working',
  },
  {
    category: 'Ring Doorbell',
    title: 'Ring Doorbell Battery Draining Fast',
    href: '/fix/smart-home/ring-doorbell/battery-draining-fast',
  },
  {
    category: 'Ring Doorbell Guides',
    title: 'All Ring Doorbell troubleshooting guides →',
    href: '/fix/smart-home/ring-doorbell',
  },
];

export default function RingDoorbellWontConnectWifiPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Ring Doorbell Won't Connect to WiFi"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Ring Doorbell Won&apos;t Connect to WiFi? Here&rsquo;s the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Most Ring WiFi failures are caused by the wrong band or weak signal during the
              pairing handshake. Here&rsquo;s how to identify which one and get connected.
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
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-6">Step-by-Step Fix</h2>
            <div>
              {STEPS.map((step, i) => (
                <StepItem key={i} step={i + 1} {...step} />
              ))}
            </div>
          </section>

          <MidCTA
            heading="Still can't connect to WiFi after these steps?"
            body="Our AI can identify whether it's a band mismatch, router setting, or signal issue specific to your network setup."
            chatLink="/chat?device=ring-doorbell&issue=wifi"
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
            heading="Still having trouble with your Ring Doorbell?"
            body="Tell our AI your router model and what you've tried — it'll give you a targeted fix for your specific setup."
            chatLink="/chat?device=ring-doorbell"
          />
        </div>
      </div>
    </>
  );
}
