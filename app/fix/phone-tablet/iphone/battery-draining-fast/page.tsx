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
import { Activity, Smartphone, Battery, RefreshCw } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'iPhone Battery Draining Fast? Here\'s How to Fix It | MyTech-Fix',
  description:
    "iPhone battery dying too fast? Check Battery Usage by App first — one app running excessive background activity is usually the cause. Here's how to find and fix it.",
  alternates: {
    canonical: `${BASE}/fix/phone-tablet/iphone/battery-draining-fast`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Phone & Tablet', href: '/fix/phone-tablet' },
  { label: 'iPhone', href: '/fix/phone-tablet/iphone' },
  { label: 'iPhone Battery Draining Fast' },
];

const TLDR = [
  "Go to Settings > Battery > Battery Usage by App — look for any app consuming disproportionately more battery than expected in the last 24 hours.",
  "Check Settings > Battery > Battery Health & Charging: if Maximum Capacity is significantly below 100% (especially under 80%), degradation explains the fast drain.",
  "Turn off 'Always' location access for apps that don't need it: Settings > Privacy & Security > Location Services.",
  "Restart the iPhone fully — this clears stuck background processes that can silently consume battery without appearing in app-level stats.",
];

const CAUSES = [
  {
    icon: Activity,
    title: 'A specific app is running excessive background activity',
    description:
      "One misbehaving app is the most common cause of sudden or unexplained battery drain. Apps can run background tasks — syncing, processing, fetching updates — in ways that consume far more battery than their foreground use would suggest. iOS tracks per-app battery usage over the last 24 hours and 10 days, making it easy to identify the culprit. Social media apps, email clients, and recently updated apps are the most common offenders.",
    likelihood: 'likely' as const,
  },
  {
    icon: Smartphone,
    title: 'Location Services, Background App Refresh, or push notifications running constantly',
    description:
      "Several system settings, if misconfigured, drain battery continuously. Location Services set to 'Always' for multiple apps keep the GPS radio active. Background App Refresh lets apps update their content while not in use — useful for a few apps, unnecessary for most. Push notifications from many apps require constant network connectivity. Each alone is modest; together, they account for substantial background drain.",
    likelihood: 'common' as const,
  },
  {
    icon: Battery,
    title: 'Battery health has degraded with age',
    description:
      "Every iPhone battery has a finite number of charge cycles before it begins losing capacity. A battery at 85% health holds 15% less charge than when new; at 79%, iOS may enable performance management (formerly 'throttling') to prevent unexpected shutdowns. Battery degradation is gradual and normal — a two-year-old iPhone used daily will typically show 80–90% capacity. If fast drain has worsened slowly over months rather than appearing suddenly, degradation is likely the primary cause.",
    likelihood: 'common' as const,
  },
  {
    icon: RefreshCw,
    title: 'A stuck process following a botched iOS update',
    description:
      "After an iOS update, the system performs indexing, re-analysis of photos, and various background maintenance tasks that temporarily increase battery drain for 24–48 hours. Occasionally, one of these processes gets stuck and continues running indefinitely, draining battery without appearing prominently in per-app battery stats. A full restart forces these processes to either complete or terminate.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Check Battery Usage by App to find the culprit',
    description:
      "Go to Settings > Battery and scroll to 'Battery Usage by App.' Tap 'Last 24 Hours' and look at the percentage next to each app. One app consuming 30%+ of total usage while another comparable app uses 5% is a clear signal of excessive background activity. Also check the 'Background Activity' indicator under each app name — this appears when an app is consuming battery while not in use.",
    tip: "Tap 'Show Activity' in the top right of the app list to see how much time each app ran in the foreground vs. background — this distinguishes heavy use from runaway background processes.",
  },
  {
    title: 'Check Battery Health to rule out degradation',
    description:
      "Go to Settings > Battery > Battery Health & Charging. Look at 'Maximum Capacity' — this shows your battery's capacity relative to when it was new. Apple considers batteries below 80% significantly degraded. If you see a 'Performance Management' or 'Battery Health' recommendation message, your battery has already been flagged. Batteries below 80% can be replaced at an Apple Store or Apple Authorized Service Provider, sometimes for free under warranty.",
  },
  {
    title: 'Review and restrict Location Services',
    description:
      "Go to Settings > Privacy & Security > Location Services. Tap through each app and check its setting. For most apps, 'While Using the App' is the appropriate choice — 'Always' should be limited to apps that genuinely need background location (navigation, fitness tracking, Find My). Changing weather apps, social media, and delivery apps from 'Always' to 'While Using' or 'Never' can meaningfully reduce background battery use.",
  },
  {
    title: 'Turn off Background App Refresh for most apps',
    description:
      "Go to Settings > General > Background App Refresh. You can turn it off entirely, or leave it on globally and disable it per app. For apps where fresh content when you open them matters (email, news), leaving it on is reasonable. For games, shopping, and social apps you don't check constantly, disabling it saves battery without any practical downside — the app will simply refresh when you open it.",
  },
  {
    title: 'Restart the iPhone fully',
    description:
      "A full restart clears all in-memory state including any processes stuck from a recent iOS update. On iPhone X and later: press and hold the side button and either volume button until the power slider appears, drag to power off, wait 30 seconds, then hold the side button to restart. On iPhone SE (3rd gen): hold the side button. After restart, monitor battery for 24 hours before concluding a deeper issue exists.",
  },
  {
    title: 'Investigate and remove the highest-consuming app if it persists',
    description:
      "If one app consistently tops the battery usage list and the problem started after updating that app, check the App Store for a newer update that may include a fix. If no update is available, offload the app temporarily: Settings > General > iPhone Storage > tap the app > Offload App. This removes the app but keeps its data. Reinstall it after a few days to check if an update has been released that addresses the issue.",
  },
];

