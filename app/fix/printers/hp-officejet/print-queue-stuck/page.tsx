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
  title: 'HP OfficeJet Print Queue Stuck? How to Clear It | MyTech-Fix',
  description:
    'HP OfficeJet print queue stuck with jobs that won\'t cancel? Restart the Print Spooler service — and if that doesn\'t work, manually clear the spool folder. Full steps here.',
  alternates: {
    canonical: `${BASE}/fix/printers/hp-officejet/print-queue-stuck`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'HP OfficeJet', href: '/fix/printers/hp-officejet' },
  { label: 'HP OfficeJet Print Queue Stuck' },
];

const TLDR = [
  "Open the print queue and cancel all pending jobs — if they won't cancel, the Print Spooler needs a restart.",
  'Restarting the Print Spooler (services.msc) forcibly clears most stuck queues without data loss.',
  'For stubborn jobs: stop the Spooler, delete files in C:\\Windows\\System32\\spool\\PRINTERS, restart the Spooler.',
  "Recent Windows updates sometimes conflict with HP drivers — reinstall via HP Smart app if this happened post-update.",
];

const CAUSES = [
  {
    icon: AlertCircle,
    title: 'Corrupted print job blocking the queue',
    description:
      "When a print error occurs mid-job — printer runs out of paper, loses connection, or an ink error fires — the partial job can get stuck in the queue in a corrupted state. Windows keeps trying to process it and blocks everything behind it. Regular cancel commands don't work because the job is in a locked state.",
    likelihood: 'likely' as const,
  },
  {
    icon: Cpu,
    title: 'Print Spooler service has crashed',
    description:
      "The Print Spooler manages the entire print queue. When it crashes (which happens more often than Microsoft admits), all queued jobs freeze in place and appear stuck. No amount of cancel-clicking helps because the Spooler isn't processing any commands. Restarting it via services.msc is the fix.",
    likelihood: 'common' as const,
  },
  {
    icon: RefreshCw,
    title: 'Driver conflict after a Windows update',
    description:
      "Windows updates sometimes replace or modify printer driver components, creating a conflict between the new Windows files and the existing HP driver. Jobs then get stuck at the point where Windows hands off to the driver. Reinstalling the HP driver through the HP Smart app or Device Manager resolves this.",
    likelihood: 'common' as const,
  },
  {
    icon: HardDrive,
    title: 'Leftover spool files not auto-clearing',
    description:
      "Windows stores print jobs as temporary spool files (.SPL and .SHD) in C:\\Windows\\System32\\spool\\PRINTERS. Normally these delete automatically after printing, but failed jobs sometimes leave orphaned files that confuse the Spooler on startup, causing it to get stuck trying to process them.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Cancel all jobs from the print queue',
    description:
      "Go to Settings → Bluetooth & devices → Printers & scanners, click your HP OfficeJet, and click 'Open print queue.' Select all jobs and press Delete or right-click and choose Cancel. Wait up to 60 seconds. If jobs show 'Deleting' for more than a minute without disappearing, continue to the next step.",
  },
  {
    title: 'Restart the Print Spooler service',
    description:
      "Press Win+R, type services.msc, and press Enter. Scroll to 'Print Spooler,' right-click it, and select Restart. Wait 15 seconds. Go back to the print queue — the stuck jobs should now be gone. Try sending a new test print.",
    tip: 'If Restart is greyed out, select Stop first, wait 10 seconds, then select Start.',
  },
  {
    title: 'Manually clear the spool folder for stubborn cases',
    description:
      "If jobs still won't clear after restarting the Spooler: 1) In services.msc, right-click Print Spooler and select Stop. 2) Open File Explorer and navigate to C:\\Windows\\System32\\spool\\PRINTERS. 3) Delete all files inside this folder (not the folder itself). 4) Go back to services.msc and Start the Print Spooler. The queue will now be completely empty.",
    tip: 'You need administrator privileges to access and delete files in the spool folder. Right-click File Explorer and select Run as administrator if prompted.',
  },
  {
    title: 'Update or reinstall the HP printer driver',
    description:
      "Open the HP Smart app and select your printer. Look for 'Update Driver' or 'Printer Setup & Software.' Alternatively, open Device Manager (Win+X → Device Manager), expand Print queues, right-click your HP OfficeJet, and select Update driver. For a clean reinstall: uninstall the printer from Printers & scanners, reboot, then reinstall using HP Smart.",
  },
  {
    title: 'Power cycle the printer',
    description:
      "Turn the printer off with the power button, unplug the power cable from the back for 30 seconds, then plug back in and power on. This clears any job state stuck in the printer's internal memory that may be holding the queue on the Windows side.",
  },
  {
    title: 'Print a test document to confirm the queue is clear',
    description:
      "Send a simple one-page document to confirm everything is working. Watch the queue window as it prints — the job should appear briefly and then disappear after printing successfully. If it prints and clears cleanly, the issue is resolved.",
  },
];

