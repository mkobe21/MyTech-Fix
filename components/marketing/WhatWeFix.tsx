'use client';

import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

const CATEGORIES = [
  { icon: '📶', label: 'WiFi & Networking' },
  { icon: '🖨️', label: 'Printers' },
  { icon: '💡', label: 'Smart Home' },
  { icon: '💻', label: 'Computers' },
  { icon: '📷', label: 'Security Cameras' },
  { icon: '📱', label: 'Phone & Tablet' },
  { icon: '🔐', label: 'Suspicious Activity' },
  { icon: '🛜', label: 'VPN & Remote Work' },
];

export default function WhatWeFix() {
  return (
    <section id="what-we-fix" className="py-20 bg-gray-900/40">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
            Coverage
          </div>
          <h2 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-3">
            What we fix
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From flaky WiFi to smart home glitches — if it involves a device, we can help.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.label}
              variants={fadeInUp}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-white/[0.07] bg-gray-900 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-200 cursor-default"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-medium text-slate-300 text-center leading-snug group-hover:text-slate-100 transition-colors">
                {cat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
