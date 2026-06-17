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
import { Image, MessageSquare, HardDrive, AlertCircle } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'iPhone Storage Full? Here\'s How to Free Up Space Fast | MyTech-Fix',
  description:
    "iPhone saying storage is almost full? Photos and videos are almost always the biggest culprit. Here's how to identify what's taking space and free it up quickly.",
  alternates: {
    canonical: `${BASE}/fix/phone-tablet/iphone/storage-full-error`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Phone & Tablet', href: '/fix/phone-tablet' },
  { label: 'iPhone', href: '/fix/phone-tablet/iphone' },
  { label: 'iPhone Storage Full' },
];

const TLDR = [
  "Go to Settings > General > iPhone Storage for a full breakdown — photos, apps, and messages are almost always the top three categories.",
  "Enable Settings > Photos > Optimize iPhone Storage — this moves full-resolution photos to iCloud and keeps smaller versions on-device, freeing significant space immediately.",
  "Check the Recommendations section at the top of iPhone Storage — Apple identifies specific unused apps and oversized content you can remove in one tap.",
  "Delete and reinstall any app showing unusually large storage under Settings > General > iPhone Storage — reinstalling clears accumulated local cache without losing app data stored in the cloud.",
];

const CAUSES = [
  {
    icon: Image,
    title: 'Photos and videos accumulating without being backed up and removed',
    description:
      "Photos and 4K video are by far the largest storage consumers on most iPhones. A single minute of 4K/60fps video can exceed 400MB; a vacation week of shooting can fill gigabytes quickly. Without a backup-and-remove workflow — either through iCloud's Optimize Storage feature or manual export to a computer — photos accumulate indefinitely on-device and will eventually fill any storage size.",
    likelihood: 'likely' as const,
  },
  {
    icon: MessageSquare,
    title: 'Apps with large cached data — messaging apps, social media, browsers',
    description:
      "Many apps accumulate substantial local storage over time through cached content, downloaded media, and offline data. Messaging apps store all received photos, videos, and voice memos. Browsers cache website assets. Music and podcast apps download content for offline playback. Social media apps cache feeds and media. These caches grow silently — an app you installed months ago may be using 2–4GB of storage for content you've long since seen.",
    likelihood: 'common' as const,
  },
  {
    icon: HardDrive,
    title: '"Other" storage grows from caches, message attachments, and temporary files',
    description:
      "The 'Other' category in iPhone Storage represents system caches, Siri voice data, offline content from Safari and Maps, message attachments, and temporary files created by iOS and apps. This category can grow to several gigabytes on heavily used iPhones. Unlike app data, you can't directly delete 'Other' storage — but a device restart clears temporary files, and reducing Messages retention from 'Forever' to '30 Days' shrinks the attachments portion significantly.",
    likelihood: 'common' as const,
  },
  {
    icon: AlertCircle,
    title: 'A specific app has a bug causing excessive local data accumulation',
    description:
      "Occasionally, an app update introduces a bug that causes the app to write excessive data to local storage — logging, caching, or storing content it should be cleaning up. Settings > General > iPhone Storage will show the app's storage far higher than expected for what it does. Delete and reinstall the app to clear its local data immediately, and check the App Store for an update that may contain a fix.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Open iPhone Storage to see a full breakdown',
    description:
      "Go to Settings > General > iPhone Storage. Wait a few seconds for the analysis to complete. At the top you'll see a colored bar chart showing your storage by category (Apps, Photos, Media, Mail, Messages, etc.). Scroll down to see a full list of apps sorted by storage used. This tells you exactly what's taking space, which determines the fastest fix. Focus on whichever category is largest.",
  },
  {
    title: 'Enable Optimize iPhone Storage for Photos',
    description:
      "Go to Settings > Photos > iCloud Photos and make sure it's turned on, then select 'Optimize iPhone Storage.' This automatically uploads full-resolution originals to iCloud and replaces them on-device with smaller, space-saving versions that load the full resolution when needed. For users with large photo libraries, this can free 5–20GB or more immediately. iCloud storage starts at 50GB for a small fee if your free 5GB is already full.",
    tip: "If you don't use iCloud, you can also free photo storage by exporting your library to a computer (using Finder on Mac, or Windows Photos on PC), then deleting the originals from the iPhone after confirming the backup.",
  },
  {
    title: 'Review Apple\'s Recommendations in iPhone Storage',
    description:
      "At the top of the Settings > General > iPhone Storage screen, Apple shows personalized Recommendations based on your usage — 'Offload Unused Apps,' 'Review Large Attachments,' or 'Review iCloud Backup.' Tapping each shows exactly what will be removed and how much space it saves. 'Offload Unused Apps' is particularly useful — it removes apps you haven't opened in months but keeps their data in case you reinstall them.",
  },
  {
    title: 'Clear browser cache and review app-level storage',
    description:
      "In Settings > General > iPhone Storage, tap into your largest apps to see their storage breakdown (App Size vs. Documents & Data). For Safari, clear cache via Settings > Safari > Clear History and Website Data. For other apps, check if they have an in-app cache-clearing option in their settings. Some apps (like Spotify or Podcasts) let you manage downloaded content directly — delete downloads you no longer need.",
  },
  {
    title: 'Reduce Messages storage retention',
    description:
      "Go to Settings > Messages > Keep Messages. If it's set to 'Forever,' every photo, video, and attachment you've ever received in iMessage and SMS is stored on the device. Changing this to '30 Days' — or '1 Year' as a middle ground — automatically deletes older message attachments and can free gigabytes of space on iPhones with years of message history. A confirmation prompt appears before anything is deleted.",
    tip: "Before reducing retention, consider that this permanently deletes older message conversations. Export any important conversations first using a third-party tool, or take screenshots of messages you want to keep.",
  },
  {
    title: 'Delete and reinstall large apps to clear cached data',
    description:
      "If any app shows unexpectedly large Documents & Data (e.g., a social media app using 3GB), delete the app entirely and reinstall it fresh. In Settings > General > iPhone Storage, tap the app and select 'Delete App.' Then reinstall it from the App Store. This clears all accumulated local cache. For most apps, your account data is stored server-side and will reappear after you sign back in — but verify this before deleting apps with important local data.",
  },
];

