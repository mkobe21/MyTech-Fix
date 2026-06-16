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
import { RefreshCw, User, Smartphone, Clock } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Nest Thermostat Not Showing in Google Home? Here's the Fix | MyTech-Fix",
  description:
    "Nest Thermostat disappeared from Google Home? The Works with Google account link has broken. Here's how to re-link it and get your thermostat back in minutes.",
  alternates: {
    canonical: `${BASE}/fix/smart-home/nest-thermostat-not-showing-in-google-home`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Smart Home', href: '/fix/smart-home' },
  { label: 'Nest Not Showing in Google Home' },
];

const WHY =
  "Nest thermostats and Google Home are both Google products, but they use separate account systems that need to be actively linked through the \"Works with Google\" integration. This link can silently break after a Google account update, an app update, or a password change — leaving your thermostat functional locally but invisible in Google Home.";

const TLDR = [
  "Open Google Home > + > Set up device > Works with Google and search 'Nest' to re-link the integration.",
  "Account mismatch is the most common cause — sign in with the same Google account your Nest is registered under.",
  "If linked but still missing, unlink Nest in Works with Google and re-add from scratch.",
  "If you set up using the original Nest app, you may need to migrate your Nest account to a Google account first.",
];

const CAUSES = [
  {
    icon: RefreshCw,
    title: '"Works with Google" connection has broken',
    description:
      "The Works with Google integration between Nest and Google Home uses an OAuth token that can expire or be invalidated after a Google account update, an app update, or a routine server-side re-authentication request. When this happens, the thermostat disappears from Google Home even though it continues working locally and in the Nest app.",
    likelihood: 'likely' as const,
  },
  {
    icon: User,
    title: 'Thermostat linked to a different Google account',
    description:
      "If you have multiple Google accounts — personal, work, or a legacy Nest account — the thermostat may be registered to a different account than the one used in the Google Home app. During the Works with Google linking flow, Google Home will only surface devices from the account you sign into at that moment.",
    likelihood: 'common' as const,
  },
  {
    icon: Smartphone,
    title: 'Thermostat set up via the legacy Nest app and not migrated',
    description:
      "Nest thermostats originally set up through the Nest app (before Google merged it with Google Home) use a separate Nest account. These devices won't appear in Google Home until the Nest account is migrated to a Google account. The migration process is one-directional and preserves all settings and schedule data.",
    likelihood: 'common' as const,
  },
  {
    icon: Clock,
    title: 'Temporary Google service sync delay',
    description:
      "Occasionally, a Google-side sync delay can cause a device to appear missing from Google Home even though the integration is intact. This typically resolves itself within an hour without any intervention. Waiting 2–3 minutes and force-refreshing the Google Home app is often enough.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Open Google Home and start the Works with Google flow',
    description:
      "In the Google Home app, tap the '+' button > Set up device > Works with Google. This opens the third-party device integration list. You can also reach it by searching for your thermostat in the Google Home device list — if it shows 'Unlinked' or has a warning badge, tap it to begin re-linking.",
  },
  {
    title: 'Search for "Nest" and select it',
    description:
      "In the Works with Google search bar, type 'Nest' and tap the Nest result. You may see 'Google Nest' listed — that's the correct one. On the next screen, tap 'Link' or 'Authorize' to start the account connection.",
  },
  {
    title: 'Sign in with the Google account your Nest is registered under',
    description:
      "When prompted, sign in with the Google account that owns the Nest thermostat. If you have multiple Google accounts on your phone, make sure you select the correct one — account mismatch is the most common reason the thermostat doesn't appear after re-linking. After signing in, authorize Google Home to access your Nest devices.",
    tip: "To confirm which account your Nest thermostat is registered to: open the Nest app (or Google Home) > tap your profile icon > check the email address shown.",
  },
  {
    title: 'Unlink and re-link if the thermostat still does not appear',
    description:
      "If you've re-linked but the thermostat still doesn't show: in Google Home, go to Settings > Works with Google > find Nest in the linked services list > tap Disconnect. Wait 30 seconds. Then return to the home screen, tap '+' > Set up device > Works with Google > Nest, and re-link with your correct credentials.",
  },
  {
    title: 'Migrate your Nest account if you used the original Nest app',
    description:
      "If you originally set up your thermostat in the standalone Nest app (before ~2020), you have a Nest account that hasn't been merged with Google. Open the Nest app > tap your profile icon > Account > Migrate to Google Account. Follow the steps to merge your Nest account into your Google account. After migration, the thermostat will appear in Google Home.",
    tip: "Migration is permanent and one-directional. Your schedule, settings, and history are preserved. The original Nest app continues to work post-migration.",
  },
  {
    title: 'Wait 2–3 minutes and pull to refresh',
    description:
      "After re-linking, the thermostat may take a minute or two to appear in Google Home as the account sync propagates. Pull down on the Google Home home screen to force a refresh. If it still doesn't appear after 5 minutes, tap '+' > Set up device again — sometimes a second refresh of the link triggers the device to populate.",
  },
];

