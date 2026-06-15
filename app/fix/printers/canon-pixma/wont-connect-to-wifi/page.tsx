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
import { WifiOff, Lock, Wifi, Shield } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Canon PIXMA Won't Connect to WiFi? Here's the Fix | MyTech-Fix",
  description:
    "Canon PIXMA failing to connect to WiFi? The WiFi radio may be disabled, or the printer may be targeting the 5 GHz band it doesn't support. Full fix steps here.",
  alternates: {
    canonical: `${BASE}/fix/printers/canon-pixma/wont-connect-to-wifi`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Canon PIXMA', href: '/fix/printers/canon-pixma' },
  { label: "Canon PIXMA Won't Connect to WiFi" },
];

const TLDR = [
  "Check the WiFi light on the printer — if it's off, hold the WiFi button to enable the radio.",
  'Most Canon PIXMA models only support 2.4 GHz — make sure you\'re connecting to the right band.',
  'If your WiFi password changed, re-run the Wireless Setup Wizard from the printer\'s Setup menu.',
  "Canon's IJ Network Device Setup Utility can diagnose and re-add the printer from scratch.",
];

const CAUSES = [
  {
    icon: WifiOff,
    title: "Printer's WiFi radio is turned off",
    description:
      "Most Canon PIXMA models have a dedicated WiFi button on the control panel that toggles the wireless radio on and off. If the WiFi indicator light is off or blinking amber, the radio is disabled — the printer won't appear on any network scans regardless of your router settings. Press and hold the WiFi button to re-enable it.",
    likelihood: 'likely' as const,
  },
  {
    icon: Lock,
    title: 'WiFi password changed and printer has old credentials',
    description:
      "Canon PIXMA printers store WiFi credentials in non-volatile memory. If your router's password changed — after a router reset, ISP visit, or security update — the printer keeps trying to authenticate with the old password and fails silently. Re-running the Wireless Setup Wizard clears the stored credentials and lets you enter the current ones.",
    likelihood: 'common' as const,
  },
  {
    icon: Wifi,
    title: 'Printer connecting to 5 GHz instead of 2.4 GHz',
    description:
      "Most Canon PIXMA models (MG, MX, TS, and TR series) support only 2.4 GHz WiFi. If your router broadcasts a combined SSID or a separate 5 GHz SSID and the printer latches onto the 5 GHz signal, the connection will fail. The printer needs to be pointed specifically at a 2.4 GHz network.",
    likelihood: 'common' as const,
  },
  {
    icon: Shield,
    title: "Router's AP Isolation or Client Isolation is blocking the printer",
    description:
      "AP Isolation (also called Client Isolation or Wireless Isolation) prevents WiFi devices from communicating directly with each other — only with the internet. When enabled on your main home network, your computer can't send print jobs to the printer's local IP address even though both are on the same WiFi. Disabling it is safe on a home network.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Check the WiFi indicator and enable the wireless radio',
    description:
      "Look at the printer's control panel. The WiFi button usually has a small indicator light next to it. If the light is off or blinking amber (not solid blue), the wireless radio is disabled. Press and hold the WiFi button for 3–5 seconds until the light blinks, then wait for it to go solid blue. The printer is now in wireless connection mode.",
    tip: 'On some PIXMA models, the WiFi indicator is integrated into the power button area. Consult your model-specific manual if you cannot locate the WiFi button.',
  },
  {
    title: 'Run the Wireless Setup Wizard from the printer menu',
    description:
      "On the printer's control panel, go to Setup (the wrench icon) → WLAN Settings → Wireless LAN Setup (or Wireless Setup Wizard on newer models). Select your network from the list of available SSIDs and enter your current WiFi password. The printer will run a connection test and display a success or failure result within about 60 seconds.",
  },
  {
    title: 'Connect to the 2.4 GHz band specifically',
    description:
      "When the Wireless Setup Wizard shows the list of available networks, look for your 2.4 GHz SSID specifically. If your router broadcasts separate SSIDs (e.g., 'MyNetwork' and 'MyNetwork_5G'), select the one without '5G.' If you use a combined SSID, consider splitting your bands in your router's wireless settings to give the printer a clear 2.4 GHz target.",
    tip: 'Most Canon PIXMA models (MG, MX, TS, TR series) are 2.4 GHz only. Check Canon\'s product page for your specific model to confirm.',
  },
  {
    title: 'Print a Network Settings page to confirm the connection',
    description:
      "After completing the Wireless Setup Wizard, print a Network Settings page: Setup → Device settings → Print LAN details (or press and hold the WiFi button for 3 seconds on some models). Check the IPv4 Address field — a valid IP (not 0.0.0.0) confirms the printer connected to your router successfully.",
    tip: 'An IP of 0.0.0.0 or 169.254.x.x means the printer reached your WiFi but your router didn\'t assign it an IP — check that DHCP is enabled on your router.',
  },
  {
    title: "Check your router's AP Isolation or Client Isolation setting",
    description:
      "Log into your router's admin panel (typically at 192.168.1.1 or 192.168.0.1) and look in the Wireless or Advanced settings section for 'AP Isolation,' 'Client Isolation,' or 'Wireless Isolation.' If it's enabled on your main network (not just a guest network), disable it. This setting is safe to turn off on a home network and is a common cause of printers connecting to WiFi but being unreachable for printing.",
  },
  {
    title: "Use Canon IJ Network Device Setup Utility to re-add the printer",
    description:
      "Download Canon's IJ Network Device Setup Utility from Canon's support site and run it on your computer. The utility scans your network for Canon printers, shows their connection status, and can reconfigure them without requiring you to navigate the printer's menu again. Use the 'Add printer using search' option to find and re-register your PIXMA.",
  },
];

