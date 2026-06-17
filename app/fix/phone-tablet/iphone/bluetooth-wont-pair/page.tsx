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
import { Bluetooth, RefreshCw, Smartphone, Trash2 } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: "iPhone Bluetooth Won't Pair? Here's the Fix | MyTech-Fix",
  description:
    "iPhone Bluetooth not connecting? The device you're pairing with is most likely still connected to another phone or computer. Here's how to disconnect it and pair successfully.",
  alternates: {
    canonical: `${BASE}/fix/phone-tablet/iphone/bluetooth-wont-pair`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Phone & Tablet', href: '/fix/phone-tablet' },
  { label: 'iPhone', href: '/fix/phone-tablet/iphone' },
  { label: "iPhone Bluetooth Won't Pair" },
];

const TLDR = [
  "Check that the device you're pairing (headphones, speaker, etc.) isn't already connected to another phone or computer — most Bluetooth accessories only connect to one device at a time.",
  "If the device appears in Settings > Bluetooth but fails to connect, tap (i) next to it, select 'Forget This Device,' then restart pairing from scratch.",
  "Toggle Bluetooth off and back on in Settings or Control Center, then try again — this clears a common post-iOS-update cache issue.",
  "Reset Network Settings (Settings > General > Transfer or Reset iPhone > Reset > Reset Network Settings) clears all Bluetooth pairings and resolves corrupted pairing profiles.",
];

const CAUSES = [
  {
    icon: Bluetooth,
    title: 'The device is already connected to another phone or computer',
    description:
      "Most Bluetooth accessories — headphones, speakers, keyboards — can only actively connect to one device at a time. If the device is still connected to a laptop, another phone, or a previous owner's device, it will appear to ignore pairing attempts from your iPhone. The fix is to disconnect the device from the other source first, either by turning off Bluetooth on that device or by manually disconnecting from its Bluetooth settings.",
    likelihood: 'likely' as const,
  },
  {
    icon: RefreshCw,
    title: 'Bluetooth cache issue on the iPhone — common after an iOS update',
    description:
      "iOS updates occasionally leave the Bluetooth system in an inconsistent state where new pairing attempts fail silently. The device appears in the iPhone's Bluetooth list but the connection never completes, or it keeps spinning indefinitely. Toggling Bluetooth off and back on, or doing a full iPhone restart, clears the cache and usually resolves this without any deeper troubleshooting.",
    likelihood: 'common' as const,
  },
  {
    icon: Smartphone,
    title: "The other device isn't in pairing mode, or pairing mode timed out",
    description:
      "Bluetooth accessories enter pairing mode (discoverable state) for a limited time — typically 30 to 60 seconds — before timing out and becoming invisible to new devices. If you took too long between putting the device in pairing mode and opening Settings > Bluetooth on your iPhone, the device has already exited pairing mode and won't appear in the list. Put it back into pairing mode and try immediately.",
    likelihood: 'common' as const,
  },
  {
    icon: Trash2,
    title: 'A corrupted Bluetooth profile is blocking a fresh pairing',
    description:
      "If the device was previously paired to your iPhone and that pairing is still stored (even if it looks disconnected), the iPhone may attempt to reconnect using the old profile rather than initiating a fresh pairing. This is especially common after restoring the iPhone from a backup. Forgetting the device in Settings > Bluetooth and clearing the pairing on the accessory itself forces both sides to start from scratch.",
    likelihood: 'rare' as const,
  },
];

const STEPS = [
  {
    title: 'Confirm the device is in pairing mode',
    description:
      "Put your headphones, speaker, or other accessory into pairing mode — the exact method varies by manufacturer, but it typically involves holding the power or Bluetooth button for several seconds until an LED flashes rapidly or you hear a pairing tone. Check the device's manual or the manufacturer's website if you're unsure. Most accessories exit pairing mode after 60 seconds, so move quickly to the next step once pairing mode is active.",
  },
  {
    title: 'Open Settings > Bluetooth and check the device list',
    description:
      "Go to Settings > Bluetooth on your iPhone. Make sure Bluetooth is toggled on. Look for your device under 'Other Devices' — it should appear within a few seconds of entering pairing mode. If it appears but shows 'Not Connected' or fails to connect when you tap it, proceed to step 3. If it doesn't appear at all, confirm the device is in pairing mode and within a few feet of the iPhone.",
  },
  {
    title: "Forget the device if it appears but won't connect",
    description:
      "If the device is listed but fails to connect, tap the (i) icon next to its name and select 'Forget This Device.' Confirm the removal. Then put the device back into pairing mode and tap it again in the Bluetooth list — this time it will show under 'Other Devices' and prompt for a fresh pairing rather than trying to reconnect using a potentially corrupted old profile.",
  },
  {
    title: 'Toggle Bluetooth off and back on, or restart the iPhone',
    description:
      "Swipe down to open Control Center and tap the Bluetooth icon to turn it off. Wait 5 seconds, then tap it again to turn it back on. If that doesn't work, do a full iPhone restart: on iPhone X and later, press and hold the side button and either volume button until the power slider appears, then drag it. Allow 30 seconds for the restart, then retry pairing.",
  },
  {
    title: 'Disconnect the device from any other connected device first',
    description:
      "Turn off Bluetooth on any laptop, tablet, or other phone that might have the device paired. Alternatively, put those other devices in airplane mode temporarily. On the accessory itself, if there's a way to disconnect the current connection (many headphones have a 'disconnect' button sequence), use it. Once the device is fully disconnected from its current source, put it back into pairing mode and try from your iPhone.",
  },
  {
    title: 'Reset Network Settings if pairing still fails',
    description:
      "Go to Settings > General > Transfer or Reset iPhone > Reset > Reset Network Settings. This clears all Bluetooth pairings along with saved WiFi passwords. The iPhone restarts with a clean Bluetooth slate. After restarting, put your accessory into pairing mode and pair it fresh from Settings > Bluetooth.",
    tip: 'Also clear the pairing memory on the Bluetooth device itself if it has a factory reset or pairing-clear function — the device manual will explain how. Both sides starting fresh gives the best chance of a clean pairing.',
  },
];

