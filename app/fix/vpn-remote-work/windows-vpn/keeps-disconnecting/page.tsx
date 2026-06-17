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
import { Battery, WifiOff, Server, Layers } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Windows VPN Keeps Disconnecting? Here's the Fix | MyTech-Fix",
  description:
    "VPN dropping every few minutes on Windows? Windows power management putting your network adapter to sleep is the most common cause. Here's how to fix it.",
  alternates: {
    canonical: `${BASE}/fix/vpn-remote-work/windows-vpn/keeps-disconnecting`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'VPN & Remote Work', href: '/fix/vpn-remote-work' },
  { label: 'Windows VPN', href: '/fix/vpn-remote-work/windows-vpn' },
  { label: 'VPN Keeps Disconnecting' },
];

const TLDR = [
  "Disable power management on your network adapter: Device Manager > Network adapters > right-click your adapter > Properties > Power Management > uncheck 'Allow the computer to turn off this device to save power.'",
  "If on WiFi, try a wired Ethernet connection — an unstable wireless signal is often the underlying cause of repeated VPN drops.",
  "Switch to a different VPN server location in your client — an overloaded server drops connections more frequently than a healthy one.",
  "Check for any other VPN or proxy software running in the background — two VPN clients active simultaneously cause persistent conflicts.",
];

const CAUSES = [
  {
    icon: Battery,
    title: 'Windows power management suspending the network adapter',
    description:
      "Windows applies aggressive power-saving settings to network adapters, especially on laptops. When the system enters a low-power state or the adapter sits idle for a short period, Windows can turn it off to save power — which immediately drops any active VPN tunnel. The adapter restarts a few seconds later and reconnects to WiFi, but the VPN tunnel has already been terminated. This is the most common cause of VPN drops that occur at regular intervals rather than randomly.",
    likelihood: 'likely' as const,
  },
  {
    icon: WifiOff,
    title: 'Unstable WiFi causing the VPN tunnel to drop',
    description:
      "A VPN tunnel requires a persistent network connection to stay alive. Any interruption in the underlying WiFi — a brief signal drop, a router retransmission, a band steering event — breaks the tunnel's keepalive mechanism and causes the VPN client to terminate and restart the connection. If the VPN drops correlate with slow browsing, buffering video, or other signs of WiFi instability, fixing the WiFi connection resolves the VPN issue.",
    likelihood: 'common' as const,
  },
  {
    icon: Server,
    title: 'VPN server overload causing connection timeouts',
    description:
      "VPN servers handle a finite number of simultaneous connections. When a server is congested — especially during peak hours or after a regional outage routes traffic to a subset of servers — it begins dropping connections to manage load. The client reconnects, the tunnel briefly re-establishes, and then drops again. Switching to a different server location in the VPN client is the fastest way to test and fix this: if another server is stable, congestion was the cause.",
    likelihood: 'common' as const,
  },
  {
    icon: Layers,
    title: 'Conflict with another VPN or proxy software',
    description:
      "Running two VPN clients simultaneously — or a VPN alongside a proxy tool, anonymizing browser extension, or corporate split-tunnel client — creates routing table conflicts that cause one or both tunnels to drop repeatedly. Corporate VPN clients (Cisco AnyConnect, GlobalProtect, Pulse Secure) are particularly aggressive about controlling the routing table and will conflict with commercial VPN clients. Check the taskbar system tray for any VPN or proxy software running alongside your primary client.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: "Disable power management on the network adapter",
    description:
      "Right-click the Start menu and open Device Manager. Expand 'Network adapters.' Right-click your WiFi adapter (or Ethernet adapter if wired) and select Properties. Go to the Power Management tab. Uncheck 'Allow the computer to turn off this device to save power.' Click OK. Repeat for any other network adapters listed. This prevents Windows from suspending the adapter mid-session and is the single most effective fix for regular VPN drops on laptops.",
  },
  {
    title: "Switch to a wired Ethernet connection if possible",
    description:
      "Connect your PC to the router via an Ethernet cable and test the VPN. A wired connection eliminates WiFi instability as a variable entirely. If the VPN stays connected on Ethernet but drops on WiFi, your wireless signal quality is the root cause — improve it with a WiFi extender, move the router, or switch the adapter to use the 5GHz band if range isn't a concern.",
  },
  {
    title: "Switch to a different VPN server location",
    description:
      "Open your VPN client and change to a server in a different location — ideally one geographically closer to you, which also tends to have lower load. If your client shows server load indicators (some do), choose a server below 50% load. Connect and monitor for 10–15 minutes. If the new server is stable and the old one was dropping, congestion on that specific server was the cause.",
  },
  {
    title: "Check for conflicting VPN or proxy software",
    description:
      "Look in the taskbar system tray (bottom right, including the hidden icons) for any VPN icons, proxy indicators, or network tools you may have forgotten about. Also check Settings > Apps > Installed Apps and search for 'VPN' or 'proxy.' If you find a second VPN client or a corporate VPN tool, disconnect or quit it before testing your primary VPN. Two active VPN clients cannot coexist without conflicts.",
  },
  {
    title: "Update the VPN client",
    description:
      "Download the latest version from your VPN provider's website and install it fresh. Reconnection stability is one of the most common improvements in VPN client updates — buggy keepalive handling in older versions is a known cause of regular drops. After updating, test the connection for at least 15–30 minutes before concluding the issue is fixed.",
  },
  {
    title: "Enable auto-reconnect in the VPN client settings",
    description:
      "Most VPN clients include an auto-reconnect option — sometimes labeled 'Reconnect on drop,' 'Auto-reconnect,' or found under General or Connection settings. Enable this as a safety net. While it doesn't address the underlying cause, it ensures that if the VPN does drop, it reconnects within seconds rather than requiring manual intervention. Use this alongside the power management fix rather than instead of it.",
  },
];

