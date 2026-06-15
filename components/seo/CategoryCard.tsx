import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type React from 'react';

interface SubLink {
  label: string;
  href: string;
  count: number;
}

interface CategoryCardProps {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  description?: string;
  guideCount: number;
  href: string | null;
  enabled: boolean;
  subLinks?: SubLink[];
}

export default function CategoryCard({
  icon: Icon,
  name,
  description,
  guideCount,
  href,
  enabled,
  subLinks,
}: CategoryCardProps) {
  const hasSubLinks = enabled && subLinks && subLinks.length > 0;

  const cardContent = (
    <div
      className={`h-full rounded-2xl border p-6 transition-all ${
        enabled
          ? hasSubLinks
            ? 'border-white/10 bg-card/60'
            : 'border-white/10 bg-card/60 hover:border-blue-500/30 hover:bg-blue-500/5 group cursor-pointer'
          : 'border-white/[0.05] bg-card/30 opacity-50 cursor-default'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
          enabled ? 'bg-blue-500/10' : 'bg-white/5'
        }`}
      >
        <Icon className={`w-6 h-6 ${enabled ? 'text-blue-400' : 'text-slate-600'}`} />
      </div>
      <h3
        className={`font-sora font-semibold mb-1 transition-colors ${
          enabled
            ? hasSubLinks
              ? 'text-slate-100'
              : 'text-slate-100 group-hover:text-blue-400'
            : 'text-slate-500'
        }`}
      >
        {name}
      </h3>
      {description && (
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">{description}</p>
      )}
      <div className={`text-xs font-medium mb-4 ${enabled ? 'text-emerald-400' : 'text-slate-700'}`}>
        {enabled ? `${guideCount} guide${guideCount !== 1 ? 's' : ''}` : 'Coming soon'}
      </div>

      {hasSubLinks && (
        <div className="space-y-1.5">
          {subLinks!.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              className="flex items-center justify-between rounded-lg bg-white/[0.04] hover:bg-blue-500/10 border border-white/[0.06] hover:border-blue-500/20 px-3 py-2 transition-all group/sub"
            >
              <span className="text-xs font-medium text-slate-300 group-hover/sub:text-blue-400 transition-colors">
                {sub.label}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-600 group-hover/sub:text-blue-500 transition-colors">
                  {sub.count}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-600 group-hover/sub:text-blue-400 group-hover/sub:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  if (enabled && href && !hasSubLinks) {
    return (
      <Link href={href} className="h-full block">
        {cardContent}
      </Link>
    );
  }
  return <div className="h-full">{cardContent}</div>;
}
