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
import { ShieldOff, Globe, GitBranch, HardDrive } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "VPN Blocking Internet Access? Here's How to Fix It | MyTech-Fix",
  description:
    "VPN connected but no internet? The kill switch blocking traffic while the tunnel isn't fully established is the most common cause. Here's how to diagnose and fix it.",
  alternates: {
    canonical: `${BASE}/fix/vpn-remote-work/windows-vpn/blocking-internet-access`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'VPN & Remote Work', href: '/fix/vpn-remote-work' },
  { label: 'Windows VPN', href: '/fix/vpn-remote-work/windows-vpn' },
  { label: 'VPN Blocking Internet' },
];

const TLDR = [
  "Check if your VPN's Kill Switch is active and blocking traffic because the VPN tunnel itself isn't fully established — temporarily disable it to confirm, then fix the connection issue.",
  "Flush DNS from an elevated Command Prompt: run `ipconfig /flushdns` then reconnect the VPN.",
  "Disconnect and fully quit the VPN client (not just minimize it), restart it, then reconnect.",
  "If nothing else works, uninstall and reinstall the VPN client — this resets its virtual network adapter, which is the most common root of persistent blocking.",
];

const CAUSES = [
  {
    icon: ShieldOff,
    title: "Kill switch blocking all traffic because the VPN tunnel isn't established",
    description:
      "The VPN kill switch is designed to block all internet traffic if the VPN tunnel drops — preventing any data from traveling unencrypted. When the kill switch is active and the VPN connection itself fails to fully establish, the kill switch correctly blocks all traffic. The result looks like the VPN is 'on' but the internet is completely unavailable. This is the intended behavior of the kill switch, but it traps users who don't realize the VPN isn't actually connected.",
    likelihood: 'likely' as const,
  },
  {
    icon: Globe,
    title: "DNS settings conflict — VPN DNS isn't resolving correctly",
    description:
      "VPN connections typically override the DNS server settings Windows uses, pointing traffic through the VPN provider's DNS. If the VPN's DNS configuration fails to apply — or conflicts with manually set DNS servers — domain names can't resolve, making the internet appear unavailable even though the TCP/IP connection is working. This presents as 'connected' with no web pages loading rather than a complete network failure.",
    likelihood: 'common' as const,
  },
  {
    icon: GitBranch,
    title: 'Split tunneling misconfiguration routing traffic incorrectly',
    description:
      "Split tunneling allows some traffic to bypass the VPN tunnel while other traffic routes through it. A misconfigured split tunnel can accidentally route all traffic through the VPN when the tunnel is broken, or block traffic that was meant to bypass the VPN. This is particularly common after updating the VPN client, which may reset split tunneling rules to default.",
    likelihood: 'common' as const,
  },
  {
    icon: HardDrive,
    title: "Corrupted VPN network adapter requiring reinstallation",
    description:
      "VPN clients install a virtual network adapter in Windows that all VPN traffic routes through. If this adapter's driver becomes corrupted — after a Windows update, driver conflict, or incomplete VPN update — the adapter can block traffic without the VPN being able to fix it through settings alone. The adapter appears in Device Manager but fails to route traffic correctly. A full uninstall and reinstall of the VPN client removes and recreates the adapter.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: "Check and temporarily disable the Kill Switch",
    description:
      "Open your VPN client's settings and look for 'Kill Switch,' 'Network Lock,' or 'Internet Kill Switch.' If it's enabled, temporarily turn it off. Then attempt to connect the VPN. If internet access returns when the kill switch is off, the kill switch is working correctly — the underlying VPN connection is failing, which triggers the kill switch to block traffic. Fix the VPN connection issue first (see 'Windows VPN Won't Connect'), then re-enable the kill switch.",
    tip: "Never leave the kill switch disabled as a permanent fix. It's a safety feature. The right resolution is to fix the VPN connection itself, then re-enable the kill switch.",
  },
  {
    title: "Flush DNS and reconnect the VPN",
    description:
      "Press Win + S and search for 'Command Prompt.' Right-click it and select 'Run as administrator.' In the window, type: `ipconfig /flushdns` and press Enter. You should see 'Successfully flushed the DNS Resolver Cache.' Then disconnect and reconnect the VPN. This clears cached DNS entries that may have become stale or conflicted with the VPN's DNS settings.",
  },
  {
    title: "Disconnect, fully quit the VPN client, and restart it",
    description:
      "Clicking 'Disconnect' in the VPN client may leave background processes running. Right-click the VPN icon in the system tray and choose 'Quit' or 'Exit' to fully close it. Wait 10 seconds. Then relaunch the client from the Start menu and reconnect. This clears any in-memory state where the client believes it's partially connected — which is enough to trigger the kill switch — without actually having a working tunnel.",
  },
  {
    title: "Disable Split Tunneling temporarily to test",
    description:
      "In your VPN client's settings, look for Split Tunneling (may also be called 'App Exclusions' or 'Bypass VPN'). If enabled, temporarily disable it and reconnect. If internet access returns, a split tunneling rule was routing traffic incorrectly. Review each app exclusion rule and remove any that shouldn't be there, or reset split tunneling to default settings.",
  },
  {
    title: "Restart Windows",
    description:
      "A full Windows restart clears routing table state, resets network adapter drivers, and terminates any background VPN processes that may be holding the network in a partially configured state. After restarting, connect the VPN before opening any other applications to give it a clean network state to work with.",
  },
  {
    title: "Uninstall and reinstall the VPN client",
    description:
      "Go to Settings > Apps > Installed Apps and search for your VPN client. Uninstall it completely and restart Windows. After restarting, download the latest version from the VPN provider's website and install fresh. This removes and recreates the virtual network adapter and all associated driver files, which is the only way to fully reset a corrupted VPN network configuration that has persisted through client restarts.",
  },
];

