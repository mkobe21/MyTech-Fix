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
import { WifiOff, Wifi, Zap, Globe } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Ring Doorbell Showing Offline? Here's How to Fix It | MyTech-Fix",
  description:
    "Ring Doorbell offline in the Ring app? Usually a weak WiFi signal or a power issue. Here's how to diagnose and fix it — battery and wired models covered.",
  alternates: {
    canonical: `${BASE}/fix/smart-home/ring-doorbell/offline`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Smart Home', href: '/fix/smart-home' },
  { label: 'Ring Doorbell', href: '/fix/smart-home/ring-doorbell' },
  { label: 'Ring Doorbell Offline' },
];

const TLDR = [
  "Check Device Health > Signal Strength in the Ring app — 'Good' or better is required for a stable connection.",
  "Most Ring doorbells support only 2.4 GHz WiFi — a 5 GHz network causes silent offline failures.",
  "For battery models, check the charge level in the app; for wired models, verify the transformer supplies 16–24 VAC.",
  "Check status.ring.com for outages before spending time troubleshooting the device locally.",
];

const CAUSES = [
  {
    icon: WifiOff,
    title: 'WiFi signal too weak at the doorbell location',
    description:
      "Doorbells are often mounted at the far end of a home from the router — through multiple walls, windows, and sometimes outside. A signal that looks functional on nearby devices may be too weak for a doorbell to maintain a stable connection. Ring's Device Health screen shows signal strength in real time; anything below 'Good' is a likely culprit.",
    likelihood: 'likely' as const,
  },
  {
    icon: Wifi,
    title: 'WiFi password or network name changed',
    description:
      "If you changed your WiFi password, replaced your router, or renamed your network, the Ring doorbell still has the old credentials and can no longer connect. The doorbell won't update WiFi settings automatically — you must re-enter current credentials through the Ring app.",
    likelihood: 'common' as const,
  },
  {
    icon: Zap,
    title: 'Power issue — low battery or insufficient transformer voltage',
    description:
      "Battery-powered Ring doorbells go offline when the battery is fully depleted. Wired models require a doorbell transformer supplying 16–24 VAC; older homes often have 8–10 VAC transformers that don't provide enough power for Ring's wired doorbells. Both scenarios result in the same 'offline' status in the app.",
    likelihood: 'common' as const,
  },
  {
    icon: Globe,
    title: 'Ring service outage',
    description:
      "Ring's cloud infrastructure occasionally experiences disruptions that make devices appear offline in the app even though they're connected to WiFi. During a server-side outage, local troubleshooting won't help. Check status.ring.com before spending time on router or device steps.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Check signal strength in Device Health',
    description:
      "Open the Ring app, tap on your doorbell, then tap Device Health. Look at the Signal Strength reading. Ring rates it as Excellent, Good, Fair, or Poor. 'Fair' or 'Poor' means the signal is the likely cause of offline issues — the doorbell is losing its connection intermittently. A WiFi extender positioned closer to the front door is the most reliable fix for a weak signal.",
    tip: "Ring makes the Ring Chime Pro, which is a WiFi extender specifically designed to boost signal to Ring devices — it's worth considering if the doorbell is far from your router.",
  },
  {
    title: 'Confirm the doorbell is on a 2.4 GHz network',
    description:
      "In Device Health, you'll see the network name the doorbell is connected to. Most Ring doorbells support only 2.4 GHz — if you recently changed routers or network settings and the doorbell is now on a 5 GHz SSID, it will appear online briefly then drop. Change the WiFi network through the Ring app to a 2.4 GHz SSID specifically.",
  },
  {
    title: 'Re-add the doorbell if your WiFi credentials changed',
    description:
      "If your WiFi password or network name changed, go to Ring app > your doorbell's device settings > Device Health > Change WiFi Network. This walks you through entering the current network credentials without a full factory reset. If Change WiFi Network doesn't work, remove the device from the app and re-add it using the '+' button.",
  },
  {
    title: 'Check power — battery level or transformer voltage',
    description:
      "For battery models: Device Health shows battery percentage. If it's below 20%, charge the battery using the included cable (orange USB connector on most models). For wired models: use a multimeter to test your doorbell transformer — it should read 16–24 VAC. If it reads below 16V, the transformer needs upgrading. Ring sells a compatible plug-in transformer as an alternative.",
    tip: "For wired Ring doorbells, the transformer is usually located in a closet, utility room, or near the breaker panel. It's typically a small rectangular device with two low-voltage wires leading to the doorbell.",
  },
  {
    title: 'Power cycle the doorbell',
    description:
      "For battery models: remove the battery pack from the doorbell, wait 30 seconds, then reinsert it. For wired models: turn off the circuit breaker for your doorbell circuit, wait 30 seconds, then turn it back on. This clears any frozen connection state. After the doorbell reboots (30–60 seconds), check Device Health again.",
  },
  {
    title: 'Check status.ring.com for service outages',
    description:
      "Visit status.ring.com in a browser. This page shows real-time status for Ring's device connectivity, app, and cloud infrastructure. If any service shows an incident or degraded performance, the offline status may be caused by Ring's servers rather than your device or network. Wait for Ring to restore the affected service before continuing to troubleshoot locally.",
  },
];

