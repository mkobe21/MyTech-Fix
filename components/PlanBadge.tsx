interface PlanBadgeProps {
  tier: string;
  className?: string;
}

const tierConfig: Record<string, { label: string; className: string }> = {
  free_trial: { label: 'Free Trial', className: 'bg-zinc-100 text-zinc-700' },
  single_use: { label: 'Single Use', className: 'bg-amber-100 text-amber-700' },
  home: { label: 'Home', className: 'bg-blue-100 text-blue-700' },
  business: { label: 'Business', className: 'bg-purple-100 text-purple-700' },
};

export default function PlanBadge({ tier, className = '' }: PlanBadgeProps) {
  const config = tierConfig[tier] || tierConfig.free_trial;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}>
      {config.label}
    </span>
  );
}
