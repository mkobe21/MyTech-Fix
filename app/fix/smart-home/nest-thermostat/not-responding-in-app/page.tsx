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
import { WifiOff, User, RefreshCw, Clock } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Nest Thermostat Not Responding in the App? Try This | MyTech-Fix',
  description:
    "Google Home app shows your Nest Thermostat as 'Not responding'? The thermostat may still be controlling your HVAC. Here's how to restore app control.",
  alternates: {
    canonical: `${BASE}/fix/smart-home/nest-thermostat/not-responding-in-app`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Nest Thermostat', href: '/fix/smart-home/nest-thermostat' },
  { label: 'Nest Thermostat Not Responding in App' },
];

const TLDR = [
  "The thermostat can still control your HVAC locally even when the app shows 'Not responding.'",
  "Force-close and reopen the Google Home app — many 'not responding' states clear on a fresh app session.",
  "Log out and back in to your Google account in the app to refresh the device sync.",
  "If the thermostat shows connected on its display but the app still won't respond, re-add it in Google Home.",
];

const CAUSES = [
  {
    icon: WifiOff,
    title: "Thermostat has lost its WiFi connection",
    description:
      "The most common reason the app can't control the thermostat is a dropped WiFi connection — the thermostat can't send or receive commands from Google's servers. Crucially, it will still control your HVAC using its existing schedule. Check the thermostat's display for a WiFi status icon before assuming the app itself is at fault.",
    likelihood: 'likely' as const,
  },
  {
    icon: User,
    title: 'Google account session in the app has expired',
    description:
      "Google Home app sessions can expire silently, causing the app to show devices as unresponsive even when they're online. Force-closing the app and logging out, then back in, re-establishes the session and restores real-time device communication.",
    likelihood: 'common' as const,
  },
  {
    icon: RefreshCw,
    title: 'Google Home app needs updating',
    description:
      "An outdated version of the Google Home app can lose compatibility with current Nest firmware. Google periodically updates both the app and the cloud API — if the app is significantly out of date, it may fail to display device status correctly or appear to time out on commands.",
    likelihood: 'common' as const,
  },
  {
    icon: Clock,
    title: 'Temporary server-side sync delay',
    description:
      "Changes made on the thermostat can take 30–90 seconds to reflect in the Google Home app. If you adjusted the temperature physically and then immediately checked the app, the brief lag can look like an unresponsive device. Waiting a minute and refreshing the app is all that's needed in this case.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: "Check the thermostat's display for a WiFi indicator",
    description:
      "Wake the thermostat display and look for the WiFi icon — typically in the corner of the screen or visible when you navigate to Settings > Wi-Fi. A solid WiFi icon means the thermostat is connected. No icon or a disconnected symbol means WiFi is the issue — follow the WiFi guide first before troubleshooting the app.",
  },
  {
    title: 'Force-close and reopen the Google Home app',
    description:
      "On iOS: swipe up from the bottom and swipe the Google Home app card away. On Android: go to Recent Apps and swipe it away, or go to Settings > Apps > Google Home > Force Stop. Reopen the app and check whether the thermostat's card now shows a current temperature and responds to taps.",
  },
  {
    title: 'Log out of your Google account in the app and log back in',
    description:
      "In the Google Home app, tap your profile icon (top right) > Settings > tap your account name > Sign out. Wait 10 seconds, then sign back in with the same Google account. This refreshes the OAuth session between the app and Google's device servers. After signing back in, pull down to refresh the home screen.",
  },
  {
    title: 'Update the Google Home app to the latest version',
    description:
      "Open the App Store (iOS) or Google Play Store (Android), search for 'Google Home,' and install any available update. After updating, force-close the app and reopen it. Google Home app updates frequently add compatibility fixes for Nest device communication.",
  },
  {
    title: "Verify the thermostat is connected to WiFi from its own display",
    description:
      "On the thermostat: Settings > Wi-Fi. Confirm the display shows your network name and a connected status. If it shows 'Not connected,' resolve the WiFi issue first — app control can't work without a live cloud connection. If it shows connected but the app still won't respond, continue to the next step.",
  },
  {
    title: 'Remove and re-add the thermostat in Google Home',
    description:
      "In the Google Home app, tap your thermostat's device card, tap the gear icon (Settings), scroll down and tap 'Remove device.' Then from your home screen tap '+' > Set up device > New device and follow the guided setup to re-add the thermostat. This re-links the device to your account without factory-resetting the thermostat or clearing its schedule.",
    tip: "Removing and re-adding does not delete your heating/cooling schedule or preferences — those are stored on the thermostat itself.",
  },
];

