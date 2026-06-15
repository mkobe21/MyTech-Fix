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
import { AlertCircle, Cpu, RefreshCw, HardDrive } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Canon PIXMA Print Queue Stuck? How to Clear It | MyTech-Fix',
  description:
    "Canon PIXMA print queue stuck with jobs that won't cancel? Restart the Print Spooler — and if that fails, manually clear the spool folder. Full steps here.",
  alternates: {
    canonical: `${BASE}/fix/printers/canon-pixma/print-queue-stuck`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Canon PIXMA', href: '/fix/printers/canon-pixma' },
  { label: 'Canon PIXMA Print Queue Stuck' },
];

const TLDR = [
  "Cancel jobs from the queue — if they won't cancel, restart the Print Spooler via services.msc.",
  'Restarting the Print Spooler forcibly releases locked jobs without losing any data.',
  'For jobs that survive a Spooler restart: stop the service, delete files in C:\\Windows\\System32\\spool\\PRINTERS, restart.',
  "Post-Windows-update stuck queues usually mean a driver conflict — reinstall the Canon driver from Canon's site.",
];

const CAUSES = [
  {
    icon: AlertCircle,
    title: 'Corrupted print job blocking the queue',
    description:
      "When a low-ink or paper error interrupts a print job mid-way, the partial job can get stuck in a corrupted state in the queue. Windows keeps retrying it, and everything sent after it waits indefinitely. The regular Cancel button doesn't work because the Spooler has locked the job.",
    likelihood: 'likely' as const,
  },
  {
    icon: Cpu,
    title: 'Print Spooler service has crashed',
    description:
      "The Windows Print Spooler manages the entire queue. When it crashes, all jobs freeze in place and no amount of cancel-clicking helps — the Spooler isn't processing commands. Restarting it from services.msc is the most reliable way to clear a queue frozen by a Spooler crash.",
    likelihood: 'common' as const,
  },
  {
    icon: RefreshCw,
    title: 'Driver conflict after a Windows update',
    description:
      "Windows updates can replace or modify shared driver components, creating a conflict with Canon's existing driver package — especially with Canon printers that install large software suites (IJ Printer Utility, My Image Garden). Jobs get stuck at the point Windows hands off to the driver. Reinstalling the Canon driver from Canon's support site resolves this.",
    likelihood: 'common' as const,
  },
  {
    icon: HardDrive,
    title: 'Leftover spool files from a previous failed print',
    description:
      "Windows stores print jobs as temporary spool files (.SPL and .SHD) in C:\\Windows\\System32\\spool\\PRINTERS. Normally these auto-delete after printing, but failed jobs can leave orphaned files. When the Spooler restarts, it tries to process them and gets stuck again. Manually deleting these files while the Spooler is stopped clears them permanently.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Cancel all jobs from the print queue',
    description:
      "Go to Settings → Bluetooth & devices → Printers & scanners, click your Canon PIXMA, and click 'Open print queue.' Select all jobs (Ctrl+A) and press Delete, or right-click each job and choose Cancel. Wait up to 60 seconds. If jobs show 'Deleting' for more than a minute without clearing, continue to the next step.",
  },
  {
    title: 'Restart the Print Spooler service',
    description:
      "Press Win+R, type services.msc, and press Enter. Scroll to 'Print Spooler,' right-click it, and select Restart. Wait 15 seconds. Return to the print queue — the stuck jobs should now be gone. Try sending a small test print to confirm the queue is flowing normally.",
    tip: 'If Restart is greyed out, select Stop first, wait 10 seconds, then select Start.',
  },
  {
    title: 'Manually clear the spool folder for stubborn jobs',
    description:
      "If jobs still won't clear after restarting the Spooler: 1) In services.msc, right-click Print Spooler and select Stop. 2) Open File Explorer and navigate to C:\\Windows\\System32\\spool\\PRINTERS. 3) Delete all files inside this folder — do not delete the folder itself. 4) Return to services.msc and Start the Print Spooler. The queue will now be completely empty.",
    tip: 'You need administrator privileges to access and delete files in this folder. Right-click File Explorer and select Run as administrator if access is denied.',
  },
  {
    title: 'Reinstall the Canon printer driver',
    description:
      "If the queue gets stuck repeatedly, the driver needs replacing. Go to Canon's support site, search for your PIXMA model, and download the latest full driver package for your version of Windows. Before installing, uninstall the existing Canon printer from Settings → Printers & scanners, reboot, then run the new installer.",
  },
  {
    title: 'Power cycle the Canon PIXMA',
    description:
      "Turn the printer off with the power button, disconnect the power cable from the printer for 30 seconds, then reconnect and power on. This clears any job state stuck in the printer's internal memory that may be contributing to the Windows-side queue blockage.",
  },
  {
    title: 'Print a test document to confirm the queue is clear',
    description:
      "Send a simple one-page document and watch the print queue while it processes. The job should appear briefly in the queue and disappear after the page exits the printer. If it flows through and clears without getting stuck, the issue is resolved.",
  },
];

