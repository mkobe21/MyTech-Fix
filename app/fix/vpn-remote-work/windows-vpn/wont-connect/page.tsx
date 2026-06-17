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
import { Lock, ShieldOff, RefreshCw, WifiOff } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Windows VPN Won't Connect? Here's How to Fix It | MyTech-Fix",
  description:
    "Windows VPN failing to connect? Incorrect or stale credentials are the most common cause. Here's how to fix authentication errors, firewall blocks, and protocol conflicts.",
  alternates: {
    canonical: `${BASE}/fix/vpn-remote-work/windows-vpn/wont-connect`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'VPN & Remote Work', href: '/fix/vpn-remote-work' },
  { label: 'Windows VPN', href: '/fix/vpn-remote-work/windows-vpn' },
  { label: "VPN Won't Connect" },
];

const TLDR = [
  "Re-enter your VPN credentials manually — saved credentials can become stale, especially after a password change or subscription renewal.",
  "Temporarily disable Windows Firewall (Settings > Privacy & Security > Windows Security > Firewall) and retry — re-enable immediately after testing.",
  "Update your VPN client from the provider's website, then try switching protocol (UDP to TCP or vice versa) in the client's settings.",
  "If it fails on your current network but you suspect network-level blocking, test on a mobile hotspot to confirm.",
];

const CAUSES = [
  {
    icon: Lock,
    title: 'Incorrect credentials or an expired VPN account',
    description:
      "The most common reason a VPN refuses to connect is an authentication failure — wrong username, wrong password, or an account that has lapsed. VPN clients often store credentials and silently retry them without prompting; if the password changed after account renewal, the client keeps sending the old one. Re-entering credentials manually (not relying on saved values) eliminates this as a cause immediately.",
    likelihood: 'likely' as const,
  },
  {
    icon: ShieldOff,
    title: 'Windows Firewall or antivirus blocking the VPN connection',
    description:
      "Windows Firewall and third-party antivirus products (especially those with network inspection features) frequently block VPN protocols or the VPN client's network adapter. This is particularly common after a Windows update or after installing new security software. The VPN client may show a generic 'connection failed' error rather than a firewall-specific message, making this non-obvious to diagnose without testing.",
    likelihood: 'common' as const,
  },
  {
    icon: RefreshCw,
    title: 'Outdated VPN client or conflicting protocol setting',
    description:
      "VPN client updates often include fixes for connection failures caused by changes in server-side infrastructure. An outdated client may fail silently against updated servers. Protocol conflicts are also common: a client set to use a specific protocol (OpenVPN UDP, L2TP, IKEv2) may fail on certain networks while another protocol succeeds. Most clients allow manual protocol selection in settings.",
    likelihood: 'common' as const,
  },
  {
    icon: WifiOff,
    title: 'ISP or network-level blocking of VPN traffic',
    description:
      "Some networks block VPN traffic at the router or gateway level — this is common on certain public WiFi networks (airports, hotels, schools), some corporate networks, and ISPs in certain regions. The tell-tale sign is that the VPN works fine on your home network or mobile hotspot but fails on a specific network. Switching protocol to TCP on port 443 (which mimics HTTPS traffic) often bypasses this type of blocking.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: "Re-enter VPN credentials manually",
    description:
      "Open your VPN client and go to its account or login settings. Clear any saved username and password fields and retype them fresh — don't paste from a clipboard with invisible whitespace. Confirm your subscription is active by logging into the VPN provider's website. If your provider uses a separate VPN username and password (distinct from your account login), check the provider's dashboard for the correct VPN credentials.",
  },
  {
    title: "Temporarily disable Windows Firewall and test the connection",
    description:
      "Go to Settings > Privacy & Security > Windows Security > Firewall & network protection. Click the active network profile (Domain, Private, or Public) and toggle the firewall off. Immediately attempt to connect with your VPN. If it succeeds, the firewall was the cause — re-enable the firewall, then add an exception: Windows Security > Firewall & network protection > Allow an app through firewall and add your VPN client. Re-enable the firewall before continuing normal use.",
    tip: "Never leave Windows Firewall disabled. The test is only to confirm it's the cause — always add a proper exception rather than leaving the firewall off.",
  },
  {
    title: "Update the VPN client from the provider's website",
    description:
      "Avoid updating through in-app prompts alone — go directly to the VPN provider's download page in a browser and download the latest version. Uninstall the current client first (Settings > Apps > your VPN app > Uninstall), restart, then install the fresh download. This ensures you get the full current build rather than a patched incremental update.",
  },
  {
    title: "Switch VPN protocol in the client settings",
    description:
      "In your VPN client's settings, look for a Protocol or Connection section. If currently on UDP, switch to TCP — or vice versa. On networks that block VPNs, try a protocol that uses port 443 (the same port as HTTPS) if your client offers it (often labeled 'TCP port 443' or 'Obfuscated'). WireGuard uses UDP only, so if WireGuard is failing on a restricted network, switch to OpenVPN TCP.",
  },
  {
    title: "Restart the computer and router",
    description:
      "A full Windows restart clears stale VPN adapter state, driver issues, and in-memory routing table conflicts that can accumulate after sleep/wake cycles. After restarting, also restart your router by unplugging it for 30 seconds — this clears any connection-state entries the router may have cached for the previous failed VPN session.",
  },
  {
    title: "Test on a mobile hotspot to rule out network-level blocking",
    description:
      "Enable hotspot on your phone and connect your Windows PC to it via WiFi. Attempt the VPN connection. If it works immediately on the hotspot but not on your regular network, the issue is specific to that network (your home router, your ISP, or a public WiFi restriction) rather than the VPN client or Windows. Contact your router's admin settings or switch VPN protocol to TCP/443 to work around network-side blocking.",
  },
];

