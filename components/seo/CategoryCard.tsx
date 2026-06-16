import Link from 'next/link';
import type React from 'react';

interface CategoryCardProps {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  description?: string;
  guideCount: number;
  href: string;
  enabled: boolean;
}

export default function CategoryCard({
  icon: Icon,
  name,
  description,
  guideCount,
  href,
  enabled,
}: CategoryCardProps) {
  const cardContent = (
    <div
      className={`h-full rounded-2xl border p-6 transition-all ${
        enabled
          ? 'border-white/10 bg-card/60 hover:border-blue-500/30 hover:bg-blue-500/5 group cursor-pointer'
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
          enabled ? 'text-slate-100 group-hover:text-blue-400' : 'text-slate-500'
        }`}
      >
        {name}
      </h3>
      {description && (
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">{description}</p>
      )}
      <div className={`text-xs font-medium ${enabled ? 'text-emerald-400' : 'text-slate-700'}`}>
        {enabled ? `${guideCount} guide${guideCount !== 1 ? 's' : ''}` : 'Coming soon'}
      </div>
    </div>
  );

  if (enabled) {
    return (
      <Link href={href} className="h-full block">
        {cardContent}
      </Link>
    );
  }
  return <div className="h-full">{cardContent}</div>;
}
