import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import TLDRBox from '@/components/seo/TLDRBox';
import StepItem from '@/components/seo/StepItem';
import MidCTA from '@/components/seo/MidCTA';
import FAQItem from '@/components/seo/FAQItem';
import RelatedGrid from '@/components/seo/RelatedGrid';
import FinalCTA from '@/components/seo/FinalCTA';
import SeoSchema from '@/components/seo/SeoSchema';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Smart Camera Privacy Settings Checklist | MyTech-Fix',
  description:
    "Ring, Nest, Wyze, Arlo — every smart camera needs a privacy review after setup. Here's a quick checklist to confirm your cameras are secured and not oversharing.",
  alternates: {
    canonical: `${BASE}/fix/security-privacy/smart-camera-privacy-settings`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Security & Privacy', href: '/fix/security-privacy' },
  { label: 'Smart Camera Privacy Settings' },
];

const TLDR = [
  "Change the default admin password on your camera account and any local web interface — default credentials are publicly listed for every camera model.",
  "Enable two-factor authentication on your Ring, Arlo, Wyze, or Nest account — this prevents unauthorized access even if your password is compromised.",
  "Review 'Shared Users' in the camera app and remove anyone who shouldn't still have access.",
  "Disable community sharing features (like Ring Neighbors) if you don't actively use them — these can share your footage beyond your household.",
];

const STEPS = [
  {
    title: "Change the default admin password on your camera account",
    description:
      "Log into your camera manufacturer's app or web account (Ring, Arlo, Wyze, Nest/Google Home, etc.) and go to Account Settings > Security or Change Password. Replace the password with a strong, unique one — at least 12 characters, not shared with any other account. Also check if your camera has a separate local web interface (accessible via its IP address on your home network) — if so, change that admin password too, which is often still set to the factory default.",
  },
  {
    title: "Enable two-factor authentication on your camera account",
    description:
      "All major camera platforms support 2FA: Ring (Account > Two-Factor Authentication), Arlo (Account Settings > Security), Wyze (Account > Security > Two-Factor Authentication), Google/Nest (manage at myaccount.google.com). Enable it and choose an authenticator app over SMS if available. This is the single highest-impact security step — even if someone obtains your password through a data breach, they cannot access your camera feed without the second factor.",
  },
  {
    title: "Review Shared Users and remove stale access",
    description:
      "Open your camera app and find the Shared Users or Shared Access section. Ring: Main menu > Account > Shared Users. Arlo: Settings > Grant Access. Wyze: Account > Sharing. Google Home: Home tab > Settings > Household. Review everyone listed and remove anyone who no longer needs access — past houseguests, ex-partners, or people from a previous address if you moved the cameras. Stale shared access is one of the most common privacy oversights.",
  },
  {
    title: "Review cloud storage and local storage options",
    description:
      "Most smart cameras store recordings in the cloud by default. Check your camera's storage settings to understand where video is being stored, who has access to it, and how long it's retained. If you're uncomfortable with cloud storage, check whether your camera supports a local storage option (SD card or local NAS) and whether end-to-end encryption is available. Ring and Google Nest both offer end-to-end encryption as an opt-in setting — enable it if available and if you understand the trade-offs (loss of some cloud features).",
  },
  {
    title: "Disable public sharing and community features",
    description:
      "Some camera apps include community or social features that share your footage more broadly than you may realize. Ring's Neighbors feature can share camera clips with the broader community, the Ring app, and sometimes law enforcement — review your sharing settings: Ring app > Account > Control Center > Video Requests and Neighbors. Wyze has a 'Cam Plus' community feature. Review and disable any features that share footage beyond your household unless you've consciously opted into them.",
  },
  {
    title: "Review camera placement for unintended capture areas",
    description:
      "Walk outside and stand at each camera location to see exactly what field of view it captures. Confirm the camera isn't accidentally recording: your neighbor's property or windows, public areas beyond your immediate access points, or indoor areas visible through windows. Some jurisdictions have laws about recording beyond your property. Most camera apps let you draw a privacy zone (masked area) to exclude specific parts of the frame — use this to black out any areas you don't need to capture.",
  },
  {
    title: "Check for firmware updates monthly",
    description:
      "Camera firmware updates frequently include security patches for vulnerabilities discovered after the camera shipped. Most camera apps have an automatic update option — enable it, or check manually: in the app, go to your camera's Device Settings > Device Info or Firmware to see the current version and check for updates. Security vulnerabilities in camera firmware have been publicly disclosed for Wyze, Ring, Arlo, and Nest — keeping firmware current is the primary defense.",
  },
];