const FAQS = [
  {
    question: 'Why did my Nest thermostat disappear from Google Home overnight?',
    answer:
      "The Works with Google account link silently expired or was reset — this can happen after a Google account update, an app update, or a server-side re-authentication on Google's end. Re-linking through Google Home (+ > Set up device > Works with Google > Nest) usually restores it within minutes without affecting your thermostat's settings or schedule.",
  },
  {
    question: 'Do I need the Nest app and the Google Home app?',
    answer:
      "Google has moved Nest thermostat management primarily into the Google Home app. The Nest app still works for some functions and is required if you haven't yet migrated your Nest account to a Google account. Once migrated, the Google Home app is the recommended primary interface — it handles scheduling, remote control, and routines.",
  },
  {
    question: 'Will re-linking my Nest thermostat in Google Home reset my schedule?',
    answer:
      "No. Re-linking only refreshes the authorization between Google Home and the Nest device. Your thermostat's heating and cooling schedule, eco temperatures, and home/away settings are stored on the thermostat itself — they're not affected by account link changes or disconnects.",
  },
  {
    question: "What does 'Works with Google' mean?",
    answer:
      "'Works with Google' is Google Home's integration framework for smart home devices — both Google's own products like Nest and third-party devices. It requires an active OAuth authorization between your Google account and your device account. When this authorization expires or is invalidated, the device appears to go missing from Google Home, even though it continues working locally.",
  },
];

const RELATED = [
  {
    category: 'Nest Thermostat',
    title: 'All Nest Thermostat troubleshooting guides →',
    href: '/fix/smart-home/nest-thermostat',
  },
  {
    category: 'Smart Home',
    title: 'Ring Doorbell Not Working with Alexa',
    href: '/fix/smart-home/ring-doorbell-not-working-with-alexa',
  },
  {
    category: 'Smart Home',
    title: 'Ecobee Not Working with Google Home',
    href: '/fix/smart-home/ecobee-not-working-with-google-home',
  },
  {
    category: 'AI Diagnosis',
    title: "Can't find your issue? Ask our AI →",
    href: '/chat',
  },
];

export default function NestNotInGoogleHomePage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Nest Thermostat Not Showing in Google Home"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Nest Thermostat Not Showing in Google Home? Here&rsquo;s the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The Works with Google account link has broken — a common occurrence after app
              updates or account changes. Re-linking takes under 3 minutes.
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
            body="Our AI can check your account linking, Works with Google status, and Nest migration state to find the issue."
            chatLink="/chat?device=nest-thermostat&issue=google-home"
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
            body="Describe your setup and the error message — our AI will walk you through the account linking fix specific to your Nest model."
            chatLink="/chat?device=nest-thermostat"
          />
        </div>
      </div>
    </>
  );
}
