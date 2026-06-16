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
  title: "HP OfficeJet Says Ready But Won't Print? Try This | MyTech-Fix",
  description:
    "HP OfficeJet shows 'Ready' but nothing prints? A stuck job in the queue blocks everything. Here's how to clear it and fix the underlying cause.",
  alternates: {
    canonical: `${BASE}/fix/printers/hp-officejet/wont-print`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Printers', href: '/fix/printers' },
  { label: 'HP OfficeJet', href: '/fix/printers/hp-officejet' },
  { label: "HP OfficeJet Won't Print" },
];

const TLDR = [
  'A stuck job in the print queue blocks every new job — open the queue and cancel all pending jobs first.',
  'Power off the printer completely for 30 seconds — this clears internal memory, unlike a standby reset.',
  'Re-seat ink cartridges even if no ink error is showing — a loose cartridge prevents printing silently.',
  "Test printing from the printer's own menu to isolate whether the issue is the printer or the computer.",
];

const CAUSES = [
  {
    icon: AlertCircle,
    title: 'Stalled print job stuck in the queue',
    description:
      "When a print job fails mid-way — due to a paper jam, ink error, or connection drop — it can get stuck in the queue without clearing. All subsequent print jobs queue behind it and wait indefinitely. Windows may show the printer as 'Ready' while this queue blockage exists.",
    likelihood: 'likely' as const,
  },
  {
    icon: Droplet,
    title: 'Ink cartridge not seated properly',
    description:
      "A cartridge that isn't fully clicked into its slot can prevent printing even when the printer doesn't display an ink error. HP printers are designed to halt printing if any cartridge contact is uncertain. Removing and re-seating each cartridge firmly until it clicks is a reliable fix.",
    likelihood: 'common' as const,
  },
  {
    icon: File,
    title: 'Hidden paper jam or debris',
    description:
      "Small pieces of torn paper near the feed rollers — especially in the rear access area — can trigger the jam sensor without a visible blockage or a clear error code on screen. Always check both the front access panel and the rear door before assuming the paper path is clear.",
    likelihood: 'common' as const,
  },
  {
    icon: WifiOff,
    title: 'USB or WiFi connection dropped mid-job',
    description:
      "A brief connection interruption during a print job can leave a partial job stuck in the printer's memory and Windows' queue simultaneously. Power cycling both the printer and restarting the Print Spooler clears both sides of this state.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Clear all jobs from the print queue',
    description:
      "Go to Settings → Bluetooth & devices → Printers & scanners, click your HP OfficeJet, then click 'Open print queue.' Select all jobs (Ctrl+A) and press Delete, or right-click each job and choose Cancel. Wait 30 seconds to confirm they clear. If jobs won't cancel, proceed to the next step.",
  },
  {
    title: 'Power off the printer completely and wait 30 seconds',
    description:
      "Press the power button to turn the printer fully off — not just sleep. Disconnect the power cable from the back of the printer or from the wall. Wait a full 30 seconds. Plug back in and power on. This clears the printer's internal job memory, unlike a soft reset.",
    tip: 'A full power cycle is more thorough than pressing the reset button. Disconnect power at the wall or the printer.',
  },
  {
    title: 'Remove and re-seat each ink cartridge',
    description:
      "Open the ink cartridge access door and wait for the carriage to stop moving. Press each cartridge down and toward the back of the slot until you hear or feel it click into place. Close the access door and wait for the printer to return to Ready status before testing.",
  },
  {
    title: 'Check for hidden paper jams in both access areas',
    description:
      "Open the front paper access panel and remove any visible paper. Then open the rear access door (usually a removable panel on the back of the printer) and check for any scraps, torn corners, or debris near the rollers. Even a small piece can hold the jam sensor in the triggered state.",
  },
  {
    title: 'Run a print head cleaning cycle',
    description:
      "If the printer accepts jobs but produces blank or streaked output, dried ink is blocking the nozzles. Open the HP Smart app and go to Printer Maintenance → Clean Printhead. Alternatively, on the printer's touchscreen: Settings → Tools → Clean Printhead. Run one cycle and print a test page.",
    tip: "Cleaning cycles use ink. Run at most 2–3 in a row — running more won't help and wastes cartridge ink.",
  },
  {
    title: 'Print a test page directly from the printer to isolate the issue',
    description:
      "On the printer's touchscreen or control panel, go to Settings → Reports → Print Quality Report (or similar). This prints a test page using only the printer's internal memory, bypassing Windows entirely. If the test page prints fine, the printer hardware is working and the issue is the driver or connection on the computer side.",
  },
];

