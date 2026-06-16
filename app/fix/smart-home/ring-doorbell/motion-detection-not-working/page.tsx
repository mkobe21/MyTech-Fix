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
import { EyeOff, Settings, Home, RefreshCw } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Ring Doorbell Motion Detection Not Working? Try This | MyTech-Fix',
  description:
    "Ring Doorbell not detecting motion or sending alerts? Check these four settings in the Ring app — most motion issues are a single toggle or zone adjustment away.",
  alternates: {
    canonical: `${BASE}/fix/smart-home/ring-doorbell/motion-detection-not-working`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Smart Home', href: '/fix/smart-home' },
  { label: 'Ring Doorbell', href: '/fix/smart-home/ring-doorbell' },
  { label: 'Ring Doorbell Motion Detection Not Working' },
];

const TLDR = [
  "Check that Motion Detection is toggled on in Ring app > your device > Motion Settings.",
  "Motion Zones control exactly which areas trigger recording — verify your target area is inside an active zone.",
  "The current Mode (Home/Away/Disarmed) controls which devices record motion — switching modes is a quick test.",
  "Phone notification permissions for Ring must be enabled in your phone's system settings separately from the app.",
];

const CAUSES = [
  {
    icon: EyeOff,
    title: 'Motion Detection is turned off or sensitivity is too low',
    description:
      "Ring's motion detection is controlled by a toggle in the app — and it's easy to accidentally turn it off while browsing device settings. The sensitivity slider also matters: at the lowest setting, the doorbell may only detect objects very close to the lens. Both are common first causes to check before investigating anything else.",
    likelihood: 'likely' as const,
  },
  {
    icon: Settings,
    title: 'Motion Zones exclude the area where motion is occurring',
    description:
      "Ring lets you define custom Motion Zones — rectangular regions of the camera's field of view that the doorbell monitors. Areas outside these zones are ignored entirely. If your front path, driveway, or porch isn't inside an active zone, motion there won't trigger recording. It's easy to configure zones that miss a key area.",
    likelihood: 'common' as const,
  },
  {
    icon: Home,
    title: "Current Ring Mode disables motion for this device",
    description:
      "Ring Modes (Home, Away, Disarmed) let you configure each device differently based on your status. If you're in Home or Disarmed mode and motion recording is disabled for the doorbell in that mode, no motion will trigger recording even with detection turned on. A quick mode switch to Away will test whether this is the cause.",
    likelihood: 'common' as const,
  },
  {
    icon: RefreshCw,
    title: 'Firmware bug following a recent update',
    description:
      "Occasional firmware updates have introduced motion detection regressions on specific Ring models. If motion detection stopped working immediately after an automatic update, power cycling the doorbell to complete the update process usually restores normal function. Ring typically patches confirmed bugs within a week.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Confirm Motion Detection is turned on',
    description:
      "Open the Ring app, tap on your doorbell, then tap Motion Settings. At the top of the screen, confirm the Motion Detection toggle is switched on (blue/green). If it's off, tap it to enable. Wait 30 seconds and walk in front of the doorbell to test. This single setting overrides all zone and sensitivity configurations — it must be on for anything else to work.",
  },
  {
    title: 'Raise the Motion Sensitivity slider',
    description:
      "In Motion Settings, look for the Motion Sensitivity slider (or Sensitivity setting, depending on your model). If it's set to the lowest position, increase it to the midpoint and test. Higher sensitivity means the doorbell reacts to smaller or more distant movement. Too low a setting means only very close or large motion triggers recording.",
    tip: "Start at the midpoint — too high a sensitivity setting will trigger on wind, passing cars, and shadows, which drains battery quickly on battery-powered models.",
  },
  {
    title: 'Review and expand your Motion Zones',
    description:
      "In Motion Settings, tap Motion Zones. You'll see the camera's current field of view with adjustable zone rectangles. Make sure the area you expect motion from — your front path, porch, or driveway — is inside an active (blue) zone. Drag the zone edges to include that area. Zones shown in gray or outside the active area are not monitored.",
  },
  {
    title: 'Check which Ring Mode is currently active',
    description:
      "In the Ring app, tap the three-line menu > Ring Modes (or tap the shield icon on the home screen). Note which mode is currently active — Home, Away, or Disarmed. Tap on that mode and check the doorbell's setting within it. If it shows 'Record motion but don't alert' or 'Don't record motion,' switch the setting or change to a different mode and test.",
  },
  {
    title: 'Confirm Ring has notification permissions on your phone',
    description:
      "Even with motion detection fully enabled, blocked system notifications mean you won't receive alerts. On iOS: Settings > Ring > Notifications > Allow Notifications (and confirm Alerts is checked). On Android: Settings > Apps > Ring > Notifications > Allow. After enabling, test by walking in front of the doorbell — you should receive a push notification within a few seconds.",
  },
  {
    title: 'Power cycle the doorbell to recover from a firmware issue',
    description:
      "If motion stopped working after a recent automatic firmware update, power cycling the doorbell helps it complete the update and reset its motion detection state. For battery models: remove the battery, wait 30 seconds, reinsert. For wired models: turn off the doorbell circuit breaker for 30 seconds, then restore power. After rebooting, test motion detection.",
  },
];

