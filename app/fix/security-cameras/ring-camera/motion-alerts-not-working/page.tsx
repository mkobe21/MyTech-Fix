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
import { BellOff, MapPin, Shield, Battery } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Ring Camera Motion Alerts Not Working? Try This | MyTech-Fix',
  description:
    "Not getting Ring camera notifications? The Motion Alerts toggle, phone notification settings, or Ring Modes are the usual suspects. Here's how to fix it.",
  alternates: {
    canonical: `${BASE}/fix/security-cameras/ring-camera/motion-alerts-not-working`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Security Cameras', href: '/fix/security-cameras' },
  { label: 'Ring Camera', href: '/fix/security-cameras/ring-camera' },
  { label: 'Motion Alerts Not Working' },
];

const TLDR = [
  "Check the Motion Alerts toggle first — it's per-device and easy to accidentally turn off when adjusting settings.",
  "Your phone's OS notification settings for Ring must be set to 'Allow' — phone-level Do Not Disturb or Focus modes silently block all Ring notifications.",
  "Ring Modes (Home/Away/Disarmed) control which devices send alerts — if the current mode has alerts disabled for your camera, you won't receive them.",
  "Test by walking in front of the camera and checking Event History — if motion was detected but no alert arrived, it's a notification issue, not a detection issue.",
];

const CAUSES = [
  {
    icon: BellOff,
    title: 'Motion Alerts toggle is off, or phone notifications are blocked',
    description:
      "Ring has two separate layers of alert control: the Motion Alerts toggle inside the Ring app (per device), and your phone's system-level notification permission for the Ring app. Both must be enabled for alerts to arrive. The Motion Alerts toggle is easy to accidentally disable when navigating settings — it's also the first thing Ring support checks. Phone-level Do Not Disturb and Focus modes (on iOS) silently suppress Ring notifications without any visual indication in the Ring app.",
    likelihood: 'likely' as const,
  },
  {
    icon: MapPin,
    title: 'Motion Zones exclude the area where activity is occurring',
    description:
      "Ring cameras let you define custom Motion Zones — polygonal areas of the frame where the camera should watch for movement. If a Motion Zone doesn't cover the driveway, walkway, or area where you expect activity, the camera will detect motion in its full field of view but only trigger alerts for events inside the defined zones. A common mistake is drawing zones that don't reach the edges of the frame, leaving a blind strip.",
    likelihood: 'common' as const,
  },
  {
    icon: Shield,
    title: 'Current Ring Mode has motion alerts disabled for this device',
    description:
      "Ring Modes (Home, Away, Disarmed) let you configure different motion alert behaviors for each device. If your household is in 'Home' or 'Disarmed' mode and you've configured those modes to suppress alerts from a specific camera, you won't receive notifications even if motion detection is working correctly. People often set this up once for a less-critical camera and then forget — and later can't figure out why that camera stopped alerting.",
    likelihood: 'common' as const,
  },
  {
    icon: Battery,
    title: 'Motion Frequency setting is too low on a battery-powered camera',
    description:
      "Ring's battery-powered cameras have a Motion Frequency setting designed to extend battery life by introducing a cool-down period between triggered events. Set to 'Light' or 'Standard,' the camera won't alert on every motion event — it will wait a set interval before arming again after the first trigger. This means you can miss motion events that happen within minutes of each other. Setting it to 'Frequent' minimizes missed events but increases battery drain.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Confirm Motion Alerts is toggled on for the camera',
    description:
      "Open the Ring app > tap the three lines (menu) > Devices > select your camera. On the camera's device page, look for the 'Motion Alerts' toggle — it should be blue (on). If it's gray, tap it to enable. This toggle is per-device, so each camera in your account has its own independent setting.",
    tip: 'Also check the bell icon on the main Ring dashboard — if it shows a line through it (muted), all alerts for that device are suppressed regardless of individual settings.',
  },
  {
    title: "Check your phone's notification settings for Ring",
    description:
      "On iPhone: go to Settings > Notifications > Ring. Confirm 'Allow Notifications' is on, and that the alert styles (Lock Screen, Notification Center, Banners) are set appropriately. Check if an active Focus or Do Not Disturb mode is filtering Ring notifications — you can whitelist Ring in Focus settings under 'Allowed Notifications.' On Android: Settings > Apps > Ring > Notifications — confirm notifications are enabled and not set to Silent.",
  },
  {
    title: 'Review Motion Zones to cover the expected area',
    description:
      "In the Ring app > select your camera > Motion Settings > Motion Zones. You'll see your camera's live view with drawn zone boundaries. Ensure the areas you want monitored — driveway, walkway, front door approach — are fully inside an active zone. Zones can be edited by dragging the corner handles. If using 'All Motion' (no custom zones), this step is not the cause.",
  },
  {
    title: 'Check which Ring Mode is currently active',
    description:
      "In the Ring app, the current Mode (Home, Away, Disarmed) is shown at the top of the main dashboard. Tap the Mode icon to review its settings. Under Devices, find your camera and confirm 'Motion Detection' and 'Motion Alerts' are enabled for the current mode. If Disarmed or Home mode has alerts off for that device by design, switch to Away mode temporarily to test whether alerts work, which confirms the Mode configuration is the cause.",
  },
  {
    title: 'Adjust Motion Frequency on battery-powered cameras',
    description:
      "For battery-powered Ring cameras: in the Ring app > Devices > [camera] > Motion Settings > Motion Frequency. Change this to 'Frequent' to minimize the cool-down period between detected events. Be aware this setting increases battery consumption — but it's the right tradeoff if you're missing real events. Wired Ring cameras don't have a Motion Frequency setting because they don't have a battery to protect.",
  },
  {
    title: 'Test and verify using Event History',
    description:
      "Walk in front of the camera and wait 1–2 minutes. Then open the Ring app > tap the clock icon (Event History) and check whether a motion event was logged. If an event appears in history but you didn't get a phone notification, the detection is working — the issue is at the notification layer (step 2). If no event appears at all, the detection is the problem — review Motion Zones (step 3) and check if the camera is online.",
  },
];

