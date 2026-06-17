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
import { Monitor, Activity, Lock, AlertCircle } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Signs Your WiFi Network Has Been Hacked (And What to Do) | MyTech-Fix",
  description:
    "Unfamiliar devices on your network or a router admin password that stopped working are the clearest signs of compromise. Here's how to check and secure your network.",
  alternates: {
    canonical: `${BASE}/fix/security-privacy/wifi-network-hacked-signs`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Security & Privacy', href: '/fix/security-privacy' },
  { label: 'Signs Your WiFi Has Been Hacked' },
];

const TLDR = [
  "Check your router's connected device list for anything you don't recognize — this is the clearest direct evidence of an unauthorized device.",
  "If your router's admin password no longer works, someone may have changed it — use the factory reset button to regain control.",
  "Changing your WiFi password disconnects all devices and forces them to reconnect with the new password — do this immediately if you suspect unauthorized access.",
  "After securing the network, update your router's firmware and disable remote management if it's enabled.",
];

const CAUSES = [
  {
    icon: Monitor,
    title: "Unfamiliar devices in the router's connected devices list",
    description:
      "Your router maintains a list of every device currently connected and recently connected to your network. An unknown phone, laptop, or device appearing in this list is the clearest direct indicator that someone unauthorized is using your WiFi. Common causes: a neighbor who obtained or guessed your WiFi password, a device you forgot about (an old phone, a guest's device still connecting automatically), or a malicious actor specifically targeting your network.",
    likelihood: 'likely' as const,
  },
  {
    icon: Activity,
    title: 'Internet noticeably slower with no other explanation',
    description:
      "An unauthorized user consuming your bandwidth — downloading files, streaming, or running services — can slow your connection measurably. This is a weaker signal on its own since slow internet has many innocent causes, but it's worth investigating if it appears alongside other signs. The most reliable check is looking at the connected devices list rather than relying on speed as an indicator.",
    likelihood: 'likely' as const,
  },
  {
    icon: Lock,
    title: "Router admin password no longer works",
    description:
      "If you try to log into your router's admin page and your password doesn't work, it may have been changed by an intruder. This is a more serious sign — it suggests the attacker accessed the admin interface and locked you out. The immediate response is to factory reset the router using the physical reset button, which restores the default credentials and revokes any changes the attacker made.",
    likelihood: 'common' as const,
  },
  {
    icon: AlertCircle,
    title: 'Unusual outbound network activity at unexpected times',
    description:
      "Some routers log outbound traffic or provide traffic monitoring features that reveal unusual activity — large data transfers at 3am, connections to unfamiliar servers, or sustained upload activity with no obvious source. This level of monitoring isn't available on all routers and requires actively checking logs, but it's one of the ways sophisticated intrusions are detected. If your router has a Traffic Monitor or Logs section, it's worth checking if you have other reasons to be suspicious.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: "Check the connected devices list on your router",
    description:
      "Log into your router's admin page (typically 192.168.1.1 or 192.168.0.1 in a browser). Look for a section called 'Connected Devices,' 'Device List,' 'DHCP Clients,' or 'Attached Devices.' You'll see each device by its MAC address and hostname (device name). Cross-reference these against devices you own. Unfamiliar device names or more devices than you expect are worth investigating. Note: devices you've connected in the past but aren't currently active may still appear if the DHCP lease hasn't expired.",
    tip: "Phone manufacturers often randomize MAC addresses, which can make your own devices appear unfamiliar. On iPhone, go to Settings > WiFi > tap your network > Private Wi-Fi Address to see whether MAC randomization is on. The device name/hostname is usually more helpful for identification.",
  },
  {
    title: "Change your WiFi password immediately",
    description:
      "In your router's WiFi or Wireless settings, change the WiFi password (WPA2/WPA3 key) to a strong, new one — at least 12 characters. This disconnects every device currently on the network and requires the new password to reconnect. Reconnect your own devices one by one — this also serves as an inventory check. Any device you can't account for that reconnects or keeps trying to connect confirms unauthorized access.",
  },
  {
    title: "Change the router admin password",
    description:
      "In the router's Administration or System settings, change the admin password to something strong and unique — different from the WiFi password. This blocks anyone who may have accessed the admin interface from doing so again. If your current admin password is still the factory default, it may have been exploited to change settings without requiring your WiFi password at all.",
  },
  {
    title: "Update the router's firmware",
    description:
      "In the router's Administration or Advanced settings, look for a Firmware Update section. Install the latest available firmware. Many home router compromises exploit vulnerabilities in outdated firmware — attackers scan for routers running known-vulnerable versions. Updating closes these gaps. Some routers support automatic firmware updates — enable this if available.",
  },
  {
    title: "Disable remote management if it's enabled",
    description:
      "In the router's Administration or Advanced settings, look for 'Remote Management,' 'Remote Access,' or 'WAN Management.' If it's enabled, disable it unless you have a specific reason to manage the router from outside your home network. Remote management enabled with the default password is one of the most common ways home routers are compromised from the internet — no physical proximity required.",
  },
  {
    title: "Enable the guest network for visitors going forward",
    description:
      "Most routers support a guest WiFi network that's isolated from your main network. Guest devices on this network can access the internet but cannot see or communicate with your main network's devices (computers, printers, smart home devices). Enable this in your router's WiFi or Guest Network settings, set a strong password, and share this network's credentials with guests rather than your main network password. This limits the blast radius of any future unauthorized access.",
  },
];