const FAQS = [
  {
    question: "Why won't my Canon PIXMA print jobs cancel from the queue?",
    answer:
      "Windows sends cancel commands to the Print Spooler, but if the Spooler has locked a job — which happens when an error interrupted a print mid-job — the cancel request itself gets queued behind the locked job. Restarting the Print Spooler from services.msc forces all jobs to release regardless of their locked state, which is the one thing the Cancel button can't do.",
  },
  {
    question: 'Is it safe to delete files from C:\\Windows\\System32\\spool\\PRINTERS?',
    answer:
      "Yes, when the Print Spooler service is stopped first. These temporary spool files (.SPL and .SHD) represent pending print jobs. Deleting them with the Spooler stopped is the recommended manual method for clearing a truly stuck queue. After deleting, restart the Print Spooler and power cycle the printer before trying again.",
  },
  {
    question: 'Why did a Windows Update break my Canon PIXMA queue?',
    answer:
      "Windows updates occasionally replace or modify printer driver components, creating a conflict with Canon's existing driver. This is particularly common with Canon printers that install large companion software packages. If your queue started getting stuck after a Windows update, uninstall the Canon printer from Device Manager, reboot, then reinstall using the latest full driver package from Canon's support site for your PIXMA model.",
  },
  {
    question: 'How do I set Canon PIXMA as my default printer to avoid queue issues?',
    answer:
      "In Settings → Bluetooth & devices → Printers & scanners, click your Canon PIXMA and select 'Set as default.' Also turn off 'Let Windows manage my default printer' in Printer preferences — this Windows setting can override your choice when you switch applications, accidentally routing jobs through an old or incorrect driver and causing queue issues.",
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
    title: "Canon PIXMA Won't Print",
    href: '/fix/printers/canon-pixma/wont-print',
  },
  {
    category: 'Canon PIXMA',
    title: "Canon PIXMA Won't Connect to WiFi",
    href: '/fix/printers/canon-pixma/wont-connect-to-wifi',
  },
  {
    category: 'Canon PIXMA Guides',
    title: 'All Canon PIXMA troubleshooting guides →',
    href: '/fix/printers/canon-pixma',
  },
];

export default function CanonPixmaPrintQueueStuckPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Canon PIXMA Print Queue Stuck"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Canon PIXMA Print Queue Stuck? How to Clear It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Jobs that won&rsquo;t cancel need the Print Spooler restarted — and if that
              doesn&rsquo;t clear them, the spool folder cleared manually. Here&rsquo;s exactly how.
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
            heading="Queue still stuck after restarting the Spooler?"
            body="Our AI can diagnose whether a driver conflict, Windows update, or spooler corruption is the root cause — and walk you through the specific fix."
            chatLink="/chat?device=canon-pixma&issue=print-queue"
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
            body="Describe what's stuck and what you've tried — our AI will give you a step-by-step fix for your specific Windows version and printer model."
            chatLink="/chat?device=canon-pixma"
          />
        </div>
      </div>
    </>
  );
}
