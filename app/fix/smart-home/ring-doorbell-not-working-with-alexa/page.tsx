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
import { AlertCircle, User, Shield, WifiOff } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Ring Doorbell Not Working with Alexa? Here's How to Fix It | MyTech-Fix",
  description:
    "Ring Doorbell stopped working with Alexa? The Ring Alexa Skill has disconnected. Disable and re-enable the skill — most connections restore in under 5 minutes.",
  alternates: {
    canonical: `${BASE}/fix/smart-home/ring-doorbell-not-working-with-alexa`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Smart Home', href: '/fix/smart-home' },
  { label: 'Ring Doorbell Not Working with Alexa' },
];

const WHY =
  "Ring and Amazon Alexa are both Amazon products, but they connect through the Ring Alexa Skill — a bridge that can lose its authorization after a Ring account password change, an app update, or a routine re-authentication request from Amazon. When the skill disconnects, Alexa loses the ability to see or announce Ring events.";

const TLDR = [
  "Disable and re-enable the Ring Alexa Skill in the Alexa app — this resets the auth token and restores most broken connections.",
  "The Ring account and Amazon account must match across both apps — account mismatch is a common silent failure.",
  "After re-enabling the skill, say 'Alexa, discover devices' to force Alexa to sync the Ring doorbell.",
  "In the Ring app, confirm Alexa announcements are enabled under Control Center > Alexa.",
];

const CAUSES = [
  {
    icon: AlertCircle,
    title: 'Ring Alexa Skill has lost its authorization',
    description:
      "The Ring Alexa Skill uses an OAuth token to maintain its connection to your Ring account. This token can be invalidated after a Ring account password change, a Ring or Alexa app update, or an Amazon-side re-authentication cycle. When it expires, Alexa loses all visibility into your Ring devices — live view, announcements, and voice commands all stop working.",
    likelihood: 'likely' as const,
  },
  {
    icon: User,
    title: 'Echo and Ring registered to different Amazon accounts',
    description:
      "Ring and Alexa both operate within Amazon's ecosystem, but they must be connected to the same Amazon account for the skill to function. If you have multiple Amazon accounts — or if a household member set up the Echo under a different account — the Ring skill won't be able to bridge them.",
    likelihood: 'common' as const,
  },
  {
    icon: Shield,
    title: 'Ring app notification or Alexa announcement settings are off',
    description:
      "Even with the Ring Alexa Skill correctly linked, Alexa announcements require that Live View and Alexa-specific announcements are enabled within the Ring app's Control Center. If these permissions were toggled off — during a Ring app update or after a privacy settings review — Alexa won't receive Ring events.",
    likelihood: 'common' as const,
  },
  {
    icon: WifiOff,
    title: 'Echo device has lost its connection to Alexa cloud services',
    description:
      "Occasionally, a specific Echo device loses its connection to Alexa's cloud while the Alexa app on your phone still shows everything as linked. A restart of the Echo device (unplug, wait 30 seconds, plug back in) resolves this by forcing it to re-authenticate with Alexa's servers.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Disable and re-enable the Ring Alexa Skill',
    description:
      "Open the Alexa app, tap More (bottom right) > Skills & Games. Search for 'Ring' and tap the Ring skill. If it shows as enabled, tap 'Disable Skill.' Wait 30 seconds. Then tap 'Enable to Use' and sign in with your Ring account credentials when prompted. This resets the OAuth token and restores the authorization bridge.",
    tip: "Don't just re-enable without disabling first — the existing broken token needs to be cleared before a new one can be issued.",
  },
  {
    title: 'Confirm your Echo and Ring account are the same Amazon account',
    description:
      "In the Alexa app, tap the profile icon (bottom right) and note the email address shown — this is your Amazon account. In the Ring app, tap the hamburger menu > Account and check the email address there. Both must match. If they don't, you'll need to either re-register one of the devices or use a single Amazon account for both.",
  },
  {
    title: "Say 'Alexa, discover devices' to force a Ring sync",
    description:
      "After re-enabling the Ring skill, open the Alexa app and tap Devices > '+' > Add Device and let Alexa run a scan, or simply say 'Alexa, discover devices' to your Echo. This forces Alexa to query the Ring skill for all associated Ring devices and populate them in the Alexa device list.",
  },
  {
    title: 'Check for your Ring doorbell in the Alexa device list',
    description:
      "In the Alexa app, go to Devices and scroll to find your Ring doorbell (it may be listed under 'Cameras' or 'Doorbells'). If it doesn't appear after discovery, open Ring app > Control Center > Alexa and confirm Alexa is authorized and announcements are toggled on.",
  },
  {
    title: "Test with 'Alexa, show the front door'",
    description:
      "On an Echo Show, Echo Spot, or Alexa-enabled Fire TV, say 'Alexa, show the [camera name from Ring app].' If this returns a 'device not found' error, the skill needs to be re-linked from Step 1. If the live feed appears, the integration is working — doorbell press announcements should also now work on all your Echo speakers.",
  },
  {
    title: 'Enable Alexa announcements in the Ring app',
    description:
      "Open the Ring app > tap the three-line menu > Control Center > Alexa. Confirm that 'Alexa Greetings' or 'Announcements' are toggled on. Also confirm the specific doorbell device has Alexa announcements enabled in its device settings. Without this, Alexa may be linked but won't announce doorbell presses.",
  },
];

