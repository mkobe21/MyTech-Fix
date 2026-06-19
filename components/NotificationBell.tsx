'use client';

import { useState, useCallback, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import NotificationPanel, { type DeviceNotification } from './NotificationPanel';

interface Props {
  userId: string;
}

export default function NotificationBell({ userId }: Props) {
  const [notifications, setNotifications] = useState<DeviceNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchNotifications = useCallback(async () => {
    const { data } = await supabaseBrowser
      .from('device_notifications')
      .select('id, user_device_id, notification_type, device_brand, device_model, reference_id, ai_summary, severity, sent_at, read_at')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(50);
    setNotifications((data as DeviceNotification[]) ?? []);
    setLoaded(true);
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time: listen for new notifications
  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'device_notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications((prev) => [payload.new as DeviceNotification, ...prev]);
        }
      )
      .subscribe();
    return () => { supabaseBrowser.removeChannel(channel); };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => (n.read_at ? n : { ...n, read_at: new Date().toISOString() }))
    );
  }, []);

  if (!loaded) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
        )}
      </button>

      {open && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setOpen(false)}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
        />
      )}
    </div>
  );
}
