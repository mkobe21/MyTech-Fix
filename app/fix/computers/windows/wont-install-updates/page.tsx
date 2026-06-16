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
import { RefreshCw, HardDrive, Shield, AlertCircle } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Windows Won't Install Updates? Here's How to Fix It | MyTech-Fix",
  description:
    "Windows Update stuck, failing, or stuck downloading? Corrupted update components are the usual cause. Here's how to reset them and get updates flowing again.",
  alternates: {
    canonical: `${BASE}/fix/computers/windows/wont-install-updates`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Computers', href: '/fix/computers' },
  { label: 'Windows', href: '/fix/computers/windows' },
  { label: "Won't Install Updates" },
];

const TLDR = [
  "Run the built-in Windows Update Troubleshooter first — Settings > System > Troubleshoot > Other troubleshooters > Windows Update.",
  "Check free storage — Windows updates need 10-20GB free space to download and unpack; a full drive is a common silent cause.",
  "Temporarily disable third-party antivirus software, which sometimes blocks update files from being applied.",
  "If nothing else works, reset the Windows Update components via Command Prompt — this clears corrupted update cache without affecting your files.",
];

const CAUSES = [
  {
    icon: RefreshCw,
    title: 'Windows Update components are corrupted or stuck',
    description:
      "Windows Update relies on several background services (wuauserv, cryptSvc, bits) and a local cache folder (SoftwareDistribution) to download and apply updates. If a previous update was interrupted — by a shutdown, a crash, or a network drop — these components can be left in a corrupted or stuck state. Updates will appear to download but fail to install, or get stuck at a specific percentage indefinitely.",
    likelihood: 'likely' as const,
  },
  {
    icon: HardDrive,
    title: 'Insufficient free storage',
    description:
      "Windows updates download compressed files and then unpack and apply them, which temporarily requires significantly more free space than the final installed size — often 10-20GB for a major update. If your drive doesn't have enough headroom, the update will fail partway through, sometimes with a generic error that doesn't mention storage at all.",
    likelihood: 'common' as const,
  },
  {
    icon: Shield,
    title: 'Third-party antivirus or security software is blocking the update',
    description:
      "Some third-party antivirus and security suites are overly aggressive about flagging or quarantining update installer files, especially right after a major Windows feature update is released and signature databases haven't caught up. This can cause the update to fail silently or with a vague error code. Windows' own Defender rarely causes this issue, but most third-party tools can.",
    likelihood: 'common' as const,
  },
  {
    icon: AlertCircle,
    title: 'A specific update has a known compatibility bug',
    description:
      "Occasionally, Microsoft ships an update with a bug that affects certain hardware configurations, driver versions, or installed software combinations — these are usually documented quickly on Microsoft's support site with a KB (Knowledge Base) number and either a workaround or a follow-up patch. If an update fails consistently with the same error code across multiple retries, this is worth checking before assuming a local problem.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Run the Windows Update Troubleshooter',
    description:
      "Open Settings > System > Troubleshoot > Other troubleshooters. Find 'Windows Update' in the list and click Run. This built-in tool automatically detects and repairs the most common causes of update failures — corrupted cache files, stuck services, and incorrect update settings — without requiring any manual commands.",
  },
  {
    title: 'Check available storage',
    description:
      "Open File Explorer and click 'This PC.' Check the free space shown under your main drive (usually C:). If you have less than 20GB free, open Disk Cleanup (search for it in Start), select your drive, check all categories including 'Windows Update Cleanup,' and click OK to free up space. Retry the update after cleanup.",
  },
  {
    title: 'Temporarily disable third-party antivirus',
    description:
      "If you use antivirus software other than Windows Defender (Norton, McAfee, Avast, etc.), open it and temporarily disable real-time protection — most have a 'pause protection' option for a set time period. Retry the Windows Update. If it succeeds, re-enable your antivirus immediately afterward and check for an updated version that's compatible with the new Windows update.",
  },
  {
    title: 'Reset Windows Update components',
    description:
      "Search 'Command Prompt' in Start, right-click it, and select 'Run as administrator.' Run these commands one at a time, pressing Enter after each: net stop wuauserv, then net stop cryptSvc, then net stop bits, then ren C:\\Windows\\SoftwareDistribution SoftwareDistribution.old, then net start wuauserv, then net start cryptSvc, then net start bits. This stops the update services, renames the corrupted cache folder so Windows rebuilds it fresh, then restarts the services.",
    tip: "The 'ren' command will fail with 'Access is denied' if a file in that folder is currently in use — if that happens, restart the PC and try the full sequence again before any updates run in the background.",
  },
  {
    title: 'Retry Windows Update',
    description:
      "Go to Settings > Windows Update and click 'Check for updates.' With the components reset, Windows will rebuild its update cache and re-evaluate which updates apply to your system. This first check after a reset can take longer than usual — give it 10-15 minutes before assuming it's stuck again.",
  },
  {
    title: 'Look up the specific KB number if one update keeps failing',
    description:
      "If the same single update keeps failing while others install fine, go to Settings > Windows Update > Update history to find its KB number (e.g., KB5031354). Search 'KB5031354 known issues' on Microsoft's support site. Microsoft documents known issues for major updates and often provides either a fix, a workaround, or a statement that a patch is coming — this can save hours of unnecessary troubleshooting on your end.",
  },
];