const FAQS = [
  {
    question: "How can I tell if someone is using my WiFi?",
    answer:
      "The most reliable method is checking your router's connected device list — log into the admin page and look for 'Connected Devices' or 'DHCP Clients.' Compare the listed devices against every device you own that could be on WiFi. A second approach is using a network scanner app (Fing, available free on iOS and Android) which scans your local network and lists all connected devices with their manufacturer information, making identification easier.",
  },
  {
    question: "Can a hacker access my devices through my WiFi?",
    answer:
      "Being on the same network gives an attacker local network access, which enables several types of attacks: monitoring unencrypted traffic, attempting to access shared folders or local services on your devices, ARP spoofing (man-in-the-middle between your device and the router), and attempting to exploit vulnerabilities in network-connected devices (printers, smart TVs, IoT devices). Most modern HTTPS traffic is encrypted end-to-end, limiting what can be intercepted — but local network access is still a meaningful threat, especially for older or IoT devices.",
  },
  {
    question: "What should I do after changing my WiFi password?",
    answer:
      "After changing the WiFi password: reconnect all your own devices using the new password (this is your inventory check), change the router admin password if you haven't yet, update the router firmware, review the connected device list after an hour to confirm no unexpected devices have reconnected, and consider enabling the guest network for future visitors. Also check your smart home devices and IoT devices — cameras, smart speakers, thermostats — since these need the new WiFi password to reconnect.",
  },
  {
    question: "What is WPS and should I disable it?",
    answer:
      "WPS (Wi-Fi Protected Setup) is a feature that lets devices connect to your network by pressing a physical button on the router or entering an 8-digit PIN. The PIN method has a known security vulnerability (the PIN can be brute-forced in hours), and many security guides recommend disabling WPS entirely. Disable it in your router's WiFi or WPS settings. The push-button method is less vulnerable but the entire feature can be disabled without any practical downside for most home users.",
  },
];

const RELATED = [
  {
    category: 'Security & Privacy',
    title: "Router Default Password Risk",
    href: '/fix/security-privacy/router-default-password-risk',
  },
  {
    category: 'Security & Privacy',
    title: 'Got a Suspicious Login Alert? Here\'s What to Do',
    href: '/fix/security-privacy/suspicious-login-alert',
  },
  {
    category: 'Security & Privacy',
    title: 'How to Set Up Two-Factor Authentication',
    href: '/fix/security-privacy/two-factor-authentication-setup',
  },
  {
    category: 'Security & Privacy Guides',
    title: 'All Security & Privacy guides →',
    href: '/fix/security-privacy',
  },
  {
    category: 'WiFi & Networking',
    title: 'Having a different router issue? See WiFi & Networking guides →',
    href: '/fix/wifi',
  },
];

export default function WifiNetworkHackedSignsPage() {
  return (
    <>
      <SeoSchema
        howToName="Check and Secure a Hacked WiFi Network"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Signs Your WiFi Network Has Been Hacked (And What to Do)
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Unfamiliar devices in your router&rsquo;s connected list and an admin password that
              stopped working are the clearest signs. Here&rsquo;s how to check and recover.
            </p>
          </header>

          <TLDRBox points={TLDR} />

          <section className="mb-10">
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-4">Warning Signs</h2>
            <div className="space-y-3">
              {CAUSES.map((cause) => (
                <CauseCard key={cause.title} {...cause} />
              ))}
            </div>
          </section>

          <section className="mb-2">
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-6">
              How to Check and Secure Your Network
            </h2>
            <div>
              {STEPS.map((step, i) => (
                <StepItem key={i} step={i + 1} {...step} />
              ))}
            </div>
          </section>

          <MidCTA
            heading="Not sure what you're seeing in your router's device list?"
            body="Tell our AI your router model and what you're seeing — it can help you identify whether a device is yours and what to do next."
            chatLink="/chat?category=security&issue=wifi-hacked"
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
            heading="Want help securing your home network?"
            body="Our AI can walk you through your router's security settings, firmware update, and device audit for your specific router model."
            chatLink="/chat?category=security-privacy"
          />
        </div>
      </div>
    </>
  );
}
