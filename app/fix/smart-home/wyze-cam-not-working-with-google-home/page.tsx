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
import { RefreshCw, Lock, WifiOff, HardDrive } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Wyze Cam Not Working with Google Home? Here's the Fix | MyTech-Fix",
  description:
    "Wyze camera not showing in Google Home or live stream not working? The Wyze integration has disconnected. Re-link it — most issues resolve in under 5 minutes.",
  alternates: {
    canonical: `${BASE}/fix/smart-home/wyze-cam-not-working-with-google-home`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Smart Home', href: '/fix/smart-home' },
  { label: 'Wyze Cam Not Working with Google Home' },
];

const WHY =
  "Wyze cameras connect to Google Home through the 'Wyze for Google Home' integration, which uses an OAuth link between your Wyze account and Google. This link can break after a Wyze or Google Home app update, a Wyze account password change, or a routine re-authentication cycle. When it does, the camera disappears from Google Home or shows 'Unavailable' even though it works fine in the Wyze app.";

const TLDR = [
  "Confirm the camera is online in the Wyze app first — Google Home can't stream a camera that's offline in Wyze.",
  "Unlink and re-link the Wyze integration in Google Home > Works with Google — app updates commonly break the session.",
  "After re-linking, say 'Hey Google, show [camera name]' to test — if unrecognized, simplify the camera name in Wyze.",
  "Keep both the Wyze app and Google Home app updated to prevent repeated integration drops.",
];

const CAUSES = [
  {
    icon: RefreshCw,
    title: 'Wyze for Google Home integration has disconnected',
    description:
      "The Wyze Google Home integration uses an OAuth session that can be invalidated by a Wyze app update, a Google Home update, or a routine token refresh failure. When the session breaks, cameras disappear from Google Home or return 'Unavailable' when you try to stream them. Unlike a broken WiFi connection, this is entirely an account-link issue — the cameras are online in Wyze but inaccessible to Google Home.",
    likelihood: 'likely' as const,
  },
  {
    icon: Lock,
    title: 'Wyze account password was recently changed',
    description:
      "Changing your Wyze account password invalidates all active third-party OAuth sessions, including the one Google Home uses. This is by design — it revokes external access as a security measure. After a password change, you need to re-link the Wyze integration in Google Home using your new credentials.",
    likelihood: 'common' as const,
  },
  {
    icon: WifiOff,
    title: 'Camera is offline in the Wyze app',
    description:
      "If the camera itself is offline (power loss, WiFi issue, or firmware update in progress), Google Home will show it as unavailable regardless of the integration status. Google Home streams Wyze cameras through Wyze's cloud — if the camera isn't online in Wyze, there's nothing to stream. Fix the camera's connectivity in the Wyze app first before troubleshooting the Google Home integration.",
    likelihood: 'common' as const,
  },
  {
    icon: HardDrive,
    title: 'Cached session data needs to be cleared',
    description:
      "In some cases, stale cached session data in either the Wyze app or the Google Home app can prevent the integration from functioning even after re-linking. Clearing the Wyze app's cache (or reinstalling it) forces a clean re-authentication and resolves integration issues that persist after standard re-linking steps.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Confirm the camera is online in the Wyze app',
    description:
      "Open the Wyze app and check that your camera shows a live preview and is not showing 'Offline' or a yellow warning badge. If the camera is offline, troubleshoot its power and WiFi connection first — the Wyze for Google Home integration streams through Wyze's cloud, and Google Home cannot access a camera that isn't connected to Wyze.",
  },
  {
    title: 'Unlink the Wyze integration in Google Home',
    description:
      "In the Google Home app, go to Settings (gear icon) > Works with Google. Find 'Wyze' in the list of linked services. Tap it, then tap Disconnect or Unlink. Wait 30 seconds after unlinking — this gives Google's servers time to clear the old session before you establish a new one.",
    tip: "If you don't see Wyze in the linked services list, skip this step and go directly to Step 3 to link it for the first time.",
  },
  {
    title: 'Re-link the Wyze integration',
    description:
      "In the Google Home app, tap '+' > Set up device > Works with Google. Search for 'Wyze' and tap the result. On the Wyze authorization screen, sign in with your Wyze account email and password and tap Authorize. Google Home will then sync your Wyze cameras into its device list.",
  },
  {
    title: 'Let Google Home discover your Wyze cameras',
    description:
      "After linking, Google Home will automatically discover your Wyze cameras from the integration. This takes 1–2 minutes. Pull down on the Google Home main screen to force a sync. When the cameras appear, tap each one to assign it to a room — room assignment is needed for room-specific voice commands.",
  },
  {
    title: "Test with 'Hey Google, show [camera name]'",
    description:
      "On a Google Nest Hub or a Chromecast-connected TV, say 'Hey Google, show [camera name]' using the exact name set in the Wyze app. If Google says it can't find the device, the camera name in Wyze may have special characters or spaces that Google Assistant has trouble recognizing. Simplify it in the Wyze app (tap the camera > edit pencil icon) and re-test.",
    tip: "Camera names like 'Front Door' and 'Backyard' work well. Names like 'Front Door (Left)' or names with apostrophes can cause recognition issues.",
  },
  {
    title: "Clear Wyze app cache and reinstall if issues persist",
    description:
      "If the integration breaks again shortly after re-linking, clear the Wyze app's cache: on Android, go to Settings > Apps > Wyze > Storage > Clear Cache. On iOS, offload and reinstall the Wyze app. Then re-link the Google Home integration from Step 2. Also ensure both the Wyze app and Google Home app are on their latest versions — frequent updates on both sides are a common root cause of integration breaks.",
  },
];

