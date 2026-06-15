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
import { WifiOff, Zap, Wifi, Globe } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Nest Thermostat Showing Offline? Here's How to Fix It | MyTech-Fix",
  description:
    "Nest Thermostat showing offline in the Google Home app? Usually a lost WiFi connection or a power issue. Here's how to diagnose and fix it in minutes.",
  alternates: {
    canonical: `${BASE}/fix/smart-home/nest-thermostat/offline`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Nest Thermostat', href: '/fix/smart-home/nest-thermostat' },
  { label: 'Nest Thermostat Offline' },
];

const TLDR = [
  "If the thermostat display is blank or dim, check your HVAC breaker — a power issue causes offline status.",
  "On the thermostat, go to Settings > Wi-Fi to confirm connection status and re-enter credentials if needed.",
  "Most Nest thermostats require 2.4 GHz WiFi and won't connect to 5 GHz-only networks.",
  "Check status.nest.com for service outages before spending time troubleshooting the device itself.",
];

const CAUSES = [
  {
    icon: WifiOff,
    title: 'Thermostat lost its WiFi connection',
    description:
      "The most common cause of an offline Nest is a dropped WiFi connection — after a router restart, a password change, or intermittent signal. The thermostat will still control your HVAC locally using its existing schedule, but the Google Home app will show it as offline until the WiFi connection is restored.",
    likelihood: 'likely' as const,
  },
  {
    icon: Zap,
    title: 'Power issue on systems without a C-wire',
    description:
      "On HVAC systems without a dedicated common wire (C-wire), Nest thermostats draw small amounts of power from the heating or cooling circuits to charge an internal capacitor. If the system doesn't run frequently enough, the capacitor drains and the thermostat can go offline or reboot. A C-wire or the Nest Power Connector accessory provides continuous power.",
    likelihood: 'common' as const,
  },
  {
    icon: Wifi,
    title: 'Router or network changes not updated on the thermostat',
    description:
      "If you changed your WiFi password, got a new router, or renamed your network, the Nest thermostat still has the old credentials saved and can no longer connect. You must manually update the WiFi settings on the thermostat itself — it won't pick up changes automatically.",
    likelihood: 'common' as const,
  },
  {
    icon: Globe,
    title: 'Google or Nest service outage',
    description:
      "Occasionally, Google's cloud infrastructure for Nest devices experiences disruptions. During an outage, devices may show as offline in the app even though they're connected to WiFi and controlling your HVAC normally. Check status.nest.com before spending time on local troubleshooting.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: "Check the thermostat's display for power",
    description:
      "Look at the thermostat. If the display is blank, very dim, or shows a low-battery indicator, this is a power issue — not a WiFi issue. Check your HVAC system's circuit breaker first (the breaker labeled for your furnace or air handler). If the breaker is fine and the display is still blank, your thermostat may not be receiving power from the HVAC wiring.",
    tip: "On Nest models without a C-wire, the thermostat charges itself from HVAC cycles. If your system hasn't run recently (e.g., mild weather), the internal charge can drain.",
  },
  {
    title: "Check the thermostat's WiFi connection status",
    description:
      "On the thermostat, press the ring or tap the display to wake it. Go to Settings (the gear icon at the bottom right) > Wi-Fi. The screen shows your connected network name and signal strength, or 'Not connected' if WiFi is dropped. This tells you whether the problem is WiFi-related before doing anything else.",
  },
  {
    title: 'Re-enter your WiFi password if the connection is dropped',
    description:
      "If Settings > Wi-Fi shows 'Not connected' or the wrong network, select your 2.4 GHz network from the list and re-enter your current WiFi password. The thermostat will attempt to reconnect and show a checkmark on success. If your network doesn't appear, restart your router first.",
  },
  {
    title: 'Check the Google Home app for error details',
    description:
      "Open the Google Home app and tap on your Nest thermostat's device card. If it shows 'Offline,' tap the card for any additional error message. Some errors (like 'C-wire needed' or a specific connectivity error code) give you more direction than the generic 'offline' label.",
  },
  {
    title: 'Soft-restart the thermostat',
    description:
      "On the thermostat: Settings > Reset > Restart. This is a soft restart — it reboots the thermostat's software without clearing any settings, schedule, or preferences. After restarting, wait 2–3 minutes for the thermostat to reconnect to WiFi and re-sync with the Google Home app.",
    tip: "Settings > Reset > Restart is a soft reboot. Settings > Reset > All Settings is a factory reset — avoid this unless you're setting the device up fresh.",
  },
  {
    title: 'Restart your router and confirm a 2.4 GHz network is available',
    description:
      "Power off your router, wait 30 seconds, and power it back on. Confirm your router is broadcasting a 2.4 GHz network — Nest thermostats require 2.4 GHz and cannot connect to 5 GHz-only networks. If you recently got a new router or changed settings, your 2.4 GHz band may have been inadvertently disabled.",
  },
  {
    title: 'Check status.nest.com for service outages',
    description:
      "Visit status.nest.com in a browser. This page shows real-time status for Nest device connectivity, account login, and the Google Home app. If any service shows 'Degraded performance' or 'Outage,' the offline status in your app is caused by Google's servers — not your thermostat or network. Wait for Google to restore the service.",
  },
];

const FAQS = [
  {
    question: 'Why does my Nest Thermostat go offline frequently?',
    answer:
      "Frequent disconnects usually point to one of three things: weak WiFi signal at the thermostat's wall location, power fluctuations on systems without a C-wire, or a router that periodically reassigns IP addresses. Check signal strength in Settings > Wi-Fi — one or two bars means the signal is marginal. If your thermostat runs on battery power (no C-wire), the Nest Power Connector accessory provides continuous 24V power and eliminates most power-related offline issues.",
  },
  {
    question: 'Can I still use my Nest Thermostat when it shows offline?',
    answer:
      "Yes. A Nest thermostat operates in local mode when offline — it continues heating and cooling based on its existing schedule and temperature settings. You can also adjust the temperature directly on the thermostat's display at any time. You just can't control it remotely through the Google Home app or Google Assistant until it reconnects.",
  },
  {
    question: 'What is a C-wire and why does it matter for Nest Thermostats?',
    answer:
      "A common wire (C-wire) provides continuous 24V DC power from your HVAC system to the thermostat. Without it, Nest thermostats draw small amounts of power from the heating or cooling circuits to recharge an internal capacitor — a process that can occasionally cause brief HVAC cycles and, over time, cause the thermostat to go offline when charge is insufficient. If you have frequent offline issues, check your HVAC wiring for an available C-wire, or use the Nest Power Connector accessory.",
  },
  {
    question: 'What is status.nest.com?',
    answer:
      "status.nest.com is Google's official real-time status page for Nest and Google Home services. It shows current status for Nest device connectivity, account sign-in, the Google Home app, and related infrastructure. If the page shows a reported outage or degraded performance affecting your region, your offline status may not be locally fixable — wait for Google to restore the affected service before continuing to troubleshoot your device.",
  },
];

const RELATED = [
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

export default function NestThermostatOfflinePage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Nest Thermostat Showing Offline"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Nest Thermostat Showing Offline? Here&rsquo;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              An offline Nest is almost always a lost WiFi connection or a power issue — both are
              fixable in a few minutes without any tools.
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
            body="Our AI can check whether it's a power issue, network problem, or Nest service outage — and walk you through the specific fix."
            chatLink="/chat?device=nest-thermostat&issue=offline"
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
            body="Describe what you're seeing — our AI will walk you through a fix specific to your thermostat model and home setup."
            chatLink="/chat?device=nest-thermostat"
          />
        </div>
      </div>
    </>
  );
}