const FAQS = [
  {
    question: 'Why is my Ring Doorbell not recording motion?',
    answer:
      "The four most common reasons: Motion Detection is toggled off in Motion Settings, the Motion Sensitivity is set too low, your Motion Zones don't cover the area where motion is occurring, or your current Ring Mode (Home/Away/Disarmed) has motion recording disabled for that device. Check all four in the Ring app before assuming a hardware problem.",
  },
  {
    question: 'What are Motion Zones on Ring Doorbell?',
    answer:
      "Motion Zones are rectangular regions you define within the camera's field of view that the doorbell actively monitors. Areas outside your defined zones are completely ignored — no recording, no alerts. If a critical area like your front door path or driveway isn't inside an active zone, motion there won't trigger anything. Edit your zones in Ring app > your device > Motion Settings > Motion Zones.",
  },
  {
    question: "What does 'Modes' do in the Ring app and how does it affect motion?",
    answer:
      "Ring Modes (Home, Away, Disarmed) let you set different behavior per device depending on your status. For each mode, you can configure each Ring device to record motion with alerts, record without alerts, or not record at all. If your doorbell stopped detecting motion after you switched modes, check Ring app > Modes > select the current mode > and review your doorbell's configuration in that mode.",
  },
  {
    question: 'How do I get Ring motion alerts on my phone?',
    answer:
      "Ring motion alerts need two things: motion detection enabled in the Ring app, and notification permissions granted by your phone's OS. On iOS: Settings > Ring > Notifications > Allow Notifications. On Android: Settings > Apps > Ring > Notifications > Allow. The Ring app's in-app alerts setting and your phone's system notifications are separate — both must be on for push alerts to arrive.",
  },
];

const RELATED = [
  {
    category: 'Ring Doorbell',
    title: 'Ring Doorbell Showing Offline',
    href: '/fix/smart-home/ring-doorbell/offline',
  },
  {
    category: 'Ring Doorbell',
    title: "Ring Doorbell Won't Connect to WiFi",
    href: '/fix/smart-home/ring-doorbell/wont-connect-to-wifi',
  },
  {
    category: 'Ring Doorbell',
    title: 'Ring Doorbell Battery Draining Fast',
    href: '/fix/smart-home/ring-doorbell/battery-draining-fast',
  },
  {
    category: 'Ring Doorbell Guides',
    title: 'All Ring Doorbell troubleshooting guides →',
    href: '/fix/smart-home/ring-doorbell',
  },
];

export default function RingDoorbellMotionDetectionPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Ring Doorbell Motion Detection Not Working"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Ring Doorbell Motion Detection Not Working? Try This
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Most Ring motion issues are a single setting — a toggle, a zone boundary, or a
              Mode configuration. Here&rsquo;s exactly where to look.
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
            heading="Motion detection still not working after these steps?"
            body="Our AI can check your zone configuration, mode settings, and notification permissions to find exactly what's blocking alerts."
            chatLink="/chat?device=ring-doorbell&issue=motion-detection"
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
            heading="Still having trouble with your Ring Doorbell?"
            body="Describe your setup and what you've checked — our AI will give you a targeted fix."
            chatLink="/chat?device=ring-doorbell"
          />
        </div>
      </div>
    </>
  );
}
