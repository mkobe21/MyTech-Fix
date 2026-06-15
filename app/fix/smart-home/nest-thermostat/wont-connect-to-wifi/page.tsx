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
import { Wifi, Lock, Shield, AlertCircle } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Nest Thermostat Won't Connect to WiFi? Here's the Fix | MyTech-Fix",
  description:
    "Nest Thermostat refusing to connect to WiFi? The most common cause is a 5 GHz network — Nest requires 2.4 GHz. Here's how to fix it step by step.",
  alternates: {
    canonical: `${BASE}/fix/smart-home/nest-thermostat/wont-connect-to-wifi`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Nest Thermostat', href: '/fix/smart-home/nest-thermostat' },
  { label: "Nest Thermostat Won't Connect to WiFi" },
];

const TLDR = [
  "Nest thermostats require a 2.4 GHz network — connecting to a 5 GHz SSID is the most common setup failure.",
  "Re-enter your WiFi password carefully — special characters and capitalization are common mistake points.",
  "Use Settings > Wi-Fi > Forget on the thermostat, then reconnect from scratch to clear stale credentials.",
  "If your router uses MAC address filtering, add the thermostat's MAC (Settings > About) to the allowed list.",
];

const CAUSES = [
  {
    icon: Wifi,
    title: 'Connecting to a 5 GHz network instead of 2.4 GHz',
    description:
      "Nest thermostats (all generations of the Nest Learning Thermostat, Nest Thermostat E, and the 2020 Nest Thermostat) require a 2.4 GHz WiFi network. If your router broadcasts a combined SSID for both bands, the thermostat may attempt to connect at 5 GHz and fail. You may need to temporarily split your router's bands into separate SSIDs to give the thermostat a clear 2.4 GHz target.",
    likelihood: 'likely' as const,
  },
  {
    icon: Lock,
    title: 'WiFi password entered incorrectly',
    description:
      "The Nest thermostat's on-device keyboard can be tricky — special characters, uppercase letters, and numbers are easy to mis-enter on the ring or touchscreen. Even one wrong character means the connection attempt fails silently. Re-entering the password carefully, character by character, resolves most failures.",
    likelihood: 'common' as const,
  },
  {
    icon: Shield,
    title: "Router's MAC filtering or guest network isolation is blocking the thermostat",
    description:
      "If your router's MAC address filtering is enabled, it only allows pre-approved devices to join. The Nest thermostat won't appear in the allow-list until you add it manually. Similarly, if you're trying to connect to a guest network with client isolation enabled, the thermostat will connect to the network but won't be reachable for remote control.",
    likelihood: 'common' as const,
  },
  {
    icon: AlertCircle,
    title: 'Network name (SSID) contains special characters',
    description:
      "SSIDs with ampersands (&), apostrophes ('), quotation marks, or certain Unicode characters can cause connection failures on Nest thermostats. If your network name contains any of these, try temporarily renaming it to a simple alphanumeric name in your router settings to test whether that's the cause.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Confirm you are selecting a 2.4 GHz network',
    description:
      "On the thermostat, go to Settings > Wi-Fi and look at the list of available networks. If your router broadcasts separate SSIDs for each band (e.g., 'MyNetwork' and 'MyNetwork_5G'), select the one without '5G.' If your router uses a single combined SSID, log into your router's admin panel and enable separate SSIDs for each band — connect the thermostat to the 2.4 GHz SSID specifically.",
    tip: "2.4 GHz networks have better range through walls and are required for all current Nest Thermostat models. Your other devices can still use 5 GHz.",
  },
  {
    title: 'Re-enter your WiFi password carefully',
    description:
      "On the network selection screen, choose your network and re-enter the password. Use the ring to scroll through characters or tap the on-screen keyboard on touchscreen models. Passwords are case-sensitive. If your password contains special characters, go slowly — the ring input is easy to overshoot. After entering, select 'Join' and wait up to 60 seconds for the connection attempt.",
  },
  {
    title: "Forget the network and reconnect from scratch",
    description:
      "If the thermostat shows a previous connection attempt with the wrong credentials stored, go to Settings > Wi-Fi, select your network name, and choose 'Forget.' Wait 10 seconds, then re-select the network and enter your password fresh. This clears any stale credential state from previous failed attempts.",
  },
  {
    title: "Add the thermostat's MAC address to your router's allow-list",
    description:
      "If your router uses MAC address filtering: on the thermostat, go to Settings > About > Technical info and note the 'MAC address: Wi-Fi' value (format: XX:XX:XX:XX:XX:XX). Log into your router's admin panel, find the MAC address filtering or device allow-list section, and add this address. Retry the WiFi connection after saving.",
  },
  {
    title: 'Disable guest network client isolation if connecting to a guest network',
    description:
      "If you're connecting the thermostat to a guest network, that network may have 'AP Isolation' or 'Client Isolation' enabled — which prevents devices on the guest network from talking to your computer or phone. Disable this setting in your router's guest network configuration, or move the thermostat to your main network instead.",
  },
  {
    title: 'Restart both the router and the thermostat, then retry',
    description:
      "Power off your router, wait 30 seconds, and power it back on. Wait 2 minutes for it to fully restart and re-broadcast its networks. Then on the thermostat, go to Settings > Reset > Restart. After both devices are back up, attempt the WiFi connection again from Settings > Wi-Fi.",
  },
];

