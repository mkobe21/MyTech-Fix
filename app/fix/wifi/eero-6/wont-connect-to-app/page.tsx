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
import { Bluetooth, RefreshCw, Smartphone, UserX } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Eero 6 Won't Connect to App? Here's the Fix | MyTech-Fix",
  description:
    "Can't add your Eero 6 to the app during setup? Most connection failures come down to Bluetooth or app state. Follow these steps to pair successfully.",
  alternates: {
    canonical: `${BASE}/fix/wifi/eero-6/wont-connect-to-app`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Eero', href: '/fix/wifi/eero' },
  { label: "Eero 6 Won't Connect to App" },
];

const TLDR = [
  'Bluetooth must be enabled on your phone — Eero uses it for initial device discovery.',
  'Update the Eero app to the latest version before starting setup.',
  'Your Eero should pulse white slowly (breathing) before you try adding it — not solid white.',
  'Switching to cellular data on your phone during setup often resolves pairing conflicts.',
];

const CAUSES = [
  {
    icon: Bluetooth,
    title: 'Bluetooth disabled on your phone',
    description:
      'Eero uses Bluetooth Low Energy (BLE) to discover new devices during setup. If Bluetooth is off or the app lacks Bluetooth permission, the Eero app simply cannot see the device — it won\'t show up in the "Add device" flow at all.',
    likelihood: 'likely' as const,
  },
  {
    icon: RefreshCw,
    title: 'Stale Eero app or phone cache',
    description:
      'An outdated version of the Eero app or a corrupted app cache can cause the pairing screen to freeze or fail silently. This is especially common after a major iOS or Android update that temporarily breaks background Bluetooth access.',
    likelihood: 'common' as const,
  },
  {
    icon: Smartphone,
    title: 'Phone is on WiFi instead of cellular during setup',
    description:
      'If your phone is connected to a WiFi network during Eero setup, the app may get confused when the Eero tries to join a different network. Switching to cellular data removes this ambiguity and is Eero\'s official recommendation.',
    likelihood: 'common' as const,
  },
  {
    icon: UserX,
    title: 'Eero is already claimed by another account',
    description:
      'If this Eero was previously set up on another account and not properly removed, the app will refuse to add it again. You\'ll need to factory reset it to clear the ownership claim before adding it to your account.',
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Enable Bluetooth on your phone',
    description:
      'Open your phone\'s Settings and make sure Bluetooth is on. On iPhone, also check Settings → Privacy & Security → Bluetooth and confirm the Eero app is allowed. On Android, check App Permissions and grant Location permission (required for BLE scanning on Android).',
    tip: 'On Android, Bluetooth scanning for nearby devices requires Location permission to be enabled at the OS level — not just Bluetooth itself.',
  },
  {
    title: 'Update the Eero app to the latest version',
    description:
      'Open the App Store or Google Play and update the Eero app if an update is available. Then force-quit the app completely (swipe up/close) and reopen it before starting setup.',
  },
  {
    title: 'Confirm the Eero is in setup mode',
    description:
      'The Eero should show a slowly pulsing white light (breathing pattern). This means it\'s ready to be set up. If it shows solid white, it\'s already configured — factory reset it first (hold the reset button for 10 seconds). If it shows any other color, unplug it and plug it back in.',
    tip: 'A pulsing white light = ready to pair. Solid white = already set up. Any other color = needs a restart or reset.',
  },
  {
    title: 'Switch your phone to cellular data',
    description:
      'Turn off WiFi on your phone (or forget your current network temporarily) so your phone is running on cellular data. Then retry the "Add device" flow in the Eero app. This prevents the app from getting confused by network switching during pairing.',
  },
  {
    title: 'Log out and back into the Eero app',
    description:
      'If the app still can\'t find the device, log out of the Eero app, close it fully, then log back in. Sometimes a stale auth token causes the device discovery step to silently fail.',
  },
  {
    title: 'Factory reset the Eero and try again',
    description:
      'If the Eero was previously owned by another account, or if nothing else works, factory reset it. Hold the small reset button (pinhole on the bottom or back) for 10 seconds until the light flashes. Wait for a slow white pulse, then retry setup in the app.',
    tip: 'If you bought this Eero used, a factory reset is always the right first step — it clears any prior account claim.',
  },
];

const FAQS = [
  {
    question: 'Why does Eero use Bluetooth for setup?',
    answer:
      'Eero uses Bluetooth Low Energy (BLE) for initial device discovery during setup. Since the Eero isn\'t on your network yet, Bluetooth is the only way for the app to find and communicate with it before WiFi credentials are configured. After setup, Bluetooth is no longer needed.',
  },
  {
    question: 'Can I set up Eero without the app?',
    answer:
      'No — the Eero app is required for initial setup. The hardware cannot be configured via a web browser or without Bluetooth pairing. Once set up, the Eero operates independently, but first-time configuration always requires the Eero app on a smartphone or tablet.',
  },
  {
    question: 'What color should the Eero light be when ready to set up?',
    answer:
      'The Eero should show a slowly pulsing white light — sometimes called a "breathing" pattern. This means it\'s in setup mode and waiting to be paired. If it\'s solid white, it\'s already been configured. If it\'s showing any other color, unplug it, wait 30 seconds, and plug it back in.',
  },
  {
    question: 'How do I add an Eero that was on a previous owner\'s account?',
    answer:
      'Factory reset the Eero by holding the reset button (small pinhole on the bottom or back) for 10 seconds until the light flashes yellow, then slowly pulses white. This removes the previous account claim. You can then add it to your account fresh in the Eero app.',
  },
];

const RELATED = [
  {
    category: 'Eero 6',
    title: 'Eero 6 Red Light Blinking',
    href: '/fix/wifi/eero-6/red-light-blinking',
  },
  {
    category: 'Eero Guides',
    title: 'All Eero troubleshooting guides →',
    href: '/fix/wifi/eero',
  },
];

export default function EeroWontConnectPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Eero 6 Not Connecting to App"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Eero 6 Won&apos;t Connect to App? Here&apos;s the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Most Eero app pairing failures come down to Bluetooth access or app state. Here&apos;s
              how to get set up in minutes.
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
            heading="Eero still not showing up in the app?"
            body="Our AI can walk through your specific setup — phone model, Eero model, and account state — and give you a targeted fix."
            chatLink="/chat?device=eero-6&issue=app-connect"
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
            heading="Still can't get your Eero set up?"
            body="Describe your setup in the chat — phone model, Eero model, what the light shows — and our AI will give you a step-by-step fix."
            chatLink="/chat?device=eero-6"
          />
        </div>
      </div>
    </>
  );
}
