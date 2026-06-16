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
import { Cpu, AlertTriangle, FileWarning, Thermometer } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Windows Blue Screen Error (BSOD)? Here's How to Fix It | MyTech-Fix",
  description:
    "Getting a blue screen error on Windows? A recently installed driver is the most common cause. Here's how to identify and fix the real cause.",
  alternates: {
    canonical: `${BASE}/fix/computers/windows/blue-screen-error`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Computers', href: '/fix/computers' },
  { label: 'Windows', href: '/fix/computers/windows' },
  { label: 'Blue Screen Error' },
];

const TLDR = [
  "Note the error code on the blue screen (e.g., IRQL_NOT_LESS_OR_EQUAL) — it tells you exactly which subsystem failed.",
  "Boot into Safe Mode first — if the BSOD doesn't recur there, a recently installed driver is almost certainly the cause.",
  "Run 'sfc /scannow' in an elevated Command Prompt to repair corrupted Windows system files automatically.",
  "If crashes persist under light use, check CPU/GPU temperatures with HWMonitor — sustained heat above 90°C causes emergency shutdowns that look like BSODs.",
];

const CAUSES = [
  {
    icon: Cpu,
    title: 'A recently installed driver is incompatible or corrupted',
    description:
      "Hardware drivers — especially GPU, WiFi, and audio drivers — run with the highest level of system access (kernel mode), so a bug in one of them can crash the entire operating system rather than just the affected app. This is the single most common BSOD cause. If the crashes started right after installing a new GPU driver, a Windows Update, or a new peripheral, the driver is the first place to look.",
    likelihood: 'likely' as const,
  },
  {
    icon: AlertTriangle,
    title: 'Faulty or failing RAM',
    description:
      "Bad memory modules cause data corruption that can crash Windows with a wide variety of error codes — MEMORY_MANAGEMENT, PAGE_FAULT_IN_NONPAGED_AREA, and others. Unlike driver crashes, RAM-related BSODs tend to be inconsistent: different error codes, happening at random times rather than during a specific action. Windows Memory Diagnostic (built in) can confirm or rule this out.",
    likelihood: 'common' as const,
  },
  {
    icon: FileWarning,
    title: 'Windows system files are corrupted',
    description:
      "A failed update, an improper shutdown (holding the power button), or a sudden power loss can leave core Windows system files in a corrupted state. When Windows tries to load a damaged system file, it can trigger a BSOD rather than failing gracefully. The System File Checker tool (sfc /scannow) scans for and automatically repairs these files using a protected cache.",
    likelihood: 'common' as const,
  },
  {
    icon: Thermometer,
    title: 'Overheating CPU or GPU triggering an emergency shutdown',
    description:
      "When a CPU or GPU temperature exceeds its safe operating threshold, some systems force an emergency shutdown to prevent permanent hardware damage — and this can present as a BSOD rather than a clean power-off. This is more common on laptops with clogged cooling vents or desktops with dried thermal paste. It typically happens under load (gaming, video rendering) rather than at idle.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Note the exact error code on the blue screen',
    description:
      "When the BSOD appears, look for the error code in all caps (e.g., IRQL_NOT_LESS_OR_EQUAL, MEMORY_MANAGEMENT, KERNEL_SECURITY_CHECK_FAILURE). If the screen disappears too fast to read, go to Settings > Windows Update > Windows Insider Program is not needed — instead check Event Viewer (search 'Event Viewer' in Start) > Windows Logs > System and look for a 'Critical' event around the crash time, which will show the same code. Each code points to a different subsystem, so searching the specific code narrows your troubleshooting significantly.",
  },
  {
    title: 'Boot into Safe Mode and check if the crash recurs',
    description:
      "Hold Shift while clicking Restart from the Start menu's power options. This boots into the recovery environment. Go to Troubleshoot > Advanced options > Startup Settings > Restart, then press 4 (or F4) to enter Safe Mode. Safe Mode loads only essential drivers. Use the PC normally for a while — if the BSOD doesn't happen in Safe Mode, a third-party driver is almost certainly the cause, since Safe Mode bypasses most of them.",
    tip: "If the PC won't boot normally at all, Windows usually drops into the recovery environment automatically after 2-3 failed boot attempts, giving you the same Troubleshoot menu.",
  },
  {
    title: 'Roll back recently installed drivers',
    description:
      "Open Device Manager (Win + X > Device Manager). Look for any device with a yellow warning icon, or think about what you installed or updated recently — GPU drivers and WiFi drivers are the most common culprits. Right-click the device > Properties > Driver tab > Roll Back Driver. If that button is grayed out, instead uninstall the device (right-click > Uninstall device) and let Windows reinstall a basic driver on next restart.",
  },
  {
    title: 'Run Windows Memory Diagnostic',
    description:
      "Search 'Windows Memory Diagnostic' in the Start menu and open it. Select 'Restart now and check for problems.' The PC will restart and run a memory test before Windows loads — this takes 10-20 minutes for a standard test. For a more thorough check, press F1 during the test to access extended test options and let it run overnight. Results appear as a notification after Windows finishes booting.",
  },
  {
    title: "Run System File Checker (sfc /scannow)",
    description:
      "Search 'Command Prompt' in the Start menu, right-click it, and select 'Run as administrator.' Type 'sfc /scannow' and press Enter. This scans all protected system files and automatically replaces any that are corrupted using a cached copy. The scan takes 5-15 minutes. If it reports it found and fixed corrupted files, restart and check if the BSODs stop.",
    tip: "If sfc reports it couldn't fix some files, run 'DISM /Online /Cleanup-Image /RestoreHealth' first (also in an elevated Command Prompt) to repair the underlying Windows image, then run sfc /scannow again.",
  },
  {
    title: 'Check CPU and GPU temperatures under load',
    description:
      "Download HWMonitor (free, from cpuid.com). Open it while running a normal workload — browsing, or whatever typically triggers the crash. Watch the 'Max' temperature column for your CPU and GPU. Sustained temperatures above 90°C (194°F) indicate a cooling problem. On a laptop, this usually means dust-clogged vents; on a desktop, it can mean a failed fan or dried thermal paste. Cleaning vents with compressed air resolves most cases.",
  },
];

