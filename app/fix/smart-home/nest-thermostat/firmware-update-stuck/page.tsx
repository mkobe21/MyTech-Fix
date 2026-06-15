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
import { WifiOff, Clock, Zap, HardDrive } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Nest Thermostat Firmware Update Stuck? Here's What to Do | MyTech-Fix",
  description:
    "Nest Thermostat stuck on a firmware update? It may be a staged rollout pause or a weak WiFi signal. Here's what to check and when to contact Nest support.",
  alternates: {
    canonical: `${BASE}/fix/smart-home/nest-thermostat/firmware-update-stuck`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Nest Thermostat', href: '/fix/smart-home/nest-thermostat' },
  { label: 'Nest Thermostat Firmware Update Stuck' },
];

const TLDR = [
  "Nest firmware updates roll out in stages — waiting 24–48 hours is often all that's needed.",
  "Check WiFi signal strength at the thermostat's location — weak signal interrupts the download.",
  "A soft restart (Settings > Reset > Restart) can unstick an update that has paused mid-way.",
  "If stuck for more than a few days, request a forced update push through Google Home support.",
];

const CAUSES = [
  {
    icon: WifiOff,
    title: 'Weak WiFi signal interrupting the download',
    description:
      "Firmware updates are downloaded over WiFi. A signal that's adequate for normal thermostat operation can still be too weak for a sustained file download — especially if the thermostat is far from the router or separated by thick walls. Even a brief signal dropout mid-download can pause or corrupt the update.",
    likelihood: 'likely' as const,
  },
  {
    icon: Clock,
    title: "Staged rollout — update is pending, not stuck",
    description:
      "Google releases Nest firmware updates in waves — rolling them out to small percentages of devices at a time before expanding. If your device hasn't received an update yet, it may appear 'behind' compared to other users. This is normal and not a malfunction. Most devices receive updates within 2–7 days of the initial rollout.",
    likelihood: 'common' as const,
  },
  {
    icon: Zap,
    title: 'Thermostat losing power during the update',
    description:
      "On systems without a C-wire, a firmware update can drain the thermostat's internal power reserve — especially if the HVAC system isn't cycling frequently enough to recharge it. If power drops mid-update, the download pauses or fails. Ensuring the thermostat has stable power (via C-wire or the Nest Power Connector) prevents this.",
    likelihood: 'common' as const,
  },
  {
    icon: HardDrive,
    title: 'Storage issue preventing the update from installing',
    description:
      "In rare cases, a previous failed update can leave partial files on the thermostat's storage that block a new installation. A soft restart clears temporary state and usually resolves this. If a restart doesn't help after multiple attempts, Nest support can push a recovery firmware.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Check WiFi signal strength at the thermostat',
    description:
      "On the thermostat: Settings > Wi-Fi. Look at the number of signal bars or the RSSI reading if shown. One bar or 'Weak signal' indicates a marginal connection that can interrupt downloads. Firmware files are typically 10–50 MB — a weak connection that works for normal thermostat operation may not sustain a file download.",
    tip: "For reference: 2 bars is marginal, 3 bars is adequate, 4 bars is good. If you see 1 bar, improving signal should be your first step.",
  },
  {
    title: 'Improve WiFi signal if it is weak',
    description:
      "If the signal is weak, consider a WiFi extender or mesh node positioned closer to the thermostat. Alternatively, if your router is in the same general area, temporarily relocating it a room closer can confirm whether signal is the issue. After improving signal, soft-restart the thermostat and check whether the update resumes.",
  },
  {
    title: 'Wait 24–48 hours for a staged rollout',
    description:
      "If the signal is fine and the thermostat is connected but hasn't updated, the device may simply not have been selected for the current rollout wave yet. Google's staged deployment process means some devices receive updates days later than others. Check the current software version under Settings > About > Software version, and compare it to the version number in Google's Nest release notes.",
  },
  {
    title: 'Soft-restart the thermostat to retry',
    description:
      "On the thermostat: Settings > Reset > Restart. This reboots the thermostat's software without clearing any settings or schedule. After restarting, the thermostat reconnects to Nest's update servers, which can trigger a pending update to resume from the beginning or continue from where it paused.",
    tip: "Settings > Reset > Restart is a soft reboot only. Do not select 'All Settings' or 'Schedule' — those erase your configuration.",
  },
  {
    title: 'Confirm the thermostat has stable power',
    description:
      "If your thermostat runs without a C-wire, check whether your HVAC system has been running recently. Mild weather that doesn't trigger heating or cooling can drain the thermostat's charge. If a firmware download keeps stopping, a C-wire or the Nest Power Connector accessory provides continuous 24V power and prevents download interruptions from power drops.",
  },
  {
    title: 'Contact Nest support to request a forced update push',
    description:
      "If the update has been stuck for more than 3–5 days and the above steps haven't helped, contact Nest support through the Google Home app: tap your profile icon > Help & feedback > Contact us. Nest support can push a forced update to a specific device, bypassing the staged rollout queue. Have your thermostat's serial number ready (Settings > About).",
  },
];

