import type React from 'react';

interface CauseCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  likelihood: 'likely' | 'common' | 'rare';
}

const STYLES = {
  likely: {
    label: 'Most Likely',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
  },
  common: {
    label: 'Common',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-400',
  },
  rare: {
    label: 'Less Common',
    border: 'border-white/10',
    iconBg: 'bg-white/5',
    iconColor: 'text-slate-400',
    badgeBg: 'bg-white/5',
    badgeText: 'text-slate-400',
  },
};

export default function CauseCard({ icon: Icon, title, description, likelihood }: CauseCardProps) {
  const s = STYLES[likelihood];
  return (
    <div className={`rounded-2xl border ${s.border} bg-card/60 p-5 flex gap-4`}>
      <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon className={`w-5 h-5 ${s.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <h3 className="font-semibold text-slate-100 text-sm">{title}</h3>
          <span className={`text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${s.badgeBg} ${s.badgeText}`}>
            {s.label}
          </span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
