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
import { RefreshCw, AlertCircle, Smartphone, HardDrive } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "Philips Hue Not Syncing with Apple HomeKit? Here's the Fix | MyTech-Fix",
  description:
    "Philips Hue lights disappeared from the Apple Home app? The HomeKit pairing with your Hue Bridge has broken. Here's how to restore it without losing your scenes.",
  alternates: {
    canonical: `${BASE}/fix/smart-home/philips-hue-not-syncing-with-homekit`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Smart Home', href: '/fix/smart-home' },
  { label: 'Philips Hue Not Syncing with HomeKit' },
];

const WHY =
  "Philips Hue connects to Apple HomeKit through the Hue Bridge (v2 or later), which acts as the HomeKit gateway. The connection relies on a HomeKit pairing stored on the bridge — if this pairing breaks after a bridge restart, network change, or iOS update, the Hue lights disappear from the Home app even though they still work in the Hue app.";

const TLDR = [
  "You need a Hue Bridge v2 (square shape) — the v1 round bridge does not support HomeKit at all.",
  "HomeKit pairing often breaks after a router restart or network change — re-adding the bridge in the Home app restores it.",
  "Your iPhone and Hue Bridge must be on the same WiFi network for HomeKit pairing to succeed.",
  "Update the Hue Bridge firmware through the Hue app before re-pairing — outdated firmware can block HomeKit connections.",
];

const CAUSES = [
  {
    icon: RefreshCw,
    title: 'HomeKit pairing between Hue Bridge and Apple Home has broken',
    description:
      "Apple HomeKit uses an encrypted pairing stored on both the bridge and in iOS. A router restart, a DHCP IP change that the bridge fails to handle cleanly, or an iOS update that resets HomeKit's local network authorization can break this pairing. The Hue lights continue working in the Hue app because that connection goes through Philips' cloud — but HomeKit's local pairing is gone.",
    likelihood: 'likely' as const,
  },
  {
    icon: AlertCircle,
    title: 'Using a Hue Bridge v1 — not compatible with HomeKit',
    description:
      "The original Hue Bridge (round shape, pre-2015) does not support HomeKit at all. Only the Hue Bridge v2 (square shape) has the HomeKit firmware required for Apple Home integration. If you have a v1 bridge, you need to upgrade to a v2 — the bridge ships in most Hue starter kits sold since 2015.",
    likelihood: 'common' as const,
  },
  {
    icon: Smartphone,
    title: 'iOS or iPadOS update changed HomeKit authorization state',
    description:
      "Major iOS updates occasionally reset local network permissions or HomeKit's accessory authorization database. After an update, the Home app may lose its pairing with existing accessories — especially those connected via local LAN rather than direct Bluetooth. Re-adding the bridge restores the pairing without affecting your Hue configuration.",
    likelihood: 'common' as const,
  },
  {
    icon: HardDrive,
    title: 'Hue Bridge firmware is outdated',
    description:
      "Philips periodically releases Hue Bridge firmware updates that include HomeKit compatibility fixes. If the bridge firmware is significantly out of date, HomeKit may fail to re-pair even when everything else is correct. Updating through the Hue app should be done before attempting to re-add the bridge to HomeKit.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Confirm you have a Hue Bridge v2',
    description:
      "Look at your Hue Bridge. The v2 is square-shaped (approximately 9cm × 9cm) with a rounded top and status lights on the front. The v1 is round and approximately 12cm in diameter. Only the v2 supports HomeKit. If you have a v1, you'll need to purchase a Hue Bridge v2 or a Hue starter kit — it's sold separately and on Amazon.",
  },
  {
    title: 'Update the Hue Bridge firmware',
    description:
      "Open the Philips Hue app on your phone. Tap Settings > My Hue system > Software update. If an update is available, install it before proceeding. Firmware updates on the Hue Bridge are required before HomeKit will successfully re-pair on some versions. The update takes 2–5 minutes and the bridge restarts automatically.",
  },
  {
    title: 'Restart the Hue Bridge',
    description:
      "Unplug the Hue Bridge power cable, wait 30 seconds, and plug it back in. Wait for all three status lights to turn solid (power, network, link). This clears any stale pairing state from the bridge's side and ensures it's ready for a fresh HomeKit pairing attempt.",
    tip: "Make sure the Ethernet cable connecting the bridge to your router is firmly seated. The bridge requires a wired LAN connection — it does not connect via WiFi.",
  },
  {
    title: 'Confirm your iPhone is on the same network as the bridge',
    description:
      "For HomeKit pairing to work, your iPhone must be on the same local network as the Hue Bridge. The bridge is connected via Ethernet to your router — your iPhone should be on the WiFi network served by that same router. If you have multiple VLANs or a separate IoT network, the iPhone and bridge must be on the same one during pairing.",
  },
  {
    title: 'Add the bridge to Apple HomeKit',
    description:
      "Open the Apple Home app on your iPhone. Tap '+' > Add Accessory. Point your iPhone camera at the QR code on the bottom of the Hue Bridge, or tap 'More options' and enter the 8-digit HomeKit code printed on the bridge's underside sticker. Follow the prompts to add the bridge and assign it to a room. Your Hue lights will appear automatically after the bridge is paired.",
    tip: "The HomeKit code is on a white sticker on the bottom of the bridge in the format XXXX-XXXX. Keep this sticker — if it's damaged, you'll need to contact Philips Hue support to retrieve the code.",
  },
  {
    title: 'Remove and re-add the bridge if it still does not pair',
    description:
      "If the bridge appears in HomeKit but shows as 'No Response,' or pairing fails repeatedly: open the Home app > tap the bridge accessory > tap the gear icon > Remove Accessory. Then restart the bridge (unplug, wait 30 seconds, replug) and repeat step 5. For persistent failures, contact Philips Hue support — they can remotely reset the bridge's HomeKit pairing key.",
  },
];

