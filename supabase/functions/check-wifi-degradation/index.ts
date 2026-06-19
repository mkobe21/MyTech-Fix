// Edge Function: check-wifi-degradation
// Runs daily at 5 AM UTC.
// Cross-references the user's most recent diagnostic result against:
//   - their ISP plan speed (from user_devices.plan_speed_mbps)
//   - a 30-day rolling average from user_diagnostics
// Sends a notification if current speed is >30% below baseline or plan.
//
// Schedule: "0 5 * * *"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generateMaintenanceSummary, fallbackSummary } from '../_shared/maintenance-ai.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

const DEGRADATION_THRESHOLD = 0.30; // 30% drop triggers a notification

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const jobName = 'check-wifi-degradation';
  let usersChecked = 0;
  let notificationsSent = 0;

  try {
    // Get users who have Router/WiFi devices with a plan speed configured
    const { data: routerDevices, error: devErr } = await supabase
      .from('user_devices')
      .select('id, user_id, device_brand, device_model, plan_speed_mbps')
      .not('plan_speed_mbps', 'is', null)
      .ilike('device_type', '%router%');
    if (devErr) throw new Error(`fetch router devices: ${devErr.message}`);
    if (!routerDevices || routerDevices.length === 0) {
      await logJob(supabase, jobName, 'success', 0, 0);
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // Dedup: recent degradation/speed notifications (last 7 days per user)
    const since7d = new Date(Date.now() - 7 * 86_400_000).toISOString();
    const { data: recentNotifs } = await supabase
      .from('device_notifications')
      .select('user_id, notification_type')
      .in('notification_type', ['wifi_degradation', 'speed_vs_plan'])
      .gte('sent_at', since7d);
    const recentSet = new Set(
      (recentNotifs ?? []).map((n: { user_id: string; notification_type: string }) =>
        `${n.user_id}|${n.notification_type}`
      )
    );

    const now = Date.now();
    const since30d = new Date(now - 30 * 86_400_000).toISOString();
    const since7dStr = new Date(now - 7 * 86_400_000).toISOString();

    for (const device of routerDevices) {
      usersChecked++;
      const ctx = { deviceBrand: device.device_brand, deviceModel: device.device_model };

      // Fetch user's recent diagnostics
      const { data: diagnostics } = await supabase
        .from('user_diagnostics')
        .select('results, created_at')
        .eq('user_id', device.user_id)
        .gte('created_at', since30d)
        .order('created_at', { ascending: false });

      if (!diagnostics || diagnostics.length < 3) continue; // need enough data points

      // Extract download speeds from diagnostic results
      const speeds = diagnostics
        .map((d: { results: { internetSpeed?: { downloadMbps?: number } }; created_at: string }) => ({
          speed: d.results?.internetSpeed?.downloadMbps ?? null,
          date: d.created_at,
        }))
        .filter((s: { speed: number | null }) => s.speed !== null);

      if (speeds.length < 3) continue;

      // 7-day average (recent) vs 30-day average (baseline)
      const recentSpeeds = speeds.filter((s: { date: string }) => s.date >= since7dStr).map((s: { speed: number }) => s.speed);
      const baselineSpeeds = speeds.map((s: { speed: number }) => s.speed);

      const recentAvg = recentSpeeds.length > 0
        ? Math.round(recentSpeeds.reduce((a: number, b: number) => a + b, 0) / recentSpeeds.length)
        : null;
      const baselineAvg = Math.round(baselineSpeeds.reduce((a: number, b: number) => a + b, 0) / baselineSpeeds.length);
      const planSpeed: number = device.plan_speed_mbps;

      // Check: speed vs plan
      if (recentAvg !== null && recentAvg < planSpeed * (1 - DEGRADATION_THRESHOLD)) {
        const key = `${device.user_id}|speed_vs_plan`;
        if (!recentSet.has(key)) {
          const summary = ANTHROPIC_API_KEY
            ? await generateMaintenanceSummary('speed_vs_plan', { ...ctx, currentSpeed: recentAvg, planSpeed }, ANTHROPIC_API_KEY)
            : fallbackSummary('speed_vs_plan', { ...ctx, currentSpeed: recentAvg, planSpeed });
          await supabase.from('device_notifications').insert({
            user_id: device.user_id,
            user_device_id: device.id,
            notification_type: 'speed_vs_plan',
            device_brand: device.device_brand,
            device_model: device.device_model,
            ai_summary: summary,
            severity: 'medium',
          });
          notificationsSent++;
          recentSet.add(key);
        }
        continue; // speed_vs_plan takes priority over general degradation
      }

      // Check: degradation vs own baseline
      if (recentAvg !== null && baselineSpeeds.length >= 7 && recentAvg < baselineAvg * (1 - DEGRADATION_THRESHOLD)) {
        const key = `${device.user_id}|wifi_degradation`;
        if (!recentSet.has(key)) {
          const summary = ANTHROPIC_API_KEY
            ? await generateMaintenanceSummary('wifi_degradation', { ...ctx, currentSpeed: recentAvg, baselineSpeed: baselineAvg }, ANTHROPIC_API_KEY)
            : fallbackSummary('wifi_degradation', { ...ctx, currentSpeed: recentAvg, baselineSpeed: baselineAvg });
          await supabase.from('device_notifications').insert({
            user_id: device.user_id,
            user_device_id: device.id,
            notification_type: 'wifi_degradation',
            device_brand: device.device_brand,
            device_model: device.device_model,
            ai_summary: summary,
            severity: 'medium',
          });
          notificationsSent++;
          recentSet.add(key);
        }
      }
    }

    await logJob(supabase, jobName, 'success', usersChecked, notificationsSent);
    return new Response(JSON.stringify({ ok: true, usersChecked, notificationsSent }), { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[${jobName}]`, msg);
    await logJob(supabase, jobName, 'error', usersChecked, notificationsSent, msg);
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
});

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
