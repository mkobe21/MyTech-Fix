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
import { WifiOff, Eye, RefreshCw, AlertCircle } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Ring Camera Shows No Video Feed? Here's How to Fix It | MyTech-Fix",
  description:
    "Ring camera live view failing or showing a black screen? Weak WiFi is the most common cause, but a dirty lens or outdated app can also be the culprit.",
  alternates: {
    canonical: `${BASE}/fix/security-cameras/ring-camera/no-video-feed`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Security Cameras', href: '/fix/security-cameras' },
  { label: 'Ring Camera', href: '/fix/security-cameras/ring-camera' },
  { label: 'No Video Feed' },
];

const TLDR = [
  "Check Signal Strength in Device Health first — a weak connection causes live view to time out before it finishes loading.",
  "Physically inspect the lens for dirt, water droplets, or spider webs — a partial obstruction shows as a dark or blurry picture, not an error.",
  "Try viewing from a different device to isolate whether it's the app or the camera — if another device works, clear the Ring app cache.",
  "Check Event History in the app — if past recordings have video but live view fails, the issue is connection latency, not the camera hardware.",
];

const CAUSES = [
  {
    icon: WifiOff,
    title: 'Weak WiFi connection causing live view to time out',
    description:
      "Live view requires a sustained connection fast enough to stream real-time video — this is significantly more demanding than simply staying online or capturing short event clips. A signal that's strong enough to report the camera as online can still be too weak or too latency-prone to stream live video without timing out. Ring's live view typically requires a sustained upstream speed of at least 1–2 Mbps and consistent latency from the camera to Ring's servers.",
    likelihood: 'likely' as const,
  },
  {
    icon: Eye,
    title: 'Camera lens is obstructed',
    description:
      "Outdoor Ring cameras frequently accumulate dirt, water spots, condensation, and spider webs directly on the lens — spiders are particularly attracted to the infrared LEDs Ring cameras use for night vision. Even a thin web or a few water droplets can create a blurry, dark, or partially obscured image. This is easy to overlook because the camera appears online and functional from the app's perspective.",
    likelihood: 'common' as const,
  },
  {
    icon: RefreshCw,
    title: 'Ring app cache is corrupted or the app needs updating',
    description:
      "The Ring app stores session data and cached video frames locally — if this cache becomes corrupted (often after a phone OS update or a Ring app update), live view may fail to load or hang on a black screen. Force-closing the app and clearing its cache, or checking for a pending Ring app update, resolves the majority of app-layer video failures.",
    likelihood: 'common' as const,
  },
  {
    icon: AlertCircle,
    title: "Camera's image sensor has failed",
    description:
      "In rare cases — particularly with cameras that have been exposed to direct water ingress or physical impact — the image sensor itself can fail. This presents as a persistent black screen on live view while the camera otherwise appears online, and it can be confirmed if Event History also shows black or corrupted video from before the current session. Ring cameras are generally covered by a 1-year limited warranty and potentially Amazon's extended protection plans.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Check signal strength in Device Health',
    description:
      "Open the Ring app > menu (three lines) > Devices > [your camera] > Device Health > Signal Strength. For reliable live view, aim for 'Good' with an RSSI value of -60 dBm or better. A 'Fair' or 'Poor' signal is the most common reason live view fails or shows a spinning loader before timing out. Improving signal with a WiFi extender, relocating the router, or using a Ring Chime Pro is the highest-impact fix.",
  },
  {
    title: 'Physically inspect and clean the camera lens',
    description:
      "Walk out to the camera and look directly at the lens. Check for: spider webs (especially around the IR LEDs), water spots or condensation on the lens face, dirt buildup or bird droppings, and condensation inside the lens dome (indicates seal failure). Clean the lens gently with a clean, dry microfiber cloth — don't use paper towels or rough fabric which can scratch. For spider webs, use a soft brush or compressed air.",
    tip: "To deter spiders from returning, spray a small amount of peppermint oil solution (avoid getting it directly on the lens) around the camera mounting bracket — spiders are strongly deterred by it.",
  },
  {
    title: 'Force-close the Ring app and try from a different device',
    description:
      "On iPhone: swipe up from the bottom to the app switcher and swipe Ring away. On Android: tap the recent apps button and close Ring. Reopen Ring and test live view. If live view works from a different phone or tablet, the issue is app-specific on your primary device — proceed to step 4. If it fails on multiple devices, the issue is the camera or its connection.",
  },
  {
    title: 'Update or reinstall the Ring app',
    description:
      "Open the App Store (iPhone) or Google Play Store (Android) and check for a Ring update. Pending updates often fix known live view and streaming bugs. If already on the latest version, uninstall Ring, restart your phone, and reinstall from the store — this clears cached state that can't be removed any other way.",
  },
  {
    title: 'Power cycle the camera',
    description:
      "For battery-powered models: remove the battery, wait 30 seconds, reinsert. For wired models: switch off the circuit breaker or unplug the power supply, wait 30 seconds, restore power. Allow 2–3 minutes for the camera to boot before testing live view. A power cycle clears any transient firmware state that can freeze the video encoder.",
  },
  {
    title: 'Check Event History to distinguish app from hardware failure',
    description:
      "In the Ring app, tap the clock icon (Event History) to review past recordings from the camera. If past recordings show clear video but live view fails, the hardware is working and the issue is connection-related (latency or bandwidth to Ring's streaming servers). If Event History also shows black or corrupted video from recent events, the image sensor may have failed — contact Ring support for warranty assessment.",
  },
];

