'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

export default function AudienceSection() {
  return (
    <section className="py-20 bg-[#0A0F1E]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3">
            Built for home and business
          </h2>
          <p className="text-slate-400 text-lg">Choose the experience that matches your needs</p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {/* Home */}
          <motion.div
            variants={fadeInUp}
            className="rounded-3xl border border-white/[0.07] bg-gray-900 p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-xl">🏠</div>
              <div>
                <div className="font-sora font-semibold text-lg text-slate-50">Home & Family</div>
                <div className="inline-block text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5 mt-0.5">
                  Personal
                </div>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-400 mb-8 flex-1">
              {[
                'Instant help for WiFi, computers, and smart devices',
                'Screenshot & photo upload for faster answers',
                'Works great on your phone while dealing with the issue',
                'Pay only when you need help — no subscription required',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/[0.12] text-slate-200 hover:bg-white/5 hover:border-white/25 font-medium text-sm transition-colors"
            >
              Start Free Trial — 5 Chats
            </Link>
          </motion.div>

          {/* Business */}
          <motion.div
            variants={fadeInUp}
            className="rounded-3xl border-2 border-blue-500/40 bg-gray-900 p-8 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/15 flex items-center justify-center text-xl">🏢</div>
              <div>
                <div className="font-sora font-semibold text-lg text-slate-50">Small Business & Teams</div>
                <div className="inline-block text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2.5 py-0.5 mt-0.5">
                  Built for teams
                </div>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-400 mb-8 flex-1">
              {[
                'Shared conversation history — no more "how did we fix the printer?"',
                'Device inventory to track all hardware across locations',
                'Team usage reports and time-saved analytics',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
              <li className="flex items-start gap-2.5">
                <span className="text-blue-400 mt-0.5 flex-shrink-0">✓</span>
                <span>
                  <Link href="/productivity" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Productivity tools
                  </Link>
                  : Excel formulas, email drafting, and more
                </span>
              </li>
            </ul>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-900/40"
            >
              Explore Business Plans
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
