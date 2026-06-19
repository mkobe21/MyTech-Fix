'use client';

import { useEffect, useState, useCallback, type ReactElement } from 'react';
import { RefreshCw, ExternalLink, MessageCircle, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface UserDevice {
  id: string;
  device_brand: string;
  device_model: string;
  nickname?: string | null;
}

interface FirmwareRecord {
  latest_version: string | null;
  release_date: string | null;
  eol_date: string | null;
  eol_replacement_suggestion: string | null;
}

interface DeviceNotification {
  id: string;
  notification_type: string;
  reference_id: string | null;
  ai_summary: string | null;
  severity: string | null;
  sent_at: string;
  read_at: string | null;
}

interface Props {
  device: UserDevice;
}

const TYPE_LABELS: Record<string, string> = {
  firmware_update:  'Firmware Update',
  cve:              'Security Advisory',
  eol_warning:      'End-of-Life Warning',
  eol_final:        'End-of-Life',
  password_hygiene: 'Password Hygiene',
  dns_security:     'DNS Security',
  wifi_degradation: 'Network Degradation',
  battery_reminder: 'Battery Reminder',
  warranty_expiry:  'Warranty Expiring',
  speed_vs_plan:    'Speed Below Plan',
  all_clear:        'All Clear',
};

const SEVERITY_ICON: Record<string, ReactElement> = {
  critical: <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />,
  high:     <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />,
  medium:   <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />,
  info:     <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function DeviceMaintenanceTab({ device }: Props) {
  const [notifications, setNotifications] = useState<DeviceNotification[]>([]);
  const [firmware, setFirmware] = useState<FirmwareRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [notifRes, fwRes] = await Promise.all([
      supabaseBrowser
        .from('device_notifications')
        .select('id, notification_type, reference_id, ai_summary, severity, sent_at, read_at')
        .eq('user_device_id', device.id)
        .order('sent_at', { ascending: false })
        .limit(20),
      supabaseBrowser
        .from('device_firmware')
        .select('latest_version, release_date, eol_date, eol_replacement_suggestion')
        .eq('device_brand', device.device_brand)
        .eq('device_model', device.device_model)
        .maybeSingle(),
    ]);
    setNotifications((notifRes.data as DeviceNotification[]) ?? []);
    setFirmware(fwRes.data as FirmwareRecord | null);
    setLoading(false);
  }, [device.id, device.device_brand, device.device_model]);

  useEffect(() => { load(); }, [load]);

  async function markRead(id: string) {
    await supabaseBrowser
      .from('device_notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
  }

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-white/5 rounded-xl" />
        ))}
      </div>
    );
  }

  const deviceLabel = device.nickname || `${device.device_brand} ${device.device_model}`;

  return (
    <div className="space-y-4">
      {/* Firmware info bar */}
      {firmware && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-wrap gap-4 text-sm">
          {firmware.latest_version && (
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Latest Firmware</div>
              <div className="font-mono text-slate-200">{firmware.latest_version}</div>
              {firmware.release_date && (
                <div className="text-xs text-slate-500 mt-0.5">{formatDate(firmware.release_date)}</div>
              )}
            </div>
          )}
          {firmware.eol_date && (
            <div>
              <div className="text-xs text-slate-500 mb-0.5">End of Support</div>
              <div className={`font-medium ${new Date(firmware.eol_date) < new Date() ? 'text-red-400' : 'text-amber-400'}`}>
                {formatDate(firmware.eol_date)}
              </div>
              {firmware.eol_replacement_suggestion && (
                <div className="text-xs text-slate-500 mt-0.5">
                  Recommended: {firmware.eol_replacement_suggestion}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Notifications list */}
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          <CheckCircle className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
          No alerts for {deviceLabel} — looking good.
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const isUnread = !n.read_at;
            const icon = SEVERITY_ICON[n.severity ?? 'info'] ?? SEVERITY_ICON.info;
            const chatMsg = encodeURIComponent(
              n.ai_summary
                ? `I have a notification about my ${device.device_brand} ${device.device_model}: ${n.ai_summary}`
                : `Help me with a ${TYPE_LABELS[n.notification_type] ?? n.notification_type} issue on my ${deviceLabel}.`
            );

            return (
              <div
                key={n.id}
                className={`rounded-xl border p-3 transition-colors ${
                  isUnread ? 'border-white/15 bg-white/[0.04]' : 'border-white/[0.07] bg-white/[0.02]'
                }`}
              >
                <div className="flex items-start gap-2">
                  {icon}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${isUnread ? 'text-slate-200' : 'text-slate-400'}`}>
                        {TYPE_LABELS[n.notification_type] ?? n.notification_type}
                      </span>
                      {isUnread && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
                      )}
                      <span className="text-xs text-slate-600 ml-auto">{formatDate(n.sent_at)}</span>
                    </div>
                    {n.ai_summary && (
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">{n.ai_summary}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <Link
                        href={`/chat?context=${chatMsg}`}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" /> Get help
                      </Link>
                      {n.notification_type === 'cve' && n.reference_id && (
                        <a
                          href={`https://nvd.nist.gov/vuln/detail/${n.reference_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> {n.reference_id}
                        </a>
                      )}
                      {isUnread && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="text-xs text-slate-600 hover:text-slate-400 ml-auto"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={load}
          className="gap-1.5 border-white/10 text-slate-400 hover:text-slate-200 text-xs"
        >
          <RefreshCw className="w-3 h-3" /> Refresh
        </Button>
      </div>
    </div>
  );
}
