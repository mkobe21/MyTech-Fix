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
import { Wifi, Lock, WifiOff, Shield } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "HP OfficeJet Won't Connect to WiFi? Here's the Fix | MyTech-Fix",
  description:
    "HP OfficeJet failing to connect to WiFi? Most HP OfficeJet models only support 2.4 GHz — connecting to a 5 GHz network is the most common cause. Here's the full fix.",
  alternates: {
    canonical: `${BASE}/fix/printers/hp-officejet/wont-connect-to-wifi`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Printers', href: '/fix/printers' },
  { label: 'HP OfficeJet', href: '/fix/printers/hp-officejet' },
  { label: "HP OfficeJet Won't Connect to WiFi" },
];

const TLDR = [
  'Most HP OfficeJet models only support 2.4 GHz WiFi — make sure you\'re connecting to the right band.',
  'If your WiFi password changed recently, re-run the Wireless Setup Wizard from the printer\'s menu.',
  'AP Isolation or Client Isolation on your router silently blocks printer-to-computer communication.',
  'HP Smart app setup catches most WiFi configuration issues and handles the 2.4 GHz check automatically.',
];

const CAUSES = [
  {
    icon: Wifi,
    title: 'Printer trying to connect to 5 GHz instead of 2.4 GHz',
    description:
      "Most HP OfficeJet models support only 2.4 GHz WiFi. If your router broadcasts a single combined SSID for both bands, or you have separate SSIDs and the printer latches onto the 5 GHz one, the connection will fail. The printer needs to be pointed specifically at a 2.4 GHz network.",
    likelihood: 'likely' as const,
  },
  {
    icon: Lock,
    title: 'WiFi password changed and printer has old credentials',
    description:
      "HP printers store WiFi credentials internally. If your router's password changed — after a router replacement, ISP visit, or security update — the printer will keep trying to connect with the old password and fail silently. Re-running the Wireless Setup Wizard re-enters the current credentials.",
    likelihood: 'common' as const,
  },
  {
    icon: WifiOff,
    title: 'Wireless radio disabled on the printer',
    description:
      "The wireless radio on HP OfficeJet printers can be turned off manually or after a factory reset. When off, the printer won't broadcast its status or accept any network connection attempts. This is easy to overlook because the printer still powers on and operates normally otherwise.",
    likelihood: 'common' as const,
  },
  {
    icon: Shield,
    title: "Router's AP Isolation or Client Isolation is on",
    description:
      "AP Isolation (also called Client Isolation or Wireless Isolation) prevents devices on the same WiFi network from communicating with each other. It's common in guest network configurations. When enabled, your computer can't reach your printer's IP address even though both are on the same network.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Connect to the 2.4 GHz band specifically',
    description:
      "On the printer's touchscreen, go to Wireless Settings and start the Wireless Setup Wizard. When it scans for networks, look for your network name — if your router broadcasts separate 2.4 GHz and 5 GHz SSIDs (e.g., 'MyNetwork' and 'MyNetwork_5G'), select the one without '5G' in the name. If you have a combined SSID, your router may be assigning the 5 GHz band — consider separating the SSIDs in your router settings.",
    tip: 'Log into your router admin panel and check if your network has separate 2.4 GHz and 5 GHz SSIDs. HP OfficeJet models without WiFi 5/6 support cannot use 5 GHz at all.',
  },
  {
    title: 'Re-run the Wireless Setup Wizard with current credentials',
    description:
      "On the printer's touchscreen: Settings → Wireless → Wireless Setup Wizard. Select your network from the list and enter the current WiFi password carefully — passwords are case-sensitive. The wizard will show a success or failure result within about 60 seconds.",
  },
  {
    title: 'Confirm wireless is enabled on the printer',
    description:
      "Go to Settings → Wireless on the printer's touchscreen and confirm the Wireless setting shows 'On.' If it shows 'Off,' toggle it on and wait 30 seconds for the radio to initialize before attempting the Wireless Setup Wizard.",
  },
  {
    title: 'Print a Network Configuration page to verify connection',
    description:
      "After completing the Wireless Setup Wizard, print a Network Configuration page (Settings → Reports → Network Configuration). Check that the IPv4 Address shows a valid IP (not 0.0.0.0) and that the SSID shown matches your network name. A valid IP confirms the printer connected successfully.",
    tip: 'An IP address of 0.0.0.0 or 169.254.x.x means the printer connected to the WiFi but failed to get an IP from your router — check if DHCP is enabled on your router.',
  },
  {
    title: "Check your router's AP Isolation / Client Isolation setting",
    description:
      "Log into your router's admin panel (usually at 192.168.1.1 or 192.168.0.1) and look in Wireless or Advanced settings for 'AP Isolation,' 'Client Isolation,' or 'Wireless Isolation.' If it's enabled on your main network (not just guest), disable it. This setting is usually safe to turn off on a home network.",
  },
  {
    title: 'Use HP Smart app to re-add the printer from scratch',
    description:
      "If all else fails, open the HP Smart app (download from hp.com or the Microsoft Store), click the '+' to add a printer, and follow the guided setup. The app checks for 2.4 GHz compatibility, detects driver issues, and walks through the WiFi configuration step by step — catching problems the manual wizard misses.",
  },
];

