import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RelatedItem {
  category: string;
  title: string;
  href: string;
}

export default function RelatedGrid({ items }: { items: RelatedItem[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 p-6">
      <h3 className="font-sora font-semibold text-slate-100 mb-4 text-sm uppercase tracking-wide">
        Related Guides
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:border-blue-500/30 hover:bg-blue-500/5 p-4 transition-all group"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500 mb-1">
                {item.category}
              </div>
              <div className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                {item.title}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all mt-0.5 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