const FAQS = [
  {
    question: "What is a VPN kill switch and why is it blocking my internet?",
    answer:
      "A kill switch is a safety feature that blocks all internet traffic when the VPN tunnel drops or fails to establish — ensuring your real IP address and unencrypted traffic never leak outside the VPN. When the kill switch is active and the VPN connection itself is broken, you'll have no internet access at all. This is correct, intentional behavior. The fix is to either repair the VPN connection (so the kill switch permits traffic through the tunnel) or temporarily disable the kill switch to diagnose the connection issue.",
  },
  {
    question: "How do I flush DNS on Windows?",
    answer:
      "Open Command Prompt as administrator (search 'cmd' in Start, right-click > 'Run as administrator'). Type `ipconfig /flushdns` and press Enter. You'll see the confirmation message 'Successfully flushed the DNS Resolver Cache.' This clears locally cached DNS records that may conflict with the VPN's DNS settings. It's a safe operation with no downside — DNS entries are re-cached from scratch on the next request.",
  },
  {
    question: "What is split tunneling on a VPN?",
    answer:
      "Split tunneling lets you choose which apps or traffic routes through the VPN tunnel and which uses your regular internet connection. For example, you could route work applications through the VPN while streaming on Netflix through your regular connection. When misconfigured, split tunneling can route traffic incorrectly, making it appear the VPN is blocking access. If you're experiencing internet access issues after enabling split tunneling, disable it temporarily to confirm it's the cause.",
  },
  {
    question: "Why does reinstalling the VPN client fix blocking issues?",
    answer:
      "VPN clients install a virtual network adapter and modify Windows routing tables. If either becomes corrupted — through a partial update, driver conflict, or failed uninstall of a previous VPN client — no amount of reconnecting or settings changes can fix the broken adapter. Uninstalling the VPN client removes its virtual adapter entirely; reinstalling creates a fresh one with clean configuration. This is the nuclear option but is reliably effective for persistent blocking issues that survive restarts.",
  },
];

const RELATED = [
  {
    category: 'Windows VPN',
    title: "Windows VPN Won't Connect",
    href: '/fix/vpn-remote-work/windows-vpn/wont-connect',
  },
  {
    category: 'Windows VPN',
    title: 'Windows VPN Keeps Disconnecting',
    href: '/fix/vpn-remote-work/windows-vpn/keeps-disconnecting',
  },
  {
    category: 'Windows VPN',
    title: 'Windows VPN Slow Speeds',
    href: '/fix/vpn-remote-work/windows-vpn/slow-speeds',
  },
  {
    category: 'Windows VPN Guides',
    title: 'All Windows VPN troubleshooting guides →',
    href: '/fix/vpn-remote-work/windows-vpn',
  },
];

export default function VpnBlockingInternetPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix VPN Blocking Internet Access"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              VPN Blocking Internet Access? Here&rsquo;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The kill switch blocking traffic while the VPN tunnel isn&rsquo;t fully established
              is the most common cause. Here&rsquo;s how to identify and resolve it.
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
            heading="VPN still blocking internet after these steps?"
            body="Tell our AI your VPN client, what happens when you disconnect the VPN, and whether you've tried reinstalling — it'll help pinpoint the cause."
            chatLink="/chat?category=vpn&issue=blocking-internet"
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
            heading="Still having VPN trouble?"
            body="Describe what happens when you connect and disconnect the VPN — our AI will walk you through a targeted fix."
            chatLink="/chat?category=vpn"
          />
        </div>
      </div>
    </>
  );
}
