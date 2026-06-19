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
  title: 'How to Set Up a Nest Thermostat with Google Home | MyTech-Fix',
  description:
    'Step-by-step guide to installing your Nest Thermostat, connecting it to your 2.4 GHz WiFi network, adding it to the Google Home app, and testing voice control.',
  alternates: {
    canonical: `${BASE}/setup/nest-thermostat-with-google-home`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Setup Guides', href: '/setup' },
  { label: 'Nest Thermostat with Google Home' },
];

const PREREQS = [
  'Your Nest Thermostat and the included screwdriver and trim plate',
  'The Google Home app on iOS or Android — sign in with your Google account before starting',
  'A 2.4 GHz WiFi network name and password — Nest does not support 5 GHz-only networks',
  'Your HVAC system wiring labels (or a photo of the existing thermostat wiring before removal)',
];

const STEPS = [
  {
    title: 'Turn off power to your HVAC system at the breaker',
    description:
      "Before touching any wiring, go to your electrical panel and turn off the breaker for your heating and cooling system. Do not skip this step. If you are not comfortable identifying the correct breaker or handling low-voltage HVAC wiring, this is the point to call a licensed HVAC technician — Nest installation is included in a standard service call at most HVAC companies.",
  },
  {
    title: 'Remove the existing thermostat and photograph the wiring',
    description:
      "Remove your old thermostat from the wall. Before unplugging any wires, take a clear photo of how the wires are connected to their terminals (R, G, Y, W, C, etc.). This photo is your reference if anything gets confusing during Nest installation. Label each wire with a small piece of tape if the wires are not already labeled.",
  },
  {
    title: 'Connect your wires to the Nest base',
    description:
      "Follow the wiring guide included with your Nest, or use the Nest compatibility checker at home.nest.com to confirm your setup. Insert each wire into the matching terminal on the Nest base and press until it clicks. The Nest app also has a wiring setup flow that walks you through each connection based on your specific HVAC system type.",
    tip: "If you don't have a C-wire (common wire), your Nest may run on battery power — many models support this, but a C-wire provides more stable continuous power. Check your specific Nest model's requirements.",
  },
  {
    title: 'Attach the Nest display to the base and restore power',
    description:
      "Snap the Nest display onto the base — it should click firmly into place. Return to your electrical panel and turn the HVAC breaker back on. The Nest display will power on and show a welcome screen or begin its own first-run setup. If the display doesn't come on, check that it's fully seated on the base.",
  },
  {
    title: 'Connect the Nest to your 2.4 GHz WiFi network',
    description:
      "Follow the on-screen prompts on the thermostat itself to connect to WiFi. When the network list appears, select your 2.4 GHz network specifically. If your router broadcasts a combined 2.4/5 GHz name, connect to that — the Nest will negotiate 2.4 GHz automatically. If you have a separate 5 GHz-only SSID, do not select it.",
  },
  {
    title: 'Add the thermostat to the Google Home app',
    description:
      "Open the Google Home app and tap the \"+\" button, then \"Set up device\" > \"New device.\" The app will search your WiFi network for compatible devices. Your Nest Thermostat should appear automatically within a few seconds if it's connected to the same WiFi network as your phone. Follow the prompts to assign it to a room and confirm the setup.",
  },
  {
    title: 'Set your temperature schedule',
    description:
      'Once the thermostat is linked, set your preferred temperature schedule either through the Google Home app or directly on the thermostat display. The Nest also has a learning feature that adapts to your preferences over the first few weeks — if you prefer manual control, you can disable learning in the thermostat settings.',
  },
  {
    title: "Test voice control and confirm it's working",
    description:
      'Say "Hey Google, set the temperature to 70 degrees" to an Assistant-enabled device on the same Google account. The Nest Thermostat should adjust and you should receive a confirmation response. If voice control doesn\'t work, check that the thermostat is in the same Google Home structure and account as your Assistant devices.',
  },
];

const FAQS = [
  {
    question: 'Does my Nest Thermostat require a C-wire?',
    answer:
      "Not always — it depends on your specific Nest model. Some models can run on battery power from the existing HVAC wiring without a C-wire (common wire). However, a C-wire provides stable continuous power and prevents the thermostat from having to occasionally \"borrow\" power from heating/cooling wires, which can cause short cycling on some systems. Check your Nest model's compatibility page at home.nest.com to confirm whether a C-wire is required or recommended for your setup.",
  },
  {
    question: 'Can I control my Nest Thermostat without the Google Home app?',
    answer:
      'Yes — the thermostat itself has full manual control via its dial and display. The Google Home app (formerly the Nest app) adds remote access from anywhere and voice control via Google Assistant. If you just want to control temperature from your phone without linking to Google Assistant, you can use the Home app as a standalone controller without setting up any voice integrations.',
  },
  {
    question: 'Why does Nest require 2.4 GHz WiFi specifically?',
    answer:
      "Nest Thermostats use 2.4 GHz-only WiFi radios. The design prioritizes range and low power consumption over speed — 2.4 GHz travels farther through walls than 5 GHz, which matters for a device that's mounted wherever your old thermostat was, not near your router. If your router broadcasts a combined SSID (same name for both bands), connecting to it will work because the router will negotiate 2.4 GHz. Only dedicated 5 GHz-only SSIDs will fail.",
  },
];

const RELATED = [
  {
    category: 'Smart Home',
    title: 'Nest Thermostat Troubleshooting Guides — already set up but having issues?',
    href: '/fix/smart-home/nest-thermostat',
  },
  {
    category: 'Smart Home',
    title: 'Nest Thermostat Not Showing in Google Home',
    href: '/fix/smart-home/nest-thermostat-not-showing-in-google-home',
  },
  {
    category: 'Setup Guides',
    title: 'How to Set Up a Ring Doorbell with Alexa',
    href: '/setup/ring-doorbell-with-alexa',
  },
];

export default function NestSetupPage() {
  return (
    <>
      <SeoSchema
        howToName="How to Set Up a Nest Thermostat with Google Home"
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
              How to Set Up a Nest Thermostat with Google Home
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              From wiring and installation to Google Home app linking and voice control — a
              complete walkthrough for first-time setup.
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
            heading="Stuck on the wiring or app setup?"
            body="Tell our AI which step you're on and describe what you're seeing — it can walk you through HVAC wiring and Google Home pairing issues."
            chatLink="/chat?device=nest-thermostat&issue=setup"
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
            body="Our AI can help with Nest wiring questions, Google Home linking issues, and WiFi connectivity — describe the problem and get a targeted fix."
            chatLink="/chat?device=nest-thermostat"
          />
        </div>
      </div>
    </>
  );
}