const FAQS = [
  {
    question: 'Does HP OfficeJet support 5 GHz WiFi?',
    answer:
      "Most HP OfficeJet models — especially older series (OfficeJet 3830, 4650, 5255, etc.) — support only 2.4 GHz WiFi. Newer models (some OfficeJet Pro 9000 series) added 5 GHz support. Check your printer's specifications on HP's website or in the manual. If yours is 2.4 GHz only, you must connect it to a 2.4 GHz SSID specifically.",
  },
  {
    question: 'How do I run the Wireless Setup Wizard on HP OfficeJet?',
    answer:
      "On the printer's touchscreen: tap the Wireless icon or go to Settings → Wireless → Wireless Setup Wizard. The wizard scans for available networks, lets you select yours, and prompts for the password. If you don't see your network in the list, your printer may be in range of only the 5 GHz signal — move it closer to the router and try again.",
  },
  {
    question: 'What is AP Isolation and why does it block my printer?',
    answer:
      "AP Isolation (also called Client Isolation) is a router setting that prevents WiFi devices from talking directly to each other — only to the internet. It's designed for guest networks in public spaces. When enabled on your main home network, your computer can't send print jobs to your printer's local IP address, even though both are on the same WiFi. Disabling it is safe on a home network.",
  },
  {
    question: 'Can I print from HP OfficeJet without connecting it to WiFi?',
    answer:
      "Yes — HP OfficeJet supports WiFi Direct, which lets devices connect directly to the printer without using your home router. On the printer: Settings → Wireless → WiFi Direct → On. The printer creates its own private network (named 'DIRECT-xx-HP OfficeJet...') that you connect your device to before printing. This is useful for one-off printing when WiFi setup isn't working.",
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
    title: 'HP OfficeJet Print Queue Stuck',
    href: '/fix/printers/hp-officejet/print-queue-stuck',
  },
  {
    category: 'HP OfficeJet Guides',
    title: 'All HP OfficeJet troubleshooting guides →',
    href: '/fix/printers/hp-officejet',
  },
];

export default function HpOfficejetWontConnectWifiPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix HP OfficeJet Won't Connect to WiFi"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              HP OfficeJet Won&apos;t Connect to WiFi? Here&apos;s the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The most common cause is the 5 GHz band — most HP OfficeJet models only support
              2.4 GHz. Here&apos;s how to diagnose and fix it in minutes.
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
            heading="Still can't connect to WiFi after these steps?"
            body="Our AI can check your network configuration and router settings to find what's blocking the connection."
            chatLink="/chat?device=hp-officejet&issue=wifi"
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
            body="Tell our AI your printer model and router type — it'll give you a targeted fix for your specific setup."
            chatLink="/chat?device=hp-officejet"
          />
        </div>
      </div>
    </>
  );
}
