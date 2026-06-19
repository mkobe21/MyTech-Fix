// Edge Function: check-firmware-updates
// Runs daily at 2 AM UTC.
// For each unique device_brand/device_model in user_devices, checks device_firmware for
// known EOL dates and queues notifications. Actual firmware version data is maintained
// manually in device_firmware — a scraping service or webhook would update latest_version.
//
// Schedule (set in Supabase Dashboard > Edge Functions > Schedules):
//   cron: "0 2 * * *"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generateMaintenanceSummary, fallbackSummary } from '../_shared/maintenance-ai.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

// Days before EOL to start warning
const EOL_WARNING_DAYS = 90;

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const jobName = 'check-firmware-updates';
  let devicesProcessed = 0;
  let notificationsSent = 0;
  const errors: string[] = [];

  try {
    // Fetch all user devices
    const { data: userDevices, error: devErr } = await supabase
      .from('user_devices')
      .select('id, user_id, device_brand, device_model, firmware_user_version');

    if (devErr) throw new Error(`fetch user_devices: ${devErr.message}`);
    if (!userDevices || userDevices.length === 0) {
      await logJob(supabase, jobName, 'success', 0, 0);
      return new Response(JSON.stringify({ ok: true, processed: 0 }), { status: 200 });
    }

    // Get all firmware records (shared knowledge base)
    const { data: firmwareRecords } = await supabase
      .from('device_firmware')
      .select('device_brand, device_model, latest_version, release_date, eol_date, eol_replacement_suggestion');

    const firmwareMap = new Map<string, typeof firmwareRecords extends (infer T)[] | null ? T : never>();
    for (const fw of firmwareRecords ?? []) {
      firmwareMap.set(`${fw.device_brand}|${fw.device_model}`, fw);
    }

    // Fetch recently sent notifications to avoid duplicates (last 14 days)
    const since = new Date(Date.now() - 14 * 86_400_000).toISOString();
    const { data: recentNotifs } = await supabase
      .from('device_notifications')
      .select('user_id, user_device_id, notification_type, reference_id')
      .in('notification_type', ['firmware_update', 'eol_warning', 'eol_final'])
      .gte('sent_at', since);

    const recentSet = new Set(
      (recentNotifs ?? []).map((n: { user_id: string; user_device_id: string; notification_type: string; reference_id: string }) =>
        `${n.user_id}|${n.user_device_id}|${n.notification_type}|${n.reference_id ?? ''}`
      )
    );

    const today = new Date();

    for (const device of userDevices) {
      devicesProcessed++;
      const fw = firmwareMap.get(`${device.device_brand}|${device.device_model}`);
      if (!fw) continue;

      const ctx = {
        deviceBrand: device.device_brand,
        deviceModel: device.device_model,
      };

      // --- Firmware update check ---
      if (fw.latest_version && device.firmware_user_version && fw.latest_version !== device.firmware_user_version) {
        const key = `${device.user_id}|${device.id}|firmware_update|${fw.latest_version}`;
        if (!recentSet.has(key)) {
          const summary = ANTHROPIC_API_KEY
            ? await generateMaintenanceSummary('firmware_update', { ...ctx, latestVersion: fw.latest_version, releaseDate: fw.release_date }, ANTHROPIC_API_KEY)
            : fallbackSummary('firmware_update', { ...ctx, latestVersion: fw.latest_version });

          await supabase.from('device_notifications').insert({
            user_id: device.user_id,
            user_device_id: device.id,
            notification_type: 'firmware_update',
            device_brand: device.device_brand,
            device_model: device.device_model,
            reference_id: fw.latest_version,
            ai_summary: summary,
            severity: 'medium',
          });
          notificationsSent++;
        }
      }

      // --- EOL checks ---
      if (fw.eol_date) {
        const eolMs = new Date(fw.eol_date).getTime();
        const daysUntilEol = Math.ceil((eolMs - today.getTime()) / 86_400_000);

        if (daysUntilEol <= 0) {
          // Final EOL
          const key = `${device.user_id}|${device.id}|eol_final|${fw.eol_date}`;
          if (!recentSet.has(key)) {
            const summary = ANTHROPIC_API_KEY
              ? await generateMaintenanceSummary('eol_final', { ...ctx, eolDate: fw.eol_date, replacementSuggestion: fw.eol_replacement_suggestion }, ANTHROPIC_API_KEY)
              : fallbackSummary('eol_final', { ...ctx, eolDate: fw.eol_date });

            await supabase.from('device_notifications').insert({
              user_id: device.user_id,
              user_device_id: device.id,
              notification_type: 'eol_final',
              device_brand: device.device_brand,
              device_model: device.device_model,
              reference_id: fw.eol_date,
              ai_summary: summary,
              severity: 'high',
            });
            notificationsSent++;
          }
        } else if (daysUntilEol <= EOL_WARNING_DAYS) {
          // Warning (within 90 days)
          const key = `${device.user_id}|${device.id}|eol_warning|${fw.eol_date}`;
          if (!recentSet.has(key)) {
            const summary = ANTHROPIC_API_KEY
              ? await generateMaintenanceSummary('eol_warning', { ...ctx, eolDate: fw.eol_date, replacementSuggestion: fw.eol_replacement_suggestion }, ANTHROPIC_API_KEY)
              : fallbackSummary('eol_warning', { ...ctx, eolDate: fw.eol_date });

            await supabase.from('device_notifications').insert({
              user_id: device.user_id,
              user_device_id: device.id,
              notification_type: 'eol_warning',
              device_brand: device.device_brand,
              device_model: device.device_model,
              reference_id: fw.eol_date,
              ai_summary: summary,
              severity: 'medium',
            });
            notificationsSent++;
          }
        }
      }
    }

    await logJob(supabase, jobName, 'success', devicesProcessed, notificationsSent);
    return new Response(JSON.stringify({ ok: true, devicesProcessed, notificationsSent }), { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(msg);
    console.error(`[${jobName}]`, msg);
    await logJob(supabase, jobName, 'error', devicesProcessed, notificationsSent, msg);
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
