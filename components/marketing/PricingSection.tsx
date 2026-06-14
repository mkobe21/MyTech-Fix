'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { Zap, Shield, Users } from 'lucide-react';

const VALUE_POINTS = [
  {
    icon: Zap,
    title: 'Less than a single Geek Squad visit',
    body: 'A Home plan is $9.99/mo — unlimited chats, 24/7.',
  },
  {
    icon: Shield,
    title: 'No subscription required to start',
    body: '3 free sessions, no credit card. Upgrade only when you need more.',
  },
  {
    icon: Users,
    title: 'Plans for everyone',
    body: 'From individual households to multi-seat business teams.',
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-[#0A0F1E]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
        >
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
            Pricing
          </div>
          <h2 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3">
            Simple pricing for every need
          </h2>
          <p className="text-slate-400 text-lg mb-12">
            Start free — no credit card required. Upgrade when you&apos;re ready.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-12 text-left">
            {VALUE_POINTS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/[0.07] bg-gray-900/60 p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="font-semibold text-slate-100 text-sm mb-1">{title}</div>
                <div className="text-slate-500 text-sm">{body}</div>
              </div>
            ))}
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-900/40"
          >
            See all plans & pricing
            <span className="text-blue-200">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