const FAQS = [
  {
    question: 'Why does Windows Update get stuck at a specific percentage?',
    answer:
      "An update stuck at the same percentage for an extended period (more than 30-60 minutes with no progress) usually means a corrupted update component or cache file is blocking progress, not that it's still working slowly. Resetting the Windows Update components (stopping the wuauserv, cryptSvc, and bits services and renaming the SoftwareDistribution folder) clears the stuck cache and lets Windows rebuild it. Avoid forcing a shutdown while it's stuck — wait at least an hour first, since some large updates genuinely do take that long.",
  },
  {
    question: 'Is it safe to reset Windows Update components?',
    answer:
      "Yes — resetting Windows Update components only clears the update cache and restarts the related background services. It doesn't affect your personal files, installed applications, or any settings outside of the update process itself. Windows automatically rebuilds the SoftwareDistribution folder the next time it checks for updates. This is a standard, Microsoft-documented troubleshooting step.",
  },
  {
    question: 'How much free space do I need to install a Windows update?',
    answer:
      "Major feature updates typically need 10-20GB of free space temporarily, even though the final installed size is smaller — Windows downloads the update package, then unpacks and stages it before applying, which requires extra headroom. Smaller cumulative (monthly) updates usually need less, around 2-5GB. If you're consistently low on space, running Disk Cleanup with 'Windows Update Cleanup' checked before each update cycle helps prevent failures.",
  },
  {
    question: 'Why does my antivirus block Windows updates?',
    answer:
      "Third-party antivirus software sometimes flags update installer files as suspicious, especially in the hours after a major update is first released — before the antivirus vendor's signature databases have caught up with the new files. This is more common with aggressive heuristic scanning settings. Temporarily pausing real-time protection during the update, then re-enabling it afterward and checking for an antivirus software update, resolves this without permanently lowering your protection.",
  },
];

const RELATED = [
  {
    category: 'Windows',
    title: 'Windows WiFi Keeps Disconnecting',
    href: '/fix/computers/windows/wifi-keeps-disconnecting',
  },
  {
    category: 'Windows',
    title: 'Windows Running Slow',
    href: '/fix/computers/windows/running-slow',
  },
  {
    category: 'Windows',
    title: 'Windows Blue Screen Error',
    href: '/fix/computers/windows/blue-screen-error',
  },
  {
    category: 'Windows Guides',
    title: 'All Windows troubleshooting guides →',
    href: '/fix/computers/windows',
  },
];

export default function WindowsWontInstallUpdatesPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Windows Won't Install Updates"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Windows Won&rsquo;t Install Updates? Here&rsquo;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Corrupted update components are the usual cause. Resetting them clears the stuck
              cache and gets updates flowing again.
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
            heading="Still failing after these steps?"
            body="Our AI can walk through your specific error code and update history to find exactly what's blocking it."
            chatLink="/chat?device=windows-pc&issue=update-failing"
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
            body="Tell our AI the error code and what you've tried — it'll give you a targeted fix for your specific update issue."
            chatLink="/chat?device=windows-pc"
          />
        </div>
      </div>
    </>
  );
}
