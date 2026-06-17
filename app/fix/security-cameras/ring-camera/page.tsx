import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { ArrowRight, Clock, Camera } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytech-fix.com';

export const metadata: Metadata = {
  title: 'Ring Camera Troubleshooting Guides | MyTech-Fix',
  description:
    'Step-by-step fixes for the most common Ring security camera problems: offline errors, no video feed, motion alerts not working, and night vision issues.',
  alternates: {
    canonical: `${BASE}/fix/security-cameras/ring-camera`,
  },
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Guides', href: '/fix' },
  { label: 'Security Cameras', href: '/fix/security-cameras' },
  { label: 'Ring Camera' },
];

const RING_CAMERA_GUIDES = [
  {
    slug: 'offline',
    title: 'Ring Camera Showing Offline? How to Get It Back Online',
    description:
      "Weak WiFi signal at the camera's location is the most common cause. Check Signal Strength in Device Health — anything below 'Good' needs attention.",
    readTime: '5 min read',
  },
  {
    slug: 'no-video-feed',
    title: 'Ring Camera Shows No Video Feed? Here\'s How to Fix It',
    description:
      "Live view timing out is almost always a WiFi signal issue. A dirty lens or outdated app are the next most likely causes.",
    readTime: '5 min read',
  },
  {
    slug: 'motion-alerts-not-working',
    title: 'Ring Camera Motion Alerts Not Working? Try This',
    description:
      "The Motion Alerts toggle, your phone's notification settings, or Ring Modes are the usual suspects — one of these is almost always the cause.",
    readTime: '5 min read',
  },
  {
    slug: 'night-vision-not-working',
    title: "Ring Camera Night Vision Not Working? Here's the Fix",
    description:
      "Night Vision is probably set to Off or On Demand rather than Automatic. A nearby light source or dirty IR LEDs are the next most common causes.",
    readTime: '4 min read',
  },
];

export default function RingCameraHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Breadcrumb items={BREADCRUMBS} />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Camera className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">Ring Camera</span>
          </div>
          <h1 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3 leading-tight">
            Ring Camera Troubleshooting Guides
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Common issues with Ring security cameras — and how to fix them. Each guide covers
            the likeliest causes, walks you through the fix, and links to our AI if you need
            more help.
          </p>
        </header>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sora text-lg font-semibold text-slate-200">
              All guides — {RING_CAMERA_GUIDES.length} fixes
            </h2>
          </div>
          <div className="space-y-3">
            {RING_CAMERA_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/fix/security-cameras/ring-camera/${guide.slug}`}
                className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-card/60 px-5 py-4 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-sora font-semibold text-slate-100 group-hover:text-blue-300 transition-colors mb-1 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span className="text-xs text-slate-500">{guide.readTime}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Ring Products
          </p>
          <Link
            href="/fix/smart-home/ring-doorbell"
            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-blue-500/20 hover:bg-blue-500/5 px-4 py-3 transition-all group"
          >
            <span className="text-sm text-slate-300 group-hover:text-blue-300 transition-colors">
              Looking for Ring Doorbell help instead? →
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 flex-shrink-0" />
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-6 text-center">
          <h2 className="font-sora text-xl font-bold text-slate-100 mb-2">
            Still having trouble with your Ring Camera?
          </h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Describe your issue to our AI — it can walk you through a fix specific to your
            camera model, network setup, and home configuration.
          </p>
          <Link
            href="/chat?device=ring-camera"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 transition-colors text-sm"
          >
            Ask MyTech-Fix AI
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/fix/security-cameras"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Security Camera guides
          </Link>
        </div>
      </div>
    </div>
  );
}
