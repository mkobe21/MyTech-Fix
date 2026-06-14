import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-24 bg-[#0A0F1E]">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="font-sora text-4xl sm:text-5xl font-bold text-slate-50 tracking-tight mb-5">
          Ready to stop guessing what&apos;s wrong?
        </h2>
        <p className="text-lg text-slate-400 mb-10 leading-relaxed">
          Real diagnostics. Real answers. Fix it in minutes, not hours.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base transition-colors shadow-lg shadow-blue-900/40"
          >
            Start Free — 5 Chats ↗
          </Link>
          <Link
            href="#diagnostics"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/[0.12] text-slate-300 hover:text-slate-50 hover:border-white/25 font-medium text-base transition-colors"
          >
            See how diagnostics work →
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-500">No credit card required · Works on any device</p>
      </div>
    </section>
  );
}
