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
import { Lock, RefreshCw } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Still Using Your Router's Default Password? Here's the Risk | MyTech-Fix",
  description:
    "Routers with default admin passwords are one of the most common home network vulnerabilities. Here's how to find your router's admin page and change it in under 5 minutes.",
  alternates: {
    canonical: `${BASE}/fix/security-privacy/router-default-password-risk`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Security & Privacy', href: '/fix/security-privacy' },
  { label: 'Router Default Password Risk' },
];

const TLDR = [
  "If you've never changed your router's admin password, do it now — the default credentials are publicly listed for every router model.",
  "Your router's admin page is usually at 192.168.1.1 or 192.168.0.1 — type this in a browser while connected to your home network.",
  "The admin password is different from your WiFi password — both should be strong and unique.",
  "If you forget the new admin password, a factory reset restores the default — which is why writing it down and storing it securely matters.",
];

const CAUSES = [
  {
    icon: Lock,
    title: 'Default password was never changed during initial setup',
    description:
      "Routers ship from the factory with a default admin username and password — often 'admin/admin,' 'admin/password,' or a short string printed on the router's label. These defaults are publicly documented for every router model and are the first thing anyone attempts when trying to access a router without authorization. Leaving the default unchanged means anyone on your network (or within WiFi range) can access your router's full admin interface.",
    likelihood: 'likely' as const,
  },
  {
    icon: RefreshCw,
    title: 'Password was reset and reverted to default without being updated',
    description:
      "A factory reset — whether done intentionally during troubleshooting or accidentally — restores all settings to default, including the admin password. If someone reset the router to fix a problem and didn't re-set the admin password afterward, the router is back to its default credentials. This is particularly common when purchasing a second-hand router that was reset before being sold.",
    likelihood: 'common' as const,
  },
];

const STEPS = [
  {
    title: "Find your router's admin page address",
    description:
      "Open a browser on a device connected to your home network and type 192.168.1.1 in the address bar. If that doesn't work, try 192.168.0.1 or 10.0.0.1. Some routers use a custom address — check the label on the bottom or back of the router, which usually lists the admin URL, default username, and default password. You can also find the gateway address on Windows: open Command Prompt and run `ipconfig` — the 'Default Gateway' address is your router's admin IP.",
  },
  {
    title: "Log in with the current credentials",
    description:
      "Enter the current admin username and password. If you've never changed them, use the defaults printed on the router's label. Common defaults include admin/admin, admin/password, or admin/(blank). If the defaults don't work and you don't have a record of changing them, you'll need to factory reset the router to restore the defaults — check your router model's manual for the reset button location and process.",
  },
  {
    title: "Navigate to Administration or System settings and change the password",
    description:
      "Once logged in, look for a menu item called 'Administration,' 'System,' 'Management,' or 'Advanced' — the exact name varies by router model and firmware. Look for 'Change Password,' 'Admin Password,' or 'Router Password.' Enter a strong new password: at least 12 characters, not a word from the dictionary, not the same as your WiFi password. You'll need to log in again with the new password immediately after saving.",
    tip: "Write the new admin password on a piece of paper and store it in a secure place — many people tape it inside a drawer or to the router itself (if physical access is only available to household members). Losing admin access requires a factory reset.",
  },
  {
    title: "Confirm your WiFi network password is also strong",
    description:
      "While you're in the router admin interface, navigate to the WiFi or Wireless settings section. Check your WiFi password (also called the Network Key or WPA2 Pre-Shared Key). If it's still a default value — typically a short random string printed on the router's label — replace it with a strong passphrase of at least 12 characters. Any device currently using your WiFi will need to re-enter the new password.",
  },
  {
    title: "Confirm WPA3 or WPA2 encryption is enabled",
    description:
      "In the WiFi settings, check the Security Mode or Encryption setting. It should show WPA3 (preferred on newer routers) or WPA2-AES at minimum. If you see WEP, WPA (without a version number), or 'Open,' your network is using weak or no encryption — change it to WPA2 or WPA3 immediately. WEP can be cracked in minutes with freely available tools.",
  },
  {
    title: "Store the new credentials securely",
    description:
      "Record both the new router admin password and the WiFi password in a secure location — either a password manager (Bitwarden, 1Password, or the built-in keychain on iOS/macOS/Windows) or a physical note stored somewhere only household members can access. Losing both the admin password and access to the router label (if you've obscured it) results in needing a factory reset, which disconnects all devices and requires full reconfiguration.",
  },
];

