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
  title: 'How to Set Up a TP-Link Deco Mesh Network (Complete Guide) | MyTech-Fix',
  description:
    'Step-by-step setup for your TP-Link Deco mesh WiFi network — connecting to your modem, configuring the app, adding satellite units, and verifying coverage.',
  alternates: {
    canonical: `${BASE}/setup/tp-link-deco-mesh`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Setup Guides', href: '/setup' },
  { label: 'TP-Link Deco Mesh Network' },
];

const PREREQS = [
  'TP-Link Deco unit(s) and power adapters',
  'The Deco app — download it on iOS or Android before starting',
  'Your modem (supplied by your ISP)',
  'ISP account credentials if your connection requires a login (PPPoE — common with DSL and some fiber providers)',
];

const STEPS = [
  {
    title: 'Connect your primary Deco to your modem',
    description:
      "Use the included Ethernet cable to connect the primary Deco unit's WAN port to one of the LAN ports on your modem. Power on your modem first and allow it to fully initialize — usually 1–2 minutes — before plugging in the Deco.",
  },
  {
    title: 'Power on the Deco and wait for the LED',
    description:
      "Plug in the Deco's power adapter. The LED will cycle through colors during startup. Wait for it to turn solid blue — this means the unit is ready for the app to configure it. If the LED turns amber or red, check the Ethernet connection to your modem.",
  },
  {
    title: 'Download the Deco app and sign in',
    description:
      'Install the TP-Link Deco app and sign in with a TP-Link account (or create one — it\'s free). A TP-Link account is required to manage your network both at home and remotely. The app uses Bluetooth to detect your Deco during initial setup, so keep Bluetooth enabled on your phone.',
  },
  {
    title: 'Set up a new network in the app',
    description:
      'Tap "Set Up a New Network" and follow the on-screen prompts. The app will scan for your Deco via Bluetooth and guide you through internet connection setup. If your ISP requires PPPoE credentials, enter them when prompted — your ISP will have provided these, usually on a welcome letter or account page.',
  },
  {
    title: 'Name your network and set a WiFi password',
    description:
      'When prompted, choose a network name (SSID) and create a strong WiFi password. Deco creates a single unified network name covering both 2.4 GHz and 5 GHz bands — devices connect to whichever is optimal. You can split the bands in advanced settings later if needed, but it isn\'t necessary for most households.',
  },
  {
    title: 'Place and power on additional Deco units',
    description:
      "Place each additional Deco unit roughly halfway between the primary unit and the area needing coverage. Avoid locations in closed cabinets, directly behind TVs, or adjacent to concrete walls. Plug each unit in and wait for its LED to turn solid yellow (searching for the primary) before adding it in the app.",
    tip: "If you can run an Ethernet cable between Deco units (wired backhaul), do it — it significantly improves throughput and reliability compared to wireless mesh connections.",
  },
  {
    title: 'Add each additional unit in the app',
    description:
      'In the Deco app, tap the "+" icon and select "Add Deco." The app will scan for waiting units and guide you through pairing each one. Wait for each unit\'s LED to turn solid blue and for it to appear as "Connected" in the app before moving on to the next.',
  },
  {
    title: 'Run a speed test to confirm setup',
    description:
      "Once all units show as connected in the app, run a speed test from within the Deco app's home screen. Results close to your ISP plan speed (tested via Ethernet) confirm the setup is correct. WiFi speeds will typically be somewhat lower than a direct Ethernet connection — that's normal.",
  },
  {
    title: 'Connect your devices to the new network',
    description:
      'Join your phones, laptops, smart TVs, and other devices to the network name and password you created. Smart home devices that only support 2.4 GHz will need to be re-added to their respective apps if you changed your network name. Devices that were on a previous network will not reconnect automatically.',
  },
];

const FAQS = [
  {
    question: 'How many Deco units do I need?',
    answer:
      "A single Deco unit typically covers 1,500–2,000 square feet on a single floor with standard building materials. Homes with brick, concrete, or older plaster walls need more units spaced closer together. Multi-story homes generally need at least one unit per floor. The Deco app includes a coverage check feature that shows signal strength across your units once they're set up, which helps confirm whether placement is adequate.",
  },
  {
    question: 'Does Deco support wired backhaul between units?',
    answer:
      "Yes — connecting Deco units via Ethernet cable (wired backhaul) uses the LAN ports on each unit to form a dedicated wired connection between them, which significantly improves throughput and latency compared to wireless mesh connections. This is especially noticeable for 4K streaming, video calls, and gaming. The Deco app detects wired backhaul automatically when units are connected via Ethernet.",
  },
  {
    question: 'Can I set up Deco without the app?',
    answer:
      "The app is required for initial setup — there is no standalone web-based setup wizard for first configuration. After initial setup, basic settings like the network name and password can be changed through a web browser at tplinkmesh.com, but full management (adding units, QoS settings, parental controls) is handled through the app.",
  },
];

const RELATED = [
  {
    category: 'WiFi & Networking',
    title: 'WiFi & Networking Troubleshooting Guides — having mesh issues after setup?',
    href: '/fix/wifi',
  },
  {
    category: 'Setup Guides',
    title: 'How to Set Up an Eero 6 Mesh Network',
    href: '/setup/eero-6-mesh-network',
  },
];

export default function DecoSetupPage() {
  return (
    <>
      <SeoSchema
        howToName="How to Set Up a TP-Link Deco Mesh Network"
        howToSteps={STEPS.map((s) => ({ name: s.title, text: s.description }))}
        faqItems={FAQS}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Breadcrumb items={BREADCRUMBS} />

          <header className="mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-4">
              Setup Guide &middot; WiFi &amp; Networking
            </div>
            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
              How to Set Up a TP-Link Deco Mesh Network
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A complete walkthrough from modem connection to verified whole-home coverage —
              including adding satellite units and confirming speeds.
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
            heading="Stuck on a specific step?"
            body="Tell our AI where you got stuck and it will walk you through that part of the Deco setup."
            chatLink="/chat?device=tp-link-deco&issue=setup"
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
            body="Our AI can diagnose Deco setup problems and walk you through the exact step that's failing — including satellite sync and ISP connection issues."
            chatLink="/chat?device=tp-link-deco"
          />
        </div>
      </div>
    </>
  );
}
