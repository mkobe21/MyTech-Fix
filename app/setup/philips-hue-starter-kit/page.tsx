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
  title: 'How to Set Up a Philips Hue Starter Kit | MyTech-Fix',
  description:
    'Complete setup guide for your Philips Hue Starter Kit — connecting the Bridge, adding bulbs, organizing rooms, and creating your first scene.',
  alternates: {
    canonical: `${BASE}/setup/philips-hue-starter-kit`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Setup Guides', href: '/setup' },
  { label: 'Philips Hue Starter Kit' },
];

const PREREQS = [
  'Philips Hue Starter Kit — Bridge and bulbs (all in the box)',
  'The Philips Hue app — download it on iOS or Android before starting',
  'An available Ethernet port on your router — the Bridge connects via cable, not WiFi',
  'Hue bulbs already screwed into their fixtures and the fixtures switched on',
];

const STEPS = [
  {
    title: 'Connect the Hue Bridge to your router via Ethernet',
    description:
      'Use the included Ethernet cable to connect the Hue Bridge to any open LAN port on your router. The Bridge does not connect to WiFi directly — it requires a wired connection to your router to function. If your router is in another room, the Bridge needs to be within cable reach of it.',
  },
  {
    title: 'Plug in the Bridge and wait for all three lights',
    description:
      "Plug the Bridge's power adapter into a wall outlet. Three small lights on top of the Bridge will light up as it initializes — wait until all three are solid (not blinking) before proceeding. This typically takes 60–90 seconds.",
  },
  {
    title: 'Download the Philips Hue app and sign in',
    description:
      'Install the Philips Hue app on your iOS or Android device. Create a free Hue account or sign in if you already have one. An account is required for remote access and for linking to voice assistants later.',
  },
  {
    title: 'Pair the Bridge in the app',
    description:
      "Open the app and tap \"Set Up\" when it detects your Bridge on the local network. When the app prompts you, physically walk to the Bridge and press the large round button on top of it. This button press confirms you have physical access to the device — it's a security step, not optional. The app will confirm pairing within a few seconds.",
  },
  {
    title: 'Leave light switch fixtures powered on',
    description:
      "Hue bulbs must receive continuous power to respond to app and voice commands. If the wall switch controlling a fixture is turned off, the bulb loses power and becomes unreachable. The correct way to use Hue bulbs is to leave the physical switch permanently on and control the bulbs exclusively through the app, a smart switch, or a voice assistant.",
    tip: 'If you share your home with others, label the switch or add a cover so people don\'t accidentally cut power to the bulbs — it\'s the most common reason Hue stops responding.',
  },
  {
    title: 'Add your bulbs in the app',
    description:
      'In the app, tap the "+" icon and select "Add light." The app will scan for Hue bulbs on the same network. Each bulb should appear by its serial number — tap to add them one at a time, or use "Search" to add all discovered bulbs at once. Bulbs that don\'t appear may need their fixture\'s power cycled: turn the switch off for 10 seconds, then back on.',
  },
  {
    title: 'Organize bulbs into Rooms',
    description:
      'Once your bulbs are added, tap "Add room" and group bulbs by their physical location (Living Room, Bedroom, Kitchen, etc.). Rooms are how you control multiple bulbs together — turning on "Living Room" controls all bulbs in that room at once. Voice assistants like Alexa and Google Home also use room names as the control target.',
  },
  {
    title: 'Create your first Scene to verify the system',
    description:
      'A Scene saves a specific combination of brightness and color across your bulbs. Open any room, tap "Create scene," adjust the bulbs to a state you like, and save it with a name. Successfully creating and recalling a Scene confirms that your Bridge, bulbs, and app are all communicating correctly.',
  },
];

const FAQS = [
  {
    question: 'Can I use Hue bulbs without the Bridge?',
    answer:
      "Some newer Hue bulbs support Bluetooth-only control directly from your phone without a Bridge. This works within Bluetooth range (roughly 30 feet) but loses several features: no remote access when away from home, no voice assistant integration without additional setup, no automations, and reduced multi-room coordination. The Bridge is recommended if you plan to use more than a few bulbs or want the full Hue experience.",
  },
  {
    question: "Why isn't my Hue bulb responding to the app?",
    answer:
      "The most common cause is that the physical wall switch controlling that fixture has been turned off, cutting power to the bulb. Hue bulbs need continuous power to receive commands — leave the switch permanently on. If the switch is on and the bulb still isn't responding, try cycling power to the fixture (switch off 10 seconds, switch back on) to let the bulb reconnect to the Bridge.",
  },
  {
    question: 'Can I control Hue lights when away from home?',
    answer:
      'Yes — once your Bridge is online and linked to your Hue account, you can control your lights remotely from anywhere through the app. Remote access requires the Bridge to be connected to the internet via your home router. If your internet goes down, remote access stops working, but any automations programmed into the Bridge itself continue running locally.',
  },
];

const RELATED = [
  {
    category: 'Smart Home',
    title: 'Philips Hue Not Syncing with HomeKit — already set up but having an integration issue?',
    href: '/fix/smart-home/philips-hue-not-syncing-with-homekit',
  },
  {
    category: 'Setup Guides',
    title: 'How to Set Up an Ecobee Thermostat',
    href: '/setup/ecobee-thermostat',
  },
];

export default function PhilipsHueSetupPage() {
  return (
    <>
      <SeoSchema
        howToName="How to Set Up a Philips Hue Starter Kit"
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
              How to Set Up a Philips Hue Starter Kit
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              From Bridge connection to your first Scene — a complete walkthrough for first-time
              Hue setup including bulb pairing and room organization.
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
            heading="Bulb not showing up or Bridge not pairing?"
            body="Describe what you're seeing and our AI will walk you through the specific step that's failing."
            chatLink="/chat?device=philips-hue&issue=setup"
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
            body="Our AI can walk you through Hue Bridge pairing, bulb discovery issues, and room configuration step by step."
            chatLink="/chat?device=philips-hue"
          />
        </div>
      </div>
    </>
  );
}
