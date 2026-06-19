import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import TLDRBox from '@/components/seo/TLDRBox';
import StepItem from '@/components/seo/StepItem';
import MidCTA from '@/components/seo/MidCTA';
import FAQItem from '@/components/seo/FAQItem';
import RelatedGrid from '@/components/seo/RelatedGrid';
import FinalCTA from '@/components/seo/FinalCTA';
import SeoSchema from '@/components/seo/SeoSchema';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'How to Set Up an Ecobee Thermostat | MyTech-Fix',
  description:
    'Step-by-step Ecobee thermostat setup guide — wiring, WiFi connection, app configuration, room sensors, and voice assistant integration.',
  alternates: {
    canonical: `${BASE}/setup/ecobee-thermostat`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Setup Guides', href: '/setup' },
  { label: 'Ecobee Thermostat' },
];

const PREREQS = [
  'Your Ecobee Thermostat and any included accessories (trim plate, screws)',
  'The Ecobee app — download it on iOS or Android before starting',
  'A free Ecobee account (you can create one during setup)',
  'Your 2.4 GHz WiFi network name and password — Ecobee does not support 5 GHz-only networks',
];

const STEPS = [
  {
    title: 'Turn off power to your HVAC system at the breaker',
    description:
      "Before touching any wiring, locate your home's electrical panel and turn off the breaker for your heating and cooling system. Do not skip this step — HVAC wiring carries low voltage but can still damage the thermostat or cause a short if touched while live. If you are not comfortable identifying the correct breaker or working with HVAC wiring, this is the point to call a licensed HVAC technician.",
  },
  {
    title: 'Remove the old thermostat and photograph the wiring',
    description:
      "Remove your existing thermostat from the wall. Before disconnecting any wires, take a clear photo of how each wire is connected to its terminal (R, G, Y, W, C, etc.). This is your reference if anything gets confusing during Ecobee installation. Label each wire with a small piece of tape if the wires aren't already labeled.",
  },
  {
    title: 'Connect your wires to the Ecobee backplate',
    description:
      "Follow the wiring guide in the Ecobee box, or use Ecobee's online compatibility checker at ecobee.com to confirm your system is supported. Insert each wire into the matching terminal on the Ecobee backplate and tighten the screws. If your system doesn't have a C-wire and your Ecobee model requires one, use the included Power Extender Kit (PEK) — its wiring diagram is in the box.",
    tip: "Ecobee's app includes a wiring setup wizard that walks you through each connection based on your specific HVAC system type. Opening it on your phone before connecting wires makes the process significantly easier.",
  },
  {
    title: 'Mount the Ecobee display and restore power',
    description:
      "Attach the Ecobee display to the backplate — it should click into place firmly. Return to your electrical panel and turn the HVAC breaker back on. The Ecobee display will power on and show a setup screen. If it doesn't power on, check that the display is fully seated and all wiring connections are secure.",
  },
  {
    title: "Follow the thermostat's on-screen setup wizard",
    description:
      "The Ecobee guides you through initial configuration directly on its touchscreen: language, time zone, HVAC system type (heat pump, forced air, etc.), and threshold settings. Work through these screens carefully — selecting the wrong HVAC type can cause the thermostat to run heating and cooling incorrectly.",
  },
  {
    title: 'Connect to your 2.4 GHz WiFi network',
    description:
      "When the thermostat reaches the WiFi setup screen, select your 2.4 GHz network from the list and enter the password. If your router broadcasts a combined SSID for both bands, connecting to it will work — the Ecobee will negotiate 2.4 GHz. Only dedicated 5 GHz-only SSIDs will fail to connect.",
  },
  {
    title: 'Download the Ecobee app and link your account',
    description:
      'Install the Ecobee app on your phone and sign in with the same account credentials you created during thermostat setup (or create an account now if you skipped it on-screen). The thermostat should appear in the app automatically within a minute of both being connected to the same account.',
  },
  {
    title: 'Set your temperature schedule',
    description:
      'Configure your preferred heating and cooling schedule through the app or directly on the thermostat. Ecobee uses "Comfort Settings" — named profiles (Home, Away, Sleep) each with their own temperature targets. You assign time ranges to each profile throughout the week to build your schedule.',
  },
  {
    title: 'Pair room sensors if included',
    description:
      "If your Ecobee kit includes SmartSensors (room sensors), place them on a shelf or mount them in frequently occupied rooms — living room, bedroom, office. In the app, go to Sensors and follow the pairing prompts. Once paired, you can set which sensors participate in temperature averaging during which Comfort Settings, allowing the thermostat to balance comfort across your whole home rather than just at the thermostat's location.",
  },
];

const FAQS = [
  {
    question: 'Does my Ecobee require a C-wire?',
    answer:
      "Most Ecobee models require a C-wire (common wire) for stable continuous power. However, if your existing wiring lacks a C-wire, Ecobee includes a Power Extender Kit (PEK) with many models that repurposes an existing wire to provide power without running a new cable. Check your specific Ecobee model's installation guide — it will tell you whether the PEK is needed and which wire to repurpose.",
  },
  {
    question: 'What are Ecobee room sensors and do I need them?',
    answer:
      "Ecobee SmartSensors measure temperature and occupancy in specific rooms. Without them, the thermostat controls your HVAC based only on the temperature at its own location — which may not reflect the temperature in the rooms where you're actually spending time. Sensors let the Ecobee average temperatures across multiple locations, reducing hot and cold spots. They're especially valuable in larger homes or homes with uneven heating/cooling.",
  },
  {
    question: 'Can I use Ecobee with Alexa, Google Home, and HomeKit at the same time?',
    answer:
      "Yes — Ecobee supports simultaneous integration with Amazon Alexa (built into many Ecobee models), Google Assistant, and Apple HomeKit. Each integration is set up independently through its respective app. You can enable all three without conflict, allowing you to control the thermostat from whichever voice assistant is most convenient.",
  },
];

const RELATED = [
  {
    category: 'Smart Home',
    title: 'Ecobee Not Working with Google Home — already set up but having an integration issue?',
    href: '/fix/smart-home/ecobee-not-working-with-google-home',
  },
  {
    category: 'Setup Guides',
    title: 'How to Set Up a Nest Thermostat with Google Home',
    href: '/setup/nest-thermostat-with-google-home',
  },
];

export default function EcobeeSetupPage() {
  return (
    <>
      <SeoSchema
        howToName="How to Set Up an Ecobee Thermostat"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-4">
              Setup Guide &middot; Smart Home
            </div>
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              How to Set Up an Ecobee Thermostat
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Complete setup from wiring and installation to app configuration, room sensors, and
              voice assistant integration.
            </p>
          </header>

          <TLDRBox points={PREREQS} label="What You'll Need" />

          <section className="mb-2">
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-6">Setup Steps</h2>
            <div>
              {STEPS.map((step, i) => (
                <StepItem key={i} step={i + 1} {...step} />
              ))}
            </div>
          </section>

          <MidCTA
            heading="Stuck on wiring or the WiFi setup screen?"
            body="Tell our AI which step you're on and describe what you're seeing — it can walk you through Ecobee wiring and account linking issues."
            chatLink="/chat?device=ecobee&issue=setup"
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
            heading="Having trouble during setup?"
            body="Our AI can help with Ecobee wiring questions, WiFi connection issues, and room sensor pairing — describe the problem and get a targeted fix."
            chatLink="/chat?device=ecobee"
          />
        </div>
      </div>
    </>
  );
}