const FAQS = [
  {
    question: "Why does my VPN say 'Authentication Failed' even with the correct password?",
    answer:
      "Authentication failures with correct credentials usually mean one of three things: the VPN service uses a separate VPN username/password distinct from your account login (check the provider's dashboard), your subscription has lapsed or the account has been flagged for too many failed attempts and temporarily locked, or the client is sending a cached old password rather than the one you think you're entering. Re-entering credentials through the provider's web portal first to confirm they work, then entering the same values fresh in the client, resolves most cases.",
  },
  {
    question: "Can Windows Firewall really block a VPN connection?",
    answer:
      "Yes — Windows Firewall can block the VPN client's network adapter driver, block specific VPN protocols (L2TP uses ports 500 and 4500 that Firewall may restrict), or block outbound connections from the VPN application entirely. Third-party security suites (Norton, McAfee, Bitdefender) with network inspection features are even more aggressive. The quickest confirmation is to temporarily disable the firewall or security suite, test the VPN, and re-enable — then add a proper app exception rather than leaving it disabled.",
  },
  {
    question: "Why does my VPN work on some networks but not others?",
    answer:
      "Network-level VPN blocking is the cause. Some networks — corporate offices, schools, hotels, public WiFi, and ISPs in certain regions — block common VPN protocols at the gateway. UDP-based protocols (WireGuard, OpenVPN UDP) are easier to block than TCP on port 443, which resembles HTTPS traffic. If your VPN client offers an 'obfuscated' or 'stealth' mode, or the option to use TCP on port 443, enabling this almost always bypasses network-level restrictions.",
  },
  {
    question: "Do I need to open ports on my router for a VPN to work?",
    answer:
      "For a VPN client connecting to a remote server (the typical home/work use case), you do not need to open any ports on your router — outbound connections initiate from your PC and don't require inbound port forwarding. Port forwarding is only needed if you're hosting your own VPN server at home and want to connect to it from outside. Commercial VPN clients (NordVPN, ExpressVPN, Mullvad, etc.) work without any router changes.",
  },
];

const RELATED = [
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
    category: 'Windows VPN',
    title: 'VPN Blocking Internet Access',
    href: '/fix/vpn-remote-work/windows-vpn/blocking-internet-access',
  },
  {
    category: 'Windows VPN Guides',
    title: 'All Windows VPN troubleshooting guides →',
    href: '/fix/vpn-remote-work/windows-vpn',
  },
];

export default function WindowsVpnWontConnectPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Windows VPN Won't Connect"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Windows VPN Won&rsquo;t Connect? Here&rsquo;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Stale credentials and Windows Firewall blocks are the two most common causes. Here&rsquo;s
              how to diagnose which one is stopping your connection and fix it.
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
            heading="VPN still won't connect after these steps?"
            body="Describe your VPN provider, the error message you see, and which network you're on — our AI can walk you through a targeted fix."
            chatLink="/chat?category=vpn&issue=wont-connect"
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
            body="Tell our AI your VPN client, Windows version, and what error message appears — it'll give you a targeted fix for your specific setup."
            chatLink="/chat?category=vpn"
          />
        </div>
      </div>
    </>
  );
}