const FAQS = [
  {
    question: 'Why did my Hue lights disappear from the Apple Home app?',
    answer:
      "The HomeKit pairing between your Hue Bridge and Apple Home broke — most commonly after a router restart, a network DHCP change, or an iOS update that reset HomeKit's local network permissions. The lights continue working in the Hue app because that uses Philips' cloud connection. Re-adding the bridge through the Home app (+ > Add Accessory) restores all lights and rooms within minutes.",
  },
  {
    question: 'Do I need the Hue Bridge for HomeKit, or can I use Hue Bluetooth bulbs?',
    answer:
      "Hue Bluetooth bulbs (and the Bluetooth version of the Gradient Lightstrip) don't support HomeKit integration — they can only be controlled through the Hue app directly. You need a Hue Bridge v2 (the square model) to use Hue lights with Apple HomeKit, Siri, and Apple Home automations.",
  },
  {
    question: 'Will removing the bridge from HomeKit delete my Hue scenes?',
    answer:
      "No. Your Hue scenes, rooms, and automations are stored in the Hue app and on the bridge itself. Removing the bridge from Apple HomeKit only removes the connection to the Home app — the Hue app continues to work normally, and all your scenes and groups are preserved when you re-add the bridge to HomeKit.",
  },
  {
    question: 'Where is the HomeKit code on my Hue Bridge?',
    answer:
      "The 8-digit HomeKit setup code is on a white sticker on the bottom of the Hue Bridge v2, in the format XXXX-XXXX. You can also scan the QR code on that same sticker with your iPhone camera during HomeKit setup. Keep this sticker in good condition — if it's damaged or illegible, contact Philips Hue support to retrieve the code for your bridge's serial number.",
  },
];

const RELATED = [
  {
    category: 'Smart Home',
    title: 'Nest Thermostat Not Showing in Google Home',
    href: '/fix/smart-home/nest-thermostat-not-showing-in-google-home',
  },
  {
    category: 'Smart Home',
    title: 'Ecobee Not Working with Google Home',
    href: '/fix/smart-home/ecobee-not-working-with-google-home',
  },
  {
    category: 'Smart Home',
    title: 'Wyze Cam Not Working with Google Home',
    href: '/fix/smart-home/wyze-cam-not-working-with-google-home',
  },
  {
    category: 'AI Diagnosis',
    title: "Can't find your issue? Ask our AI →",
    href: '/chat',
  },
];

export default function PhilipsHueHomekitPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix Philips Hue Not Syncing with Apple HomeKit"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              Philips Hue Not Syncing with Apple HomeKit? Here&rsquo;s the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The HomeKit pairing with your Hue Bridge has broken — re-adding the bridge in the
              Apple Home app restores all your lights and scenes in minutes.
            </p>
          </header>

          <TLDRBox points={TLDR} />

          <div className="mb-10 rounded-2xl border border-white/10 bg-card/60 px-6 py-5">
            <h2 className="font-sora text-base font-semibold text-slate-200 mb-2">
              Why this happens
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">{WHY}</p>
          </div>

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
            heading="Still not showing in the Home app?"
            body="Our AI can check your bridge version, firmware, and HomeKit pairing state to find exactly what's blocking the connection."
            chatLink="/chat?device=philips-hue&issue=homekit"
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
            body="Describe your bridge version and what you've tried — our AI will give you a step-by-step HomeKit fix."
            chatLink="/chat?device=philips-hue"
          />
        </div>
      </div>
    </>
  );
}