const FAQS = [
  {
    question: 'Why does Nest Thermostat require 2.4 GHz WiFi?',
    answer:
      "2.4 GHz WiFi has better range and wall penetration than 5 GHz, which matters for a thermostat often installed on an interior wall with the router in another room. All current Nest Thermostat models — including the Nest Learning Thermostat (all generations), Nest Thermostat E, and the 2020 Nest Thermostat — use 2.4 GHz only. Check Google's product page for your specific model to confirm its WiFi specifications.",
  },
  {
    question: "How do I find my Nest Thermostat's MAC address?",
    answer:
      "On the thermostat, go to Settings (gear icon) > About > Technical info. The MAC address is listed as 'MAC address: Wi-Fi' in the format XX:XX:XX:XX:XX:XX. This is the identifier you need to add to your router's MAC address filtering allow-list if that feature is enabled on your router.",
  },
  {
    question: 'Can I use a WiFi extender or mesh node with my Nest Thermostat?',
    answer:
      "Yes, as long as the extender or mesh node broadcasts a 2.4 GHz SSID. For mesh systems with a single unified SSID, the thermostat should connect automatically to the nearest node at 2.4 GHz. Some mesh systems use band steering that pushes devices toward 5 GHz — if the thermostat can't connect, try connecting it when you're standing near the mesh node closest to the thermostat, or temporarily disable band steering in your mesh settings.",
  },
  {
    question: 'Does Nest Thermostat update its WiFi credentials automatically if I change my router password?',
    answer:
      "No. The Nest thermostat stores your WiFi password locally and won't know the password changed until you update it manually. Go to Settings > Wi-Fi on the thermostat, select your network, and re-enter the new password. The Google Home app will show the thermostat as offline until the new credentials are entered and a successful connection is made.",
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
    title: 'Nest Thermostat Not Responding in App',
    href: '/fix/smart-home/nest-thermostat/not-responding-in-app',
  },
  {
    category: 'Nest Thermostat',
    title: 'Nest Thermostat Firmware Update Stuck',
    href: '/fix/smart-home/nest-thermostat/firmware-update-stuck',
  },
  {
    category: 'Nest Thermostat Guides',
    title: 'All Nest Thermostat troubleshooting guides →',
    href: '/fix/smart-home/nest-thermostat',
  },
];

export default function NestThermostatWontConnectWifiPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Nest Thermostat Won't Connect to WiFi"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Nest Thermostat Won&apos;t Connect to WiFi? Here&apos;s the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Most Nest WiFi failures come down to the wrong band, a mis-typed password, or a router
              setting. Here&rsquo;s how to identify which one and fix it.
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
            body="Our AI can identify whether it's a band mismatch, router setting, or credential issue specific to your network setup."
            chatLink="/chat?device=nest-thermostat&issue=wifi"
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
            body="Tell our AI your router model and what you've tried — it'll give you a targeted fix for your specific network setup."
            chatLink="/chat?device=nest-thermostat"
          />
        </div>
      </div>
    </>
  );
}
