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
  title: 'How to Set Up a Netgear Orbi Mesh Network (Complete Guide) | MyTech-Fix',
  description:
    'Step-by-step setup for your Netgear Orbi router and satellites — connecting to your modem, app configuration, syncing satellites, and verifying coverage.',
  alternates: {
    canonical: `${BASE}/setup/netgear-orbi-mesh-network`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Setup Guides', href: '/setup' },
  { label: 'Netgear Orbi Mesh Network' },
];

const PREREQS = [
  'Netgear Orbi router and satellite unit(s) with power adapters',
  'The Orbi app — download it on iOS or Android before you start',
  'Your modem (supplied by your ISP)',
  'ISP account credentials if your connection requires a login (PPPoE — common with DSL and some fiber providers)',
];

const STEPS = [
  {
    title: 'Connect the Orbi router to your modem',
    description:
      "Use the included Ethernet cable to connect the Orbi router's WAN/Internet port (usually yellow, labeled \"Internet\") to one of the LAN ports on your modem. Power on your modem first and wait for it to fully initialize — usually 1–2 minutes — before powering on the Orbi router.",
  },
  {
    title: 'Power on the router and wait for the status light',
    description:
      "Plug in the Orbi router. The LED ring on top will cycle through colors during startup. Wait for it to turn solid blue or solid white — the exact color depends on your Orbi model, but a solid (non-blinking) light means it's ready to configure. Amber means it's still booting; red means no internet signal was detected from the modem.",
  },
  {
    title: 'Download the Orbi app and sign in',
    description:
      'Open the Orbi app on your phone. You will need to create a free NETGEAR account or sign in if you already have one. The app is the fastest way to set up a new system, though orbilogin.com also works from a device connected via Ethernet if you prefer a browser-based setup.',
  },
  {
    title: 'Let the app detect and configure your router',
    description:
      "Follow the app's prompts to detect your Orbi router. It will scan your local network, find the router, and guide you through internet connection setup. If your ISP requires PPPoE credentials (common with DSL), enter them when prompted. The app will test the connection and confirm before moving on.",
  },
  {
    title: 'Name your network and set a WiFi password',
    description:
      "When prompted, choose an SSID (network name) and create a WiFi password. Orbi creates a single unified network name across 2.4 GHz and 5 GHz bands — devices connect to whichever band is optimal automatically. You can separate the bands later in advanced settings if you need to, but it isn't necessary for most setups.",
  },
  {
    title: 'Power on your satellite unit(s)',
    description:
      "Place each satellite unit in a location roughly halfway between the Orbi router and the area you need coverage. Plug it in and power it on. The satellite will automatically look for the router to sync with over the wireless backhaul. Give it 2–3 minutes to initialize.",
    tip: 'Avoid placing satellites behind large appliances or in enclosed spaces. The backhaul signal between router and satellite needs to be strong — if your satellite is at the edge of the router\'s range, the whole mesh suffers.',
  },
  {
    title: 'Add the satellite in the app',
    description:
      "In the Orbi app, tap \"Add Satellite\" (or \"Add Device\" depending on your app version) and follow the prompts. The app will scan for the satellite and sync it to your network. The satellite's LED ring will pulse during sync and turn solid once it has successfully joined the mesh.",
  },
  {
    title: 'Repeat for additional satellites',
    description:
      "If you have more than one satellite, repeat the power-on and app pairing process for each one. Each satellite must show a solid LED and appear as connected in the app before you move on. Adding satellites one at a time gives you a clear confirmation that each one is working before you add the next.",
  },
  {
    title: 'Run a speed test to verify setup',
    description:
      "Once everything shows as connected in the Orbi app, run a speed test from within the app (or use a browser-based test like fast.com on a device connected via Ethernet). Ethernet results close to your ISP plan speed confirm the router setup is correct. WiFi speeds will typically be somewhat lower, which is expected.",
    tip: 'For best satellite performance, connecting satellites to the router via Ethernet (wired backhaul) uses a dedicated cable connection instead of wireless, significantly improving throughput. If your home allows running Ethernet between units, it\'s worth doing.',
  },
];

const FAQS = [
  {
    question: 'How far apart should I place Orbi satellites?',
    answer:
      "Position satellites so they can maintain a strong wireless backhaul connection to the router — typically within 30–40 feet in a typical home with standard wall materials. Too close and you waste coverage; too far and the backhaul degrades, reducing the speeds the satellite can deliver. The Orbi app shows backhaul signal strength for each satellite, which helps you fine-tune placement.",
  },
  {
    question: 'Do I need a NETGEAR account to use Orbi?',
    answer:
      "A free NETGEAR account is required for app-based setup. If you prefer not to create an account, you can configure the Orbi through a web browser by connecting a device via Ethernet to the router and navigating to orbilogin.com — this method doesn't require an account but provides fewer management features than the app.",
  },
  {
    question: 'Can I add more Orbi satellites later?',
    answer:
      "Yes — you can add additional compatible Orbi satellites to an existing system at any time through the same \"Add Satellite\" process in the app. Make sure any satellite you're adding is compatible with your Orbi router model. Orbi RBK series satellites are generally cross-compatible within their generation, but mixing very old and very new Orbi hardware can cause issues.",
  },
];

const RELATED = [
  {
    category: 'WiFi & Networking',
    title: 'Netgear Orbi Troubleshooting Guides — already set up but having issues?',
    href: '/fix/wifi/netgear-orbi',
  },
  {
    category: 'Setup Guides',
    title: 'How to Set Up an Eero 6 Mesh Network',
    href: '/setup/eero-6-mesh-network',
  },
];

export default function OrbiSetupPage() {
  return (
    <>
      <SeoSchema
        howToName="How to Set Up a Netgear Orbi Mesh Network"
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
              How to Set Up a Netgear Orbi Mesh Network
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A complete walkthrough for setting up your Orbi router and satellites — from modem
              connection to verified whole-home coverage.
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
            body="Tell our AI where you got stuck and it will walk you through that part of the Orbi setup."
            chatLink="/chat?device=netgear-orbi&issue=setup"
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
            body="Our AI can diagnose Orbi setup problems and walk you through the exact step that's failing — including satellite sync issues and ISP connection errors."
            chatLink="/chat?device=netgear-orbi"
          />
        </div>
      </div>
    </>
  );
}
