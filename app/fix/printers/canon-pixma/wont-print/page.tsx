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
import { AlertCircle, Droplet, File, WifiOff } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Canon PIXMA Says Ready But Won't Print? Try This | MyTech-Fix",
  description:
    "Canon PIXMA shows 'Ready' but nothing prints? A stuck job in the queue blocks everything. Here's how to clear it and fix the underlying cause.",
  alternates: {
    canonical: `${BASE}/fix/printers/canon-pixma/wont-print`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Printers', href: '/fix/printers' },
  { label: 'Canon PIXMA', href: '/fix/printers/canon-pixma' },
  { label: "Canon PIXMA Won't Print" },
];

const TLDR = [
  'A stuck job in the print queue blocks every print behind it — cancel all pending jobs first.',
  'Power off completely for 30 seconds (not just sleep) to clear the printer\'s internal job memory.',
  'Re-seat ink cartridges even with no error showing — a loose cartridge prevents printing without any warning.',
  "Test print from the printer's menu directly to find out whether the issue is the printer or the computer.",
];

const CAUSES = [
  {
    icon: AlertCircle,
    title: 'Stalled print job stuck in the queue',
    description:
      "When a print job fails mid-way — due to a paper jam, ink error, or connection drop — it can get stuck in the queue without clearing. All jobs sent after it wait indefinitely. Windows may still show the printer as 'Ready' while this queue blockage is in place.",
    likelihood: 'likely' as const,
  },
  {
    icon: Droplet,
    title: 'Ink cartridge not seated properly',
    description:
      "A Canon PIXMA cartridge that isn't fully clicked into its slot can prevent printing even when the printer doesn't display an ink error. Canon printers halt printing if any cartridge contact is uncertain. Removing and firmly re-seating each cartridge until it clicks resolves this without any driver changes.",
    likelihood: 'common' as const,
  },
  {
    icon: File,
    title: 'Hidden paper jam or debris',
    description:
      "Small scraps of torn paper near the feed rollers — particularly at the rear paper intake — can trigger the jam sensor without a visible blockage or a clear error code. The printer silently refuses to pull new paper. Check both the front cover and the rear intake area before assuming the paper path is clear.",
    likelihood: 'common' as const,
  },
  {
    icon: WifiOff,
    title: 'USB or WiFi connection dropped mid-job',
    description:
      "A brief connection loss during a print job leaves a partial job stuck in both the printer's internal memory and Windows' queue simultaneously. Power cycling the printer and restarting the Print Spooler clears both sides of this state.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Clear all jobs from the print queue',
    description:
      "Search for 'Printers & scanners' in the Windows Start menu, click your Canon PIXMA, then click 'Open print queue.' Select all jobs (Ctrl+A) and press Delete, or right-click each job and choose Cancel. Wait 30 seconds for them to clear. If jobs show 'Deleting' for more than a minute without disappearing, continue to the next step.",
  },
  {
    title: 'Power off the printer completely and wait 30 seconds',
    description:
      "Press the power button to turn the printer fully off. Disconnect the power cable from the back of the printer or from the wall outlet. Wait a full 30 seconds. Reconnect and power on. This clears the printer's internal job memory — more thorough than pressing the Cancel button.",
    tip: 'A full power cycle clears internal memory. Simply pressing the On/Off button without disconnecting power does not always clear stuck jobs.',
  },
  {
    title: 'Remove and re-seat each ink cartridge',
    description:
      "Open the ink cartridge access door and wait for the carriage to stop moving. Press each cartridge firmly down and toward the rear of the slot until you hear or feel it click into place. Close the access door and wait for the printer to return to Ready status before testing again.",
  },
  {
    title: 'Check for hidden paper jams in both access areas',
    description:
      "Open the front paper output tray and check the paper path for any visible scraps. Then open the rear paper intake panel (usually a removable cover on the back of the printer) and check the rollers and paper guide area. Even a small torn corner in the rear intake can hold the jam sensor in the triggered state.",
  },
  {
    title: 'Run Canon print head cleaning and alignment',
    description:
      "If the printer accepts jobs but produces blank or streaked output, dried ink is blocking the nozzles. On the printer's control panel, go to Maintenance → Cleaning or Deep Cleaning. Alternatively, open the Canon IJ Printer Utility on your computer, select your printer, and run Clean or Deep Cleaning from the Maintenance tab. Print a nozzle check pattern to confirm before and after.",
    tip: "Cleaning cycles use ink. Run at most 2–3 consecutive cycles — running more wastes ink without additional benefit. Deep Cleaning uses more ink but is more effective for severely dried nozzles.",
  },
  {
    title: 'Print a test page from the printer to isolate the issue',
    description:
      "From the printer's control panel, go to Setup → Device settings → Test print, or press and hold the Stop button for a few seconds (varies by model) to print a status sheet. This test bypasses Windows entirely. If the test page prints correctly, the printer hardware is fine and the issue is on the computer side — try reinstalling the Canon driver.",
  },
];