const FAQS = [
  {
    question: "What does 'Not responding' mean in the Google Home app?",
    answer:
      "'Not responding' means the Google Home app can't get a reply from the thermostat through Google's cloud servers. This can happen when the thermostat is offline, your app session is stale, or there's a temporary cloud sync issue. The thermostat itself may be working fine and controlling your HVAC — check the thermostat's display directly to confirm its actual state.",
  },
  {
    question: 'Can I control my Nest Thermostat if the app shows it as offline?',
    answer:
      "No — app and voice control require a live cloud connection. If the thermostat is offline, remote control isn't available until it reconnects. However, you can still adjust temperature and settings directly on the thermostat's display using its ring (on Learning Thermostats) or touchscreen (on the 2020 model) — the thermostat continues running its existing schedule and responds to manual adjustments.",
  },
  {
    question: "Why does my Nest Thermostat work on the wall but show as offline in the app?",
    answer:
      "The thermostat has a local control mode that's independent of its cloud connection. It will follow its existing schedule and respond to manual adjustments even when it can't reach Google's servers. The app shows 'offline' or 'not responding' because it can't sync via the cloud — but the thermostat's heating and cooling functions are unaffected.",
  },
  {
    question: 'How do I re-add a Nest Thermostat to Google Home without a factory reset?',
    answer:
      "In the Google Home app, go to your thermostat device > tap the gear icon > Remove device. Then tap '+' > Set up device > New device on your home screen and follow the guided setup. This re-links the thermostat to your account without clearing any settings, schedules, or preferences — those are stored locally on the thermostat and aren't affected by the re-add process.",
  },
];

const RELATED = [
  {
    category: 'Nest Thermostat',
    title: 'Nest Thermostat Showing Offline',
    href: '/fix/smart-home/nest-thermostat/offline',
  },
  {
    category: 'Nest Thermostat',
    title: "Nest Thermostat Won't Connect to WiFi",
    href: '/fix/smart-home/nest-thermostat/wont-connect-to-wifi',
  },
  {
    category: 'Nest Thermostat',
    title: 'Nest Thermostat Firmware Update Stuck',
    href: '/fix/smart-home/nest-thermostat/firmware-update-stuck',
  },
  {
    category: 'Nest Thermostat Guides',
    title: 'All Nest Thermostat troubleshooting guides →',
    href: '/fix/smart-home/nest-thermostat',
  },
];

export default function NestThermostatNotRespondingPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Nest Thermostat Not Responding in the App"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Nest Thermostat Not Responding in the App? Try This
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              &ldquo;Not responding&rdquo; in Google Home is usually a stale app session or a dropped
              WiFi connection. The thermostat is likely still heating or cooling normally.
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
            heading="App still not responding after these steps?"
            body="Our AI can walk through your account setup, thermostat connection status, and Google Home sync to find the exact issue."
            chatLink="/chat?device=nest-thermostat&issue=app-not-responding"
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
            heading="Still having trouble with your Nest Thermostat?"
            body="Describe what the app shows and what you've tried — our AI will give you a targeted fix."
            chatLink="/chat?device=nest-thermostat"
          />
        </div>
      </div>
    </>
  );
}
