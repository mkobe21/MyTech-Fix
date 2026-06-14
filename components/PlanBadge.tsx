interface PlanBadgeProps {
  tier: string;
  className?: string;
}

const tierConfig: Record<string, { label: string; className: string }> = {
  free_trial: { label: 'Free Trial', className: 'bg-slate-500/15 text-slate-400' },
  single_use: { label: 'Single Use', className: 'bg-amber-500/15 text-amber-400' },
  home: { label: 'Home', className: 'bg-blue-500/15 text-blue-400' },
  home_pro: { label: 'Home Pro', className: 'bg-blue-500/20 text-blue-300' },
  business: { label: 'Small Business', className: 'bg-purple-500/15 text-purple-400' },
  business_plus: { label: 'Business Plus', className: 'bg-purple-500/20 text-purple-300' },
};

export default function PlanBadge({ tier, className = '' }: PlanBadgeProps) {
  const config = tierConfig[tier] || tierConfig.free_trial;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-white/[0.07] ${config.className} ${className}`}>
      {config.label}
    </span>
  );
}
