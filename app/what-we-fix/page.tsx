'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Wifi, Monitor, Smartphone, Home, Users, 
  Image as ImageIcon, Printer, Mail, Zap, ArrowRight 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

const categories = [
  {
    icon: Wifi,
    title: "Network & WiFi Problems",
    description: "Issues with internet connectivity, routers, and wireless networks.",
    issues: [
      "WiFi keeps dropping or disconnecting",
      "Slow internet speeds (download/upload)",
      "Can't connect to 5GHz or 2.4GHz network",
      "Router setup and configuration",
      "Mesh WiFi system problems",
      "VPN connection issues",
      "Guest network not working",
      "IP address conflicts"
    ]
  },
  {
    icon: Monitor,
    title: "Computer & Device Issues",
    description: "Problems with Windows, Mac, laptops, desktops, and mobile devices.",
    issues: [
      "Computer running very slow",
      "Windows won't boot or blue screen errors",
      "Mac startup or performance problems",
      "App crashes or won't open",
      "Driver installation issues",
      "Hardware not detected (USB, webcam, etc.)",
      "Overheating or fan problems",
      "Battery draining too fast on laptops"
    ]
  },
  {
    icon: ImageIcon,
    title: "Browser Problems",
    description: "Troubleshooting Chrome, Firefox, Edge, Safari, and website issues.",
    issues: [
      "Pages not loading or showing errors",
      "Browser keeps crashing",
      "Extensions causing problems",
      "Can't log into websites",
      "Cache and cookie issues",
      "Pop-ups and unwanted ads",
      "Download problems",
      "Video or audio not playing in browser"
    ]
  },
  {
    icon: Home,
    title: "Smart Home & IoT Devices",
    description: "Help with smart lights, cameras, plugs, thermostats, and more.",
    issues: [
      "Smart lights not responding or offline",
      "Security cameras not connecting",
      "Smart plugs or switches not working",
      "Voice assistant (Alexa/Google) issues",
      "Thermostat connectivity problems",
      "Smart door locks and entry systems",
      "Devices dropping off the network",
      "Setup of new smart home devices"
    ]
  },
  {
    icon: Printer,
    title: "Printer & Peripheral Issues",
    description: "Printers, scanners, and other connected hardware.",
    issues: [
      "Printer shows as offline",
      "Can't print from specific devices",
      "Scanner not working",
      "Low ink/toner warnings",
      "Wireless printing setup",
      "USB printer connection problems",
      "Print jobs stuck in queue",
      "All-in-one device issues"
    ]
  },
  {
    icon: Users,
    title: "Social Media & Apps",
    description: "Facebook, Instagram, TikTok, and other popular apps.",
    issues: [
      "Can't log into Facebook or Instagram",
      "Account hacked or compromised",
      "Posts not uploading or appearing",
      "App crashing or freezing",
      "Notifications not working",
      "Two-factor authentication problems",
      "Content not loading properly",
      "Privacy and visibility settings"
    ]
  },
  {
    icon: Mail,
    title: "Email & Account Problems",
    description: "Gmail, Outlook, Microsoft 365, and account access issues.",
    issues: [
      "Can't send or receive emails",
      "Email sync problems on phone/computer",
      "Login or password reset issues",
      "Spam going to inbox or vice versa",
      "Account recovery when locked out",
      "Microsoft 365 / Google Workspace problems",
      "Calendar and contacts not syncing",
      "Two-factor authentication setup"
    ]
  },
  {
    icon: Zap,
    title: "Performance & Slow Tech",
    description: "General slowness, storage, startup, and optimization issues.",
    issues: [
      "Device feels sluggish overall",
      "Too many startup programs",
      "Low storage space warnings",
      "Apps taking forever to open",
      "Frequent freezing or crashing",
      "Phone or tablet running hot",
      "Outdated software causing issues",
      "Background processes using too much CPU"
    ]
  }
];

export default function WhatWeFixPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            We&apos;ve Got You Covered
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            What Can MyTech-Fix Help You Fix?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Not sure if we can help? Just start chatting — we&apos;ll tell you right away.
          </p>
        </div>

        {/* Intro CTA */}
        <div className="text-center mb-16">
          <Link href="/chat">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-12 py-7">
              Start Fixing Now — It&apos;s Free to Try
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-3">
            No credit card required • Works great on mobile
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="scroll-mt-20">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight mb-2">{category.title}</h2>
                    <p className="text-lg text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 pl-2 md:pl-20 text-[15px]">
                  {category.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-3 py-1.5 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70 mt-2.5 flex-shrink-0" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center border-t border-white/10 pt-14">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Ready to solve your tech problem?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
            Describe what&apos;s happening or send a screenshot. We&apos;ll guide you through it step by step.
          </p>
          <Link href="/chat">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-12 py-7">
              Start Troubleshooting Free
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Works on phone, tablet, and computer • Clear visual instructions included
          </p>
        </div>
      </div>
    </div>
  );
}
