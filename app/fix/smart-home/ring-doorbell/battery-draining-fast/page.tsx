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
import { Activity, Thermometer, WifiOff, Battery } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Ring Doorbell Battery Draining Fast? Here\'s Why and How to Fix It | MyTech-Fix',
  description:
    "Ring Doorbell battery not lasting? High motion event volume, cold weather, and weak WiFi are the three main drains. Here's how to fix each one.",
  alternates: {
    canonical: `${BASE}/fix/smart-home/ring-doorbell/battery-draining-fast`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Smart Home', href: '/fix/smart-home' },
  { label: 'Ring Doorbell', href: '/fix/smart-home/ring-doorbell' },
  { label: 'Ring Doorbell Battery Draining Fast' },
];

const TLDR = [
  "High-traffic areas trigger far more recordings — adjusting Motion Zones and sensitivity is the most effective fix.",
  "Cold weather reduces battery capacity as expected behavior — a compatible solar charging accessory can offset this.",
  "Weak WiFi forces the doorbell to work harder to stay connected, significantly increasing battery drain.",
  "If the battery is 1–2 years old and these steps don't help, degradation is likely — replacement batteries are available for most models.",
];

const CAUSES = [
  {
    icon: Activity,
    title: 'High frequency of motion alerts and recordings',
    description:
      "Every motion event wakes the doorbell, activates the camera, and uploads a video clip — each one consuming a measurable amount of battery. A doorbell facing a busy street, shared driveway, or sidewalk can trigger hundreds of times per day. Adjusting Motion Zones to exclude distant or irrelevant areas and enabling People Only mode (if available) dramatically reduces trigger volume.",
    likelihood: 'likely' as const,
  },
  {
    icon: Thermometer,
    title: 'Cold weather reducing battery capacity',
    description:
      "Lithium-ion batteries lose 20–50% of their effective capacity below 32°F (0°C) — this is fundamental battery chemistry, not a defect. In winter, a Ring doorbell that lasts months in mild weather may need charging every few weeks. This is expected behavior, but a compatible solar charging accessory can offset cold-weather discharge in sunny climates.",
    likelihood: 'common' as const,
  },
  {
    icon: WifiOff,
    title: 'Weak WiFi signal increasing power draw',
    description:
      "When a Ring doorbell has a weak WiFi connection, its radio has to transmit at higher power and retry more frequently to stay connected — consuming significantly more battery. Device Health in the Ring app shows signal strength; anything below 'Good' meaningfully impacts battery life. Improving signal coverage near the front door is one of the highest-impact battery fixes.",
    likelihood: 'common' as const,
  },
  {
    icon: Battery,
    title: 'Battery has degraded with age',
    description:
      "Lithium-ion batteries lose capacity with each charge cycle — after 1–2 years of use, a Ring battery may hold only 60–80% of its original charge. If battery life has gradually worsened over time despite no changes to settings or location, degradation is the likely cause. Replacement batteries are available for most battery-powered Ring models.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Reduce motion trigger volume with zones and sensitivity',
    description:
      "In the Ring app, go to your doorbell > Motion Settings. Lower the sensitivity slider to reduce distant triggers. Then tap Motion Zones and adjust the zone boundaries to exclude the street, sidewalk, or distant areas that generate false triggers. The goal is to cover your immediate porch and approach path while excluding high-traffic background areas.",
    tip: "Enabling People Only mode (Ring app > Motion Settings > Smart Alerts > People Only) filters out vehicles, animals, and environmental motion — available on compatible models. This is often the single highest-impact setting change.",
  },
  {
    title: 'Check and improve WiFi signal strength',
    description:
      "Open Ring app > your doorbell > Device Health and look at the Signal Strength reading. If it shows 'Fair' or 'Poor,' the doorbell's radio is working harder to maintain its connection, which drains battery significantly. Add a WiFi extender or Ring Chime Pro near the front door to boost signal. Even moving from 'Fair' to 'Good' signal can add weeks to battery life.",
  },
  {
    title: 'Lower video quality if your model supports it',
    description:
      "Some Ring models let you reduce recording resolution in Device Settings > Video Settings. Lower resolution means smaller files and less processing per event — both reduce power consumption per recording. If your model offers 1080p and 720p options, 720p uses less power with only a modest quality reduction.",
  },
  {
    title: 'Review battery usage history in the Ring app',
    description:
      "In the Ring app, go to your doorbell > Device Health > Battery > Battery Usage. This shows a breakdown of what's consuming power — number of motion events, live views, and time period. If the event count is very high, zone/sensitivity adjustment is your fix. If it's normal but battery still drains fast, move to the degradation check.",
  },
  {
    title: 'Use a solar charging accessory in cold climates',
    description:
      "Ring's Solar Charger (compatible with Ring Video Doorbell 2, 3, 4, and some Pro models — check compatibility on Ring's site) mounts above the doorbell and provides a trickle charge that offsets daily drain. In sunny climates, it can keep the battery at 90%+ indefinitely. In cold or cloudy climates, it offsets some discharge rather than eliminating charging entirely.",
    tip: "The solar charger requires at least 2–3 hours of direct sunlight per day to be effective. South-facing doorbell locations work best in the Northern Hemisphere.",
  },
  {
    title: 'Consider a replacement battery if degradation is the cause',
    description:
      "If battery life has gradually declined over 1–2 years and the settings steps above haven't helped, the battery has likely lost significant capacity. For most Ring battery-powered doorbells (Video Doorbell 2, 3, 4, and Battery Doorbell Plus), Ring sells a Quick Release Battery Pack as a replacement. Wired models (Pro, Pro 2, Elite) don't have replaceable batteries.",
  },
];

