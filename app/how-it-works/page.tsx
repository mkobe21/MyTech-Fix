'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  MessageSquare, Zap, Image, Users,
  Lightbulb, ArrowRight, FileSpreadsheet, Mail, Presentation, Bot,
  Wifi, Monitor, Home, Sparkles, Brain, Smartphone, Mic, Activity,
  ChevronDown, CheckCircle2, Globe, Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 hover:text-primary transition-colors"
      >
        <span className="font-medium">{question}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="text-sm text-muted-foreground pb-5 pr-8 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Fix it in minutes, not hours
          </div>
          <h1 className="text-5xl font-semibold tracking-tight mb-4">How to Use MyTech-Fix</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Describe your problem, upload a screenshot, or speak out loud — and get clear, step-by-step fixes with pictures. No IT degree, no Googling, no hold music.
          </p>
        </div>

        {/* Chat Experience */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold tracking-tight mb-3">The Chat Experience</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A natural, visual, and context-aware way to get tech help.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="h-full">
              <Card className="card-premium border-white/10 h-full flex flex-col">
                <CardContent className="p-8 flex flex-col flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Natural Conversation</h3>
                  <p className="text-muted-foreground flex-1">
                    Type normally. You don't need perfect technical terms. The more context you give, the better the answer.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} className="h-full">
              <Card className="card-premium border-white/10 h-full flex flex-col">
                <CardContent className="p-8 flex flex-col flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Image className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Screenshot &amp; Photo Support</h3>
                  <p className="text-muted-foreground flex-1">
                    Upload or paste screenshots, error messages, or photos of your setup. The AI can see and understand visual context.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} className="h-full">
              <Card className="card-premium border-white/10 h-full flex flex-col">
                <CardContent className="p-8 flex flex-col flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Mic className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Speak Your Problem</h3>
                  <p className="text-muted-foreground flex-1">
                    Tap the mic and describe the issue out loud. Great for non-technical users, seniors, or anyone who finds typing frustrating.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} className="h-full">
              <Card className="card-premium border-white/10 h-full flex flex-col">
                <CardContent className="p-8 flex flex-col flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI-Generated Visual Aids</h3>
                  <p className="text-muted-foreground flex-1">
                    Request clear diagrams, wiring layouts, button locations, or step illustrations any time with the "Generate visual aid" button.
                  </p>
                  <p className="text-xs text-muted-foreground mt-auto pt-3 border-t border-white/10">
                    Example: "Generate a diagram showing how to connect the router LAN ports correctly."
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} className="h-full">
              <Card className="card-premium border-white/10 h-full flex flex-col">
                <CardContent className="p-8 flex flex-col flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Remembers Context</h3>
                  <p className="text-muted-foreground flex-1">
                    Follow up naturally — "What if that doesn't work?" or "I'm on a Mac, not Windows." The full conversation stays in memory the whole time.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Core Steps */}
        <div className="mb-20">
          <h2 className="text-3xl font-semibold text-center mb-12">The 3 Steps to Fixing Any Issue</h2>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                  Step 1
                </div>
                <h3 className="text-3xl font-semibold mb-4">Tell us what's broken</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Be as specific as you can. Instead of "WiFi is bad," try "My laptop won't stay connected to the 5GHz network after 10 minutes."
                </p>
                <p className="text-muted-foreground">
                  <strong>Pro tip:</strong> Paste error messages or describe exactly what you see on screen.
                </p>
              </div>
              <div className="card-premium border-white/10 rounded-3xl p-8">
                <div className="bg-white/5 rounded-2xl p-6 text-sm font-mono text-muted-foreground border border-white/10">
                  "My HP LaserJet Pro won't print from the front desk computer after the Windows update last night. It says 'Printer offline'."
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                  Step 2
                </div>
                <h3 className="text-3xl font-semibold mb-4">Get clear, actionable steps</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  MyTech-Fix gives you numbered instructions tailored to your exact setup. It explains <em>why</em> each step matters, not just what to click.
                </p>
                <p className="text-muted-foreground">
                  Reply with "I don't see that option" or "I'm getting a different error now" and it will adjust in real time.
                </p>
              </div>
              <div className="md:order-1 card-premium border-white/10 rounded-3xl p-8">
                <div className="space-y-4 text-sm">
                  <div className="bg-primary/10 p-4 rounded-2xl border border-primary/10">
                    <strong>Step 1:</strong> Open Settings → Devices → Printers &amp; scanners
                  </div>
                  <div className="bg-primary/10 p-4 rounded-2xl border border-primary/10">
                    <strong>Step 2:</strong> Click "Add a printer or scanner" and wait 30 seconds
                  </div>
                  <div className="bg-primary/10 p-4 rounded-2xl border border-primary/10">
                    <strong>Step 3:</strong> Right-click the printer → Set as default → Print a test page
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                  Step 3
                </div>
                <h3 className="text-3xl font-semibold mb-4">Keep going until it's fixed</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Most issues are solved in 1–3 messages. If a step doesn't work, just say so — the chat adapts and tries a different approach.
                </p>
                <p className="text-muted-foreground">
                  When it's resolved, hit <strong>Mark Resolved</strong> to close out the session. Your full history is saved so teammates can see what was tried.
                </p>
              </div>
              <div className="card-premium border-white/10 rounded-3xl p-6 space-y-3 text-sm">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-muted-foreground font-mono">
                  "That didn't work — I don't have admin rights on this computer."
                </div>
                <div className="flex justify-center text-muted-foreground text-xs">↓ MyTech-Fix adapts</div>
                <div className="bg-primary/10 rounded-xl p-4 border border-primary/10">
                  <strong>No problem.</strong> Here's an alternative that works without admin access: open Command Prompt as a standard user and run <code className="text-xs bg-white/10 px-1 rounded">printui /s /t2</code> to access the print server properties directly.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Network Diagnostics */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <Activity className="w-4 h-4" /> Built-in Network Diagnostics
            </div>
            <h2 className="text-3xl font-semibold mb-3">Know Your Network Before You Even Ask</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Run a full network health check from the dashboard. The results are fed directly into your chat session so the AI already knows your network's condition when you start troubleshooting.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Zap,      color: 'text-yellow-400 bg-yellow-400/10', title: 'Speed Test',        desc: 'Real download & upload speeds via Cloudflare infrastructure — not a simulated result.' },
              { icon: Wifi,     color: 'text-cyan-400 bg-cyan-400/10',     title: 'WiFi Quality',      desc: 'Signal strength, channel interference, and 2.4GHz vs 5GHz band analysis.' },
              { icon: Activity, color: 'text-emerald-400 bg-emerald-400/10',title: 'Latency & Ping',   desc: 'Packet loss percentage and round-trip latency to identify unstable connections.' },
              { icon: Globe,    color: 'text-blue-400 bg-blue-400/10',     title: 'DNS Health',        desc: 'Response time and resolution quality for your current DNS provider.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="card-premium border-white/10 rounded-2xl p-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color.split(' ')[1]}`}>
                  <Icon className={`w-5 h-5 ${color.split(' ')[0]}`} />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="card-premium border-cyan-500/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 text-sm text-muted-foreground">
              After running a diagnostic, click <strong className="text-foreground">"Discuss with MyTech-Fix"</strong> to open a chat session pre-loaded with your results. The AI skips the guesswork and jumps straight to solutions based on your actual network data.
            </div>
            <Link href="/dashboard" className="flex-shrink-0">
              <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 whitespace-nowrap">
                Run a Diagnostic <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* What We Can Help With */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold mb-3">What We Can Help With</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Clear, visual, step-by-step guidance for a wide range of everyday tech problems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Wifi,          title: 'Network & WiFi',         items: 'WiFi drops, slow internet, router setup, mesh systems, 5GHz vs 2.4GHz issues' },
              { icon: Monitor,       title: 'Devices & Computers',    items: 'Windows/Mac issues, slow performance, software problems, updates, crashes' },
              { icon: Home,          title: 'Smart Home & IoT',       items: 'Smart lights, cameras, plugs, thermostats, voice assistants, connectivity problems' },
              { icon: Globe,         title: 'Browser Problems',       items: 'Chrome/Firefox/Edge issues, extensions, cache problems, website loading errors' },
              { icon: Smartphone,    title: 'Social Media & Apps',    items: 'Facebook, Instagram, TikTok, login issues, account recovery, app glitches' },
              { icon: FileSpreadsheet,title: 'Printers & Peripherals', items: 'Printer offline, scanning, ink/toner issues, USB/WiFi printing problems' },
              { icon: Mail,          title: 'Email & Accounts',       items: 'Outlook/Gmail setup, login problems, sync issues, spam, account recovery' },
              { icon: Zap,           title: 'Performance & Slow Tech', items: 'Computer running slow, phone lag, storage full, startup issues, battery drain' },
            ].map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="card-premium border-white/10 p-6 rounded-2xl hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{category.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{category.items}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/what-we-fix">
              <Button size="lg" variant="outline" className="px-8 border-white/10">
                See the Full List of Issues We Solve <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* How to Get Better Answers */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold mb-3">How to Get Better Answers</h2>
            <p className="text-xl text-muted-foreground">These simple habits dramatically improve the quality of help you receive.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-premium border-white/10">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-xl">Be Specific</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-medium text-red-400">Instead of:</span>
                    <span className="text-muted-foreground ml-2">"My internet is slow"</span>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-400">Try:</span>
                    <span className="text-muted-foreground ml-2">"Download speed dropped from 400Mbps to 12Mbps after the router reboot this morning."</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium border-white/10">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Image className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-xl">Use Screenshots</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Error messages, router admin pages, device settings — a screenshot is worth 10 messages. Drag and drop or paste directly into the chat (Ctrl+V / Cmd+V).
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium border-white/10">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-xl">Follow Up</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Don't start over. Just reply with what happened after each step. The chat remembers your entire conversation and device context throughout.
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium border-white/10">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-xl">Add Context</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Mention your operating system, whether you're on the company network, or select a team and device at the top of the chat. This helps the AI give much more relevant advice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Productivity Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <Bot className="w-4 h-4" /> Bonus: Work Smarter Too
            </div>
            <h2 className="text-3xl font-semibold mb-3">Not Just for Fixing Tech</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              MyTech-Fix helps you work faster inside the apps you already use every day.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="card-premium border-white/10">
                <CardContent className="p-6">
                  <FileSpreadsheet className="w-8 h-8 text-emerald-400 mb-4" />
                  <h3 className="font-semibold mb-2">Excel &amp; Google Sheets</h3>
                  <p className="text-sm text-muted-foreground">
                    "Create a formula that calculates commission tiers" or "Write a script to clean this data."
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="card-premium border-white/10">
                <CardContent className="p-6">
                  <Mail className="w-8 h-8 text-emerald-400 mb-4" />
                  <h3 className="font-semibold mb-2">Email &amp; Communication</h3>
                  <p className="text-sm text-muted-foreground">
                    Draft professional emails, create follow-up sequences, or write polite responses to difficult clients.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="card-premium border-white/10">
                <CardContent className="p-6">
                  <Presentation className="w-8 h-8 text-emerald-400 mb-4" />
                  <h3 className="font-semibold mb-2">Presentations &amp; Docs</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate slide outlines, speaker notes, or format long documents consistently.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="card-premium border-white/10">
                <CardContent className="p-6">
                  <Zap className="w-8 h-8 text-emerald-400 mb-4" />
                  <h3 className="font-semibold mb-2">Automations &amp; Workflows</h3>
                  <p className="text-sm text-muted-foreground">
                    Build simple automations in Notion, Zapier, Make.com, or write Power Automate flows.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="card-premium border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
              <h3 className="font-semibold text-lg">Real Example: Excel Commission Formula</h3>
            </div>
            <div className="text-sm text-muted-foreground space-y-3">
              <p><strong>You ask:</strong></p>
              <div className="bg-white/5 p-4 rounded-xl font-mono text-xs border border-white/10">
                "I have sales reps in column A and their monthly sales in column B. Give them 5% commission on sales up to $10,000 and 8% on anything above that."
              </div>
              <p className="pt-2"><strong>MyTech-Fix replies with:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>A ready-to-paste formula using <code>IF</code> and <code>AND</code></li>
                <li>An explanation of how the formula works</li>
                <li>A version that handles edge cases (negative numbers, blank cells)</li>
                <li>Instructions on turning it into a reusable named formula</li>
              </ul>
              <p className="text-emerald-400 text-xs pt-2">Business users can save these as team prompt packs so everyone uses the same logic.</p>
            </div>
          </div>
        </div>

        {/* Business Tips */}
        <div className="card-premium border-primary/20 rounded-3xl p-10 mb-20">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Users className="w-7 h-7 text-primary" />
            Tips for Small Business &amp; Team Users
          </h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-5 text-sm">
            {[
              'Select your team at the top of the chat so your fixes are saved to the shared history.',
              'Tag a device when starting a chat so future team members can see exactly what was tried.',
              'Check the Team Reports page regularly to spot recurring issues before they become bigger problems.',
              'Use Business Prompt Packs in the sidebar for industry-specific issues like POS systems, VoIP, or security cameras.',
              'Click "Mark Resolved" when an issue is fixed — your team can track fix rates over time.',
              'Run a diagnostic before calling your ISP — arrive at the call with real speed and latency data.',
            ].map((tip, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold mb-3">What Users Are Saying</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Fixed my router issue in under 5 minutes. It knew the exact settings for my ISP without me having to look anything up.",
                name: "Sarah T.",
                role: "Home User",
              },
              {
                quote: "Our team uses it daily. It's saved us from calling IT support at least twice a week and the shared history is a game changer.",
                name: "Mark D.",
                role: "Small Business Owner",
              },
              {
                quote: "I took a screenshot of the error and it walked me through exactly what to do. No confusing tech jargon at all.",
                name: "Linda M.",
                role: "Retired Teacher",
              },
            ].map(({ quote, name, role }) => (
              <div key={name} className="card-premium border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
                <div>
                  <div className="font-semibold text-sm">{name}</div>
                  <div className="text-xs text-muted-foreground">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="card-premium border-white/10 rounded-3xl px-8 py-4 max-w-3xl mx-auto">
            {[
              {
                question: "Does it work on Mac, iPhone, and Android?",
                answer: "Yes. MyTech-Fix works in any modern browser on any device — Mac, Windows, iPhone, iPad, Android, and Chromebook. The chat, diagnostics, and visual aids are all fully accessible from your phone.",
              },
              {
                question: "What if it can't solve my problem?",
                answer: "If the AI reaches the limit of what it can diagnose remotely, it will tell you clearly and recommend what type of professional to contact. It won't loop you in circles — it knows when to say 'you need an on-site technician for this one.'",
              },
              {
                question: "Is my conversation data private?",
                answer: "Yes. Your chat sessions are private to your account (and your team, if you're on a business plan). We do not use your conversation content to train AI models. You can download or delete all your data at any time from Account Settings.",
              },
              {
                question: "Do I need to know tech terms to use it?",
                answer: "Not at all. Just describe what's happening in plain language. 'My computer is making a loud noise and getting really hot' works just as well as a technical description. The AI will ask follow-up questions if it needs more detail.",
              },
              {
                question: "How is this different from just Googling it?",
                answer: "Google gives you a list of pages that might contain an answer. MyTech-Fix gives you a single, conversational response tailored to your exact setup, device, and what you've already tried. You can ask follow-ups, share screenshots, and get adapted guidance — no tab-switching required.",
              },
              {
                question: "Can my team share troubleshooting history?",
                answer: "Yes, on Small Business and Business Plus plans. Every chat session tagged to your team is visible in shared history. Teammates can see what steps were already tried on a device, avoiding duplicate effort. You can also tag devices so the AI knows the hardware context up front.",
              },
            ].map((item) => (
              <FAQItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="text-4xl font-semibold mb-4">Ready to try it?</h2>
          <p className="text-xl text-muted-foreground mb-8">The best way to understand how it works is to start a conversation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" className="btn-premium bg-primary hover:bg-primary/90 text-lg px-12 py-7">
                Open the Chat
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-lg px-10 py-7">
                See Pricing <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