const FAQS = [
  {
    question: "Why does my HP OfficeJet say 'Ready' but not print anything?",
    answer:
      "'Ready' means the printer's hardware is functioning and awaiting jobs. The most common reason it doesn't print is a stuck job in the queue — old failed jobs block every new job behind them. Open the print queue (Settings → Printers & scanners → your printer → Open queue), cancel all pending jobs, and try again.",
  },
  {
    question: 'How do I clear a stuck print queue on HP OfficeJet?',
    answer:
      "Cancel all jobs from the queue window. If they won't cancel, restart the Print Spooler service: press Win+R, type services.msc, find Print Spooler, right-click and choose Restart. For stubborn cases, stop the Print Spooler, manually delete all files inside C:\\Windows\\System32\\spool\\PRINTERS, then start the Print Spooler again.",
  },
  {
    question: 'Can a paper jam cause HP OfficeJet to stop printing without an error?',
    answer:
      "Yes. Small pieces of torn paper near the feed rollers — particularly in the rear access area — can hold the jam sensor in the triggered state without producing a clear error code. The printer simply refuses to pull new paper. Check both the front access panel and the rear door for any scraps, even very small ones.",
  },
  {
    question: 'How do I run a print head cleaning on HP OfficeJet?',
    answer:
      "Open the HP Smart app, select your printer, and look for Printer Maintenance or Tools. Alternatively, on the printer's touchscreen: Settings → Tools → Clean Printhead. This runs an ink purge cycle that clears dried ink from the nozzles. Print a test page after each cycle. Limit to 2–3 consecutive cleaning cycles — more than that wastes ink without additional benefit.",
  },
];

const RELATED = [
  {
    category: 'HP OfficeJet',
    title: 'HP OfficeJet Showing Offline',
    href: '/fix/printers/hp-officejet/offline',
  },
  {
    category: 'HP OfficeJet',
    title: "HP OfficeJet Won't Connect to WiFi",
    href: '/fix/printers/hp-officejet/wont-connect-to-wifi',
  },
  {
    category: 'HP OfficeJet',
    title: 'HP OfficeJet Print Queue Stuck',
    href: '/fix/printers/hp-officejet/print-queue-stuck',
  },
  {
    category: 'HP OfficeJet Guides',
    title: 'All HP OfficeJet troubleshooting guides →',
    href: '/fix/printers/hp-officejet',
  },
];

export default function HpOfficejetWontPrintPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix HP OfficeJet Won't Print"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              HP OfficeJet Says Ready But Won&apos;t Print? Try This
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
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-6">
              Step-by-Step Fix
            </h2>
            <div>
              {STEPS.map((step, i) => (
                <StepItem key={i} step={i + 1} {...step} />
              ))}
            </div>
          </section>

          <MidCTA
            heading="Printer still not printing after these steps?"
            body="Our AI can walk through your specific printer model, OS version, and connection type to find the exact fix."
            chatLink="/chat?device=hp-officejet&issue=wont-print"
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
            heading="Still having trouble with your HP OfficeJet?"
            body="Tell our AI what the printer displays and what you've already tried — it'll give you a targeted fix for your specific model."
            chatLink="/chat?device=hp-officejet"
          />
        </div>
      </div>
    </>
  );
}