const FAQS = [
  {
    question: 'Can I view my Wyze cam on a Google Nest Hub?',
    answer:
      "Yes — once the Wyze for Google Home integration is linked, say 'Hey Google, show [camera name]' on any Google Nest Hub, Nest Hub Max, or a TV with Chromecast to start the live stream. Use the exact camera name from the Wyze app. If Google can't find it, simplify the name in the Wyze app to remove special characters and spaces.",
  },
  {
    question: 'Why does my Wyze cam keep disconnecting from Google Home?',
    answer:
      "Frequent disconnections are usually caused by app updates on either platform resetting the OAuth session. Both Wyze and Google Home release frequent updates, and each update can invalidate the integration token. Keep both apps updated, and if disconnections persist after every update, try clearing the Wyze app cache after each update before re-linking.",
  },
  {
    question: 'Does Wyze cam work with Google Home without a Wyze Cam Plus subscription?',
    answer:
      "Yes — the basic live streaming integration with Google Home works without a Wyze Cam Plus subscription. You can say 'Hey Google, show the front door' and view a live feed without any subscription. Cam Plus adds features like person detection, extended event clips, and cloud storage — but those don't affect the basic Google Home live view.",
  },
  {
    question: 'What should I name my Wyze camera for Google Home?',
    answer:
      "Use a simple, descriptive name with no special characters — 'Front Door,' 'Backyard,' or 'Living Room' work well. Avoid apostrophes, hyphens, parentheses, or numbers at the start of names, as these can cause Google Assistant to misrecognize the camera. Set the name in the Wyze app (tap the camera > pencil icon), then re-link the integration so the new name appears in Google Home.",
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

export default function WyzeCamGoogleHomePage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Wyze Cam Not Working with Google Home"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Wyze Cam Not Working with Google Home? Here&rsquo;s the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The Wyze for Google Home integration has disconnected. Unlinking and re-linking it
              restores live streaming and voice control in under 5 minutes.
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
            heading="Still not working with Google Home?"
            body="Our AI can check your Wyze integration status, camera online state, and account link to find what's blocking the connection."
            chatLink="/chat?device=wyze-cam&issue=google-home"
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
            body="Tell our AI your camera model and what's happening in Google Home — it'll walk you through the specific integration fix."
            chatLink="/chat?device=wyze-cam"
          />
        </div>
      </div>
    </>
  );
}
