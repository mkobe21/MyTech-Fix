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
import { Zap, Cpu, Power, AlertCircle } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Windows WiFi Keeps Disconnecting? Here's the Real Fix | MyTech-Fix",
  description:
    "Windows WiFi dropping every few minutes or after sleep? Power management is almost always the culprit. Here's how to stop it permanently.",
  alternates: {
    canonical: `${BASE}/fix/computers/windows/wifi-keeps-disconnecting`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Computers', href: '/fix/computers' },
  { label: 'Windows', href: '/fix/computers/windows' },
  { label: 'WiFi Keeps Disconnecting' },
];

const TLDR = [
  "Windows power management turns off your WiFi adapter to save battery — disable this in Device Manager > Network Adapters > Power Management.",
  "Fast Startup leaves the WiFi adapter in a partial state after shutdown — disabling it in Power Options stops wake-from-sleep disconnections.",
  "If disconnections persist, download the latest WiFi driver directly from your laptop manufacturer's support page (not via Windows Update).",
  "Run 'netsh winsock reset' in an elevated Command Prompt as a final catch-all if nothing else works.",
];

const CAUSES = [
  {
    icon: Zap,
    title: 'Windows power management is turning off the WiFi adapter',
    description:
      "By default, Windows is allowed to turn off your WiFi adapter to save power — even on plugged-in desktops. When this happens, the adapter goes offline and drops your connection. It usually reconnects in a few seconds, but on some adapters or drivers it gets stuck off until you manually disable and re-enable it. This setting is buried in Device Manager and is almost never the right tradeoff.",
    likelihood: 'likely' as const,
  },
  {
    icon: Cpu,
    title: 'Outdated or buggy WiFi driver',
    description:
      "Windows Update often installs a generic Microsoft-packaged driver rather than the latest driver from your adapter or laptop manufacturer. Manufacturer drivers fix known stability bugs and implement firmware-level power management correctly. If your WiFi started disconnecting after a Windows update, a driver regression is the likely cause.",
    likelihood: 'common' as const,
  },
  {
    icon: Power,
    title: '"Fast Startup" leaving the WiFi adapter in a bad state',
    description:
      'Fast Startup is a Windows feature that hibernates the kernel on shutdown so the next boot feels faster. The problem is that it doesn\'t fully reset hardware, including the WiFi adapter. After a shutdown/startup cycle with Fast Startup enabled, some WiFi adapters resume in a partially-initialized state that causes intermittent drops. Fully disabling Fast Startup forces a clean hardware reset on every boot.',
    likelihood: 'common' as const,
  },
  {
    icon: AlertCircle,
    title: 'DHCP lease conflict with the router',
    description:
      "When your IP lease expires and the router assigns a different IP before Windows fully renews the old one, the connection drops briefly. On most networks this is seamless, but on routers with aggressive lease times or in shared networks with many devices, the renewal can cause noticeable disconnections. Running 'ipconfig /release' and 'ipconfig /renew' in Command Prompt flushes the lease and forces a clean renewal.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Disable power management on the WiFi adapter',
    description:
      "Press Win + X and select Device Manager. Expand 'Network adapters' and find your WiFi adapter (usually named after the manufacturer — Intel, Qualcomm, Realtek, Broadcom). Right-click it and select Properties. Go to the Power Management tab. Uncheck 'Allow the computer to turn off this device to save power.' Click OK. This is the single most effective fix for WiFi dropping on laptops.",
    tip: 'Also open Control Panel > Power Options > Change plan settings > Change advanced power settings > Wireless Adapter Settings > Power Saving Mode and set it to Maximum Performance.',
  },
  {
    title: 'Update the WiFi driver from the manufacturer',
    description:
      "Don't use Windows Update for this — go directly to your laptop or WiFi adapter manufacturer's support site. Search your model number (printed on the bottom of the laptop) and download the latest WiFi driver package. Run the installer, restart, and test. For common manufacturers: Dell (dell.com/support), HP (support.hp.com), Lenovo (support.lenovo.com), ASUS (asus.com/support).",
    tip: "In Device Manager, right-clicking the WiFi adapter and selecting 'Update driver' only searches Windows Update's driver catalog, which is often months behind the manufacturer.",
  },
  {
    title: 'Disable Fast Startup',
    description:
      "Open Control Panel (search for it in Start) > Power Options > 'Choose what the power buttons do' (left sidebar). Click 'Change settings that are currently unavailable' at the top to unlock the option. Under Shutdown settings, uncheck 'Turn on fast startup (recommended).' Click Save changes. From now on, shutdown will do a full hardware reset rather than a partial hibernate.",
  },
  {
    title: 'Forget and reconnect to the WiFi network',
    description:
      "Sometimes a corrupted network profile causes repeated authentication failures that look like disconnections. Go to Settings > Network & Internet > WiFi > Manage known networks. Find your network, click it, and select Forget. Then reconnect by clicking the WiFi icon in the taskbar, selecting the network, and re-entering the password.",
  },
  {
    title: 'Run the Windows Network Troubleshooter',
    description:
      "Go to Settings > System > Troubleshoot > Other troubleshooters (Windows 11) or Settings > Update & Security > Troubleshoot > Internet Connections (Windows 10). Run the troubleshooter — it can automatically detect and fix adapter state issues, DNS misconfiguration, and IP conflicts that cause disconnections.",
  },
  {
    title: "Run 'netsh winsock reset' if issues persist",
    description:
      "Open the Start menu, search for 'Command Prompt,' right-click it, and select 'Run as administrator.' Type 'netsh winsock reset' and press Enter. Then type 'netsh int ip reset' and press Enter. Restart your computer. These commands reset the Windows networking stack to a clean state and fix corruption that persists through driver reinstalls.",
    tip: "You may also run 'ipconfig /flushdns' to clear the DNS cache if websites fail to load after the WiFi reconnects.",
  },
];

