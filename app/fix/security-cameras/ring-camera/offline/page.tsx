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
import { WifiOff, Lock, Battery, RefreshCw } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Ring Camera Showing Offline? How to Get It Back Online | MyTech-Fix',
  description:
    "Ring camera offline in the app? Weak WiFi signal at the camera's location is the most common cause. Here's how to diagnose and fix it.",
  alternates: {
    canonical: `${BASE}/fix/security-cameras/ring-camera/offline`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Security Cameras', href: '/fix/security-cameras' },
  { label: 'Ring Camera', href: '/fix/security-cameras/ring-camera' },
  { label: 'Camera Offline' },
];

const TLDR = [
  "Check Signal Strength in the Ring app under Device Health — anything below 'Good' at the camera's location is the likeliest cause.",
  "Ring cameras require a 2.4GHz network — if your SSID or password changed, the camera needs to be reconnected manually.",
  "If it's a battery-powered camera, check the battery level in the app before troubleshooting further — a dead battery shows as offline.",
  "As a last resort, remove the camera from the Ring app and re-add it, which clears any stuck firmware state.",
];

const CAUSES = [
  {
    icon: WifiOff,
    title: 'WiFi signal is too weak at the camera location',
    description:
      "Ring cameras need a strong, stable WiFi signal to stay connected — and they're often mounted far from the router, outdoors, or through walls. A signal that's strong enough to set up the camera initially can still be too inconsistent to maintain a live connection over time. Weather, wall materials, and interference from neighboring networks can all degrade signal strength at the mounting location.",
    likelihood: 'likely' as const,
  },
  {
    icon: Lock,
    title: "Router's WiFi name or password changed",
    description:
      "Ring cameras store your WiFi credentials during setup. If you changed your router's SSID or password — or switched to a new router — every Ring camera loses its connection and shows offline. The camera doesn't automatically attempt to reconnect to an updated network; it must be reconfigured manually in the Ring app.",
    likelihood: 'common' as const,
  },
  {
    icon: Battery,
    title: 'Battery-powered camera entered low-battery power-saving mode',
    description:
      "Ring's battery-powered cameras (Ring Stick Up Cam Battery, Ring Spotlight Cam Battery, etc.) reduce connectivity when battery falls below roughly 10–15%. At very low battery, the camera may stop reporting live view and appear offline in the app even though the device itself is still powered. The app's Device Health screen shows the exact battery percentage.",
    likelihood: 'common' as const,
  },
  {
    icon: RefreshCw,
    title: 'Firmware update stalled mid-process',
    description:
      "Ring cameras receive automatic firmware updates in the background. If a firmware update is interrupted — by a momentary WiFi drop or power fluctuation — the camera can get stuck in an intermediate state that presents as persistently offline. A full power cycle or device removal and re-add typically resolves this.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Check signal strength in Device Health',
    description:
      "Open the Ring app, tap the three lines (menu) > Devices > select your camera > Device Health. Look at Signal Strength — Ring reports this as 'Good,' 'Fair,' or 'Poor,' along with the raw RSSI value in dBm. For reliable outdoor cameras, aim for -60 dBm or better (closer to 0 is stronger). If signal is Fair or Poor, consider a Ring Chime Pro or a WiFi range extender placed between the camera and your router.",
  },
  {
    title: 'Confirm the camera is on a 2.4GHz network',
    description:
      "Most Ring cameras only support 2.4GHz WiFi — they cannot connect to 5GHz networks. If your router uses a combined SSID (same name for both bands), the camera may have connected to 5GHz during setup in a high-signal area and now can't reconnect at its mounted location where 5GHz doesn't reach. Open your router's admin page and confirm a separate 2.4GHz SSID is available, then reconnect the camera to it via Ring app > Devices > [camera] > Device Health > Change WiFi Network.",
    tip: 'Ring Camera Pro supports both 2.4GHz and 5GHz. Check your specific camera model in the Ring app to confirm which bands it supports.',
  },
  {
    title: 'Check battery level for battery-powered models',
    description:
      "In the Ring app, go to Devices > [your camera] > Device Health > Battery Level. If battery is below 15%, charge it fully before continuing. Use the Ring-supplied charging cable — third-party cables sometimes don't deliver enough current to charge Ring's quick-release battery packs properly. A full charge typically takes 4–6 hours.",
  },
  {
    title: 'Power cycle the camera',
    description:
      "For battery-powered models: remove the battery pack from the camera, wait 30 seconds, and reinsert it. For wired models (Spotlight Cam Wired, Floodlight Cam, etc.): turn off the circuit breaker or unplug the power supply, wait 30 seconds, and restore power. Allow 2–3 minutes for the camera to fully boot and reconnect before checking the app.",
  },
  {
    title: 'Remove and re-add the camera in the Ring app',
    description:
      "If the camera still shows offline after a power cycle, remove it from your Ring account and set it up fresh. In the Ring app: tap the three lines > Devices > select the camera > Device Settings > General Settings > Remove This Device. Confirm removal. Then re-add it: tap '+' > Set Up a Device > Security Cameras and follow the setup flow. This clears any corrupted configuration or stuck firmware state.",
    tip: 'Removing a device deletes its event history from your account. Download or save any important recordings from the Ring app before removing the device.',
  },
  {
    title: 'Check Ring service status',
    description:
      "Occasionally Ring's cloud services experience outages that cause cameras to appear offline even when they're functioning normally. Visit status.ring.com to check for any active incidents. If an outage is reported, the camera will reconnect automatically once Ring's servers recover — no action needed on your end.",
  },
];