const FAQS = [
  {
    question: 'What does the error code on a blue screen mean?',
    answer:
      "The error code (e.g., IRQL_NOT_LESS_OR_EQUAL or MEMORY_MANAGEMENT) identifies which part of Windows detected the fatal error. IRQL errors usually point to a driver accessing memory incorrectly. MEMORY_MANAGEMENT often points to faulty RAM. KERNEL_SECURITY_CHECK_FAILURE often points to corrupted system files or a failing drive. Searching the exact code alongside your specific situation (e.g., 'after GPU driver update') narrows the cause far faster than generic troubleshooting.",
  },
  {
    question: 'How do I find out what caused a specific BSOD?',
    answer:
      "Open Event Viewer (search for it in Start) and navigate to Windows Logs > System. Look for a red 'Critical' or 'Error' entry timestamped around when the crash happened — it usually names the specific driver or file involved (e.g., nvlddmkm.sys for an Nvidia GPU driver). You can also check C:\\Windows\\Minidump for crash dump files, which can be analyzed with the free WinDbg tool for a more precise diagnosis.",
  },
  {
    question: 'Will System Restore fix a blue screen error?',
    answer:
      "Yes, if the BSOD started after a specific software change — a driver install, a Windows update, or a new application — System Restore can roll Windows back to a point before that change, often resolving the crash immediately. Search 'Create a restore point' in Start, click System Restore, and choose a restore point dated before the problem began. This doesn't affect personal files, only system settings and recently installed software.",
  },
  {
    question: 'Is a blue screen error a sign my PC is dying?',
    answer:
      "Not usually. The large majority of BSODs are caused by a software-level issue — a bad driver or corrupted system file — both of which are fully fixable without any hardware replacement. A BSOD is more concerning if it happens repeatedly with the same memory-related error code (suggesting failing RAM) or alongside other symptoms like unusual noises or extreme heat (suggesting failing hardware). Running Windows Memory Diagnostic and checking temperatures, as covered above, will tell you which situation you're in.",
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
    title: "Windows Won't Install Updates",
    href: '/fix/computers/windows/wont-install-updates',
  },
  {
    category: 'Windows Guides',
    title: 'All Windows troubleshooting guides →',
    href: '/fix/computers/windows',
  },
];

export default function WindowsBlueScreenPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Windows Blue Screen Error"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Windows Blue Screen Error (BSOD)? Here&rsquo;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A recently installed driver is the most common cause. Identify the exact error
              code and work through these steps to find the real culprit.
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
            heading="Still crashing after these steps?"
            body="Our AI can help interpret your specific error code and crash pattern to narrow down the exact cause."
            chatLink="/chat?device=windows-pc&issue=blue-screen"
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
            body="Tell our AI the exact error code you're seeing — it'll give you a targeted fix for your specific situation."
            chatLink="/chat?device=windows-pc"
          />
        </div>
      </div>
    </>
  );
}
