import Link from 'next/link';

export default function MarketingFooter() {
  return (
    <footer className="bg-[#0A0F1E] border-t border-white/[0.07] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-lg">
            🔧
          </div>
          <span className="font-semibold text-slate-50 text-lg">
            MyTech<span className="text-blue-400">Fix</span>
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm text-slate-400">
          <Link href="/privacy" className="hover:text-slate-200 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-200 transition-colors">Terms</Link>
          <Link href="/support" className="hover:text-slate-200 transition-colors">Support</Link>
          <Link href="/contact" className="hover:text-slate-200 transition-colors">Contact</Link>
        </div>

        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} MyTech-Fix. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
