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
  title: 'How to Set Up a Ring Doorbell with Alexa | MyTech-Fix',
  description:
    'Step-by-step guide to getting your Ring Doorbell online, connected to WiFi, linked to the Alexa app, and configured with motion alerts — for battery and wired models.',
  alternates: {
    canonical: `${BASE}/setup/ring-doorbell-with-alexa`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Setup Guides', href: '/setup' },
  { label: 'Ring Doorbell with Alexa' },
];

const PREREQS = [
  'Your Ring Doorbell (battery or wired model) and any included mounting hardware',
  'The Ring app — download it on iOS or Android and create an account before starting',
  'An Amazon account (the same one used for your Alexa/Echo devices)',
  'Your 2.4 GHz WiFi network name and password — Ring does not support 5 GHz-only connections',
];

const STEPS = [
  {
    title: 'Download the Ring app and sign in',
    description:
      'Install the Ring app on your iOS or Android device. Create a Ring account or sign in if you already have one. The app guides the entire setup process — you cannot configure the doorbell through a web browser during initial setup.',
  },
  {
    title: 'Charge the battery before starting (battery models only)',
    description:
      "If you have a battery-powered Ring Doorbell, charge the battery fully before beginning setup. Remove the battery using the included release pin, connect it to the provided charger, and wait until the charging indicator shows full. A low battery during setup can cause the doorbell to drop offline mid-pairing, which requires starting over.",
  },
  {
    title: 'Start setup in the Ring app',
    description:
      "In the Ring app, tap \"Set Up a Device\" on the dashboard, then select \"Doorbells.\" Choose your specific doorbell model from the list — the exact setup flow varies slightly between models. The app will guide you through each remaining step.",
  },
  {
    title: 'Connect the doorbell to your 2.4 GHz WiFi network',
    description:
      "The app will prompt you to put your doorbell into setup mode (usually by pressing the orange button on the back of the device) and then scan for it using your phone's WiFi. Once your phone connects to the doorbell's temporary network, you'll select your home 2.4 GHz WiFi network and enter the password. Ring will confirm the connection before continuing.",
    tip: 'Keep the doorbell close to your router during initial WiFi setup — Ring requires a stronger signal during pairing than during normal operation. You can mount it in its final location after setup is confirmed working.',
  },
  {
    title: 'Confirm the doorbell is online in the app',
    description:
      "Once WiFi setup completes, the Ring app will show the doorbell as \"Online\" with a live view button. Tap the live view to confirm you can see your front door — this verifies both the internet connection and the camera are working before you mount the device.",
  },
  {
    title: 'Mount the doorbell at the recommended height',
    description:
      "Ring recommends mounting at approximately 48 inches (about 4 feet) from the ground. This height gives the motion sensor the best coverage of the area in front of your door. Use the included mounting plate and hardware — mark your drill points, install the mounting plate, then attach the doorbell. For wired models, connect to your existing doorbell wiring before mounting.",
  },
  {
    title: 'Link Ring to Alexa via the Ring Skill',
    description:
      'Open the Alexa app on your phone. Go to More > Skills & Games, search for "Ring," and tap Enable to Use. Sign in with your Ring account credentials when prompted — these are the same credentials as your Ring app, not your Amazon account. Once linked, Alexa will import your Ring devices automatically.',
  },
  {
    title: 'Confirm your Ring Doorbell appears in the Alexa app',
    description:
      'After linking the skill, go to Devices in the Alexa app and look for your Ring Doorbell. If it doesn\'t appear immediately, tap the search icon to manually discover devices. Once it appears, you can assign it to a room in your Alexa home.',
  },
  {
    title: 'Test the Alexa integration',
    description:
      'On an Echo Show or Fire TV device, say "Alexa, show the front door" (or whatever name your doorbell was given in the Ring app). The live camera view should appear. On an Echo without a screen, Alexa will announce when motion is detected or the doorbell is pressed. Adjust the doorbell\'s name in the Ring app if you want a more natural voice command.',
  },
];

const FAQS = [
  {
    question: 'Do I need an Echo Show to use Ring with Alexa?',
    answer:
      "You need a screen-equipped Echo device (Echo Show or Echo with screen) to view the live camera feed via voice command. Without a screen, any Echo device can still announce motion alerts and doorbell presses out loud — you just won't be able to pull up the live view. Basic audio announcements work with all Echo device types.",
  },
  {
    question: 'Can I use Ring with both Alexa and Google Home at the same time?',
    answer:
      'Yes — Ring supports simultaneous integration with both Alexa and Google Home. Enabling the Ring Skill in Alexa and adding Ring to Google Home are independent steps that do not conflict. Many users run both so they can use whichever voice assistant is nearest.',
  },
  {
    question: 'Should I choose a battery or wired Ring Doorbell?',
    answer:
      'Wired models receive continuous power, which means more consistent performance, always-on connectivity, and no recharging. Battery models offer more flexible installation (no existing wiring needed) but require periodic recharging — typically every few months depending on motion event volume and weather. Cold temperatures significantly accelerate battery drain. If you have existing doorbell wiring, a wired model is generally the better choice for reliability.',
  },
];

const RELATED = [
  {
    category: 'Smart Home',
    title: 'Ring Doorbell Troubleshooting Guides — already set up but having issues?',
    href: '/fix/smart-home/ring-doorbell',
  },
  {
    category: 'Smart Home',
    title: 'Ring Doorbell Not Working with Alexa',
    href: '/fix/smart-home/ring-doorbell-not-working-with-alexa',
  },
  {
    category: 'Setup Guides',
    title: 'How to Set Up a Nest Thermostat with Google Home',
    href: '/setup/nest-thermostat-with-google-home',
  },
];

export default function RingSetupPage() {
  return (
    <>
      <SeoSchema
        howToName="How to Set Up a Ring Doorbell with Alexa"
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
              How to Set Up a Ring Doorbell with Alexa
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Get your Ring Doorbell online, connected to WiFi, and linked to Alexa — covering
              both battery and wired models.
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
            heading="Getting stuck on WiFi pairing or the Alexa Skill?"
            body="Describe what's happening and our AI will walk you through the specific step that's failing."
            chatLink="/chat?device=ring-doorbell&issue=setup"
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
            body="Our AI can walk you through Ring app setup, WiFi pairing issues, and Alexa Skill linking — describe the problem and get a targeted fix."
            chatLink="/chat?device=ring-doorbell"
          />
        </div>
      </div>
    </>
  );
}
