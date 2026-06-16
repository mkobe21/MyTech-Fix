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
import { RefreshCw, Lock, User, Clock } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Ecobee Thermostat Not Working with Google Home? Here's the Fix | MyTech-Fix",
  description:
    "Ecobee not showing up in Google Home or not responding to voice commands? The Works with Google account link has broken. Re-link it in under 3 minutes.",
  alternates: {
    canonical: `${BASE}/fix/smart-home/ecobee-not-working-with-google-home`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Smart Home', href: '/fix/smart-home' },
  { label: 'Ecobee Not Working with Google Home' },
];

const WHY =
  "Ecobee connects to Google Home through Google's 'Works with Google' integration — a separate OAuth link between your Ecobee account and your Google account. This link can silently break after an Ecobee password change, an app update, or a routine re-authentication cycle on Google's servers. When it does, the thermostat disappears from Google Home while continuing to work normally in the Ecobee app.";

const TLDR = [
  "Open Google Home > + > Set up device > Works with Google and search 'Ecobee' to re-link the integration.",
  "If already listed, unlink first and re-link — the connection needs a fresh auth token after a password change.",
  "Verify the thermostat is online in the Ecobee app first — an offline thermostat won't appear in Google Home.",
  "After linking, say 'Hey Google, set the thermostat to 70' as a test to confirm the integration is active.",
];

const CAUSES = [
  {
    icon: RefreshCw,
    title: '"Works with Google" link has expired or been invalidated',
    description:
      "The Works with Google integration uses an OAuth token that ties your Ecobee account to Google Home. This token can be invalidated after an Ecobee app update, a Google account update, or a routine server-side re-authentication. When the token expires, the Ecobee thermostat disappears from Google Home — it may still appear in the device list but show 'Disconnected' or 'Unavailable.'",
    likelihood: 'likely' as const,
  },
  {
    icon: Lock,
    title: 'Ecobee account password was recently changed',
    description:
      "Changing your Ecobee password invalidates all active third-party OAuth tokens, including the one Google Home uses to communicate with your thermostat. This is a security feature — but it means that any time you change your Ecobee password, you need to re-link the Works with Google integration from scratch.",
    likelihood: 'common' as const,
  },
  {
    icon: User,
    title: 'Linked to a different Ecobee or Google account',
    description:
      "If you have multiple Google accounts or if someone in the household set up Google Home under a different account, the Works with Google link may be pointing to the wrong Ecobee account. The thermostat must be linked to the Ecobee account that owns the device, and the Google Home app must be signed into the Google account you want to use for voice control.",
    likelihood: 'common' as const,
  },
  {
    icon: Clock,
    title: 'Google Home sync delay after re-linking',
    description:
      "After re-establishing the Works with Google connection, Google Home can take 2–5 minutes to sync and surface the Ecobee thermostat in the device list. If the thermostat doesn't appear immediately after re-linking, pull to refresh on the Google Home home screen and wait before assuming the link failed.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Confirm your Ecobee thermostat is online in the Ecobee app',
    description:
      "Open the Ecobee app on your phone and confirm your thermostat is showing its current temperature and responding to app commands. If the thermostat shows 'Offline' in the Ecobee app, fix that connectivity issue first — Google Home can only communicate with the thermostat through Ecobee's cloud, and an offline device won't appear in Google Home regardless of the Works with Google link.",
  },
  {
    title: 'Open Google Home and start the Works with Google flow',
    description:
      "In the Google Home app, tap the '+' button (top left) > Set up device > Works with Google. This opens the third-party integration browser. Search for 'Ecobee' in the search bar and tap the Ecobee result to begin the account linking flow.",
  },
  {
    title: 'Unlink existing Ecobee integration if already connected',
    description:
      "If you already see Ecobee listed in Works with Google services (Settings > Works with Google > scroll to find Ecobee), tap it and choose Disconnect before re-linking. This clears the broken OAuth token. Wait 30 seconds after disconnecting before re-linking — this gives Google's servers time to invalidate the old token.",
    tip: "If the Ecobee entry shows 'Connected' but the thermostat is still unresponsive in Google Home, disconnecting and re-linking is still the right fix — 'Connected' can persist even when the underlying token has expired.",
  },
  {
    title: 'Sign in to your Ecobee account to authorize the link',
    description:
      "Tap 'Link' or 'Authorize' on the Ecobee Works with Google screen. You'll be redirected to sign in with your Ecobee credentials (not your Google credentials — these are two separate accounts). Sign in with the email and password for the Ecobee account that owns the thermostat, then tap Authorize to grant Google Home access.",
  },
  {
    title: 'Wait for the thermostat to appear and assign it to a room',
    description:
      "After authorizing, Google Home will sync with Ecobee's cloud and surface your thermostat. This takes 1–3 minutes. Pull down on the Google Home home screen to force a refresh. When the thermostat appears, tap it to assign it to a room (e.g., Living Room, Bedroom) — this is required for room-specific voice commands to work.",
  },
  {
    title: "Test with 'Hey Google, set the thermostat to 70 degrees'",
    description:
      "Say 'Hey Google, set the thermostat to 70 degrees' or 'Hey Google, what's the temperature?' to confirm the integration is active. If Google responds with the correct thermostat name or current temperature, the integration is working. If Google says it can't find the device, re-check that you signed into the correct Ecobee account in Step 4.",
  },
];