const FAQS = [
  {
    question: "Why am I not getting Ring notifications on my phone?",
    answer:
      "Ring notifications require two things to be on simultaneously: the Motion Alerts toggle inside the Ring app for that specific device, AND the Ring app's notification permission in your phone's system settings. If either is off, you'll receive no alerts. On iPhone, also check whether an active Focus or Do Not Disturb mode is filtering Ring notifications — even with all settings enabled, a Focus profile can silently block them unless Ring is in the 'Allowed Notifications' list.",
  },
  {
    question: 'What is the difference between Motion Detection and Motion Alerts in Ring?',
    answer:
      "Motion Detection controls whether the camera watches for and records motion events. Motion Alerts controls whether you get a push notification when a motion event is recorded. You can have Motion Detection on (so events are recorded to history) but Motion Alerts off (so you don't get notified). This is a useful setup for cameras where you want a record but not constant interruptions — like a camera pointed at a backyard with frequent bird activity.",
  },
  {
    question: 'What are Ring Modes and how do they affect alerts?',
    answer:
      "Ring Modes (Home, Away, Disarmed) are profiles that let you configure which devices are active and which send alerts for each scenario. In 'Away' mode you might want every camera alerting on motion. In 'Home' mode you might silence cameras that face interior areas. In 'Disarmed' mode you might silence everything. You control these per-device within each mode's settings — Ring app > Mode Settings. If your active mode has alerts off for a camera, no amount of alert toggles within the camera settings will produce notifications.",
  },
  {
    question: 'Why does Ring detect motion but not send an alert?',
    answer:
      "If Event History shows motion events but you're not getting push notifications, the detection pipeline is working correctly — the block is at the notification layer. The most common causes in this specific scenario: (1) Motion Alerts is off for that device in the Ring app, (2) the Ring app has no notification permission on your phone, or (3) the current Ring Mode has alerts suppressed for that camera. Walk through steps 1, 2, and 4 in this guide to find which layer is blocking the notification.",
  },
];

const RELATED = [
  {
    category: 'Ring Camera',
    title: 'Ring Camera Showing Offline',
    href: '/fix/security-cameras/ring-camera/offline',
  },
  {
    category: 'Ring Camera',
    title: 'Ring Camera No Video Feed',
    href: '/fix/security-cameras/ring-camera/no-video-feed',
  },
  {
    category: 'Ring Camera',
    title: 'Ring Camera Night Vision Not Working',
    href: '/fix/security-cameras/ring-camera/night-vision-not-working',
  },
  {
    category: 'Ring Camera Guides',
    title: 'All Ring Camera troubleshooting guides →',
    href: '/fix/security-cameras/ring-camera',
  },
];

export default function RingCameraMotionAlertsPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Ring Camera Motion Alerts Not Working"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Ring Camera Motion Alerts Not Working? Try This
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The Motion Alerts toggle, your phone&rsquo;s notification settings, or Ring Modes
              are almost always the cause — here&rsquo;s how to find which one.
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
            heading="Still not getting alerts after these steps?"
            body="Our AI can walk through your Ring Mode config, notification settings, and Motion Zone setup to find exactly what's blocking alerts."
            chatLink="/chat?device=ring-camera&issue=motion-alerts"
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
            heading="Still having trouble?"
            body="Tell our AI which mode you're in and what Event History shows — it'll diagnose exactly where alerts are getting blocked."
            chatLink="/chat?device=ring-camera"
          />
        </div>
      </div>
    </>
  );
}
