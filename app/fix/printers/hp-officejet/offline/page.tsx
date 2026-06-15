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
import { Cpu, WifiOff, Globe, RefreshCw } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'HP OfficeJet Showing Offline in Windows? Fix It Fast | MyTech-Fix',
  description:
    'HP OfficeJet showing as offline in Windows even though the printer is on? Restart the Print Spooler and check one setting — most offline errors clear in under 5 minutes.',
  alternates: {
    canonical: `${BASE}/fix/printers/hp-officejet/offline`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'HP OfficeJet', href: '/fix/printers/hp-officejet' },
  { label: 'HP OfficeJet Offline' },
];

const TLDR = [
  "Windows showing 'Offline' usually means the Print Spooler service is stuck — restart it first.",
  "Check for the 'Use Printer Offline' checkbox in Windows printer settings — it gets enabled accidentally.",
  "If the printer's IP address changed (common with DHCP), Windows can't reach it — print a Network Configuration page to check.",
  'HP Smart app can automatically detect and repair most driver and connection issues in one step.',
];

const CAUSES = [
  {
    icon: Cpu,
    title: 'Windows Print Spooler service is stuck',
    description:
      "The Print Spooler is a Windows background service that manages printer communication. When it hangs or crashes, Windows loses contact with all connected printers and marks them offline — even if the printer is on and connected. Restarting the service re-establishes the connection immediately.",
    likelihood: 'likely' as const,
  },
  {
    icon: WifiOff,
    title: "Printer set to 'Use Printer Offline' in Windows",
    description:
      "Windows has a per-printer 'Use Printer Offline' setting that, when checked, makes Windows ignore the physical printer entirely. It's easy to enable accidentally — a single mis-click in the printer context menu. It doesn't turn the printer off; it just tells Windows to stop communicating with it.",
    likelihood: 'likely' as const,
  },
  {
    icon: Globe,
    title: "Printer's IP address changed",
    description:
      "If your router assigns IP addresses via DHCP, your printer may get a different IP address each time it reconnects. Windows stores the printer's IP address in the port configuration — if that IP is stale, Windows can't reach the printer and shows it offline. Assigning the printer a static IP (DHCP reservation) prevents this permanently.",
    likelihood: 'common' as const,
  },
  {
    icon: RefreshCw,
    title: 'Outdated or corrupted printer driver',
    description:
      'A printer driver that was corrupted by a Windows update, or one that is significantly out of date, can lose its communication channel with the physical printer. The HP Smart app can detect and reinstall the correct driver version automatically.',
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Restart the Print Spooler service',
    description:
      "Press Win+R, type services.msc, and press Enter. Scroll down to 'Print Spooler,' right-click it, and select Restart. Wait 10 seconds for it to fully restart. This is the fastest fix and resolves most Windows offline errors without any other changes.",
    tip: 'If Restart is greyed out, click Stop first, wait 5 seconds, then click Start.',
  },
  {
    title: "Uncheck 'Use Printer Offline' in Windows",
    description:
      "Go to Settings → Bluetooth & devices → Printers & scanners and click your HP OfficeJet. Click 'Open print queue.' In the queue window, click Printer in the menu bar and confirm that 'Use Printer Offline' does NOT have a checkmark. If it does, click it to uncheck it.",
  },
  {
    title: 'Set the printer as your default printer',
    description:
      "In Settings → Bluetooth & devices → Printers & scanners, click your HP OfficeJet and select 'Set as default.' Also make sure 'Let Windows manage my default printer' is turned off in Printer preferences — this setting can override your choice.",
  },
  {
    title: "Verify the printer's IP address matches what Windows expects",
    description:
      "On the printer, print a Network Configuration page (usually via Settings → Reports → Network Configuration). Note the IPv4 address shown. In Windows: Settings → Printers & scanners → your printer → Printer properties → Ports tab. Confirm the port IP matches the printer's current IP. If it doesn't, edit the port to use the correct IP.",
    tip: "To avoid this recurring, set a DHCP reservation in your router so the printer always gets the same IP address.",
  },
  {
    title: 'Run HP Smart app to repair the connection',
    description:
      "Download and install the HP Smart app from the Microsoft Store or hp.com. Open it, find your printer, and use 'Printer Setup & Software' or 'Fix Printer' if it appears. The app checks drivers, firmware, and connection settings in one scan and can repair most configuration issues automatically.",
  },
];

const FAQS = [
  {
    question: 'Why does my HP OfficeJet show as offline even though it\'s on?',
    answer:
      "Windows maintains its own 'offline/online' state for printers that doesn't always reflect the printer's physical status. It marks a printer offline when it can't communicate with it — usually because the Print Spooler crashed, the IP address changed, or the 'Use Printer Offline' setting was accidentally enabled. The printer itself is fine; Windows just lost contact.",
  },
  {
    question: 'What is the Print Spooler and why does it cause offline issues?',
    answer:
      "The Print Spooler is a Windows service (spoolsv.exe) that manages the print queue and handles communication between Windows and all connected printers. When it hangs or crashes, Windows loses contact with every printer and marks them all offline. Restarting it via services.msc re-establishes that communication without needing a system reboot.",
  },
  {
    question: "Why does my HP printer keep changing IP addresses?",
    answer:
      "Most home routers assign IP addresses dynamically via DHCP, which means a device can get a different IP each time it reconnects to the network. If Windows stored your printer's old IP in its port configuration, it can no longer reach the printer. The permanent fix: log into your router and set a DHCP reservation for the printer's MAC address — this gives it the same IP every time without making it fully static.",
  },
  {
    question: 'Should I use USB or WiFi for my HP OfficeJet?',
    answer:
      "USB is more reliable for desktops — no IP address issues, no band conflicts, and no router settings complications. WiFi is better if you print from multiple devices, or the printer is not near your computer. For a home printer shared by several devices, WiFi is worth the occasional troubleshooting. If you only print from one computer and it's nearby, USB eliminates most offline and connectivity issues entirely.",
  },
];

const RELATED = [
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

export default function HpOfficejetOfflinePage() {
  return (
    <>
      <SeoSchema
        howToName="Fix HP OfficeJet Showing Offline in Windows"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              HP OfficeJet Showing Offline in Windows? Fix It Fast
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A Windows &ldquo;offline&rdquo; error rarely means the printer is broken — it almost
              always means Windows lost its connection to the printer. Here&rsquo;s how to fix it in
              minutes.
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
            heading="Still showing offline after these steps?"
            body="Our AI can identify whether the issue is your driver, Print Spooler, or network configuration — and walk you through the specific fix."
            chatLink="/chat?device=hp-officejet&issue=offline"
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
            body="Describe the error message and what you've tried — our AI will walk you through a fix specific to your printer and Windows version."
            chatLink="/chat?device=hp-officejet"
          />
        </div>
      </div>
    </>
  );
}