const FAQS = [
  {
    question: 'Why does my Ring Doorbell keep going offline?',
    answer:
      "Frequent disconnects almost always trace to marginal WiFi signal at the doorbell's mounting location, a power supply issue (low battery or an under-voltage transformer), or periodic Ring server outages. Open Device Health in the Ring app — signal strength, battery level, and last connection time are all visible there. A signal reading below 'Good' is the most common cause and can often be improved with a WiFi extender or Ring Chime Pro mounted near the front door.",
  },
  {
    question: 'What WiFi frequency does Ring Doorbell use?',
    answer:
      "Most Ring Doorbell models — including Ring Video Doorbell (1st–3rd gen), Ring Video Doorbell Pro, and Ring Doorbell Wired — support only 2.4 GHz WiFi. The Ring Video Doorbell Pro 2 and Ring Video Doorbell 4 added dual-band (2.4 GHz and 5 GHz) support. Check Ring's product specifications for your specific model to confirm which bands it supports before troubleshooting a connection issue.",
  },
  {
    question: 'What voltage does a wired Ring Doorbell require?',
    answer:
      "Ring's wired doorbells require a transformer supplying 16–24 VAC at 40 VA or more. Most older homes have 8–12 VAC transformers — these are insufficient for Ring's wired models and will cause power instability, including offline status and failure to charge the backup battery. Ring sells a plug-in transformer (included with some models) that plugs directly into an outlet and bypasses the existing transformer.",
  },
  {
    question: 'Can I use Ring Doorbell on a guest WiFi network?',
    answer:
      "You can connect Ring to a guest network, but most guest networks have AP Isolation or Client Isolation enabled — this prevents your phone on the same network from communicating directly with the doorbell's local IP. For live view and two-way audio, Ring routes through its cloud, so this usually works. However, for best reliability and faster local response, connect the doorbell to your main network.",
  },
];

const RELATED = [
  {
    category: 'Ring Doorbell',
    title: "Ring Doorbell Won't Connect to WiFi",
    href: '/fix/smart-home/ring-doorbell/wont-connect-to-wifi',
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

export default function RingDoorbellOfflinePage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Ring Doorbell Showing Offline"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Ring Doorbell Showing Offline? Here&rsquo;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Ring offline status almost always means weak WiFi signal or a power issue — both
              are visible in Device Health and both are fixable.
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
            heading="Still offline after these steps?"
            body="Our AI can identify whether it's a signal, power, or Ring service issue — and walk you through the specific fix."
            chatLink="/chat?device=ring-doorbell&issue=offline"
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
            body="Describe what you're seeing in the app — our AI will give you a targeted fix for your specific model and setup."
            chatLink="/chat?device=ring-doorbell"
          />
        </div>
      </div>
    </>
  );
}
