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
import { Moon, Sun, Eye, Layers } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Ring Camera Night Vision Not Working? Here's the Fix | MyTech-Fix",
  description:
    "Ring camera showing a dark or washed-out image at night? Night Vision is probably set to Off or On Demand rather than Automatic. Here's how to fix it.",
  alternates: {
    canonical: `${BASE}/fix/security-cameras/ring-camera/night-vision-not-working`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Security Cameras', href: '/fix/security-cameras' },
  { label: 'Ring Camera', href: '/fix/security-cameras/ring-camera' },
  { label: 'Night Vision Not Working' },
];

const TLDR = [
  "Check Ring app > Device Settings > Video Settings > Night Vision — it should be set to Automatic, not Off or On Demand.",
  "A nearby porch light or streetlight can prevent night mode from engaging since Ring uses an ambient light sensor, not a fixed time.",
  "Clean the infrared LED ring around the lens — dirt or spider webs on the IR LEDs directly degrade night vision quality.",
  "If the camera is mounted behind glass or a window screen, the infrared light reflects back — relocate it to an open position.",
];

const CAUSES = [
  {
    icon: Moon,
    title: 'Night Vision is set to "Off" or "On Demand" rather than Automatic',
    description:
      "Ring cameras have three Night Vision settings: Automatic (switches to infrared mode based on ambient light), On Demand (only activates when you manually open live view and enable it), and Off. The default is Automatic, but it's easy to accidentally change this while navigating Video Settings. If set to 'Off,' the camera produces a very dark, noisy image at night without any night vision. 'On Demand' means you have to manually enable it each time — it won't activate for motion recordings.",
    likelihood: 'likely' as const,
  },
  {
    icon: Sun,
    title: 'A nearby light source is keeping night mode from engaging',
    description:
      "Ring cameras decide when to activate night vision using an ambient light sensor — not a clock or a fixed lux threshold. If a porch light, streetlight, garage light, or nearby indoor lamp keeps the sensor reading above its threshold, the camera stays in color mode rather than switching to infrared. This produces a dark, underexposed image because the scene appears brighter than the camera can properly expose in color mode without the IR LEDs active.",
    likelihood: 'common' as const,
  },
  {
    icon: Eye,
    title: 'Dirty lens or obstructed infrared LEDs',
    description:
      "Ring cameras illuminate the scene at night using infrared LEDs arranged in a ring around the lens. If the lens itself has dirt, water spots, or a web on it — or if a camera cover/case is partially blocking the IR LEDs — night vision quality degrades dramatically. The image may appear foggy, have halos, or show a very short detection range. This is one of the most common causes of worsening night vision quality on cameras that used to work well.",
    likelihood: 'common' as const,
  },
  {
    icon: Layers,
    title: 'Camera is mounted behind glass or a window screen',
    description:
      "Infrared night vision cannot work through glass — the IR light emitted by the camera reflects off the glass surface back toward the lens, creating a bright washed-out reflection or glare that obliterates the actual scene. A window screen reduces IR penetration and causes a grid pattern to appear in the night image. Ring cameras must be mounted outdoors in open air for night vision to function correctly — mounting inside looking out through a window is not a supported configuration.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Set Night Vision to Automatic in Video Settings',
    description:
      "Open the Ring app > menu > Devices > [your camera] > Device Settings > Video Settings. Find the 'Night Vision' option — tap it and confirm it is set to 'Automatic.' If it was set to 'Off,' change it to Automatic and test by blocking light from the camera (cover the lens with your hand briefly outdoors at night to force the sensor to switch modes). The image should immediately switch from color to the characteristic black-and-white infrared view.",
  },
  {
    title: 'Evaluate ambient light sources near the camera',
    description:
      "After dark, observe what light sources are visible from the camera's field of view — check the live view in the Ring app. If a porch light, garage flood, or streetlight is illuminating the scene, the camera's ambient light sensor may read it as too bright to trigger night mode. Options: redirect or reduce the competing light source, move the camera to a position where the light source is outside the field of view, or use the Ring app's 'Color Night Vision' setting if your model supports it (available on Spotlight Cam and newer models).",
    tip: "Ring cameras with Color Night Vision use enhanced color mode at low light rather than switching to black-and-white infrared — this can produce clearer images in areas with some ambient light like streetlights.",
  },
  {
    title: 'Clean the lens and the infrared LED ring',
    description:
      "Look closely at the front of the camera. You'll see a central glass lens surrounded by a ring of small infrared LED emitters. Clean both the lens and the area around the IR LEDs with a soft, dry microfiber cloth. Use compressed air to remove spider webs from the camera housing. Remove any camera cover or protective case that may be partially blocking the IR LEDs — even partial obstruction reduces night vision range significantly.",
  },
  {
    title: 'Confirm the camera is not mounted behind glass',
    description:
      "If the camera is currently installed inside, looking through a window, relocate it to an exterior mounting position. If outdoor mounting isn't possible, you'll need to accept that night vision won't function in that configuration — infrared reflection off glass is a fundamental physics limitation, not a fixable camera bug. Some users cut a hole in a window screen just large enough for the camera lens, which can partially mitigate screen-pattern artifacts.",
  },
  {
    title: 'Check for firmware updates',
    description:
      "Ring camera firmware updates can include night vision calibration improvements. Open the Ring app > Devices > [camera] > Device Health > scroll to Firmware. Ring pushes firmware updates automatically over WiFi, but the update only applies when the camera is online and idle. If the camera has been offline or on a weak connection, it may be several versions behind. Ensuring the camera is online and connected to a stable network allows any pending updates to install overnight.",
  },
  {
    title: 'Test night vision by deliberately triggering it',
    description:
      "After making any changes, test night vision by going outside after dark, covering the camera's ambient light sensor (the small dot or hole next to the lens) with your finger briefly, then uncovering it. This forces the sensor to re-evaluate the light level. In Automatic mode, the camera should switch to infrared black-and-white mode when light is low. If it doesn't switch at all, confirm Night Vision is set to Automatic in the app (Step 1) and that no firmware issue is pending.",
  },
];

