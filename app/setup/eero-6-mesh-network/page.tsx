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
  title: 'How to Set Up an Eero 6 Mesh Network (Complete Guide) | MyTech-Fix',
  description:
    'Step-by-step setup for your Eero 6 mesh WiFi network — modem connection, app pairing, adding satellite units for whole-home coverage, and your first speed test.',
  alternates: {
    canonical: `${BASE}/setup/eero-6-mesh-network`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Setup Guides', href: '/setup' },
  { label: 'Eero 6 Mesh Network' },
];

const PREREQS = [
  'Eero 6 unit(s) and power adapters (in the box)',
  'The Eero app — download it on iOS or Android before you start',
  "Your modem's make/model and any ISP login credentials (PPPoE username/password if required by your ISP)",
  'A phone with Bluetooth enabled — the app uses it to detect your Eero during pairing',
];

const STEPS = [
  {
    title: 'Download the Eero app and sign in',
    description:
      'Install the Eero app before doing anything with the hardware. Create an account or sign in if you already have one. The entire setup is guided by the app — there is no web interface to use as an alternative during initial setup.',
  },
  {
    title: 'Connect your primary Eero to your modem',
    description:
      "Use the included Ethernet cable to connect the Eero's WAN port (the single port, labeled with a globe icon on most models) to one of the LAN ports on your modem. If your modem has a built-in router, connect to one of its LAN ports — not the WAN/internet port. Power on your modem first and wait for it to fully boot before plugging in the Eero.",
  },
  {
    title: 'Plug in the Eero and wait for the setup light',
    description:
      "Plug your Eero into power using the included adapter. The LED will go through a startup sequence. When it turns solid white then begins pulsing — a slow, breathing white light — it's in setup mode and ready for the app to detect it via Bluetooth. This usually takes 30–60 seconds.",
  },
  {
    title: 'Follow the in-app setup prompts',
    description:
      "In the Eero app, tap \"Set up a new system\" and follow the on-screen instructions. The app uses Bluetooth to find your Eero automatically — keep your phone within a few feet of the device during this step. You don't need to touch any settings on the Eero itself; the app handles detection, internet check, and initial configuration.",
  },
  {
    title: 'Name your network and create a WiFi password',
    description:
      'When prompted, choose a network name (SSID) and set a WiFi password. Eero creates a single unified network name that covers all bands (2.4 GHz and 5 GHz simultaneously) — your devices will connect to whichever band is optimal. Choose a strong password — you will share it with every device in your home.',
  },
  {
    title: 'Add additional Eero units for mesh coverage',
    description:
      "If you have more than one Eero unit, the app will guide you through adding them after the primary is confirmed online. Place each additional unit roughly halfway between the primary and the area you're trying to cover — not at the very edge of signal. Plug in each satellite when prompted and wait for the app to detect and sync it before moving on.",
    tip: "Avoid placing satellites in closets, behind large appliances, or directly adjacent to concrete or brick walls. A clear line of sight to the nearest unit significantly improves wireless backhaul performance.",
  },
  {
    title: 'Wait for each unit to show solid white',
    description:
      'A pulsing light means syncing is still in progress. A solid white means the unit has joined the mesh and is ready. Do not unplug or move a unit while it is still pulsing — an interrupted sync can leave a node in a degraded state that requires a factory reset to resolve.',
  },
  {
    title: 'Run a speed test from within the Eero app',
    description:
      "Once all units show as connected in the app, go to Activity > Speed Test inside the Eero app. This test measures the speed from the Eero directly to the internet (bypassing WiFi interference), giving you a clean baseline. If speeds are significantly below your ISP plan, check the Ethernet cable between your modem and the primary Eero first.",
  },
  {
    title: 'Connect your devices to the new network',
    description:
      'Join your phones, laptops, smart TVs, and other devices to the network name and password you set up. Smart home devices — particularly those that only support 2.4 GHz — may need to be re-added through their respective apps after a network change. Devices that were previously on a different network will not switch automatically.',
  },
];

const FAQS = [
  {
    question: 'How many Eero units do I need for my home?',
    answer:
      "A general guideline is one Eero unit per 1,500–2,000 square feet of single-floor space. Dense materials — brick, concrete, old plaster — reduce effective range, so homes with these often need units spaced closer together. Multi-story homes typically need at least one unit per floor. The Eero app will flag nodes showing weak backhaul signal, which tells you a unit needs repositioning.",
  },
  {
    question: 'Can I keep my old router and add Eero on top of it?',
    answer:
      "You can, but running two routers simultaneously creates double NAT — both devices assign private IP addresses to your network, which breaks certain multiplayer games, VPNs, and remote access tools. The recommended setup is to connect your modem directly to Eero and let Eero act as your sole router. If you need a specific feature from your old router, look into putting it in bridge mode, which disables its routing function while keeping its other ports active.",
  },
  {
    question: 'Do I need to run Ethernet cables between Eero units?',
    answer:
      "No — Eero mesh works wirelessly by default, and most homes set it up that way. However, running Ethernet between units (wired backhaul) significantly improves throughput and reliability, particularly for 4K streaming or video calls in rooms far from the primary unit. If your home's layout allows it and you're comfortable running cable, wired backhaul is worth doing. If not, wireless mesh handles typical household usage well.",
  },
];

const RELATED = [
  {
    category: 'WiFi & Networking',
    title: 'Eero Troubleshooting Guides — already set up but having issues?',
    href: '/fix/wifi/eero',
  },
  {
    category: 'Setup Guides',
    title: 'How to Set Up a Netgear Orbi Mesh Network',
    href: '/setup/netgear-orbi-mesh-network',
  },
];

export default function EeroSetupPage() {
  return (
    <>
      <SeoSchema
        howToName="How to Set Up an Eero 6 Mesh Network"
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
              How to Set Up an Eero 6 Mesh Network
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A complete walkthrough from unboxing to a fully connected home — including adding
              satellite units for whole-home coverage.
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
            heading="Running into a problem mid-setup?"
            body="Describe what's happening and our AI will walk you through the specific step that's failing."
            chatLink="/chat?device=eero-6&issue=setup"
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
            body="Our AI can walk through the Eero app setup process with you step by step and diagnose exactly what's going wrong."
            chatLink="/chat?device=eero-6"
          />
        </div>
      </div>
    </>
  );
}