const FAQS = [
  {
    question: 'How do I know if my Nest Thermostat is actually updating its firmware?',
    answer:
      "During an active update, the Nest Thermostat typically displays a spinning indicator and may show a progress percentage. The display may go briefly blank when the thermostat restarts at the end of the update. Normal updates complete within 30–60 minutes. To check your current version: Settings > About > Software version. Compare it to the latest version published in Google's Nest software release notes.",
  },
  {
    question: 'Can I force my Nest Thermostat to update?',
    answer:
      "Not directly from the thermostat's menu — Nest updates are server-pushed by Google. You can soft-restart the thermostat (Settings > Reset > Restart) to reconnect it to update servers, which sometimes triggers a pending update to begin. If a pending update has not started after a week, contact Nest support through the Google Home app — they can push a forced update to your specific device.",
  },
  {
    question: 'Is it safe to use my thermostat during a firmware update?',
    answer:
      "You can make manual adjustments at the thermostat's display during a download, but avoid restarting the device or cutting power to your HVAC while an update is actively installing (when the progress spinner is showing). Interrupting the install phase can corrupt the firmware. If the thermostat appears frozen on the update screen for more than 30 minutes, wait before attempting a restart.",
  },
  {
    question: 'Will a firmware update reset my schedule or settings?',
    answer:
      "No. Firmware updates only modify the operating software on the device. They don't change your heating or cooling schedules, eco temperature settings, temperature preferences, or Home/Away settings. Your configuration is stored separately on the thermostat and is also backed up to your Google account — it's preserved across all firmware updates.",
  },
];

const RELATED = [
  {
    category: 'Nest Thermostat',
    title: 'Nest Thermostat Showing Offline',
    href: '/fix/smart-home/nest-thermostat/offline',
  },
  {
    category: 'Nest Thermostat',
    title: "Nest Thermostat Won't Connect to WiFi",
    href: '/fix/smart-home/nest-thermostat/wont-connect-to-wifi',
  },
  {
    category: 'Nest Thermostat',
    title: 'Nest Thermostat Not Responding in App',
    href: '/fix/smart-home/nest-thermostat/not-responding-in-app',
  },
  {
    category: 'Nest Thermostat Guides',
    title: 'All Nest Thermostat troubleshooting guides →',
    href: '/fix/smart-home/nest-thermostat',
  },
];

export default function NestThermostatFirmwareUpdateStuckPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Nest Thermostat Firmware Update Stuck"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Nest Thermostat Firmware Update Stuck? Here&rsquo;s What to Do
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Most &ldquo;stuck&rdquo; updates are actually staged rollout pauses — the thermostat
              just hasn&rsquo;t been selected yet. Here&rsquo;s how to tell the difference and what
              to do in each case.
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
            heading="Update still stuck after several days?"
            body="Our AI can check whether the issue is WiFi signal, power, or a server-side rollout delay — and help you request a forced update push from Nest support."
            chatLink="/chat?device=nest-thermostat&issue=firmware-update"
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
            heading="Still having trouble with your Nest Thermostat?"
            body="Describe what the thermostat displays and how long it's been stuck — our AI will give you targeted next steps."
            chatLink="/chat?device=nest-thermostat"
          />
        </div>
      </div>
    </>
  );
}