const FAQS = [
  {
    question: 'Why is my Ring camera image purple or pink at night?',
    answer:
      "A purple or pink tint in Ring camera footage at night is a common sign that the infrared cut filter (ICF) is stuck in a partially closed position. This filter normally slides open in low light to allow the IR LEDs to illuminate the scene in black and white. When it sticks partway, you get a mixed image with color casts from the IR light. A power cycle — removing and reinserting the battery, or briefly cutting power to a wired model — usually snaps the filter back into place.",
  },
  {
    question: 'Why does Ring night vision not turn on even though it looks dark outside?',
    answer:
      "Ring uses an ambient light sensor to decide when to activate night vision — not a clock. If there's enough ambient light from streetlights, porch lights, or spillover from interior lighting, the sensor may read the scene as too bright to trigger infrared mode, even if the image looks dark on your screen. The fix is either to reduce competing light sources, reposition the camera to a darker field of view, or switch to 'Color Night Vision' mode if your model supports it.",
  },
  {
    question: 'Can Ring cameras record in color at night?',
    answer:
      "Standard Ring infrared night vision produces black-and-white footage. However, Ring Spotlight Cam Plus, Spotlight Cam Pro, Floodlight Cam Pro, and some newer Stick Up Cam models support 'Color Night Vision,' which uses the camera's color sensor with enhanced image processing to produce color footage in lower light conditions — useful in areas with some ambient lighting like streetlights. Enable it in Device Settings > Video Settings > Color Night Vision if available for your model.",
  },
  {
    question: 'Why does my Ring camera produce a washed-out glare at night?',
    answer:
      "A bright, washed-out glare covering much of the night image is the classic symptom of infrared light reflecting back toward the lens — almost always caused by glass in the optical path. If the camera is mounted inside looking through a window, the IR LEDs illuminate the window glass rather than the outdoor scene. The only fix is to mount the camera outdoors. Other causes: a dirty or scratched lens that scatters IR light, or a camera cover/case with a glossy surface directly in front of the lens.",
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
    title: 'Ring Camera Motion Alerts Not Working',
    href: '/fix/security-cameras/ring-camera/motion-alerts-not-working',
  },
  {
    category: 'Ring Camera Guides',
    title: 'All Ring Camera troubleshooting guides →',
    href: '/fix/security-cameras/ring-camera',
  },
];

export default function RingCameraNightVisionPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Ring Camera Night Vision Not Working"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Ring Camera Night Vision Not Working? Here&rsquo;s the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Night Vision is probably set to Off or On Demand rather than Automatic — a
              one-tap fix. Here&rsquo;s how to check and handle other causes too.
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
            heading="Night vision still not working?"
            body="Describe what the image looks like at night — dark, purple, glare, or blurry — and our AI will identify the specific cause."
            chatLink="/chat?device=ring-camera&issue=night-vision"
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
            body="Tell our AI what the night image looks like and where the camera is mounted — it'll give you a targeted fix."
            chatLink="/chat?device=ring-camera"
          />
        </div>
      </div>
    </>
  );
}