const FAQS = [
  {
    question: 'Why does Alexa no longer announce when someone rings my doorbell?',
    answer:
      "The Ring Alexa Skill's authorization token has expired or been reset — this commonly happens after a Ring account password change, an Alexa or Ring app update, or a routine re-authentication request from Amazon. Disabling and re-enabling the Ring skill in the Alexa app (More > Skills & Games > Ring) resets the token and restores announcements within minutes.",
  },
  {
    question: 'Can I see my Ring doorbell on an Echo Show?',
    answer:
      "Yes. Once the Ring Alexa Skill is linked, say 'Alexa, show the [camera name]' on any Echo Show, Echo Spot, or Alexa-enabled Fire TV to see the live camera feed. Use the exact camera name set in the Ring app. You can also ask 'Alexa, show recent Ring activity' to see recorded events.",
  },
  {
    question: 'Do Ring and Alexa need to be on the same Amazon account?',
    answer:
      "Yes — both the Ring account and the Amazon/Alexa account must be the same Amazon account for the Ring Alexa Skill to function. If you have multiple Amazon accounts (e.g., personal and work), make sure both the Ring app and the Alexa app are signed into the same one. You can check in both apps by looking at the email address shown in each app's account settings.",
  },
  {
    question: 'What can Alexa do with Ring after linking?',
    answer:
      "After linking the Ring skill: Alexa announces doorbell presses and motion events on enabled Echo speakers, you can view live camera feeds on Echo Show and Fire TV devices, two-way audio is available on some models, and you can ask Alexa to show your Ring feed at any time. You can also create Alexa Routines that trigger Ring doorbell events — for example, turning on smart lights when motion is detected.",
  },
];

const RELATED = [
  {
    category: 'Ring Doorbell',
    title: 'All Ring Doorbell troubleshooting guides →',
    href: '/fix/smart-home/ring-doorbell',
  },
  {
    category: 'Smart Home',
    title: 'Nest Thermostat Not Showing in Google Home',
    href: '/fix/smart-home/nest-thermostat-not-showing-in-google-home',
  },
  {
    category: 'Smart Home',
    title: 'Wyze Cam Not Working with Google Home',
    href: '/fix/smart-home/wyze-cam-not-working-with-google-home',
  },
  {
    category: 'AI Diagnosis',
    title: "Can't find your issue? Ask our AI →",
    href: '/chat',
  },
];

export default function RingNotWorkingWithAlexaPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Ring Doorbell Not Working with Alexa"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Ring Doorbell Not Working with Alexa? Here&rsquo;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The Ring Alexa Skill has lost its authorization. Disable and re-enable it — most
              connections restore in under 5 minutes.
            </p>
          </header>

          <TLDRBox points={TLDR} />

          <div className="mb-10 rounded-2xl border border-white/10 bg-card/60 px-6 py-5">
            <h2 className="font-sora text-base font-semibold text-slate-200 mb-2">
              Why this happens
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">{WHY}</p>
          </div>

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
            heading="Still not working with Alexa after re-linking?"
            body="Our AI can walk through your skill setup, account matching, and Ring app permissions to find what's blocking it."
            chatLink="/chat?device=ring-doorbell&issue=alexa"
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
            heading="Still having trouble?"
            body="Tell our AI what happens when you test Alexa — it'll give you a targeted fix for your specific Echo and Ring model."
            chatLink="/chat?device=ring-doorbell"
          />
        </div>
      </div>
    </>
  );
}
