import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import TLDRBox from '@/components/seo/TLDRBox';
import StepItem from '@/components/seo/StepItem';
import MidCTA from '@/components/seo/MidCTA';
import FAQItem from '@/components/seo/FAQItem';
import RelatedGrid from '@/components/seo/RelatedGrid';
import FinalCTA from '@/components/seo/FinalCTA';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'New Device Setup Help — AI-Guided Setup for Phones, Laptops & More | MyTech-Fix',
  description:
    'Get step-by-step AI help setting up a new iPhone, Android phone, Windows laptop, Mac, printer, or smart home device. Data transfer, account setup, and first-run configuration made simple.',
  alternates: {
    canonical: `${BASE}/productivity/new-device-setup-help`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Productivity', href: '/productivity' },
  { label: 'New Device Setup Help' },
];

const TLDR = [
  'Tell the AI which device you just got and it will guide you through the entire setup.',
  'Covers iPhones, Android phones, Windows laptops, Macs, printers, smart TVs, and more.',
  'Includes data transfer from your old device, account sign-in, and security setup.',
  'Flags critical first-run steps that are easy to skip (like enabling Find My Device and 2FA).',
];

const FAQS = [
  {
    question: "How do I transfer my data from an old iPhone to a new iPhone?",
    answer:
      "Use Quick Start — place both iPhones next to each other and follow the on-screen prompts. You can restore from an iCloud backup or transfer directly over WiFi. The AI can walk you through each screen and help if Quick Start doesn't appear.",
  },
  {
    question: "Can you help me move from Android to iPhone (or iPhone to Android)?",
    answer:
      "Yes. iPhone to Android uses Google's backup tools and data transfer. Android to iPhone uses Apple's Move to iOS app from the Play Store. The AI will guide you step by step, including how to handle WhatsApp, photos, and contacts.",
  },
  {
    question: "What should I set up first on a new Windows laptop?",
    answer:
      "In order: (1) Run Windows Update fully, (2) Set up your Microsoft Account or local account, (3) Enable BitLocker drive encryption, (4) Turn on Windows Defender, (5) Install your apps, (6) Set up OneDrive or your preferred cloud backup. The AI can guide you through each step.",
  },
  {
    question: "How do I connect a new printer to my home WiFi?",
    answer:
      "Most modern printers have a Wireless Setup Wizard in the printer's control panel menu. You'll select your WiFi network and enter the password there. Then install the driver on your computer — either from the printer's website or via Windows/Mac's Add Printer wizard. Tell the AI your printer brand and model for exact steps.",
  },
  {
    question: "Do I need to create new accounts for every device or app?",
    answer:
      "Usually not. Most devices use an existing account: Apple devices use your Apple ID, Android uses your Google Account, Windows uses a Microsoft Account, and Amazon devices use your Amazon login. The AI will tell you exactly which account each device needs and how to sign in.",
  },
];

export default function NewDeviceSetupHelpPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <Breadcrumb items={BREADCRUMBS} />

        <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium">
          🖥️ Productivity Tool
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50 mb-4 leading-tight">
          New Device Setup Help — From Box to Ready in Minutes
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-8">
          Just got a new phone, laptop, printer, or smart home device? Get clear, step-by-step setup guidance tailored to your exact device.
        </p>

        <TLDRBox points={TLDR} label="What you get" />

        <h2 className="text-xl font-semibold text-slate-100 mb-5 mt-8">Common setup scenarios</h2>
        <div className="space-y-0 mb-8">
          <StepItem
            step={1}
            title="Smartphones: iPhone and Android"
            description="Walk through language, WiFi, Apple ID or Google Account sign-in, Face ID or fingerprint setup, and app restore from backup. For new-phone transfers, the AI guides you through Quick Start (iPhone) or the Android setup wizard."
            tip="Set up two-factor authentication during account sign-in — it's much harder to add after the fact if you lose access."
          />
          <StepItem
            step={2}
            title="Windows laptops and desktops"
            description="From the Out-of-Box Experience (OOBE) to first login, Windows Update, driver installation, privacy settings, and essential apps. The AI flags the security settings that Windows leaves off by default."
          />
          <StepItem
            step={3}
            title="Mac computers"
            description="Apple ID sign-in, iCloud sync, Handoff, Sidecar, macOS updates, and app migration from your old Mac via Migration Assistant. Includes tips for first-time Mac users coming from Windows."
          />
          <StepItem
            step={4}
            title="Printers and scanners"
            description="Connect to WiFi (wireless setup wizard on the printer + driver install on the computer), set as default printer, test page, and scanner software setup. Works for HP, Canon, Brother, Epson, and more."
            tip="Always install the driver from the manufacturer's website, not from a disc — the disc version is usually years out of date."
          />
          <StepItem
            step={5}
            title="Smart TVs and streaming devices"
            description="WiFi setup, account sign-in (Netflix, Disney+, Prime Video, Apple TV+), screen mirroring setup, voice remote pairing, and parental controls. Covers Roku, Fire TV, Apple TV, Google TV, and Samsung/LG smart TVs."
          />
        </div>

        <MidCTA
          heading="Setting up a new device right now?"
          body="Tell the AI which device you just got and it will guide you through every step — including data transfer and security setup."
          chatLink="/chat?tool=device-setup"
        />

        <h2 className="text-xl font-semibold text-slate-100 mb-5">Frequently asked questions</h2>
        <div className="rounded-2xl border border-white/10 bg-card/60 px-6 mb-10">
          {FAQS.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <RelatedGrid
          items={[
            { category: 'Productivity', title: 'Excel Formula Help', href: '/productivity/excel-formula-help' },
            { category: 'Productivity', title: 'Word Document Help', href: '/productivity/word-document-help' },
            { category: 'Productivity', title: 'All Productivity Tools', href: '/productivity' },
            { category: 'Phone & Tablet', title: "iPhone Won't Connect to WiFi", href: '/fix/phone-tablet/iphone/wont-connect-to-wifi' },
          ]}
        />

        <FinalCTA
          heading="Ready to set up your new device?"
          body="Tell the AI which device you have and get guided setup instructions from start to finish — no technical knowledge required."
          chatLink="/chat?tool=device-setup"
        />
      </main>
    </div>
  );
}
