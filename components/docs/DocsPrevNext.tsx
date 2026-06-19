import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DocNavItem } from '@/lib/docs-navigation';

interface Props {
  prev: DocNavItem | null;
  next: DocNavItem | null;
}

export default function DocsPrevNext({ prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <div className="flex items-stretch justify-between gap-4 mt-12 pt-8 border-t border-white/[0.07]">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="flex-1 group flex flex-col gap-1 p-4 rounded-xl border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.02] transition-all"
        >
          <span className="flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </span>
          <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="flex-1 group flex flex-col gap-1 p-4 rounded-xl border border-white/[0.07] hover:border-white/20 hover:bg-white/[0.02] transition-all text-right"
        >
          <span className="flex items-center justify-end gap-1.5 text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </span>
          <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
