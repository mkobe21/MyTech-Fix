'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const STEPS = [
  {
    num: '1',
    title: 'Describe the problem',
    desc: 'Type, paste, or upload a photo. Plain English works — no tech jargon required.',
  },
  {
    num: '2',
    title: 'We diagnose automatically',
    desc: 'MyTech-Fix runs real network tests and feeds the results into the AI — so you get a real diagnosis, not a guess.',
  },
  {
    num: '3',
    title: 'Get clear, guided steps',
    desc: 'Step-by-step instructions tailored to your exact setup. Mark each as done and move on.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-[#0A0F1E]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
            How it works
          </div>
          <h2 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight">
            Simple for you. Smart under the hood.
          </h2>
        </div>

        <div className="relative">
          {/* Connector line — hidden on mobile */}
          <div className="hidden md:block absolute top-7 left-[calc(16.666%+28px)] right-[calc(16.666%+28px)] h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

          <motion.div
            className="grid md:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            {STEPS.map((step) => (
              <motion.div key={step.num} variants={fadeInUp} className="relative text-center md:text-left">
                <div className="relative z-10 inline-flex w-14 h-14 items-center justify-center rounded-2xl border border-blue-500/30 bg-[#0A0F1E] text-blue-400 font-sora text-xl font-bold mb-5 shadow-[0_0_20px_rgba(59,130,246,0.12)]">
                  {step.num}
                </div>
                <h3 className="font-sora text-lg font-semibold text-slate-50 mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