const FAQS = [
  {
    question: 'Why does Windows WiFi disconnect after waking from sleep?',
    answer:
      "Sleep/wake disconnections are almost always caused by Windows power management turning off the WiFi adapter to save power during sleep — and then failing to fully reinitialize it on wake. The fix is to disable 'Allow the computer to turn off this device to save power' in Device Manager > Network Adapters > your WiFi adapter > Properties > Power Management. Also disable Fast Startup in Control Panel > Power Options, which can leave the adapter in a partial state.",
  },
  {
    question: 'How do I find and update my WiFi driver in Windows?',
    answer:
      "Open Device Manager (Win + X > Device Manager), expand 'Network adapters,' and note the exact name of your WiFi adapter — for example, 'Intel Wi-Fi 6 AX201.' Go to your laptop manufacturer's support site, enter your model number, and download the latest driver for that adapter. Install it, restart, and test. Avoid using Windows Update's 'Update driver' option — it typically installs older generic drivers rather than the current manufacturer release.",
  },
  {
    question: 'What is Windows Fast Startup and why does it cause WiFi drops?',
    answer:
      "Fast Startup is a Windows feature that speeds up boot time by saving the kernel state to a hibernate file during shutdown, instead of fully powering down. When you start the computer again, Windows loads from the hibernate file rather than doing a full boot — which means hardware like the WiFi adapter never gets a complete reset cycle. On some adapters, this leaves the driver in a partial state that causes intermittent connection drops. Disabling Fast Startup (Control Panel > Power Options > Choose what power buttons do) forces a full hardware reset on every shutdown.",
  },
  {
    question: 'Why does my WiFi keep disconnecting only on my laptop but other devices stay connected?',
    answer:
      "When other devices on the same network stay connected, the problem is specific to your laptop's WiFi adapter or its drivers — not the router. The most likely cause is Windows power management throttling or shutting off the adapter, or a driver bug. Disable 'Allow the computer to turn off this device to save power' in Device Manager for the adapter, and download the latest driver from your laptop manufacturer. If the issue started after a Windows update, rolling back the driver (Device Manager > right-click adapter > Properties > Driver tab > Roll Back Driver) may restore stability.",
  },
];

const RELATED = [
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

export default function WindowsWifiDisconnectingPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Windows WiFi Keeps Disconnecting"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Windows WiFi Keeps Disconnecting? Here&rsquo;s the Real Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Windows power management is almost always the culprit — it silently turns off your
              WiFi adapter. Here&rsquo;s how to stop it permanently.
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
            heading="Still disconnecting after all these steps?"
            body="Our AI can run a live network diagnostic and check your adapter status, driver version, and connection stability in real time."
            chatLink="/chat?device=windows-pc&issue=wifi-disconnecting"
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
            heading="Still having WiFi trouble?"
            body="Describe what happens when it disconnects — our AI will give you a targeted fix for your specific Windows version and adapter."
            chatLink="/chat?device=windows-pc"
          />
        </div>
      </div>
    </>
  );
}
