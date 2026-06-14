'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainerSlow, fadeInUp } from '@/lib/animations';
import ChatDemo from './ChatDemo';

export default function HeroSection() {
  return (
    <section className="pt-16 pb-20 px-6 bg-[#0A0F1E] relative overflow-hidden">
      {/* Subtle dot-grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:28px_28px]" />
      {/* Blue glow blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainerSlow}
            className="flex flex-col"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-white/[0.08] rounded-full px-4 py-1.5 text-sm font-medium text-slate-300">
                <motion.span
                  className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                />
                AI + Live Network Diagnostics
              </div>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-sora text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-50 tracking-tight leading-[1.1] mb-6"
            >
              Tech Problems Solved —{' '}
              <span className="text-blue-400">Simply &amp; Visually</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg"
            >
              Describe the issue or send a screenshot. Get clear step-by-step fixes with pictures.
              Perfect for home users, families, and small businesses.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base transition-colors shadow-lg shadow-blue-900/50"
              >
                Start Free — 5 Chats ↗
              </Link>
              <a
                href="#diagnostics"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/[0.12] text-slate-300 hover:text-slate-50 hover:border-white/25 font-medium text-base transition-colors"
              >
                See how diagnostics work →
              </a>
            </motion.div>

            {/* Trust row */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-slate-500"
            >
              {['No credit card required', 'Real diagnostics, not just chat', 'Works on any device'].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <span className="text-emerald-500 text-xs">✓</span>
                    {item}
                  </span>
                )
              )}
            </motion.div>
          </motion.div>

          {/* Right — animated chat demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <ChatDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
