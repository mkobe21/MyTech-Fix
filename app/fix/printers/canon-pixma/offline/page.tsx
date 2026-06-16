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
  title: 'Canon PIXMA Showing Offline in Windows? Fix It Fast | MyTech-Fix',
  description:
    'Canon PIXMA showing as offline in Windows even though the printer is on? Restart the Print Spooler and check one setting — most offline errors clear in under 5 minutes.',
  alternates: {
    canonical: `${BASE}/fix/printers/canon-pixma/offline`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Printers', href: '/fix/printers' },
  { label: 'Canon PIXMA', href: '/fix/printers/canon-pixma' },
  { label: 'Canon PIXMA Offline' },
];

const TLDR = [
  "Windows 'Offline' almost always means the Print Spooler crashed — restart it via services.msc first.",
  "Check for the 'Use Printer Offline' checkbox in Printer settings — it's a one-click accident that's easy to miss.",
  "Canon PIXMA printers change IP addresses when routers restart — use Canon IJ Network Tool to find the current IP.",
  "Canon's 'My Printer' utility can auto-detect and repair driver and connection problems in one step.",
];

const CAUSES = [
  {
    icon: Cpu,
    title: 'Windows Print Spooler service is stuck',
    description:
      "The Print Spooler is a Windows background service that manages all printer communication. When it crashes or hangs, Windows loses contact with every connected printer and marks them offline — even if the printer is on and fully functional. Restarting the service from services.msc re-establishes the connection immediately.",
    likelihood: 'likely' as const,
  },
  {
    icon: WifiOff,
    title: "Printer set to 'Use Printer Offline' in Windows",
    description:
      "Windows includes a per-printer 'Use Printer Offline' setting that, when checked, tells Windows to stop communicating with the physical printer entirely. It's easy to enable accidentally with a mis-click in the right-click printer menu. The printer stays powered on; Windows just ignores it.",
    likelihood: 'likely' as const,
  },
  {
    icon: Globe,
    title: "Printer's IP address changed after a router restart",
    description:
      "WiFi-connected Canon PIXMA printers can receive a different IP address every time the router restarts or the printer reconnects. Windows stores the printer's IP in its port configuration — if that IP is stale, Windows can't reach the printer. Canon's IJ Network Tool shows the printer's current IP so you can update the port.",
    likelihood: 'common' as const,
  },
  {
    icon: RefreshCw,
    title: 'Outdated Canon driver or IJ Network Tool conflict',
    description:
      "An outdated Canon driver — or a conflict introduced by a Windows update — can cause the print queue to lose its connection to the hardware. Canon's 'My Printer' utility and the latest driver package from Canon's support site can repair or replace the driver automatically.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Restart the Print Spooler service',
    description:
      "Press Win+R, type services.msc, and press Enter. Scroll to 'Print Spooler,' right-click it, and select Restart. Wait 10–15 seconds for the service to fully restart. Return to Printers & scanners — the printer should now show as Ready.",
    tip: 'If Restart is greyed out, click Stop first, wait 5 seconds, then click Start.',
  },
  {
    title: "Uncheck 'Use Printer Offline' in Windows",
    description:
      "Go to Settings → Bluetooth & devices → Printers & scanners and click your Canon PIXMA. Click 'Open print queue.' In the queue window, click Printer in the menu bar and confirm that 'Use Printer Offline' does NOT have a checkmark next to it. If it does, click it to uncheck it.",
  },
  {
    title: 'Set the Canon PIXMA as your default printer',
    description:
      "In Settings → Bluetooth & devices → Printers & scanners, click your Canon PIXMA and select 'Set as default.' Also turn off 'Let Windows manage my default printer' in Printer preferences — this setting can silently override your choice when you switch between apps.",
  },
  {
    title: "Verify the printer's IP address and update the Windows port if needed",
    description:
      "On the printer's control panel, print a Network Settings page (usually via Setup → Device settings → LAN settings → Print LAN details). Note the IPv4 address shown. In Windows: Printer properties → Ports tab — confirm the listed port IP matches the printer's current IP. If it doesn't, edit the port to use the current IP. Canon IJ Network Tool (downloadable from Canon's support site) can also show and update the IP.",
    tip: "Set a DHCP reservation for the printer's MAC address in your router to permanently prevent IP changes.",
  },
  {
    title: "Run Canon's My Printer utility to repair the connection",
    description:
      "Search for 'My Printer' in your Windows Start menu — it's installed alongside Canon's driver package. If present, open it and select 'Diagnose and Repair.' The utility checks your driver, connection port, and spooler configuration and can repair most issues automatically. If it's not installed, download the latest full driver package from Canon's support site.",
  },
];

const FAQS = [
  {
    question: "Why does my Canon PIXMA show as offline even though it's on?",
    answer:
      "Windows maintains its own 'offline/online' status for each printer, independent of whether the printer is physically on. It marks a printer offline when it can't communicate with it — most often because the Print Spooler crashed, the IP address changed, or the 'Use Printer Offline' setting was accidentally enabled. The printer is fine; Windows just lost its connection.",
  },
  {
    question: 'What does Canon IJ Network Tool do and when should I use it?',
    answer:
      "Canon IJ Network Tool is Canon's built-in utility for configuring and troubleshooting Canon printers on a network. It shows the printer's current IP address, lets you change network settings, and can diagnose connection problems — especially useful when the printer's IP has changed after a router restart. Download it from Canon's support site if it's not already installed alongside your printer driver.",
  },
  {
    question: 'Why does my Canon PIXMA keep changing IP addresses?',
    answer:
      "Home routers assign IP addresses via DHCP, which means a device can receive a different IP each time it reconnects — especially after a router restart or a power outage. If Windows is still pointing to the old IP in its port configuration, it can't reach the printer. The permanent fix: log into your router and set a DHCP reservation for the printer's MAC address, so it always gets the same IP without needing a fully static address.",
  },
  {
    question: 'Should I use USB or WiFi for my Canon PIXMA?',
    answer:
      "USB is more reliable for single-computer setups — no IP address issues, no band conflicts, no router configuration required. WiFi is better if you print from multiple devices or the printer is not near your computer. If you're frequently seeing offline errors on a WiFi-connected PIXMA, USB eliminates the entire class of network-related causes.",
  },
];

const RELATED = [
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

export default function CanonPixmaOfflinePage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Canon PIXMA Showing Offline in Windows"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Canon PIXMA Showing Offline in Windows? Fix It Fast
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A Windows &ldquo;offline&rdquo; error rarely means the printer is broken — it almost
              always means Windows lost its connection. Here&rsquo;s how to fix it in minutes.
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
            heading="Still showing offline after these steps?"
            body="Our AI can identify whether the issue is your Canon driver, Print Spooler, or network configuration — and walk you through the specific fix."
            chatLink="/chat?device=canon-pixma&issue=offline"
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
            body="Describe the error message and what you've tried — our AI will walk you through a fix specific to your printer and Windows version."
            chatLink="/chat?device=canon-pixma"
          />
        </div>
      </div>
    </>
  );
}
