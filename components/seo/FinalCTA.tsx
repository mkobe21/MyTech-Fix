import Link from 'next/link';

interface FinalCTAProps {
  heading: string;
  body: string;
  chatLink: string;
}

export default function FinalCTA({ heading, body, chatLink }: FinalCTAProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-card/60 p-10 text-center mt-10">
      <h2 className="font-sora text-2xl font-bold text-slate-50 mb-3">{heading}</h2>
      <p className="text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">{body}</p>
      <Link
        href={chatLink}
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors shadow-lg shadow-blue-900/40"
      >
        Start Free Diagnostic Chat →
      </Link>
    </div>
  );
}
