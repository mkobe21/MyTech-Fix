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
import { Smartphone, Users, AlertCircle } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Got a Suspicious Login Alert? Here's What to Do | MyTech-Fix",
  description:
    "Received a suspicious login alert from Google, Apple, Microsoft, or another service? Most are precautionary — here's how to check if it's real and what to do if it is.",
  alternates: {
    canonical: `${BASE}/fix/security-privacy/suspicious-login-alert`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Security & Privacy', href: '/fix/security-privacy' },
  { label: 'Suspicious Login Alert' },
];

const TLDR = [
  "Check the alert details — most show a device type, location, and time. If it matches something you actually did (including browsing via VPN), no action is needed.",
  "If you don't recognize the activity, change the account password immediately — don't wait to investigate further first.",
  "Enable two-factor authentication if you haven't already — this is the most effective step to prevent unauthorized access even if your password is known.",
  "If you reuse this password on other accounts, change it there too — password reuse is how one compromised account becomes many.",
];

const CAUSES = [
  {
    icon: Smartphone,
    title: 'You logged in from a new device, browser, or location',
    description:
      "Most online services track logins by device fingerprint, browser, and approximate IP-based location. Any login that differs from your usual pattern — a new phone, a different browser, a work computer, or even using a VPN that changes your apparent location — can trigger a precautionary alert. The vast majority of suspicious login alerts fall into this category. The alert is the service doing its job, not necessarily evidence of a problem.",
    likelihood: 'likely' as const,
  },
  {
    icon: Users,
    title: 'A family member or shared device user accessed the same account',
    description:
      "If multiple people use the same account — a shared streaming service, a family Google account, a joint email — a login from someone else in the household from their own device appears as an unfamiliar device and location to the service. This is a common source of confusing alerts that aren't security threats. Checking 'Active Sessions' or 'Recent Activity' in the account settings typically shows the device and location clearly enough to identify.",
    likelihood: 'common' as const,
  },
  {
    icon: AlertCircle,
    title: 'Someone else has your password and is attempting unauthorized access',
    description:
      "This is the least common but most serious cause. Unauthorized logins typically come from unfamiliar countries or continents, are at unusual hours, or are followed by account changes (password change, recovery email update, suspicious purchases). If the location in the alert is somewhere you've never been, treat it as a real threat and act immediately — change the password and enable 2FA before investigating further.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: "Read the alert details carefully before acting",
    description:
      "Open the alert email or notification and look at the details provided: the device type (iPhone, Windows PC, Android), the approximate location (city and country), and the time. Cross-reference these with what you actually did around that time. A login from 'Chicago, Illinois' on an 'iPhone' at 3pm is probably you. A login from 'Lagos, Nigeria' on a 'Windows PC' at 3am is not. Most services also include a 'This was me' / 'This wasn't me' button that lets you confirm or report the activity directly.",
  },
  {
    title: "If you don't recognize it, change your password immediately",
    description:
      "Don't wait to investigate further — change the password first. Go to the account's Security settings and change to a strong, unique password that you don't use anywhere else. A strong password is at least 12 characters with a mix of letters, numbers, and symbols, or a random passphrase (e.g., 'correct-horse-battery-staple'). Using a password manager to generate and store unique passwords is the most reliable long-term approach.",
    tip: "Change the password from a device and network you trust — not the same device or network where the suspicious login occurred, in case it's compromised.",
  },
  {
    title: "Check active sessions and log out unknown devices",
    description:
      "Most major services offer a 'Recent Activity,' 'Active Sessions,' or 'Where you're signed in' page in Security settings. Google: myaccount.google.com > Security > Your devices. Apple: appleid.apple.com > Devices. Microsoft: account.microsoft.com > Security > Activity. Review the list, identify any devices you don't recognize, and sign them out. This terminates any active sessions the unauthorized user may have.",
  },
  {
    title: "Enable two-factor authentication",
    description:
      "Two-factor authentication (2FA) requires a code from your phone in addition to your password. Even if someone obtains your password, they cannot access your account without the second factor. Enable 2FA in the account's Security settings — most major services support both SMS codes and authenticator apps (Google Authenticator, Authy, Microsoft Authenticator). Authenticator apps are more secure than SMS. See our full guide: 'How to Set Up Two-Factor Authentication.'",
  },
  {
    title: "Check for and change reused passwords on other accounts",
    description:
      "If you use the same password on multiple accounts, any account where that password was compromised becomes a potential entry point for all the others. Check whether you've used this password elsewhere and change it on each account that shares it. A password manager like Bitwarden (free), 1Password, or Dashlane can audit your stored passwords for reuse and help you replace them with unique ones.",
  },
  {
    title: "For financial or sensitive accounts, check for unauthorized changes",
    description:
      "If the alert is for a bank, email, or account tied to financial services, check for any unauthorized changes after securing access: look for new payees, changed contact information, sent emails you didn't write, or purchases you didn't make. Contact the service's support team if you find anything suspicious — most financial institutions have dedicated fraud teams and may be able to reverse unauthorized transactions.",
  },
];

