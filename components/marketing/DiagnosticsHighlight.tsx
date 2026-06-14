'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

function DiagnosticMockup() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-gray-900 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-semibold text-slate-200 text-sm">Network Health Check</span>
        <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5 font-medium">
          ● Live
        </span>
      </div>

      {/* Speed gauge row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl bg-slate-800/60 p-4">
          <div className="text-xs text-slate-400 mb-1">Download</div>
          <div className="font-sora text-2xl font-bold text-slate-50">187 <span className="text-sm font-normal text-slate-400">Mbps</span></div>
          <div className="mt-2 h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full w-[78%] rounded-full bg-emerald-500" />
          </div>
          <div className="text-xs text-emerald-400 mt-1.5 font-medium">Good</div>
        </div>
        <div className="rounded-xl bg-slate-800/60 p-4">
          <div className="text-xs text-slate-400 mb-1">Upload</div>
          <div className="font-sora text-2xl font-bold text-slate-50">54 <span className="text-sm font-normal text-slate-400">Mbps</span></div>
          <div className="mt-2 h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full w-[45%] rounded-full bg-emerald-500" />
          </div>
          <div className="text-xs text-emerald-400 mt-1.5 font-medium">Good</div>
        </div>
      </div>

      {/* Latency row */}
      <div className="rounded-xl bg-slate-800/60 p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Latency (10 probes)</span>
          <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5 font-medium">Fair — 148ms avg</span>
        </div>
        {/* Mini latency bar chart */}
        <div className="flex items-end gap-1 h-8">
          {[40, 65, 148, 52, 180, 44, 155, 48, 160, 50].map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${Math.round((v / 200) * 100)}%`,
                background: v > 100 ? '#F59E0B' : '#10B981',
                opacity: 0.85,
              }}
            />
          ))}
        </div>
      </div>

      {/* DNS + Packet loss inline */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-800/60 px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">DNS</span>
          <span className="text-xs font-semibold text-emerald-400">42ms ✓</span>
        </div>
        <div className="rounded-xl bg-slate-800/60 px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">Packet loss</span>
          <span className="text-xs font-semibold text-emerald-400">0.0%</span>
        </div>
      </div>

      {/* AI insight chip */}
      <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 flex items-start gap-2.5">
        <span className="text-base">🧠</span>
        <p className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-blue-300">MyTech-Fix AI:</span> High latency spikes detected. Your 2.4 GHz band shows congestion on channel 6 — switching to 5 GHz or channel 11 will likely resolve intermittent drops.
        </p>
      </div>
    </div>
  );
}

const BULLETS = [
  { icon: '⚡', text: 'Live speed, ping, and latency tests' },
  { icon: '🧠', text: 'Results auto-flow into your AI conversation' },
  { icon: '🔍', text: 'Pinpoints root cause, not symptoms' },
];

export default function DiagnosticsHighlight() {
  return (
    <section id="diagnostics" className="py-20 bg-gray-900/50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — mockup */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <DiagnosticMockup />
          </motion.div>

          {/* Right — copy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="flex flex-col gap-6"
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
                Why MyTech-Fix is different
              </div>
              <h2 className="font-sora text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight mb-4">
                Real diagnostics, not just chat
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Most AI tools guess based on what you describe. MyTech-Fix runs real network tests
                in the background — and our AI uses that actual data to give you specific, accurate
                fixes. No more &ldquo;have you tried restarting?&rdquo; when the issue is your DNS.
              </p>
            </motion.div>

            <motion.ul variants={staggerContainer} className="space-y-4">
              {BULLETS.map((b) => (
                <motion.li key={b.text} variants={fadeInUp} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">{b.icon}</span>
                  <span className="text-slate-300 text-sm leading-relaxed">{b.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeInUp}>
              <Link
                href="/chat"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors group"
              >
                Try it free
                <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