const FAQS = [
  {
    question: 'Why does my iPhone show the Bluetooth device but not connect to it?',
    answer:
      "When a device appears in the list but won't connect, the most common cause is a corrupted pairing profile stored on the iPhone. Tap the (i) next to the device name, select 'Forget This Device,' then put the accessory back into pairing mode and pair from scratch. If it still fails, reset the pairing memory on the accessory itself (check its manual for a factory reset or pair-clear procedure) and try again.",
  },
  {
    question: 'Why won\'t my AirPods connect to my iPhone?',
    answer:
      "AirPods pairing failures usually trace to one of three causes: the case battery is too low for the pairing indicator to activate, the AirPods are already connected to another device signed into the same Apple ID (a Mac or iPad), or the pairing profile on the iPhone has become corrupted. For the first, charge the case for 15 minutes. For the second, disconnect AirPods from other devices in their Bluetooth settings. For the third, forget the AirPods in Settings > Bluetooth and re-pair them by holding the case button with the lid open next to the iPhone.",
  },
  {
    question: 'How many Bluetooth devices can an iPhone connect to at once?',
    answer:
      "An iPhone can maintain active connections to multiple Bluetooth devices simultaneously — typically audio (headphones), input (keyboard), and health accessories at the same time. However, only one audio output device can be active at a time, so switching between Bluetooth speakers requires manually selecting the new one. The iPhone can store pairings for many more devices than it actively connects to.",
  },
  {
    question: 'Will resetting network settings fix Bluetooth issues on iPhone?',
    answer:
      "Yes — resetting network settings (Settings > General > Transfer or Reset iPhone > Reset > Reset Network Settings) clears all stored Bluetooth pairings along with WiFi passwords. This resolves corrupted Bluetooth profiles that prevent pairing. After the reset, you'll need to re-pair all your Bluetooth accessories and re-enter all WiFi passwords, so only use this if individual 'Forget This Device' steps haven't worked.",
  },
];

const RELATED = [
  {
    category: 'iPhone',
    title: "iPhone Won't Connect to WiFi",
    href: '/fix/phone-tablet/iphone/wont-connect-to-wifi',
  },
  {
    category: 'iPhone',
    title: 'iPhone Battery Draining Fast',
    href: '/fix/phone-tablet/iphone/battery-draining-fast',
  },
  {
    category: 'iPhone',
    title: 'iPhone Storage Full Error',
    href: '/fix/phone-tablet/iphone/storage-full-error',
  },
  {
    category: 'iPhone Guides',
    title: 'All iPhone troubleshooting guides →',
    href: '/fix/phone-tablet/iphone',
  },
];

export default function IPhoneBluetoothWontPairPage() {
  return (
    <>
      <SeoSchema
        howToName="Fix iPhone Bluetooth Won't Pair"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              iPhone Bluetooth Won&rsquo;t Pair? Here&rsquo;s the Fix
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The device you&rsquo;re trying to pair is most likely still connected to another
              phone or computer. Here&rsquo;s how to disconnect it and pair successfully.
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
            heading="Bluetooth still won't pair after these steps?"
            body="Our AI can help troubleshoot pairing issues specific to your accessory model and iPhone iOS version."
            chatLink="/chat?device=iphone&issue=bluetooth"
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
            heading="Still having trouble with your iPhone?"
            body="Tell our AI what device you're trying to pair and what happens when you try — it'll walk you through a fix for your specific setup."
            chatLink="/chat?device=iphone"
          />
        </div>
      </div>
    </>
  );
}
