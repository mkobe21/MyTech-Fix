'use client';

interface Notification {
  notification_type: string;
  severity: string | null;
  read_at: string | null;
}

interface Props {
  notifications: Notification[];
  className?: string;
}

const BADGE_CONFIG = {
  security: { label: 'Security Risk',    emoji: '🔴', classes: 'bg-red-500/15 text-red-400 border-red-500/25' },
  update:   { label: 'Update Available', emoji: '🟠', classes: 'bg-orange-500/15 text-orange-400 border-orange-500/25' },
  attention:{ label: 'Attention Needed', emoji: '🟡', classes: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  good:     { label: 'Up to Date',       emoji: '🟢', classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
} as const;

function getBadgeKey(notifications: Notification[]): keyof typeof BADGE_CONFIG {
  const unread = notifications.filter((n) => !n.read_at);

  if (unread.some((n) => n.notification_type === 'cve' && (n.severity === 'critical' || n.severity === 'high'))) {
    return 'security';
  }
  if (unread.some((n) => n.notification_type === 'firmware_update')) {
    return 'update';
  }
  if (unread.length > 0) {
    return 'attention';
  }
  return 'good';
}

export default function MaintenanceBadge({ notifications, className = '' }: Props) {
  const key = getBadgeKey(notifications);
  const cfg = BADGE_CONFIG[key];

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.classes} ${className}`}
    >
      <span aria-hidden="true">{cfg.emoji}</span>
      {cfg.label}
    </span>
  );
}
