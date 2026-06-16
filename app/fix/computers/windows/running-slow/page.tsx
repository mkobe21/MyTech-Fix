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
import { Cpu, HardDrive, RefreshCw, AlertCircle } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Windows Running Slow? Here's How to Speed It Up | MyTech-Fix",
  description:
    "PC running slow on Windows 10 or 11? Too many startup programs and a full drive are the usual suspects. Here's how to fix it step by step.",
  alternates: {
    canonical: `${BASE}/fix/computers/windows/running-slow`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Computers', href: '/fix/computers' },
  { label: 'Windows', href: '/fix/computers/windows' },
  { label: 'Windows Running Slow' },
];

const TLDR = [
  "Open Task Manager (Ctrl+Shift+Esc) > Startup apps and disable everything you don't need — startup bloat is the single biggest cause of a slow Windows PC.",
  "Check storage: if your drive is over 85% full, run Disk Cleanup to free space Windows needs for virtual memory and temp files.",
  "Sort Task Manager > Processes by CPU and Memory to identify what's actively consuming resources right now.",
  "If the PC is over 3 years old and slow under light load, check CPU temperatures with HWMonitor — sustained temps above 90°C mean a cooling issue.",
];

const CAUSES = [
  {
    icon: Cpu,
    title: 'Too many startup programs consuming RAM and CPU at boot',
    description:
      "Every program that adds itself to Windows startup runs silently in the background from the moment you log in — consuming RAM, CPU cycles, and disk I/O before you even open a browser. Common offenders: cloud sync clients (OneDrive, Google Drive, Dropbox), chat apps (Teams, Slack, Discord), manufacturer bloatware, and antivirus tools from removed software that leave startup entries behind. On a machine with 8GB RAM, 6–8 startup programs can consume 2–3GB before you do anything.",
    likelihood: 'likely' as const,
  },
  {
    icon: HardDrive,
    title: 'Storage drive is nearly full',
    description:
      "Windows uses free disk space for virtual memory (a page file that supplements RAM), temporary files during updates and installs, and system restore points. When a drive is over 85–90% full, these operations fail or degrade significantly. An SSD slows down noticeably when it has less than 10–15% free space due to how NAND flash writes work. Even on an HDD, a full drive forces the file system to fragment writes across scattered clusters.",
    likelihood: 'common' as const,
  },
  {
    icon: RefreshCw,
    title: 'Background processes running during use',
    description:
      "Windows Update downloads and installs in the background, often during active use. Antivirus tools run scheduled scans that can consume 30–50% of CPU on older hardware. Cloud sync clients (OneDrive, Dropbox, Google Drive) upload or sync large folders silently. These processes are benign but poorly timed — they run when the system is under load rather than idle. Checking Task Manager during a slow period reveals exactly which background process is consuming resources.",
    likelihood: 'common' as const,
  },
  {
    icon: AlertCircle,
    title: 'Hardware issue — failing drive or overheating CPU',
    description:
      "A failing hard drive causes extreme slowness as Windows repeatedly retries failed sector reads. An SSD approaching end-of-life shows similar behavior. CPU overheating causes thermal throttling — the processor intentionally reduces its speed to avoid damage, making even simple tasks feel sluggish. Both issues produce consistent slowness across all applications, not just specific programs. HWMonitor (free) shows real-time CPU temperatures; CrystalDiskInfo (free) shows drive health status.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Disable startup programs in Task Manager',
    description:
      "Press Ctrl+Shift+Esc to open Task Manager. Click 'More details' if you see the compact view. Go to the Startup apps tab (Windows 11) or Startup tab (Windows 10). Sort by 'Startup impact' (High first). Right-click any program you don't need at boot and select Disable. Safe to disable: cloud sync clients, chat apps, manufacturer utilities, update checkers. Do not disable: security software, audio drivers, display drivers.",
    tip: "Disabling a startup entry doesn't uninstall the program — it still works when you launch it manually. You're just stopping it from running automatically at login.",
  },
  {
    title: 'Free up drive space with Disk Cleanup',
    description:
      "Press Win + S and search 'Disk Cleanup.' Select your main drive (usually C:) and click OK. Check all boxes in the list — Temporary files, Recycle Bin, Windows Update Cleanup, Delivery Optimization Files. Click 'Clean up system files' for a deeper clean that includes old Windows update packages. These are often the largest category and safe to remove once updates are confirmed working.",
    tip: "If your drive is still critically full after Disk Cleanup, open Settings > System > Storage > Storage Sense to find large files and app data consuming the most space.",
  },
  {
    title: 'Identify what is consuming resources right now',
    description:
      "Open Task Manager (Ctrl+Shift+Esc) and go to the Processes tab. Click the CPU column header to sort by highest CPU usage. Then click Memory. Anything consistently above 20–30% CPU outside of a deliberate task (a game, a render, a video call) is a candidate to investigate. Right-click a suspicious process and select 'Search online' to identify what it is before deciding whether to close it.",
  },
  {
    title: 'Install pending Windows Updates',
    description:
      "Go to Settings > Windows Update and click 'Check for updates.' Download and install any pending updates. Some update processes hold background services open that consume CPU while waiting to complete. Finishing the update cycle often frees up significant resources and improves performance — especially if the PC has been avoiding restarts for weeks.",
  },
  {
    title: 'Run a malware scan with Windows Security',
    description:
      "Open Windows Security (search for it in Start). Go to Virus & threat protection > Quick scan. Malware and adware are a common cause of unexpected CPU and memory consumption. If Windows Security finds nothing and you have reason to suspect malware, Malwarebytes Free is a reputable second-opinion scanner that can be installed, run once, and uninstalled.",
  },
  {
    title: 'Check CPU temperature if the PC is consistently slow under light load',
    description:
      "Download and install HWMonitor (free from cpuid.com). Open it and look for 'Temperatures' under your CPU — note the 'Max' column values after 10 minutes of normal use. Sustained CPU temperatures above 90°C (194°F) indicate thermal throttling. The fix is cleaning dust from CPU heatsink vents with compressed air, or replacing dried thermal paste on the CPU. On a laptop, this usually requires a technician unless you're comfortable opening the chassis.",
    tip: "For drives: install CrystalDiskInfo (free) and check the Health Status. 'Good' is normal. 'Caution' or 'Bad' means the drive is failing and data should be backed up immediately.",
  },
];

