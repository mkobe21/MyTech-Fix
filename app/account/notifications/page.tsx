'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Bell, Shield } from 'lucide-react';

interface Prefs {
  email_enabled: boolean;
  firmware_updates: boolean;
  firmware_frequency: 'weekly' | 'monthly';
  maintenance_tips: boolean;
  monthly_summary: boolean;
}

const DEFAULT_PREFS: Prefs = {
  email_enabled: true,
  firmware_updates: true,
  firmware_frequency: 'weekly',
  maintenance_tips: true,
  monthly_summary: true,
};

export default function NotificationPreferencesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) { router.push('/'); return; }
      setUserId(user.id);

      const { data } = await supabaseBrowser
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setPrefs({
          email_enabled:      data.email_enabled ?? true,
          firmware_updates:   data.firmware_updates ?? true,
          firmware_frequency: data.firmware_frequency ?? 'weekly',
          maintenance_tips:   data.maintenance_tips ?? true,
          monthly_summary:    data.monthly_summary ?? true,
        });
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    const { error } = await supabaseBrowser
      .from('user_notification_preferences')
      .upsert({ user_id: userId, ...prefs, updated_at: new Date().toISOString() });
    if (error) {
      toast.error('Failed to save preferences');
    } else {
      toast.success('Notification preferences saved');
    }
    setSaving(false);
  }

  function toggle(key: keyof Omit<Prefs, 'firmware_frequency'>) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-xl mx-auto px-6 py-12">
          <div className="h-8 w-56 bg-white/10 rounded animate-pulse mb-6" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-white/5 border border-white/10 rounded-xl animate-pulse mb-3" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-6 py-12">
        {/* Header */}
        <Link href="/account" className="text-sm text-primary hover:underline flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Account
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-5 h-5 text-blue-400" />
          <h1 className="text-2xl font-semibold">Notification Preferences</h1>
        </div>
        <p className="text-slate-500 text-sm mb-8">
          Control which alerts MyTech-Fix sends you about your monitored devices.
        </p>

        <div className="space-y-4">
          {/* Master toggle */}
          <Card className="border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-100 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    Email Notifications
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Receive device alerts and digests by email.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs.email_enabled}
                  onClick={() => toggle('email_enabled')}
                  className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                    prefs.email_enabled ? 'bg-blue-500' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      prefs.email_enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Security alerts note */}
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 flex items-start gap-3">
            <Shield className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300">
              <span className="font-semibold text-red-400">Security alerts</span> (critical CVEs and end-of-life notices) are always sent and cannot be disabled — these protect your home network.
            </p>
          </div>

          {/* Firmware updates */}
          <Card className={`border-white/10 transition-opacity ${prefs.email_enabled ? '' : 'opacity-50 pointer-events-none'}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium text-slate-100">Firmware Updates</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Get notified when a new firmware version is available for your devices.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs.firmware_updates}
                  onClick={() => toggle('firmware_updates')}
                  className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                    prefs.firmware_updates ? 'bg-blue-500' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      prefs.firmware_updates ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              {prefs.firmware_updates && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">Frequency:</span>
                  {(['weekly', 'monthly'] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setPrefs((p) => ({ ...p, firmware_frequency: freq }))}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        prefs.firmware_frequency === freq
                          ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                          : 'border-white/10 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Maintenance tips */}
          <Card className={`border-white/10 transition-opacity ${prefs.email_enabled ? '' : 'opacity-50 pointer-events-none'}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-100">Maintenance Tips</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Weekly hygiene reminders — password checks, DNS security, battery alerts, warranty expiry.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs.maintenance_tips}
                  onClick={() => toggle('maintenance_tips')}
                  className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                    prefs.maintenance_tips ? 'bg-blue-500' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      prefs.maintenance_tips ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Monthly summary */}
          <Card className={`border-white/10 transition-opacity ${prefs.email_enabled ? '' : 'opacity-50 pointer-events-none'}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-100">Monthly Summary</div>
                  <p className="text-xs text-slate-500 mt-1">
                    A monthly all-clear (or issue summary) email for all your monitored devices.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs.monthly_summary}
                  onClick={() => toggle('monthly_summary')}
                  className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                    prefs.monthly_summary ? 'bg-blue-500' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      prefs.monthly_summary ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save button */}
        <div className="mt-6 flex gap-3">
          <Button
            onClick={handleSave}
            className="btn-premium"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Preferences'}
          </Button>
          <Link href="/my-devices">
            <Button variant="outline" className="border-white/10">
              Manage Devices
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