const FAQS = [
  {
    question: 'Can I control my Ecobee with Google Assistant after linking?',
    answer:
      "Yes — once linked, you can use voice commands like 'Hey Google, set the thermostat to 70 degrees,' 'Hey Google, what's the temperature?' and 'Hey Google, set the heat to 68.' If you have multiple thermostats, name them distinctly in the Ecobee app and use those names in Google Home — for example, 'Hey Google, set the upstairs thermostat to 72.'",
  },
  {
    question: 'Why does my Ecobee show in the Ecobee app but not Google Home?',
    answer:
      "The Ecobee app connects directly to Ecobee's cloud — but Google Home connects via a separate OAuth authorization. When this authorization breaks (after a password change or app update), the thermostat disappears from Google Home but continues working normally in the Ecobee app. Re-linking through Google Home's Works with Google setup restores visibility.",
  },
  {
    question: 'Will re-linking Ecobee to Google Home reset my thermostat schedule?',
    answer:
      "No — re-linking only refreshes the authorization between your Ecobee account and Google Home. Your thermostat's schedules, comfort settings (Home, Away, Sleep), eco thresholds, and Smart Home/Away settings are stored on the thermostat and in the Ecobee app. They're not affected by the Google Home connection status in any way.",
  },
  {
    question: 'Does Ecobee work with Google Assistant routines?',
    answer:
      "Yes. Once linked, you can include Ecobee thermostat control in Google Assistant routines. For example, a 'Good morning' routine can set the thermostat to a comfortable temperature, and a 'Leaving home' routine can switch it to Eco mode. Set up routines in the Google Home app under Automations — the Ecobee thermostat will appear as a controllable device after linking.",
  },
];

const RELATED = [
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
    category: 'Smart Home',
    title: 'Ring Doorbell Not Working with Alexa',
    href: '/fix/smart-home/ring-doorbell-not-working-with-alexa',
  },
  {
    category: 'AI Diagnosis',
    title: "Can't find your issue? Ask our AI →",
    href: '/chat',
  },
];

export default function EcobeeGoogleHomePage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Ecobee Thermostat Not Working with Google Home"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Ecobee Thermostat Not Working with Google Home? Here&rsquo;s the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The Works with Google account link has broken or expired. Re-linking it takes under
              3 minutes and restores full voice control.
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
            heading="Still not showing in Google Home?"
            body="Our AI can check your Works with Google connection, account status, and thermostat sync to find what's blocking it."
            chatLink="/chat?device=ecobee&issue=google-home"
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
            body="Describe your setup and what you've tried — our AI will give you a targeted fix for your Ecobee and Google Home configuration."
            chatLink="/chat?device=ecobee"
          />
        </div>
      </div>
    </>
  );
}
