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
import { Smartphone, RefreshCw, User, Shield } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Netgear Orbi Won't Connect to the App? Here's the Fix | MyTech-Fix",
  description:
    "Orbi app can't find your router? Your phone's network connection is usually the culprit. Step-by-step fixes to get the app working again.",
  alternates: {
    canonical: `${BASE}/fix/wifi/netgear-orbi/wont-connect-to-app`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Netgear Orbi', href: '/fix/wifi/netgear-orbi' },
  { label: "Orbi Won't Connect to App" },
];

const TLDR = [
  'Your phone must be on your Orbi WiFi network — not cellular data, not a different network.',
  'Update the Orbi app before troubleshooting — many app connection failures are app version bugs.',
  'A stale NETGEAR account session blocks the app from loading — log out and back in first.',
  'Test orbilogin.com in a browser while on Orbi WiFi — if that works, the issue is the app itself.',
];

const CAUSES = [
  {
    icon: Smartphone,
    title: "Phone isn't on your Orbi WiFi network",
    description:
      "The Orbi app communicates with your router over your local network — it doesn't use the internet. If your phone is on cellular data or connected to a neighbor's WiFi, it literally can't reach your router's IP address and the app shows \"no connection.\"",
    likelihood: 'likely' as const,
  },
  {
    icon: RefreshCw,
    title: 'Orbi app is outdated',
    description:
      "An old version of the Orbi app may have bugs that cause it to fail on discovery or authentication. NETGEAR ships app updates frequently — if your app is several versions behind, updating it often resolves the issue immediately.",
    likelihood: 'common' as const,
  },
  {
    icon: User,
    title: 'NETGEAR account session has expired',
    description:
      "The Orbi app requires an active NETGEAR account login. If your session has timed out or the token is corrupted, the app will fail to connect even when your phone is on the right network. A log-out/log-in cycle refreshes the session.",
    likelihood: 'common' as const,
  },
  {
    icon: Shield,
    title: 'VPN active on your phone',
    description:
      "Many VPN apps route all traffic through an encrypted tunnel, which intercepts local network traffic. This prevents the Orbi app from seeing the router at its local IP address. Disabling the VPN temporarily is enough to confirm if this is the cause.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Confirm your phone is on your Orbi WiFi network',
    description:
      "Open your phone's WiFi settings and verify it shows your Orbi network name — not a different network and not cellular. If it's on cellular, switch to WiFi. If it's on a guest network (which is isolated from the router admin), connect to your main network instead.",
    tip: 'The Orbi app communicates over your local network — it does not work over cellular data or from outside your home.',
  },
  {
    title: 'Update the Orbi app to the latest version',
    description:
      "Open the App Store (iPhone) or Google Play (Android) and search for the Orbi app. If an update is available, install it. Then force-quit the app and reopen it before trying to connect.",
  },
  {
    title: 'Log out of your NETGEAR account and log back in',
    description:
      "In the Orbi app, go to Menu → Settings → tap your account name → Log Out. Close the app completely, reopen it, and sign back in with your NETGEAR credentials. This refreshes the authentication token and resolves most session-related failures.",
  },
  {
    title: 'Disable any VPN on your phone',
    description:
      "If you have a VPN app running, disable it temporarily. Check Settings → VPN on iPhone, or your VPN app directly on Android. Then open the Orbi app again. If it connects, you'll know VPN was the issue — you can re-enable the VPN after finishing with the Orbi app.",
  },
  {
    title: 'Power cycle the Orbi router',
    description:
      "Unplug the Orbi router from power, wait 30 seconds, and plug it back in. Wait 2 full minutes for it to fully restart before opening the app. This refreshes the router's DHCP lease list and clears any stale connection state.",
  },
  {
    title: 'Test orbilogin.com in a browser to confirm connectivity',
    description:
      "While connected to your Orbi WiFi, open a browser and navigate to orbilogin.com. If the router admin login page appears, your phone can reach the router fine — the issue is specific to the app. In that case, try uninstalling and reinstalling the Orbi app.",
    tip: 'orbilogin.com only works from inside your Orbi network. It resolves to your router\'s local IP (usually 192.168.1.1). This is the fastest way to confirm your phone is reachable.',
  },
];

const FAQS = [
  {
    question: 'Why does the Orbi app only work on the same WiFi network?',
    answer:
      "The Orbi app communicates directly with your router over your local network using local IP addresses (like 192.168.1.1). It doesn't route through the internet. If your phone is on cellular or a different network, it can't reach your router's IP address at all — hence \"no connection.\" This is by design; it's a local management app, not a cloud-managed service.",
  },
  {
    question: 'What is orbilogin.com and how do I use it?',
    answer:
      "orbilogin.com is a NETGEAR-provided DNS hostname that resolves to your Orbi router's local IP address when you're on your Orbi network. Type it into any browser while connected to your Orbi WiFi to open the router's admin panel directly. If it works in a browser but the app doesn't, reinstall the Orbi app.",
  },
  {
    question: 'Can a VPN on my phone block the Orbi app?',
    answer:
      "Yes. Many VPN apps route all traffic — including local network traffic — through their encrypted tunnel. This prevents direct communication with your router's local IP address. To fix it, disable the VPN before opening the Orbi app. You can re-enable it once you're done managing the router.",
  },
  {
    question: 'Can I manage my Orbi router without the app?',
    answer:
      "Yes. Open any browser while connected to your Orbi WiFi and navigate to orbilogin.com or 192.168.1.1. The router's web admin panel gives you access to all major settings: WiFi passwords, connected devices, parental controls, firmware updates, and more — without needing the app at all.",
  },
];

const RELATED = [
  {
    category: 'Netgear Orbi',
    title: 'Orbi Red Light or Red Ring',
    href: '/fix/wifi/netgear-orbi/red-light-blinking',
  },
  {
    category: 'Netgear Orbi',
    title: 'Orbi Keeps Disconnecting',
    href: '/fix/wifi/netgear-orbi/keeps-disconnecting',
  },
  {
    category: 'Netgear Orbi',
    title: 'Orbi Slow Speeds',
    href: '/fix/wifi/netgear-orbi/slow-speeds',
  },
  {
    category: 'Orbi Guides',
    title: 'All Orbi troubleshooting guides →',
    href: '/fix/wifi/netgear-orbi',
  },
];

export default function OrbiWontConnectPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Netgear Orbi App Connection"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Netgear Orbi Won&apos;t Connect to the App? Here&apos;s the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The most common cause is your phone being on the wrong network. Here&apos;s how to
              diagnose and fix it in a few minutes.
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
            heading="App still not connecting after these steps?"
            body="Our AI can walk through your specific setup — phone model, Orbi model, and network state — and give you a targeted fix."
            chatLink="/chat?device=netgear-orbi&issue=app-connect"
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
            heading="Still having trouble with your Orbi?"
            body="Describe what you're seeing in the chat and our AI will give you a step-by-step fix specific to your setup."
            chatLink="/chat?device=netgear-orbi"
          />
        </div>
      </div>
    </>
  );
}