const FAQS = [
  {
    question: 'How do I know if my iPhone battery health is bad?',
    answer:
      "Go to Settings > Battery > Battery Health & Charging and check 'Maximum Capacity.' Apple considers anything below 80% significantly degraded. At that level, the battery holds 20% less charge than when new, and iOS may have enabled performance management to prevent unexpected shutdowns. You may also see a message recommending battery service. Batteries degrade gradually — most iPhones reach 80% capacity after 500–1000 full charge cycles, roughly 2–3 years of typical daily use.",
  },
  {
    question: 'Which apps drain iPhone battery the most?',
    answer:
      "Apps that drain the most battery are typically: video streaming apps (Netflix, YouTube, TikTok) during active use, social media apps (Instagram, Facebook, TikTok) due to background refresh and video autoplay, navigation apps (Google Maps, Apple Maps) with always-on GPS, and email apps set to push delivery. The most useful diagnostic is Settings > Battery > Battery Usage by App — this shows your actual usage rather than a generic list.",
  },
  {
    question: 'Does a new iOS update cause battery drain?',
    answer:
      "Yes, temporarily. After a major iOS update, the iPhone performs background indexing, photo re-analysis, app re-compilation, and iCloud sync that can increase drain for 24–72 hours. This is expected and resolves on its own. If drain remains high after 3 days, it may indicate a persistent stuck process (fix: full restart) or a regression in the iOS version itself (fix: wait for a point update from Apple).",
  },
  {
    question: 'Should I replace my iPhone battery?',
    answer:
      "Battery replacement is worth considering when Maximum Capacity falls below 80%, or when you're recharging significantly more often than you used to despite no change in usage habits. Apple charges a flat fee for out-of-warranty battery replacement (check apple.com/support for current pricing by model). iPhones with AppleCare+ may be covered. Third-party battery replacement is cheaper but can void remaining warranty and may affect Battery Health reporting.",
  },
];

const RELATED = [
  {
    category: 'iPhone',
    title: "iPhone Won't Connect to WiFi",
    href: '/fix/phone-tablet/iphone/wont-connect-to-wifi',
  },
  {
    category: 'iPhone',
    title: "iPhone Bluetooth Won't Pair",
    href: '/fix/phone-tablet/iphone/bluetooth-wont-pair',
  },
  {
    category: 'iPhone',
    title: 'iPhone Storage Full Error',
    href: '/fix/phone-tablet/iphone/storage-full-error',
  },
  {
    category: 'iPhone Guides',
    title: 'All iPhone troubleshooting guides →',
    href: '/fix/phone-tablet/iphone',
  },
];

export default function IPhoneBatteryDrainingFastPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix iPhone Battery Draining Fast"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              iPhone Battery Draining Fast? Here&rsquo;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Check Battery Usage by App first — one app running excessive background activity
              is the most common cause and the easiest to fix.
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
            heading="Battery still draining unusually fast after these steps?"
            body="Our AI can help you review your Battery Usage data and identify what's consuming the most power on your specific iPhone."
            chatLink="/chat?device=iphone&issue=battery"
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
            heading="Still having trouble with your iPhone?"
            body="Tell our AI your iPhone model, iOS version, and Battery Health percentage — it'll give you a targeted fix for your specific situation."
            chatLink="/chat?device=iphone"
          />
        </div>
      </div>
    </>
  );
}