const FAQS = [
  {
    question: 'Does Canon PIXMA support 5 GHz WiFi?',
    answer:
      "Most Canon PIXMA models — including the popular MG, MX, TS, and TR series — support only 2.4 GHz WiFi. Some newer PIXMA Pro models (Pro-200, Pro-300) support dual-band. Check Canon's product page or your printer's specifications document to confirm which bands your model supports. If yours is 2.4 GHz only, you must connect it to a 2.4 GHz SSID specifically.",
  },
  {
    question: 'How do I run the wireless setup on Canon PIXMA?',
    answer:
      "On the printer's control panel: Setup (wrench icon) → WLAN Settings → Wireless LAN Setup or Wireless Setup Wizard. The wizard scans for available networks, displays a list of SSIDs, and prompts you to enter your password. If your network doesn't appear, make sure you're looking at a 2.4 GHz SSID and that the printer is within good signal range of your router.",
  },
  {
    question: "What is Canon's IJ Network Device Setup Utility?",
    answer:
      "IJ Network Device Setup Utility is Canon's free desktop application (Windows and Mac) for managing Canon printers on a network. It scans your local network for Canon printers, shows their IP address and connection status, and can reconfigure network settings remotely — including re-adding a printer that's already been set up before. Download it from Canon's support site, search for your printer model, and look under Software.",
  },
  {
    question: 'Can I print from Canon PIXMA without connecting it to WiFi?',
    answer:
      "Yes — most Canon PIXMA models support Wireless Direct (Canon's equivalent of WiFi Direct), which creates a direct WiFi connection between your device and the printer without using your home router. On the printer: Setup → LAN settings → Wireless Direct → Enable. The printer broadcasts its own network (named 'DIRECT-xxxx-Canon PIXMA...') that you connect your device to before printing.",
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
    title: 'Canon PIXMA Print Queue Stuck',
    href: '/fix/printers/canon-pixma/print-queue-stuck',
  },
  {
    category: 'Canon PIXMA Guides',
    title: 'All Canon PIXMA troubleshooting guides →',
    href: '/fix/printers/canon-pixma',
  },
];

export default function CanonPixmaWontConnectWifiPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Canon PIXMA Won't Connect to WiFi"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Canon PIXMA Won&apos;t Connect to WiFi? Here&apos;s the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Start by checking the WiFi indicator on the printer — if the radio is off, nothing
              else will work. Here&rsquo;s the full fix from radio enable to IJ Network Utility.
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
            heading="Still can't connect to WiFi after these steps?"
            body="Our AI can check your network setup and guide you through Canon's IJ Network Device Setup Utility step by step."
            chatLink="/chat?device=canon-pixma&issue=wifi"
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
            body="Tell our AI your printer model and router type — it'll give you a targeted fix for your specific setup."
            chatLink="/chat?device=canon-pixma"
          />
        </div>
      </div>
    </>
  );
}