const FAQS = [
  {
    question: 'What is "Other" storage on iPhone and how do I reduce it?',
    answer:
      "'Other' in iPhone Storage represents system caches, Siri voice files, Safari offline content, Maps data, streaming app buffers, and temporary files from iOS itself. You can't delete it directly, but several actions reduce it: restarting the iPhone clears temporary files, reducing Messages retention (Settings > Messages > Keep Messages) removes attachment caches, and clearing Safari data (Settings > Safari > Clear History and Website Data) removes browser caches. 'Other' also shrinks after a factory restore, but that's rarely necessary just to reclaim this space.",
  },
  {
    question: 'Will enabling iCloud Photos free up space on my iPhone immediately?',
    answer:
      "Yes, when you enable iCloud Photos with 'Optimize iPhone Storage,' iOS replaces full-resolution originals with smaller device-optimized versions as it needs space. The process happens gradually over hours or days rather than instantly. The amount freed depends on your library size and current storage pressure — a phone that's nearly full will optimize more aggressively and faster. Your full-resolution originals remain safely in iCloud and download automatically when viewed or exported.",
  },
  {
    question: "How do I see what's taking up the most space on my iPhone?",
    answer:
      "Settings > General > iPhone Storage shows both a category breakdown (the colored bar at the top) and a per-app list sorted by total storage used. Tap any app to see its breakdown between the app itself and its Documents & Data. The most common large consumers are Photos, Messages (attachments), streaming apps (downloaded content), and social media apps (cached content). The Recommendations section at the top highlights the highest-impact actions for your specific usage.",
  },
  {
    question: "Why doesn't deleting apps free up as much space as expected?",
    answer:
      "App storage has two components: the app binary itself and its Documents & Data (cached content, downloaded files, user data). When you delete an app, both are removed. However, some of what you expect to be 'app storage' may actually be categorized under Photos, Messages, or Other — for example, videos shared in iMessage are in Messages storage, not the app that plays them. Also, offloading an app (vs. deleting) only removes the binary and preserves data — offloaded apps still show their Documents & Data size in iPhone Storage.",
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
    title: 'iPhone Battery Draining Fast',
    href: '/fix/phone-tablet/iphone/battery-draining-fast',
  },
  {
    category: 'iPhone Guides',
    title: 'All iPhone troubleshooting guides →',
    href: '/fix/phone-tablet/iphone',
  },
];

export default function IPhoneStorageFullPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix iPhone Storage Full Error"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              iPhone Storage Full? Here&rsquo;s How to Free Up Space Fast
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Photos and videos are almost always the largest culprit. Here&rsquo;s how to find
              what&rsquo;s taking space and free it up without losing anything important.
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
            heading="Still running out of storage after these steps?"
            body="Our AI can review your specific storage breakdown and suggest the highest-impact actions for your iPhone and usage pattern."
            chatLink="/chat?device=iphone&issue=storage"
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
            body="Tell our AI how much storage you have, what iPhone Storage shows as the top categories, and what you've already tried."
            chatLink="/chat?device=iphone"
          />
        </div>
      </div>
    </>
  );
}
