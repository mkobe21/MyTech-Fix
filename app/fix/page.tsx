import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import CategoryCard from '@/components/seo/CategoryCard';
import GuidesSearch from '@/components/seo/GuidesSearch';
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
    guideCount: 8,
    href: '/fix/wifi',
    enabled: true,
  },
  {
    icon: Printer,
    name: 'Printers',
    description: 'Offline printers, driver issues, scan & print setup, and wireless pairing.',
    guideCount: 8,
    href: '/fix/printers',
    enabled: true,
  },
  {
    icon: Home,
    name: 'Smart Home',
    description: 'Smart lights, cameras, plugs, hubs, and voice assistant setup.',
    guideCount: 13,
    href: '/fix/smart-home',
    enabled: true,
  },
  {
    icon: Monitor,
    name: 'Computers',
    description: 'Windows & Mac issues, slow performance, crashes, and driver problems.',
    guideCount: 4,
    href: '/fix/computers',
    enabled: true,
  },
  {
    icon: Camera,
    name: 'Security Cameras',
    description: 'Setup, cloud storage, connectivity, and motion detection issues.',
    guideCount: 4,
    href: '/fix/security-cameras',
    enabled: true,
  },
  {
    icon: Smartphone,
    name: 'Phone & Tablet',
    description: 'WiFi, Bluetooth, battery, and storage issues on iPhone and Android.',
    guideCount: 4,
    href: '/fix/phone-tablet',
    enabled: true,
  },
  {
    icon: Shield,
    name: 'Security & Privacy',
    description: 'Account protection, suspicious logins, 2FA setup, and home network security.',
    guideCount: 5,
    href: '/fix/security-privacy',
    enabled: true,
  },
  {
    icon: Globe,
    name: 'VPN & Remote Work',
    description: 'VPN connection failures, slow speeds, disconnects, and kill switch issues.',
    guideCount: 4,
    href: '/fix/vpn-remote-work',
    enabled: true,
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

        <GuidesSearch />

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