const FAQS = [
  {
    question: "Can someone hack my Ring, Nest, or Wyze camera?",
    answer:
      "Yes, if basic security steps aren't in place. The most common attack vectors are: weak or reused passwords, accounts without 2FA, and outdated camera firmware with unpatched vulnerabilities. High-profile incidents of cameras being accessed without authorization have been reported for Wyze, Ring, and Nest — in nearly every case, the root cause was a reused password compromised in an unrelated data breach. Enabling 2FA and using a unique password eliminates the vast majority of risk.",
  },
  {
    question: "Do smart cameras record all the time?",
    answer:
      "Most smart cameras support two recording modes: continuous recording (24/7) and event-based recording (only when motion or sound is detected). Which mode is active depends on your settings and subscription tier. Ring cameras default to event-based recording. Nest Cam with Nest Aware records continuously. Wyze cameras can do continuous local recording to SD card while using event-based cloud clips. Check your camera's Recording settings to confirm what's being recorded and stored.",
  },
  {
    question: "What is end-to-end encryption for smart cameras?",
    answer:
      "End-to-end encryption (E2EE) means video is encrypted on the camera and can only be decrypted on your authorized devices — not by the camera manufacturer or their servers. Ring and Google Nest offer E2EE as an opt-in feature. The trade-off is that some cloud-based features (like viewing on web browsers, sharing, or AI-powered detection) may not work with E2EE enabled, since those features require the manufacturer to process the video. It's the most private option for users willing to accept the feature limitations.",
  },
  {
    question: "How do I know if my smart camera has been accessed by someone else?",
    answer:
      "Most camera apps have an 'Account Activity' or 'Login History' section that shows recent logins, including device type and location. Ring: Account > Account Security > Login Activity. Google: myaccount.google.com > Security > Recent security activity. Wyze: Account > Security. Check for logins from unfamiliar devices or unusual times. If you find unauthorized access: change your password, enable 2FA, remove shared access, and review your camera's event history for footage you didn't capture.",
  },
];

const RELATED = [
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
    category: 'Security & Privacy',
    title: 'Signs Your WiFi Network Has Been Hacked',
    href: '/fix/security-privacy/wifi-network-hacked-signs',
  },
  {
    category: 'Security & Privacy Guides',
    title: 'All Security & Privacy guides →',
    href: '/fix/security-privacy',
  },
];

export default function SmartCameraPrivacySettingsPage() {
  return (
    <>
      <SeoSchema
        howToName="Smart Camera Privacy Settings Checklist"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Smart Camera Privacy Settings Checklist
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A quick review of your Ring, Nest, Wyze, or Arlo settings to confirm your cameras
              are secured, not oversharing, and using current firmware.
            </p>
          </header>

          <TLDRBox points={TLDR} />

          <section className="mb-2">
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-6">
              Privacy Settings Checklist
            </h2>
            <div>
              {STEPS.map((step, i) => (
                <StepItem key={i} step={i + 1} {...step} />
              ))}
            </div>
          </section>

          <MidCTA
            heading="Want help reviewing a specific camera's settings?"
            body="Tell our AI your camera model and app — it can walk you through each privacy setting specific to your device."
            chatLink="/chat?category=security&issue=camera-privacy"
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
            heading="Want help with your home security setup?"
            body="Our AI can review your camera configuration, help you understand sharing settings, and walk you through firmware updates for your specific model."
            chatLink="/chat?category=security-privacy"
          />
        </div>
      </div>
    </>
  );
}
