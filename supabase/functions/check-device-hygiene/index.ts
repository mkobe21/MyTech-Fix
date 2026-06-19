// Edge Function: check-device-hygiene
// Runs weekly at 4 AM UTC on Sundays.
// Checks: default password not changed, DNS still on ISP defaults, warranty nearing expiry,
// battery-powered device battery reminder.
//
// Schedule: "0 4 * * 0"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generateMaintenanceSummary, fallbackSummary } from '../_shared/maintenance-ai.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

// Days before warranty expiry to warn
const WARRANTY_WARN_DAYS = 30;
// Months between battery reminders
const BATTERY_REMINDER_INTERVAL_MONTHS = 6;
// Common ISP DNS servers — if user's router is set to one of these, recommend switching
const ISP_DNS_PREFIXES = ['10.', '172.', '192.168.', '100.'];

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const jobName = 'check-device-hygiene';
  let devicesProcessed = 0;
  let notificationsSent = 0;

  try {
    const { data: userDevices, error: devErr } = await supabase
      .from('user_devices')
      .select(
        'id, user_id, device_brand, device_model, device_type, purchase_date, warranty_months, ' +
        'is_battery_powered, battery_last_replaced, default_password_confirmed_changed, local_ip'
      );
    if (devErr) throw new Error(`fetch user_devices: ${devErr.message}`);
    if (!userDevices || userDevices.length === 0) {
      await logJob(supabase, jobName, 'success', 0, 0);
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // Dedup: recent hygiene notifications (last 30 days)
    const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
    const { data: recentNotifs } = await supabase
      .from('device_notifications')
      .select('user_id, user_device_id, notification_type')
      .in('notification_type', ['password_hygiene', 'dns_security', 'warranty_expiry', 'battery_reminder'])
      .gte('sent_at', since);
    const recentSet = new Set(
      (recentNotifs ?? []).map((n: { user_id: string; user_device_id: string; notification_type: string }) =>
        `${n.user_id}|${n.user_device_id}|${n.notification_type}`
      )
    );

    const today = new Date();

    for (const device of userDevices) {
      devicesProcessed++;
      const ctx = { deviceBrand: device.device_brand, deviceModel: device.device_model };

      // 1. Default password not changed (only meaningful for routers and network gear)
      const isNetworkDevice = (device.device_type ?? '').toLowerCase().includes('router') ||
                              (device.device_type ?? '').toLowerCase().includes('wifi') ||
                              (device.device_type ?? '').toLowerCase().includes('network');
      if (isNetworkDevice && !device.default_password_confirmed_changed) {
        const key = `${device.user_id}|${device.id}|password_hygiene`;
        if (!recentSet.has(key)) {
          const summary = ANTHROPIC_API_KEY
            ? await generateMaintenanceSummary('password_hygiene', ctx, ANTHROPIC_API_KEY)
            : fallbackSummary('password_hygiene', ctx);
          await insertNotification(supabase, device.user_id, device.id, 'password_hygiene', ctx.deviceBrand, ctx.deviceModel, null, summary, 'medium');
          notificationsSent++;
          recentSet.add(key);
        }
      }

      // 2. DNS security check (router/WiFi devices with known local_ip that looks like ISP DNS)
      if (isNetworkDevice && device.local_ip && ISP_DNS_PREFIXES.some((p) => device.local_ip.startsWith(p))) {
        const key = `${device.user_id}|${device.id}|dns_security`;
        if (!recentSet.has(key)) {
          const summary = ANTHROPIC_API_KEY
            ? await generateMaintenanceSummary('dns_security', { ...ctx, dnsServer: device.local_ip }, ANTHROPIC_API_KEY)
            : fallbackSummary('dns_security', { ...ctx, dnsServer: device.local_ip });
          await insertNotification(supabase, device.user_id, device.id, 'dns_security', ctx.deviceBrand, ctx.deviceModel, null, summary, 'info');
          notificationsSent++;
          recentSet.add(key);
        }
      }

      // 3. Warranty expiry
      if (device.purchase_date && device.warranty_months) {
        const warrantyEnd = new Date(device.purchase_date);
        warrantyEnd.setMonth(warrantyEnd.getMonth() + device.warranty_months);
        const daysLeft = Math.ceil((warrantyEnd.getTime() - today.getTime()) / 86_400_000);

        if (daysLeft > 0 && daysLeft <= WARRANTY_WARN_DAYS) {
          const key = `${device.user_id}|${device.id}|warranty_expiry`;
          if (!recentSet.has(key)) {
            const summary = ANTHROPIC_API_KEY
              ? await generateMaintenanceSummary('warranty_expiry', { ...ctx, purchaseDate: device.purchase_date, warrantyMonths: device.warranty_months }, ANTHROPIC_API_KEY)
              : fallbackSummary('warranty_expiry', { ...ctx, purchaseDate: device.purchase_date, warrantyMonths: device.warranty_months });
            await insertNotification(supabase, device.user_id, device.id, 'warranty_expiry', ctx.deviceBrand, ctx.deviceModel, warrantyEnd.toISOString().split('T')[0], summary, 'info');
            notificationsSent++;
            recentSet.add(key);
          }
        }
      }

      // 4. Battery reminder
      if (device.is_battery_powered) {
        let shouldRemind = false;
        if (!device.battery_last_replaced) {
          shouldRemind = true; // never replaced — prompt once
        } else {
          const monthsSinceReplaced = (today.getTime() - new Date(device.battery_last_replaced).getTime()) / (30 * 86_400_000);
          shouldRemind = monthsSinceReplaced >= BATTERY_REMINDER_INTERVAL_MONTHS;
        }

        if (shouldRemind) {
          const key = `${device.user_id}|${device.id}|battery_reminder`;
          if (!recentSet.has(key)) {
            const summary = ANTHROPIC_API_KEY
              ? await generateMaintenanceSummary('battery_reminder', ctx, ANTHROPIC_API_KEY)
              : fallbackSummary('battery_reminder', ctx);
            await insertNotification(supabase, device.user_id, device.id, 'battery_reminder', ctx.deviceBrand, ctx.deviceModel, null, summary, 'info');
            notificationsSent++;
            recentSet.add(key);
          }
        }
      }
    }

    await logJob(supabase, jobName, 'success', devicesProcessed, notificationsSent);
    return new Response(JSON.stringify({ ok: true, devicesProcessed, notificationsSent }), { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[${jobName}]`, msg);
    await logJob(supabase, jobName, 'error', devicesProcessed, notificationsSent, msg);
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
});

async function insertNotification(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  deviceId: string,
  type: string,
  brand: string,
  model: string,
  referenceId: string | null,
  aiSummary: string,
  severity: string,
) {
  await supabase.from('device_notifications').insert({
    user_id: userId,
    user_device_id: deviceId,
    notification_type: type,
    device_brand: brand,
    device_model: model,
    reference_id: referenceId,
    ai_summary: aiSummary,
    severity,
  });
}

async function logJob(
  supabase: ReturnType<typeof createClient>,
  jobName: string,
  status: 'success' | 'partial' | 'error',
  devicesProcessed: number,
  notificationsSent: number,
  errorMessage?: string,
) {
  await supabase.from('maintenance_job_logs').insert({
    job_name: jobName,
    status,
    devices_processed: devicesProcessed,
    notifications_sent: notificationsSent,
    error_message: errorMessage ?? null,
  });
}