const FAQS = [
  {
    question: "Can I ignore a suspicious login alert if I think it was me?",
    answer:
      "Yes, if the details match your actual activity. If you logged into your Google account from a new laptop, traveled recently, or connected via VPN (which changes your apparent location), the alert is precautionary. Most services include a 'This was me' link to dismiss it. If you're genuinely uncertain — the location is plausible but you don't remember logging in — it's worth checking your active sessions page to confirm the device is one you recognize.",
  },
  {
    question: "How did someone get my password if I never shared it?",
    answer:
      "Passwords are most commonly obtained through: data breaches (a service you use was hacked and your credentials were leaked — check haveibeenpwned.com with your email), phishing (you entered your credentials on a fake login page), credential stuffing (attackers try username/password combinations from leaked databases against other services), or malware on a device that captured keystrokes. Haveibeenpwned.com will tell you if your email has appeared in known data breaches.",
  },
  {
    question: "What should I do if the suspicious login alert was for my email account?",
    answer:
      "Email is the highest-priority account to secure because it's used for password recovery on everything else. Change the password immediately, enable 2FA, check the Sent folder for emails you didn't write (attackers sometimes use compromised email to send phishing messages or reset other account passwords), check for any forwarding rules that might be silently copying your email to an attacker's address (Settings > Forwarding), and check that the recovery email and phone number haven't been changed.",
  },
  {
    question: "Does a VPN trigger suspicious login alerts?",
    answer:
      "Yes — VPNs change your apparent IP address and therefore your apparent geographic location. If your account normally sees logins from New York and you connect via a VPN server in Amsterdam, the service may generate a suspicious login alert because the location changed dramatically. This is a false positive. If you use a VPN regularly, the alerts will become less frequent as the service learns the VPN's IP range as a familiar location.",
  },
];

const RELATED = [
  {
    category: 'Security & Privacy',
    title: "How to Set Up Two-Factor Authentication",
    href: '/fix/security-privacy/two-factor-authentication-setup',
  },
  {
    category: 'Security & Privacy',
    title: 'Signs Your WiFi Network Has Been Hacked',
    href: '/fix/security-privacy/wifi-network-hacked-signs',
  },
  {
    category: 'Security & Privacy',
    title: 'Router Default Password Risk',
    href: '/fix/security-privacy/router-default-password-risk',
  },
  {
    category: 'Security & Privacy Guides',
    title: 'All Security & Privacy guides →',
    href: '/fix/security-privacy',
  },
];

export default function SuspiciousLoginAlertPage() {
  return (
    <>
      <SeoSchema
        howToName="What to Do After a Suspicious Login Alert"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Got a Suspicious Login Alert? Here&rsquo;s What to Do
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Most alerts are precautionary — triggered by a new device or VPN. But a small number
              are real threats. Here&rsquo;s how to tell which and what to do.
            </p>
          </header>

          <TLDRBox points={TLDR} />

          <section className="mb-10">
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-4">
              What Triggers These Alerts
            </h2>
            <div className="space-y-3">
              {CAUSES.map((cause) => (
                <CauseCard key={cause.title} {...cause} />
              ))}
            </div>
          </section>

          <section className="mb-2">
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-6">What to Do</h2>
            <div>
              {STEPS.map((step, i) => (
                <StepItem key={i} step={i + 1} {...step} />
              ))}
            </div>
          </section>

          <MidCTA
            heading="Concerned about an account you think was accessed?"
            body="Describe the alert details and which service it was for — our AI can help you work through securing the account step by step."
            chatLink="/chat?category=security&issue=login-alert"
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
            heading="Want help securing your accounts?"
            body="Our AI can walk you through securing a compromised account, setting up 2FA, and checking for password reuse — specific to the services you use."
            chatLink="/chat?category=security-privacy"
          />
        </div>
      </div>
    </>
  );
}
