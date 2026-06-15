import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import CategoryCard from '@/components/seo/CategoryCard';
import FinalCTA from '@/components/seo/FinalCTA';
import {
  Wifi,
  Printer,
  Home,
  Monitor,
  Camera,
  Smartphone,
  Shield,
  Globe,
} from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Tech Troubleshooting Guides | MyTech-Fix',
  description:
    'Real fixes for the tech problems people search for most — written in plain English, with step-by-step instructions and AI-assisted diagnostics.',
  alternates: {
    canonical: `${BASE}/fix`,
  },
};

const BREADCRUMBS = [{ label: 'Home', href: '/' }, { label: 'Guides' }];

const CATEGORIES = [
  {
    icon: Wifi,
    name: 'WiFi & Networking',
    description: 'Router issues, mesh setup, slow speeds, dead zones, and DNS problems.',
    guideCount: 5,
    href: null,
    enabled: true,
    subLinks: [
      { label: 'Eero', href: '/fix/wifi/eero', count: 4 },
      { label: 'Netgear Orbi', href: '/fix/wifi/netgear-orbi', count: 1 },
    ],
  },
  {
    icon: Printer,
    name: 'Printers',
    description: 'Offline printers, driver issues, scan & print setup, and wireless pairing.',
    guideCount: 0,
    href: null,
    enabled: false,
  },
  {
    icon: Home,
    name: 'Smart Home',
    description: 'Smart lights, cameras, plugs, hubs, and voice assistant setup.',
    guideCount: 0,
    href: null,
    enabled: false,
  },
  {
    icon: Monitor,
    name: 'Computers',
    description: 'Windows & Mac issues, slow performance, crashes, and driver problems.',
    guideCount: 0,
    href: null,
    enabled: false,
  },
  {
    icon: Camera,
    name: 'Security Cameras',
    description: 'Setup, cloud storage, connectivity, and motion detection issues.',
    guideCount: 0,
    href: null,
    enabled: false,
  },
  {
    icon: Smartphone,
    name: 'Phone & Tablet',
    description: 'iOS & Android setup, app errors, backup, and connectivity.',
    guideCount: 0,
    href: null,
    enabled: false,
  },
  {
    icon: Shield,
    name: 'Security & Privacy',
    description: 'Account protection, password managers, 2FA, and phishing defense.',
    guideCount: 0,
    href: null,
    enabled: false,
  },
  {
    icon: Globe,
    name: 'VPN & Remote Work',
    description: 'VPN setup, remote desktop, secure connections, and split tunneling.',
    guideCount: 0,
    href: null,
    enabled: false,
  },
];

export default function FixHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Breadcrumb items={BREADCRUMBS} />

        <header className="mb-12">
          <h1 className="font-sora text-4xl sm:text-5xl font-bold text-slate-50 tracking-tight mb-4 leading-tight">
            Tech Troubleshooting Guides
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
            Real fixes for the problems people search for most — written in plain English, verified
            by our AI.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.name} {...cat} />
          ))}
        </div>

        <FinalCTA
          heading="Can't find your issue?"
          body="Our AI can diagnose almost any tech problem — describe what's happening and get a step-by-step fix specific to your setup."
          chatLink="/chat"
        />
      </div>
    </div>
  );
}