const FAQS = [
  {
    question: 'How often should I have to charge my Ring Doorbell battery?',
    answer:
      "In a typical residential setup with 10–20 motion events per day, most Ring battery doorbells last 6–12 months on a full charge. In high-traffic locations (busy streets, shared driveways), frequent activations can reduce this to weeks. Adjusting Motion Zones to exclude street traffic, enabling People Only mode (if available), and improving WiFi signal are the three highest-impact changes for extending battery life.",
  },
  {
    question: 'Does cold weather really affect Ring Doorbell battery life?',
    answer:
      "Yes — significantly. Lithium-ion batteries lose 20–50% of effective capacity below 32°F (0°C). This is normal battery chemistry, not a Ring-specific defect. A doorbell that lasts 8 months in summer may need charging every 3–4 weeks in winter. Ring's solar charging accessories can offset cold-weather discharge in locations with consistent sun, and bringing the battery inside to warm before charging helps it accept a full charge.",
  },
  {
    question: "What is People Only mode on Ring Doorbell?",
    answer:
      "People Only mode (available on compatible Ring models under Motion Settings > Smart Alerts) uses on-device processing to detect human body shapes and only triggers recording for person detections. It ignores vehicles, animals, and environmental movement like swaying trees or shadows. Enabling it dramatically reduces false triggers, which is one of the most effective ways to extend battery life in high-traffic locations.",
  },
  {
    question: 'Can I replace the battery on a Ring Doorbell?',
    answer:
      "Yes, on most battery-powered Ring models. The Quick Release Battery Pack slides or snaps out of the back of the doorbell after removing a security screw. Ring sells replacement packs online and at major retailers — search for your model's 'Quick Release Battery' on Ring's site to confirm compatibility. Wired Ring doorbells (Video Doorbell Pro, Pro 2, Elite) are continuously powered from your doorbell wiring and don't have replaceable batteries.",
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
    title: 'Ring Doorbell Motion Detection Not Working',
    href: '/fix/smart-home/ring-doorbell/motion-detection-not-working',
  },
  {
    category: 'Ring Doorbell Guides',
    title: 'All Ring Doorbell troubleshooting guides →',
    href: '/fix/smart-home/ring-doorbell',
  },
];

export default function RingDoorbellBatteryDrainingPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Ring Doorbell Battery Draining Fast"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Ring Doorbell Battery Draining Fast? Here&rsquo;s Why and How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The three main drains are motion event volume, cold weather, and weak WiFi — all
              are visible in the Ring app and all are adjustable.
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
            heading="Battery still draining unusually fast after these steps?"
            body="Our AI can help you audit your motion event history and settings to find what's consuming power."
            chatLink="/chat?device=ring-doorbell&issue=battery"
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
            body="Tell our AI your doorbell model and usage pattern — it'll identify what's draining your battery and give you a specific fix."
            chatLink="/chat?device=ring-doorbell"
          />
        </div>
      </div>
    </>
  );
}
