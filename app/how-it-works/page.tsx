'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, Zap, CheckCircle, Image, Users, 
  Lightbulb, ArrowRight, FileSpreadsheet, Mail, Presentation, Bot,
  Wifi, Monitor, Home
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            The Chat is the Core
          </div>
          <h1 className="text-5xl font-semibold tracking-tight mb-4">How to Use MyTech-Fix</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our chat interface is designed to feel like texting a very knowledgeable IT friend. 
            We provide tech troubleshooting, productivity help, and general guidance for cybersecurity events (with strong disclaimers to always consult professionals for real incidents).
          </p>
        </div>

        {/* The Chat Experience - Polished & Realigned for even flow */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold tracking-tight mb-3">The Chat Experience</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A natural, visual, and context-aware way to get tech help.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
                    Type normally. You don’t need perfect technical terms. The more context you give, the better the answer.
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
                    Upload or paste screenshots, error messages, or photos of your setup. Our AI can see and understand visual context.
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
                  <h3 className="text-xl font-semibold mb-3">AI-Generated Visual Aids</h3>
                  <p className="text-muted-foreground flex-1">
                    When it helps, MyTech-Fix can automatically (or on request) generate clear diagrams, wiring layouts, button locations, cable setups, or step illustrations.
                  </p>
                  <p className="text-xs text-muted-foreground mt-auto pt-3 border-t border-white/10">
                    Example: “Generate a diagram showing how to connect the router LAN ports correctly.”
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} className="h-full">
              <Card className="card-premium border-white/10 h-full flex flex-col">
                <CardContent className="p-8 flex flex-col flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Remembers Context</h3>
                  <p className="text-muted-foreground flex-1">
                    You can follow up with questions like “What if that doesn’t work?” or “I’m on a Mac, not Windows.” It keeps the conversation going.
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
                <h3 className="text-3xl font-semibold mb-4">Tell us what’s broken</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Be as specific as you can. Instead of “WiFi is bad”, try “My laptop won’t stay connected to the 5GHz network after 10 minutes”.
                </p>
                <p className="text-muted-foreground">
                  <strong>Pro tip:</strong> Paste error messages or describe exactly what you see on screen.
                </p>
              </div>
              <div className="card-premium border-white/10 rounded-3xl p-8">
                <div className="bg-white/5 rounded-2xl p-6 text-sm font-mono text-muted-foreground border border-white/10">
                  “My HP LaserJet Pro won’t print from the front desk computer after the Windows update last night. It says ‘Printer offline’.”
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
                  MyTech-Fix gives you numbered instructions tailored to your exact setup. It explains <em>why</em> each step matters.
                </p>
                <p className="text-muted-foreground">
                  You can reply with “I don’t see that option” or “I’m getting a different error now” and it will adjust.
                </p>
              </div>
              <div className="md:order-1 card-premium border-white/10 rounded-3xl p-8">
                <div className="space-y-4 text-sm">
                  <div className="bg-primary/10 p-4 rounded-2xl border border-primary/10">
                    <strong>Step 1:</strong> Open Settings → Devices → Printers & scanners
                  </div>
                  <div className="bg-primary/10 p-4 rounded-2xl border border-primary/10">
                    <strong>Step 2:</strong> Click “Add a printer or scanner” and wait 30 seconds
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
                <h3 className="text-3xl font-semibold mb-4">Keep going until it’s fixed</h3>
                <p className="text-lg text-muted-foreground">
                  Most issues are solved in 1–3 messages. If a step doesn’t work, just say so. The chat remembers everything you’ve told it.
                </p>
                <p className="text-muted-foreground mt-3">
                  For teams: Select your team and device at the start of the chat so the AI knows your environment.
                </p>
              </div>
              <div className="card-premium border-white/10 rounded-3xl p-8">
                <div className="text-sm text-muted-foreground">
                  <strong>Example follow-up:</strong><br />
                  “That didn’t work — I don’t have admin rights on this computer.”
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Can Help With - Improved Visual Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold mb-3">What We Can Help With</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              MyTech-Fix provides clear, visual, step-by-step guidance for a wide range of everyday tech problems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Wifi, title: "Network & WiFi", items: "WiFi drops, slow internet, router setup, mesh systems, 5GHz vs 2.4GHz issues" },
              { icon: Monitor, title: "Devices & Computers", items: "Windows/Mac issues, slow performance, software problems, updates, crashes" },
              { icon: Home, title: "Smart Home & IoT", items: "Smart lights, cameras, plugs, thermostats, voice assistants, connectivity problems" },
              { icon: Image, title: "Browser Problems", items: "Chrome/Firefox/Edge issues, extensions, cache problems, website loading errors" },
              { icon: Users, title: "Social Media & Apps", items: "Facebook, Instagram, TikTok, login issues, account recovery, app glitches" },
              { icon: FileSpreadsheet, title: "Printers & Peripherals", items: "Printer offline, scanning, ink/toner issues, USB/WiFi printing problems" },
              { icon: Mail, title: "Email & Accounts", items: "Outlook/Gmail setup, login problems, sync issues, spam, account recovery" },
              { icon: Zap, title: "Performance & Slow Tech", items: "Computer running slow, phone lag, storage full, startup issues, battery drain" },
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
              <Button size="lg" variant="outline" className="px-8">
                See the Full List of Issues We Solve <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* How to Use the Chat Effectively */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold mb-3">How to Get Better Answers from the Chat</h2>
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
                    <span className="font-medium text-red-400">Bad:</span> “My internet is slow”
                  </div>
                  <div>
                    <span className="font-medium text-emerald-400">Good:</span> “Download speed on my work laptop dropped from 400Mbps to 12Mbps after the router reboot this morning.”
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
                  Error messages, router admin pages, device settings — a photo is often worth 10 messages. Just drag and drop or paste directly into the chat.
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
                  Don’t start over. Just reply with what happened after each step. The chat remembers your entire conversation and your device context.
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium border-white/10">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-xl">Add Context (Especially for Teams)</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Mention your operating system, whether you’re on the company network, or select a team + device at the top of the chat. This helps the AI give much more relevant advice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Productivity Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <Bot className="w-4 h-4" /> Not Just for Fixing
            </div>
            <h2 className="text-3xl font-semibold mb-3">Use the Chat to Be More Productive</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              MyTech-Fix doesn’t just fix broken things — it helps you work faster inside the apps you already use every day.
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
                <h3 className="font-semibold mb-2">Excel & Google Sheets</h3>
                <p className="text-sm text-muted-foreground">
                  “Create a formula that calculates commission tiers” or “Write a script to clean this data”.
                </p>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
            <Card className="card-premium border-white/10">
              <CardContent className="p-6">
                <Mail className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="font-semibold mb-2">Email & Communication</h3>
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
                <h3 className="font-semibold mb-2">Presentations & Documents</h3>
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
                <h3 className="font-semibold mb-2">Automations & Workflows</h3>
                <p className="text-sm text-muted-foreground">
                  Build simple automations in Notion, Zapier, Make.com, or write Power Automate flows.
                </p>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>

          {/* Featured Example */}
          <div className="card-premium border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
              <h3 className="font-semibold text-lg">Real Example: Creating Excel Functions</h3>
            </div>
            <div className="text-sm text-muted-foreground space-y-3">
              <p><strong>You ask:</strong></p>
              <div className="bg-white/5 p-4 rounded-xl font-mono text-xs border border-white/10">
                “I have a list of sales reps in column A and their monthly sales in column B. 
                Create a formula that gives them 5% commission on sales over $10,000 and 8% on anything above that.”
              </div>

              <p className="pt-2"><strong>MyTech-Fix replies with:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>A ready-to-paste formula using <code>IF</code> and <code>AND</code></li>
                <li>An explanation of how the formula works</li>
                <li>A version that handles edge cases (negative numbers, blank cells)</li>
                <li>Instructions on how to turn it into a reusable function or named formula</li>
              </ul>
              <p className="text-emerald-400 text-xs pt-2">Business users can save these formulas in team prompt packs so everyone uses the same logic.</p>
            </div>
          </div>
        </div>

        {/* Business Users Callout */}
        <div className="card-premium border-primary/20 rounded-3xl p-10 mb-20">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Users className="w-7 h-7 text-primary" /> 
            Tips for Small Business & Team Users
          </h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 text-sm">
            <div className="flex gap-3">
              <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Select your team at the top of the chat so your fixes are saved to the shared history.</span>
            </div>
            <div className="flex gap-3">
              <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Tag devices when starting a chat so future team members can see what was tried.</span>
            </div>
            <div className="flex gap-3">
              <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Check the Team Reports page regularly to spot recurring issues before they become big problems.</span>
            </div>
            <div className="flex gap-3">
              <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Use Business Prompt Packs in the sidebar for industry-specific issues (POS systems, VoIP, security cameras, etc.).</span>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="text-4xl font-semibold mb-4">Ready to try it?</h2>
          <p className="text-xl text-muted-foreground mb-8">The best way to understand how it works is to start a conversation.</p>
          
          <Link href="/chat">
            <Button size="lg" className="btn-premium bg-primary hover:bg-primary/90 text-lg px-12 py-7">
              Open the Chat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