const FAQS = [
  {
    question: "Why does my VPN disconnect when my Windows PC goes to sleep?",
    answer:
      "When Windows enters sleep or hibernate mode, it suspends all network adapters to save power. The VPN client has no network connection to maintain, so the tunnel is terminated. When the PC wakes up, the adapter restarts, WiFi reconnects, and the VPN needs to reconnect manually — unless the client has auto-reconnect enabled. For laptops on battery, this behavior is by design. Enable auto-reconnect in the VPN client settings to minimize the interruption, and disable power management on the network adapter to prevent drops during active use without sleep.",
  },
  {
    question: "How do I stop Windows from turning off my network adapter?",
    answer:
      "Open Device Manager (right-click Start > Device Manager), expand 'Network adapters,' right-click your adapter > Properties > Power Management tab > uncheck 'Allow the computer to turn off this device to save power.' This setting is per-adapter, so if you have both a WiFi and an Ethernet adapter, apply it to both. On laptops, this setting may be re-enabled after a Windows update or driver reinstall — check it again if the drops return after an update.",
  },
  {
    question: "What is VPN auto-reconnect and how do I enable it?",
    answer:
      "VPN auto-reconnect automatically re-establishes the VPN tunnel when it drops, without requiring manual intervention. Most commercial VPN clients include this feature under names like 'Reconnect on drop,' 'Auto-reconnect,' or similar. The location varies by client — look in General, Connection, or Advanced settings. When enabled, the client detects the dropped tunnel and initiates a new connection, typically within 5–15 seconds. Note that during the gap between drop and reconnect, your traffic travels without the VPN — if privacy is critical, use the kill switch alongside auto-reconnect.",
  },
  {
    question: "Can two VPN clients run at the same time on Windows?",
    answer:
      "No — running two VPN clients simultaneously causes routing table conflicts that make both tunnels unstable. Each VPN client installs a virtual network adapter and modifies the Windows routing table to direct traffic through its tunnel. Two clients compete for routing control, causing repeated drops. Corporate VPN clients (Cisco AnyConnect, Palo Alto GlobalProtect) are particularly aggressive and will conflict with commercial VPN clients. If you need both, use one at a time and fully disconnect one before connecting the other.",
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

export default function WindowsVpnKeepsDisconnectingPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Windows VPN Keeps Disconnecting"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Windows VPN Keeps Disconnecting? Here&rsquo;s the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Windows power management suspending your network adapter is the most common cause of
              regular VPN drops. Here&rsquo;s how to fix it — and what else to check.
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
            heading="VPN still dropping after these steps?"
            body="Tell our AI how often it drops and what you're doing when it disconnects — it can help identify whether the cause is adapter, WiFi, or server-side."
            chatLink="/chat?category=vpn&issue=disconnecting"
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
            body="Describe your VPN client, how often it drops, and your connection type (WiFi or wired) — our AI will give you a targeted fix."
            chatLink="/chat?category=vpn"
          />
        </div>
      </div>
    </>
  );
}