const FAQS = [
  {
    question: "Why won't my HP OfficeJet print jobs cancel from the queue?",
    answer:
      "Windows sends cancel commands to the Print Spooler, but if the Spooler has locked the job — which happens when a print error occurred mid-job — the cancel request itself gets queued. The fix is to restart the Print Spooler service from services.msc, which forces all jobs to release regardless of their state.",
  },
  {
    question: 'Is it safe to delete files from C:\\Windows\\System32\\spool\\PRINTERS?',
    answer:
      "Yes, when the Print Spooler service is stopped first. These are temporary spool files (.SPL and .SHD) representing pending print jobs. Deleting them with the Spooler stopped is the safest and most reliable way to clear a truly stuck queue. After deleting, restart the Print Spooler service and the printer before trying again.",
  },
  {
    question: 'Why did a Windows Update break my HP printer queue?',
    answer:
      "Windows updates occasionally replace or modify printer driver files, creating conflicts with HP's existing driver package. This is especially common with HP printers that use complex software stacks. If your queue started getting stuck after a Windows update, uninstall the HP printer from Device Manager, reboot, then reinstall the driver using the HP Smart app or the latest download from HP's website.",
  },
  {
    question: 'How do I prevent the print queue from getting stuck in the future?',
    answer:
      "A few practices help: always wait for a job to finish printing before sending the next one, cancel jobs from the queue window rather than just closing the application, keep your printer driver updated via HP Smart, and set the printer to be your default so Windows always uses the correct driver. If you print large files frequently, give the printer time to process before queuing additional jobs.",
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
    title: "HP OfficeJet Won't Print",
    href: '/fix/printers/hp-officejet/wont-print',
  },
  {
    category: 'HP OfficeJet',
    title: "HP OfficeJet Won't Connect to WiFi",
    href: '/fix/printers/hp-officejet/wont-connect-to-wifi',
  },
  {
    category: 'HP OfficeJet Guides',
    title: 'All HP OfficeJet troubleshooting guides →',
    href: '/fix/printers/hp-officejet',
  },
];

export default function HpOfficejetPrintQueueStuckPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix HP OfficeJet Print Queue Stuck"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              HP OfficeJet Print Queue Stuck? How to Clear It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Jobs that won&rsquo;t cancel need the Print Spooler restarted — and if that
              doesn&rsquo;t work, the spool folder cleared manually. Here&rsquo;s exactly how.
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
            heading="Queue still stuck after restarting the Spooler?"
            body="Our AI can diagnose whether a driver conflict, Windows update, or spooler corruption is the root cause — and walk you through the specific fix."
            chatLink="/chat?device=hp-officejet&issue=print-queue"
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
            body="Describe what's stuck and what you've tried — our AI will give you a step-by-step fix for your specific Windows version and printer model."
            chatLink="/chat?device=hp-officejet"
          />
        </div>
      </div>
    </>
  );
}