const FAQS = [
  {
    question: 'Why does my Ring camera keep going offline randomly?',
    answer:
      "Intermittent offline events are almost always a WiFi signal stability issue rather than a permanent disconnection. A signal that appears acceptable on average can have frequent short drops that cause the camera to disconnect and reconnect. Check the RSSI value in Device Health — anything below -65 dBm is worth improving with a WiFi extender or Chime Pro. Also check for router firmware updates or interference from neighboring networks on the same 2.4GHz channel.",
  },
  {
    question: 'Does Ring camera work on 5GHz WiFi?',
    answer:
      "Most Ring cameras only support 2.4GHz WiFi — this includes the Ring Stick Up Cam Battery, Ring Spotlight Cam Battery, Ring Indoor Cam, and most Ring Doorbell models. Ring Camera Pro and a few newer wired models support both 2.4GHz and 5GHz. Check your specific camera model on Ring's support site under 'technical specifications' to confirm which bands it supports.",
  },
  {
    question: 'How do I check my Ring camera signal strength?',
    answer:
      "Open the Ring app, tap the three lines (menu) > Devices > select your camera > Device Health. The Signal Strength section shows both a qualitative rating (Good / Fair / Poor) and the raw RSSI value in dBm. For reference: -40 to -60 dBm is excellent, -60 to -70 dBm is acceptable, below -70 dBm is likely to cause intermittent offline events. If signal is consistently Fair or Poor at the camera's location, a WiFi extender or Ring Chime Pro placed closer to the camera will help.",
  },
  {
    question: 'How long does a Ring camera battery last before going offline?',
    answer:
      "Battery life varies significantly by usage: a Ring Spotlight Cam Battery or Stick Up Cam Battery typically lasts 6–12 months under light use (a few events per day) and 1–2 months with heavy use (frequent motion events, frequent Live View access). Cold temperatures below 0°C (32°F) can reduce battery capacity by 20–40% temporarily. Enable 'Smart Alerts' and tune Motion Zones to cover only relevant areas to maximize battery life.",
  },
];

const RELATED = [
  {
    category: 'Ring Camera',
    title: 'Ring Camera Shows No Video Feed',
    href: '/fix/security-cameras/ring-camera/no-video-feed',
  },
  {
    category: 'Ring Camera',
    title: 'Ring Camera Motion Alerts Not Working',
    href: '/fix/security-cameras/ring-camera/motion-alerts-not-working',
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

export default function RingCameraOfflinePage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Ring Camera Showing Offline"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Ring Camera Showing Offline? How to Get It Back Online
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Weak WiFi signal at the camera&rsquo;s location is the most common cause. Here&rsquo;s
              how to check signal strength and get back online.
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
            heading="Still showing offline after these steps?"
            body="Our AI can run a live network diagnostic and check your camera's signal path to identify what's blocking the connection."
            chatLink="/chat?device=ring-camera&issue=offline"
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
            body="Tell our AI your camera model and what Device Health shows — it'll give you a targeted fix for your specific setup."
            chatLink="/chat?device=ring-camera"
          />
        </div>
      </div>
    </>
  );
}