const FAQS = [
  {
    question: "Why does my Ring camera say 'Live View Failed to Load'?",
    answer:
      "'Live View Failed to Load' appears when the connection between the Ring app and the camera times out before the video stream can be established. This is almost always a WiFi signal quality issue at the camera's location — not enough sustained bandwidth or too much latency to open a real-time video stream. Check RSSI in Device Health and improve signal if it's below -65 dBm. It can also happen during a Ring service interruption — check status.ring.com.",
  },
  {
    question: 'Why does my Ring camera show a black screen instead of video?',
    answer:
      "A black screen with no 'Live View Failed' error usually means the video stream connected but the camera returned a blank frame — typically caused by a dirty or obstructed lens, a corrupted app cache, or a sensor that has lost its calibration state (resolved by a power cycle). If the black screen appears on multiple devices and persists after a power cycle and lens cleaning, check Event History to see if recent motion recordings also show black — if they do, the image sensor may have failed.",
  },
  {
    question: 'Can I watch Ring live view from a computer browser?',
    answer:
      "Yes. Go to ring.com, sign in, and click on your camera from the device list. Live view is available directly in the browser without needing a Ring Protect plan. If live view works in the browser but not the app, the issue is app-specific on your phone — try reinstalling the Ring app.",
  },
  {
    question: 'Why does Ring camera video cut out after a few seconds?',
    answer:
      "Live view cutting out after 5–15 seconds is a sign of marginal WiFi signal — strong enough to initiate the stream but not stable enough to sustain it. The camera connects, begins streaming, and then the connection drops below the minimum bitrate needed to continue. Improving signal at the camera's location is the direct fix. Also check if the issue happens more often during peak WiFi usage hours (evenings), which can indicate router congestion rather than pure signal distance.",
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

export default function RingCameraNoVideoPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Ring Camera No Video Feed"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Ring Camera Shows No Video Feed? Here&rsquo;s How to Fix It
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Live view timing out or showing a black screen is almost always a WiFi signal issue
              — but a dirty lens or stale app cache can also be the cause.
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
            heading="Live view still not loading?"
            body="Our AI can run a network diagnostic and check your camera's connection quality to identify exactly what's causing the stream to fail."
            chatLink="/chat?device=ring-camera&issue=no-video"
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
            body="Describe what you see when live view fails — our AI will walk you through a targeted fix for your camera model and setup."
            chatLink="/chat?device=ring-camera"
          />
        </div>
      </div>
    </>
  );
}
