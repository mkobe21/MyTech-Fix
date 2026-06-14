'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Wifi, Monitor, Smartphone, Home, Users, BarChart3, 
  Database, Clock, Zap 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { staggerContainer, staggerContainerSlow, fadeInUp, cardInteractive } from '@/lib/animations';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Premium Hero Section - Updated Benefit-Focused */}
      <section className="pt-20 pb-24 px-6 relative overflow-hidden">
        {/* Subtle background gradient for premium depth */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f2937_0.5px,transparent_1px)] bg-[length:3px_3px] opacity-40" />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={staggerContainerSlow}
        >
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter mb-6 text-white">
            Tech Problems Solved — Simply &amp; Visually
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Describe the issue or send a screenshot. Get clear step-by-step fixes with pictures. 
            Perfect for home users, families, and small businesses.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link href="/chat">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-12 py-7 shadow-lg shadow-blue-950/50 w-full sm:w-auto">
                Start Troubleshooting Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-white/20 hover:bg-white/5 w-full sm:w-auto">
                See Pricing &amp; Plans
              </Button>
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>No tech jargon</span>
            <span className="hidden sm:inline">•</span>
            <span>Works on phone, tablet &amp; computer</span>
            <span className="hidden sm:inline">•</span>
            <span>Remembers your devices</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Audience Segmentation - Clear split */}
      <section className="py-16 bg-background border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-3">MyTech-Fix works differently depending on who you are</h2>
            <p className="text-xl text-muted-foreground">Choose the experience that matches your needs</p>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Home Users Card */}
            <motion.div variants={fadeInUp} {...cardInteractive} className="border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-colors bg-card/60 backdrop-blur">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-xl">Home Users & Families</div>
                  <div className="text-sm text-muted-foreground">Perfect for individuals and households</div>
                </div>
              </div>
              <ul className="space-y-3 text-muted-foreground mb-8">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Instant help for WiFi, computers, printers, and smart home devices</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Clear, step-by-step instructions with screenshot support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Save time and avoid expensive tech support calls</span>
                </li>
              </ul>
              <Link href="/chat">
                <Button className="w-full" variant="outline">Start Free Trial (5 chats)</Button>
              </Link>
            </motion.div>

            {/* Small Business Card - Highlighted */}
            <motion.div variants={fadeInUp} className="border-2 border-primary rounded-3xl p-8 bg-card/60 backdrop-blur relative">
              <div className="absolute -top-3 right-6 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                BUILT FOR TEAMS
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-xl">Small Businesses & Teams</div>
                  <div className="text-sm text-blue-600 font-medium">Built for collaboration and scale</div>
                </div>
              </div>

              <ul className="space-y-3 text-muted-foreground mb-8">
                <li className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Team Reports</strong> — See usage, common issues, and time saved across your team</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Shared History</strong> — Everyone benefits from fixes that worked before</span>
                </li>
                <li className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Device Inventory</strong> — Track printers, routers, cameras, and more across locations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Productivity in Your Tools</strong> — Use the chat to create Excel formulas, automate emails, build presentations, and more</span>
                </li>
              </ul>
              <Link href="/pricing">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Explore Business Plans</Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* See it in Action - Chat Demo */}
      <section className="py-16 bg-background border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold tracking-tight mb-3">
              See how it works in a real conversation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch MyTech-Fix guide a user through a common WiFi issue step by step.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-white/10 bg-card shadow-2xl overflow-hidden ring-1 ring-white/5">
              {/* Browser chrome */}
              <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-block bg-white/10 text-xs text-muted-foreground px-4 py-1 rounded-md border border-white/10">
                    mytech-fix.com/chat
                  </div>
                </div>
              </div>

              {/* The actual chat screenshot */}
              <img 
                src="/images/troubleshooting-chat-demo.jpg" 
                alt="MyTech-Fix troubleshooting conversation example showing a user fixing WiFi issues with step-by-step AI guidance" 
                className="w-full h-auto"
              />
            </div>
          </div>

          <p className="text-center text-sm text-zinc-500 mt-4">
            Real conversations look like this — clear steps, screenshot support, and follow-up help.
          </p>
        </div>
      </section>

      {/* For Home Users Section */}
      <section className="py-20 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                For Individuals & Families
              </div>
              <h2 className="text-4xl font-semibold tracking-tight mb-6">
                Personal tech help that actually makes sense
              </h2>
              <p className="text-xl text-zinc-600 mb-8">
                Stop watching confusing tutorials or waiting on hold. Get clear, actionable steps the moment something breaks.
              </p>

              <div className="space-y-4">
                {[
                  "Works great on your phone while you're dealing with the issue",
                  "Supports photos and screenshots for better answers",
                  "Get help not just fixing problems, but using tools like Excel and email more effectively",
                  "No subscription required — pay only when you need help",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    </div>
                    <span className="text-zinc-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/chat">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Try It Free — 5 Chats
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-card/60 border border-white/10 rounded-3xl p-8 backdrop-blur">
              <h3 className="font-semibold text-xl mb-6">Common problems we solve for homes:</h3>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {[
                  "WiFi keeps dropping",
                  "Printer won't connect",
                  "Smart lights not responding",
                  "Computer running slow",
                  "Can't connect to VPN",
                  "Router setup issues",
                  "Security camera offline",
                  "Phone won't join WiFi",
                ].map((issue, i) => (
                  <motion.div key={i} variants={fadeInUp} className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    {issue}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* For Small Businesses Section — Strong emphasis on key features */}
      <section className="py-20 bg-background border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm font-medium mb-4 text-muted-foreground">
              For Small Businesses & Teams
            </div>
            <h2 className="text-4xl font-semibold tracking-tight mb-4 text-white">
              Turn tech issues into team productivity gains
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop losing hours to the same problems. Give your team instant answers <strong className="text-foreground">and</strong> use AI inside the tools they already use every day — Excel, email, presentations, and more.
            </p>
          </div>

          {/* Highlighted Business Features - Reports, Shared History, Device Inventory */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-2 border-blue-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Team Reports</h3>
                <p className="text-zinc-600 mb-4">
                  See exactly which issues are costing your team the most time. Understand patterns across your office or locations.
                </p>
                <p className="text-sm text-blue-600 font-medium">→ View usage by member, common problems, and estimated hours saved</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Shared History</h3>
                <p className="text-zinc-600 mb-4">
                  Every successful fix is saved and searchable by the whole team. New employees get up to speed instantly.
                </p>
                <p className="text-sm text-blue-600 font-medium">→ No more “How did we fix the printer last time?”</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Device Inventory</h3>
                <p className="text-zinc-600 mb-4">
                  Keep track of every printer, router, camera, and computer across your locations with notes and history.
                </p>
                <p className="text-sm text-blue-600 font-medium">→ Know what you have and when it last caused problems</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 mb-10">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-lg text-blue-900">Productivity That Scales With Your Team</h3>
            </div>
            <p className="text-center text-blue-800 max-w-3xl mx-auto text-sm">
              Beyond fixing issues, your team can use the chat to create Excel formulas, automate repetitive tasks, draft professional emails, and build presentations — all while saving the best prompts for everyone to reuse.
            </p>
          </div>

          <div className="text-center">
            <Link href="/pricing">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                See Small Business Plans
              </Button>
            </Link>
            <p className="text-sm text-zinc-500 mt-3">Plans start at $29.99/mo for up to 5 team members</p>
          </div>
        </div>
      </section>

      {/* How It Works - Shared experience */}
      <section className="py-20 bg-zinc-950/30">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-12 text-white">How MyTech-Fix works for everyone</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Describe the problem", desc: "Type it out or upload a photo or screenshot of the issue" },
              { step: "2", title: "Get clear steps", desc: "Receive tailored, step-by-step instructions from our specialized AI" },
              { step: "3", title: "Solve it fast", desc: "Follow the guidance and get back to work — or relaxing at home" },
            ].map((item, i) => (
              <div key={i} className="text-left">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-semibold mb-6">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-semibold mb-6">Ready to stop wasting time on tech problems?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Whether you're fixing things at home, keeping your team productive, or needing general guidance on cybersecurity events, MyTech-Fix meets you where you are.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/chat">
              <Button size="lg" variant="secondary" className="bg-white text-black hover:bg-white/90 text-lg px-10 py-7">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-white text-white hover:bg-white/10">
                Compare All Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
