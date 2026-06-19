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
  title: 'How to Set Up an Arlo Camera System | MyTech-Fix',
  description:
    'Step-by-step Arlo camera setup guide — base station connection, app pairing, camera sync, mounting placement, and motion detection configuration.',
  alternates: {
    canonical: `${BASE}/setup/arlo-camera-system`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Setup Guides', href: '/setup' },
  { label: 'Arlo Camera System' },
];

const PREREQS = [
  'Arlo camera(s) and SmartHub/base station (if your model uses one)',
  'The Arlo app — download it on iOS or Android before starting',
  'A free Arlo account',
  'Your WiFi network name and password (for direct-to-WiFi models), or an open Ethernet port on your router (for base station models)',
];

const STEPS = [
  {
    title: 'Set up the base station first (if your model includes one)',
    description:
      "If your Arlo system came with a SmartHub or base station, connect it to your router via the included Ethernet cable and plug it into power. Wait for its LED to turn solid — indicating it's online and ready. For Arlo models that connect directly to WiFi without a base station, skip to step 3.",
  },
  {
    title: 'Download the Arlo app and create your account',
    description:
      'Install the Arlo app on your iOS or Android device. Create a free Arlo account or sign in if you already have one. An Arlo account is required to manage cameras, receive alerts, and access recorded footage.',
  },
  {
    title: 'Add your base station or SmartHub in the app',
    description:
      'Tap "Add Device" in the app and select your SmartHub or base station model from the list. The app will find it on your local network and guide you through confirming the connection. If it isn\'t detected, confirm the Ethernet cable between the base station and router is seated firmly on both ends.',
  },
  {
    title: 'Charge your camera batteries fully before syncing',
    description:
      "If your cameras are battery-powered, charge them completely before syncing to the base station. Insert the magnetic charging cable and charge until the LED indicates full. Starting with a partially charged battery can cause the camera to drop offline mid-pairing, requiring you to start the sync process over.",
  },
  {
    title: 'Sync each camera to the base station',
    description:
      "In the Arlo app, tap \"Add Device\" and select your camera model. Follow the prompts — typically this involves pressing the sync button on the base station, then pressing the sync button on the camera within 10 seconds. The LED on the camera will blink to indicate it's syncing, then go solid when successful. For direct-WiFi models, the app will guide you through WiFi credential entry instead.",
    tip: 'Sync cameras close to the base station during initial setup. You can move them to their final mounting locations after confirming each one appears online in the app.',
  },
  {
    title: 'Confirm each camera shows online in the app',
    description:
      'Before mounting anything, verify each camera shows as "Online" in the app and that the live view loads correctly. This confirms connectivity before you commit to a mounting location. A camera that won\'t go online at this stage is easier to troubleshoot on your desk than after it\'s mounted 10 feet off the ground.',
  },
  {
    title: 'Mount cameras at their intended locations',
    description:
      "Mount at the height and angle appropriate for your use case — Arlo recommends 7–10 feet high for doorbells and entry cameras, angled slightly downward. Use the included mounting hardware and magnetic mount. For battery cameras, position them within a reasonable range of your base station or router — the further away, the more frequently you'll see connectivity issues.",
  },
  {
    title: 'Configure motion detection sensitivity and activity zones',
    description:
      "In the app, select each camera and go to its Settings to configure Motion Sensitivity. Start at a medium setting and adjust after observing what the camera captures. If you have unnecessary triggers (passing cars, waving tree branches), use the Activity Zones feature to draw a detection area that focuses only on the relevant portion of the camera's view.",
  },
  {
    title: 'Set up alerts and test motion detection',
    description:
      'Configure notification preferences in the app — push notifications, email alerts, or both. Then walk in front of each camera to trigger a motion event and confirm you receive the alert. Check the captured clip in the Library tab to verify the frame covers the area you intended.',
  },
];

const FAQS = [
  {
    question: 'Do all Arlo cameras require a base station?',
    answer:
      "No — this depends on the model. Older Arlo cameras (like the original Arlo and Arlo Pro series) require a SmartHub or base station for local communication. Newer models like the Arlo Pro 4, Ultra 2, and Essential series connect directly to your home WiFi without a base station. Check your specific model's packaging or the Arlo website to confirm which setup applies to your cameras.",
  },
  {
    question: 'How do I get the best motion detection accuracy?',
    answer:
      "Avoid aiming cameras directly at areas with constant irrelevant motion — a busy street, swaying tree branches, or an air conditioning unit. Use the Activity Zones feature in the app to draw a focus area within the camera's field of view, limiting detection to the zone that matters (a front door, driveway section, or gate). Reducing sensitivity slightly also helps if you're getting triggered by shadows or small animals.",
  },
  {
    question: 'Does Arlo require a subscription?',
    answer:
      "Basic features — live view, motion alerts, and a limited amount of cloud video clips — typically work without a subscription on most Arlo models. Extended cloud video history (30 or 60 days), enhanced object detection (person vs. vehicle vs. animal), and E911 emergency features require an Arlo Secure subscription plan. Check which features are included free for your specific camera model, as this varies.",
  },
];

const RELATED = [
  {
    category: 'Security Cameras',
    title: 'Security Camera Troubleshooting Guides — already set up but having issues?',
    href: '/fix/security-cameras',
  },
  {
    category: 'Security Cameras',
    title: 'Ring Camera Troubleshooting Guides',
    href: '/fix/security-cameras/ring-camera',
  },
];

export default function ArloSetupPage() {
  return (
    <>
      <SeoSchema
        howToName="How to Set Up an Arlo Camera System"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-4">
              Setup Guide &middot; Security Cameras
            </div>
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              How to Set Up an Arlo Camera System
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A complete setup walkthrough for Arlo cameras — from base station connection to
              camera sync, mounting, and motion detection configuration.
            </p>
          </header>

          <TLDRBox points={PREREQS} label="What You'll Need" />

          <section className="mb-2">
            <h2 className="font-sora text-xl font-bold text-slate-100 mb-6">Setup Steps</h2>
            <div>
              {STEPS.map((step, i) => (
                <StepItem key={i} step={i + 1} {...step} />
              ))}
            </div>
          </section>

          <MidCTA
            heading="Camera not syncing or going offline?"
            body="Describe what's happening and our AI will walk you through the specific step that's failing."
            chatLink="/chat?device=arlo&issue=setup"
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
            heading="Having trouble during setup?"
            body="Our AI can walk you through Arlo base station setup, camera sync issues, and motion detection configuration step by step."
            chatLink="/chat?device=arlo"
          />
        </div>
      </div>
    </>
  );
}
