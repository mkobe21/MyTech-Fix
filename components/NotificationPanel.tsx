'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, ExternalLink, MessageCircle, CheckCheck, Check } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import { toast } from 'sonner';

export interface DeviceNotification {
  id: string;
  user_device_id: string | null;
  notification_type: string;
  device_brand: string | null;
  device_model: string | null;
  reference_id: string | null;
  ai_summary: string | null;
  severity: 'critical' | 'high' | 'medium' | 'info' | null;
  sent_at: string;
  read_at: string | null;
}

interface Props {
  notifications: DeviceNotification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const SEVERITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, info: 3 };
const TYPE_LABELS: Record<string, string> = {
  firmware_update:  'Firmware Update',
  cve:              'Security Advisory',
  eol_warning:      'End-of-Life Warning',
  eol_final:        'End-of-Life',
  password_hygiene: 'Password Hygiene',
  dns_security:     'DNS Security Tip',
  wifi_degradation: 'Network Degradation',
  battery_reminder: 'Battery Reminder',
  warranty_expiry:  'Warranty Expiring',
  speed_vs_plan:    'Speed Below Plan',
  all_clear:        'All Clear',
};

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'border-red-500/30 bg-red-500/5',
  high:     'border-orange-500/30 bg-orange-500/5',
  medium:   'border-amber-500/30 bg-amber-500/5',
  info:     'border-blue-500/20 bg-blue-500/5',
};

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 2)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function buildChatLink(n: DeviceNotification): string {
  const device = [n.device_brand, n.device_model].filter(Boolean).join(' ');
  const context = encodeURIComponent(
    n.ai_summary
      ? `I have a notification about my ${device}: ${n.ai_summary}`
      : `Help me with a ${TYPE_LABELS[n.notification_type] ?? n.notification_type} issue on my ${device}.`
  );
  return `/chat?context=${context}`;
}

export default function NotificationPanel({ notifications, onClose, onMarkRead, onMarkAllRead }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const sorted = [...notifications].sort((a, b) => {
    const sa = SEVERITY_ORDER[a.severity ?? 'info'] ?? 3;
    const sb = SEVERITY_ORDER[b.severity ?? 'info'] ?? 3;
    if (sa !== sb) return sa - sb;
    return new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime();
  });

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  async function handleMarkRead(id: string) {
    const { error } = await supabaseBrowser
      .from('device_notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);
    if (error) { toast.error('Failed to mark as read'); return; }
    onMarkRead(id);
  }

  async function handleMarkAllRead() {
    const unreadIds = notifications.filter((n) => !n.read_at).map((n) => n.id);
    if (unreadIds.length === 0) return;
    const { error } = await supabaseBrowser
      .from('device_notifications')
      .update({ read_at: new Date().toISOString() })
      .in('id', unreadIds);
    if (error) { toast.error('Failed to mark all as read'); return; }
    onMarkAllRead();
  }

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-white/10 bg-[#0A0F1E]/95 backdrop-blur-xl shadow-2xl shadow-black/50 z-50 overflow-hidden"
      role="dialog"
      aria-label="Notifications"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-100">Notifications</h2>
          {unreadCount > 0 && (
            <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full px-2 py-0.5 font-medium">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1"
            >
              <CheckCheck className="w-3 h-3" /> Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="max-h-[70vh] overflow-y-auto divide-y divide-white/[0.05]">
        {sorted.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500">
            <div className="text-2xl mb-2">✅</div>
            No notifications — all your devices are up to date.
          </div>
        ) : (
          sorted.map((n) => {
            const device = [n.device_brand, n.device_model].filter(Boolean).join(' ') || 'Unknown device';
            const isUnread = !n.read_at;
            const severityStyle = SEVERITY_STYLES[n.severity ?? 'info'] ?? SEVERITY_STYLES.info;

            return (
              <div
                key={n.id}
                className={`px-4 py-3 transition-colors ${isUnread ? 'bg-white/[0.02]' : ''}`}
              >
                <div className={`rounded-xl border p-3 ${severityStyle}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        {TYPE_LABELS[n.notification_type] ?? n.notification_type}
                      </span>
                      {isUnread && (
                        <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-blue-400 align-middle" />
                      )}
                      <div className="text-xs text-slate-500 mt-0.5">{device} · {formatRelative(n.sent_at)}</div>
                    </div>
                    {isUnread && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="flex-shrink-0 p-1 text-slate-600 hover:text-slate-300 hover:bg-white/5 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {n.ai_summary && (
                    <p className="text-xs text-slate-300 leading-relaxed mb-2 line-clamp-3">
                      {n.ai_summary}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <Link
                      href={buildChatLink(n)}
                      onClick={onClose}
                      className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" /> Get help
                    </Link>
                    {n.notification_type === 'firmware_update' && n.reference_id && (
                      <span className="text-slate-700">·</span>
                    )}
                    {n.notification_type === 'cve' && n.reference_id && (
                      <a
                        href={`https://nvd.nist.gov/vuln/detail/${n.reference_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> {n.reference_id}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-white/[0.07] text-center">
          <Link
            href="/account/notifications"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Notification preferences →
          </Link>
        </div>
      )}
    </div>
  );
}