const FAQS = [
  {
    question: 'How many startup programs is too many in Windows?',
    answer:
      "There's no magic number, but as a rule of thumb: keep startup programs to those you actually open within the first 10 minutes of using the PC. For most users that means security software and perhaps one or two essentials. If you have 10+ startup entries and 8GB of RAM or less, you're likely using 2–3GB of RAM before you open a browser. Disable cloud sync clients (OneDrive, Dropbox, Google Drive), chat apps (Teams, Slack, Discord), and any manufacturer update utilities — you can still launch all of these manually when needed.",
  },
  {
    question: 'How much free space should I keep on my Windows drive?',
    answer:
      "Keep at least 15% of your drive free — 10% is a minimum, but 15% gives Windows comfortable room for virtual memory, update downloads, and temp files. On an SSD, full drives write slower due to how NAND flash manages free blocks; on an HDD, fragmentation worsens above 90% capacity. For a 256GB SSD, that means keeping at least 38GB free. Run Disk Cleanup and use Settings > System > Storage to identify what's using the most space.",
  },
  {
    question: 'Why did Windows get slow after an update?',
    answer:
      "A few things can cause post-update slowness: Windows Update may still be running background indexing and optimization tasks for hours or even a day after the update installs. Some updates include driver changes that introduce new performance regressions. In rare cases, an update enables a previously-disabled feature (like Virtualization-Based Security) that adds CPU overhead. If the PC was fine before a specific update, check Device Manager for any drivers marked with a yellow warning triangle and roll them back (Properties > Driver tab > Roll Back Driver).",
  },
  {
    question: 'Will adding more RAM fix a slow Windows PC?',
    answer:
      "Adding RAM fixes slowness caused by RAM exhaustion — if Task Manager shows 90%+ memory usage during normal use, more RAM will help significantly. But if the bottleneck is a slow hard drive, a full drive, or CPU throttling due to heat, more RAM won't make a noticeable difference. The fastest upgrade for most older PCs is replacing a spinning hard drive with an SSD — this typically delivers a 3–5x improvement in boot time and application load speed for around $50–80.",
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
    title: 'Windows Blue Screen Error',
    href: '/fix/computers/windows/blue-screen-error',
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

export default function WindowsRunningSlowPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Windows Running Slow"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Windows Running Slow? Here&rsquo;s How to Speed It Up
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Startup bloat and a full drive are behind most slow Windows PCs. These six steps
              fix the most common causes — no reinstall required.
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
            heading="Still running slow after these steps?"
            body="Our AI can check your startup list, disk usage, running processes, and system health to pinpoint what's holding your PC back."
            chatLink="/chat?device=windows-pc&issue=slow"
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
            body="Tell our AI your Windows version, how much RAM you have, and what's slow — it'll give you a specific fix for your setup."
            chatLink="/chat?device=windows-pc"
          />
        </div>
      </div>
    </>
  );
}
