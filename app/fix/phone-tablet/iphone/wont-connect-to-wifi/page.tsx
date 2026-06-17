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
import { Lock, RefreshCw, WifiOff, Settings } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "iPhone Won't Connect to WiFi? Here's How to Fix It | MyTech-Fix",
  description:
    "iPhone won't join your WiFi network? A wrong or cached password is the most common cause. Here's how to forget and reconnect, reset network settings, and fix router-side issues.",
  alternates: {
    canonical: `${BASE}/fix/phone-tablet/iphone/wont-connect-to-wifi`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Phone & Tablet', href: '/fix/phone-tablet' },
  { label: 'iPhone', href: '/fix/phone-tablet/iphone' },
  { label: "iPhone Won't Connect to WiFi" },
];

const TLDR = [
  "Try forgetting the network first: Settings > WiFi > tap (i) next to the network > Forget This Network, then reconnect and re-enter the password.",
  "Toggle WiFi off and on, or restart the iPhone — a software glitch after an iOS update is a common cause.",
  "If other devices connect fine but your iPhone doesn't, check your router's MAC address filtering or band settings.",
  "Reset Network Settings (Settings > General > Transfer or Reset iPhone > Reset > Reset Network Settings) as a last resort — this clears all saved WiFi passwords.",
];

const CAUSES = [
  {
    icon: Lock,
    title: 'WiFi password entered incorrectly, or the network needs to be re-added',
    description:
      "The most common reason an iPhone won't connect is a wrong password or a cached credential that's gone stale. If you recently changed your router's WiFi password, your iPhone still has the old one saved and will fail silently without prompting you for the new one. Forgetting the network forces the iPhone to prompt for fresh credentials.",
    likelihood: 'likely' as const,
  },
  {
    icon: RefreshCw,
    title: 'Software glitch in the WiFi toggle — common after an iOS update',
    description:
      "iOS updates occasionally introduce transient bugs that affect WiFi connectivity. The iPhone's WiFi radio can get stuck in an intermediate state where it appears to try connecting but never succeeds. A full restart (not just locking the screen) or toggling WiFi off and back on typically resolves this without any settings changes.",
    likelihood: 'common' as const,
  },
  {
    icon: WifiOff,
    title: 'Router-side issue — MAC filtering or band mismatch',
    description:
      "Some routers use MAC address filtering to control which devices can join the network, or are configured to only broadcast 5GHz when the iPhone is trying 2.4GHz (or vice versa). If your iPhone connects successfully in one part of the house but not another, a band mismatch is likely. If other devices can connect but your iPhone specifically cannot, MAC filtering is worth checking in your router's admin settings.",
    likelihood: 'common' as const,
  },
  {
    icon: Settings,
    title: 'Corrupted network settings profile requiring a full network reset',
    description:
      "In rare cases, the iPhone's stored network configuration becomes corrupted — often after restoring from a backup or following a failed iOS update. The device appears to connect but immediately drops, or the network doesn't appear in the list at all despite being in range. A Reset Network Settings clears all stored WiFi profiles and starts fresh, which resolves this.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Toggle WiFi off and back on, or restart the iPhone',
    description:
      "Open Control Center and tap the WiFi icon to turn it off, wait 5 seconds, then tap it again to turn it back on. If that doesn't work, do a full restart: on iPhone X and later, press and hold the side button and either volume button until the power slider appears, then drag the slider. On iPhone SE (3rd gen), press and hold the side button. A restart takes about 30 seconds and clears transient software bugs that can block WiFi.",
  },
  {
    title: 'Forget the network and reconnect',
    description:
      "Go to Settings > WiFi and tap the (i) icon next to the network name you're trying to join. Tap 'Forget This Network' and confirm. Then tap the network name again from the list, enter the WiFi password carefully (passwords are case-sensitive), and tap Join. This forces the iPhone to create a fresh connection profile rather than retrying a potentially corrupted one.",
    tip: 'If your router uses a long random password, check the password label on the back of your router or in your router admin page — one wrong character will cause a silent failure.',
  },
  {
    title: 'Confirm you are running the latest iOS version',
    description:
      "Go to Settings > General > Software Update. If an update is available, install it — Apple regularly releases point updates that fix WiFi-related bugs introduced in prior releases. If you just installed an iOS update and WiFi broke immediately after, a subsequent update is the most reliable long-term fix.",
  },
  {
    title: 'Restart your router and rule out a router-side issue',
    description:
      "Unplug your router from power, wait 30 seconds, and plug it back in. Allow 2 minutes for the router to fully restart and re-establish its connection. Then try connecting your iPhone again. Also test whether other devices (another phone, a laptop) can connect to the same network — if they can't, the issue is with the router, not the iPhone.",
  },
  {
    title: 'Check your router for MAC address filtering',
    description:
      "Log in to your router's admin page (typically 192.168.1.1 or 192.168.0.1 in a browser) and look for a 'MAC Filtering,' 'Access Control,' or 'Wireless Filter' setting. If it's enabled with a whitelist, your iPhone's MAC address may not be on it. You can find your iPhone's WiFi MAC address under Settings > General > About > Wi-Fi Address. Add it to the whitelist, or disable MAC filtering if you don't need it.",
  },
  {
    title: 'Reset Network Settings as a last resort',
    description:
      "If none of the above steps work, go to Settings > General > Transfer or Reset iPhone > Reset > Reset Network Settings. This clears all saved WiFi passwords, VPN configurations, and Bluetooth pairings. The iPhone restarts and you'll need to re-enter WiFi passwords for every network you use. This resolves corrupted network profiles that no other step can fix.",
    tip: 'Write down or screenshot any custom DNS or VPN settings before resetting — these will be wiped and you will need to reconfigure them.',
  },
];

