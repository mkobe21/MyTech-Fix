'use client';

import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

const TESTIMONIALS = [
  {
    quote: "I had our office WiFi sorted out in under 5 minutes. The diagnostic scan told the AI exactly what was wrong before I even finished describing the problem.",
    name: 'Sarah K.',
    role: 'Office Manager, Denver CO',
    stars: 5,
  },
  {
    quote: "Finally a tool that gives you real steps, not 'have you tried restarting?'. It even generated a diagram showing me which cable to move. Unreal.",
    name: 'James T.',
    role: 'Home user, Austin TX',
    stars: 5,
  },
  {
    quote: "We used to spend hours troubleshooting with our IT vendor. Now the team fixes most things themselves with MyTech-Fix. Huge time saver.",
    name: 'Maria L.',
    role: 'Small business owner, Chicago IL',
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-900/40">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight">
            People are actually fixing things
          </h2>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeInUp}
              className="flex flex-col gap-4 p-6 rounded-2xl border border-white/[0.07] bg-gray-900"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <div className="font-semibold text-slate-100 text-sm">{t.name}</div>
                <div className="text-slate-500 text-xs mt-0.5">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