const FAQS = [
  {
    question: "What is the default admin password for my router?",
    answer:
      "Default credentials vary by manufacturer. Common ones: most Netgear routers use admin/password; most Linksys routers use admin/(blank password); many TP-Link routers use admin/admin or have credentials printed on a label; Eero and Google Nest WiFi don't have a traditional admin interface (managed through the app). The most reliable source is the label on the bottom or back of your router — this shows the specific credentials for your unit, including the serial number-based default WiFi password if it was customized at the factory.",
  },
  {
    question: "Is the WiFi password the same as the router admin password?",
    answer:
      "No — these are two separate passwords. The WiFi password (also called the network key, WPA key, or wireless password) is what devices use to connect to your WiFi network. The router admin password is what you use to log into the router's settings page. Both should be strong and different from each other. Many people only know their WiFi password and have never changed the admin password, leaving the admin interface accessible with the factory default.",
  },
  {
    question: "What happens if I forget my router's admin password?",
    answer:
      "If you can't log in with the current admin password and don't have a record of it, the only option is a factory reset. The reset button is usually a small pinhole on the back of the router — hold it for 10–30 seconds (check your model's instructions) until the router reboots. This restores all settings to factory defaults, including the admin password (back to the printed default). You'll need to reconfigure your WiFi name and password, and any custom settings (port forwarding, DNS, etc.) will be lost.",
  },
  {
    question: "Can someone hack my router from outside my home network?",
    answer:
      "Generally no — by default, router admin pages are only accessible from within the local network, not from the internet. However, 'Remote Management' (sometimes called 'Remote Administration') is a feature on many routers that, if enabled, allows admin access from the internet. This should almost always be disabled unless you have a specific need for it. Additionally, anyone connected to your WiFi — including neighbors if your password is weak — can attempt to access the admin page from inside your network.",
  },
];

const RELATED = [
  {
    category: 'Security & Privacy',
    title: 'Signs Your WiFi Network Has Been Hacked',
    href: '/fix/security-privacy/wifi-network-hacked-signs',
  },
  {
    category: 'Security & Privacy',
    title: 'Smart Camera Privacy Settings Checklist',
    href: '/fix/security-privacy/smart-camera-privacy-settings',
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

export default function RouterDefaultPasswordPage() {
  return (
    <>
      <SeoSchema
        howToName="Change Router Default Admin Password"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Still Using Your Router&rsquo;s Default Password? Here&rsquo;s the Risk and the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Default router admin credentials are publicly documented for every model. Here&rsquo;s
              how to change yours in under 5 minutes.
            </p>
          </header>

          <TLDRBox points={TLDR} />

          <section className="mb-10">
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-4">Why This Matters</h2>
            <div className="space-y-3">
              {CAUSES.map((cause) => (
                <CauseCard key={cause.title} {...cause} />
              ))}
            </div>
          </section>

          <section className="mb-2">
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-6">
              How to Change Your Router Admin Password
            </h2>
            <div>
              {STEPS.map((step, i) => (
                <StepItem key={i} step={i + 1} {...step} />
              ))}
            </div>
          </section>

          <MidCTA
            heading="Need help finding your router's admin page?"
            body="Tell our AI your router model and we'll walk you through the exact steps for your specific device."
            chatLink="/chat?category=security&issue=router-password"
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
            body="Our AI can walk you through your router's security settings, guest network setup, and firmware updates — specific to your router model."
            chatLink="/chat?category=security-privacy"
          />
        </div>
      </div>
    </>
  );
}