const FAQS = [
  {
    question: "Why won't my iPhone connect to WiFi even with the correct password?",
    answer:
      "If you're certain the password is correct but the iPhone still won't connect, try forgetting the network and reconnecting — this clears a cached credential that may have become stale. If that doesn't help, check your router for MAC address filtering or band restrictions. In rarer cases, the iPhone needs a network settings reset (Settings > General > Transfer or Reset iPhone > Reset > Reset Network Settings) to clear a corrupted profile.",
  },
  {
    question: 'How do I reset network settings on my iPhone?',
    answer:
      "Go to Settings > General > Transfer or Reset iPhone > Reset > Reset Network Settings. You'll be prompted for your passcode. The iPhone restarts and clears all saved WiFi passwords, VPN settings, APN settings, and Bluetooth pairings — you'll need to reconnect to every WiFi network you use. Only use this if the other steps have failed, as it's a more disruptive change.",
  },
  {
    question: 'Can an iOS update cause WiFi problems on iPhone?',
    answer:
      "Yes — iOS updates occasionally introduce bugs that affect WiFi behavior. A restart immediately after updating often resolves them. If the problem persists, try forgetting and reconnecting to your network. Apple typically addresses known WiFi regressions in point releases (e.g., iOS 17.5.1 following iOS 17.5), so keeping iOS updated is both the cause of and the fix for these issues.",
  },
  {
    question: "Why does my iPhone connect to WiFi but show no internet?",
    answer:
      "When the iPhone shows it's connected to WiFi but has no internet, the issue is usually on the router or ISP side rather than the iPhone itself. Check whether other devices have internet — if they don't, restart the router. If only the iPhone has no internet, try forgetting and reconnecting the network. DNS issues can also cause this: go to Settings > WiFi > tap (i) next to the network > Configure DNS and switch to Automatic if it was set to manual.",
  },
];

const RELATED = [
  {
    category: 'iPhone',
    title: 'iPhone Bluetooth Won\'t Pair',
    href: '/fix/phone-tablet/iphone/bluetooth-wont-pair',
  },
  {
    category: 'iPhone',
    title: 'iPhone Battery Draining Fast',
    href: '/fix/phone-tablet/iphone/battery-draining-fast',
  },
  {
    category: 'iPhone',
    title: 'iPhone Storage Full Error',
    href: '/fix/phone-tablet/iphone/storage-full-error',
  },
  {
    category: 'iPhone Guides',
    title: 'All iPhone troubleshooting guides →',
    href: '/fix/phone-tablet/iphone',
  },
  {
    category: 'WiFi & Networking',
    title: 'Router issue instead? See WiFi & Networking guides →',
    href: '/fix/wifi',
  },
];

export default function IPhoneWontConnectToWifiPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix iPhone Won't Connect to WiFi"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              iPhone Won&rsquo;t Connect to WiFi? Here&rsquo;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A wrong or cached password is the most common cause. Here&rsquo;s how to forget
              and reconnect, restart correctly, and fix router-side issues blocking your iPhone.
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
            heading="iPhone still won't connect after these steps?"
            body="Our AI can walk you through a live diagnostic — describe your router model and what happens when you try to connect."
            chatLink="/chat?device=iphone&issue=wifi"
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
            heading="Still having trouble with your iPhone?"
            body="Tell our AI what iOS version you're running and what error appears — it'll give you a targeted fix for your specific setup."
            chatLink="/chat?device=iphone"
          />
        </div>
      </div>
    </>
  );
}