const FAQS = [
  {
    question: "Why does my Canon PIXMA say 'Ready' but not print anything?",
    answer:
      "'Ready' means the printer's hardware is idle and accepting jobs. The most common reason nothing prints is a stuck job in the queue — old failed jobs block every new job behind them. Open the print queue (Settings → Printers & scanners → your printer → Open queue), cancel all pending jobs, and try again.",
  },
  {
    question: 'How do I run a print head cleaning on Canon PIXMA?',
    answer:
      "On the printer's control panel, go to Maintenance or Setup → Maintenance → Print Head Cleaning (or Deep Cleaning for more thorough cleaning). On Windows, open Canon IJ Printer Utility — usually found in the installed Canon software — select your printer, and run Clean or Deep Cleaning from the Maintenance tab. Print a nozzle check pattern first to confirm whether cleaning is actually needed before using ink.",
  },
  {
    question: 'Can a paper jam cause a Canon PIXMA to stop printing without showing an error?',
    answer:
      "Yes. Small scraps of torn paper near the feed rollers — especially in the rear paper intake area — can hold the jam sensor in the triggered state without producing a clear error on screen. The printer simply stops pulling new paper. Check both the front output area and the rear intake panel carefully, including around the rollers, for any scraps.",
  },
  {
    question: 'How do I check ink levels on a Canon PIXMA?',
    answer:
      "On the printer's touchscreen or display, navigate to Setup → Ink → Ink level. On Windows, open the Canon IJ Status Monitor — it appears in the system tray when the printer is connected and shows approximate levels for each individual ink tank. Canon PIXMA uses separate tanks per color, so one low cartridge won't always trigger an ink error until it's nearly empty.",
  },
];

const RELATED = [
  {
    category: 'Canon PIXMA',
    title: 'Canon PIXMA Showing Offline',
    href: '/fix/printers/canon-pixma/offline',
  },
  {
    category: 'Canon PIXMA',
    title: "Canon PIXMA Won't Connect to WiFi",
    href: '/fix/printers/canon-pixma/wont-connect-to-wifi',
  },
  {
    category: 'Canon PIXMA',
    title: 'Canon PIXMA Print Queue Stuck',
    href: '/fix/printers/canon-pixma/print-queue-stuck',
  },
  {
    category: 'Canon PIXMA Guides',
    title: 'All Canon PIXMA troubleshooting guides →',
    href: '/fix/printers/canon-pixma',
  },
];

export default function CanonPixmaWontPrintPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Canon PIXMA Won't Print"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Canon PIXMA Says Ready But Won&apos;t Print? Try This
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              &ldquo;Ready&rdquo; with no output is almost always a stuck queue or a loose
              cartridge. Here&rsquo;s how to diagnose which one and get printing again.
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
            heading="Printer still not printing after these steps?"
            body="Our AI can walk through your specific Canon PIXMA model, OS version, and connection type to find the exact fix."
            chatLink="/chat?device=canon-pixma&issue=wont-print"
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
            heading="Still having trouble with your Canon PIXMA?"
            body="Tell our AI what the printer displays and what you've already tried — it'll give you a targeted fix for your specific model."
            chatLink="/chat?device=canon-pixma"
          />
        </div>
      </div>
    </>
  );
}
