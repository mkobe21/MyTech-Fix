// Edge Function: check-cves
// Runs daily at 3 AM UTC.
// Queries NVD (National Vulnerability Database) for CVEs matching user device brands/models.
// Rate limit: 5 req / 30s without API key. Staggers requests with delays.
//
// Schedule: "0 3 * * *"
// Env vars needed: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY (optional),
//                  NVD_API_KEY (optional — raises rate limit to 50 req/30s)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generateMaintenanceSummary, fallbackSummary } from '../_shared/maintenance-ai.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
const NVD_API_KEY = Deno.env.get('NVD_API_KEY') ?? '';

// Only alert on critical/high CVEs automatically
const ALERT_SEVERITIES = new Set(['critical', 'high']);

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const jobName = 'check-cves';
  let devicesProcessed = 0;
  let notificationsSent = 0;

  try {
    // Get distinct device models from user_devices
    const { data: userDevices, error: devErr } = await supabase
      .from('user_devices')
      .select('user_id, id, device_brand, device_model');
    if (devErr) throw new Error(`fetch user_devices: ${devErr.message}`);
    if (!userDevices || userDevices.length === 0) {
      await logJob(supabase, jobName, 'success', 0, 0);
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // Get known CVEs already in DB (avoid re-fetching from NVD every day)
    const { data: existingCves } = await supabase
      .from('device_cves')
      .select('cve_id, device_brand, device_model, severity, description, patch_version');
    const existingCveIds = new Set((existingCves ?? []).map((c: { cve_id: string }) => c.cve_id));

    // Group user devices by brand+model to batch NVD lookups
    const modelUserMap = new Map<string, { userId: string; deviceId: string }[]>();
    for (const d of userDevices) {
      const key = `${d.device_brand}|${d.device_model}`;
      if (!modelUserMap.has(key)) modelUserMap.set(key, []);
      modelUserMap.get(key)!.push({ userId: d.user_id, deviceId: d.id });
    }

    // Fetch recent notifications to avoid duplicates
    const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
    const { data: recentNotifs } = await supabase
      .from('device_notifications')
      .select('user_id, user_device_id, reference_id')
      .eq('notification_type', 'cve')
      .gte('sent_at', since);
    const sentSet = new Set(
      (recentNotifs ?? []).map((n: { user_id: string; user_device_id: string; reference_id: string }) =>
        `${n.user_id}|${n.user_device_id}|${n.reference_id}`
      )
    );

    let nvdRequestCount = 0;

    for (const [modelKey, users] of modelUserMap) {
      const [brand, model] = modelKey.split('|');
      devicesProcessed++;

      // NVD rate limiting: 5 req/30s without key, 50 req/30s with key
      if (NVD_API_KEY ? nvdRequestCount % 50 === 49 : nvdRequestCount % 5 === 4) {
        await new Promise((r) => setTimeout(r, 31_000));
      }

      let newCves: Array<{
        cve_id: string;
        severity: string;
        description: string;
        published_date: string;
        patch_version: string | null;
      }> = [];

      try {
        const query = encodeURIComponent(`${brand} ${model}`);
        const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${query}&resultsPerPage=10`;
        const headers: Record<string, string> = { Accept: 'application/json' };
        if (NVD_API_KEY) headers['apiKey'] = NVD_API_KEY;

        const res = await fetch(url, { headers });
        nvdRequestCount++;

        if (res.ok) {
          const data = await res.json();
          for (const vuln of data?.vulnerabilities ?? []) {
            const cve = vuln?.cve;
            if (!cve) continue;
            const cveId: string = cve.id;
            if (existingCveIds.has(cveId)) continue;

            const metrics = cve.metrics?.cvssMetricV31?.[0] ?? cve.metrics?.cvssMetricV30?.[0];
            const severity = (metrics?.cvssData?.baseSeverity ?? 'unknown').toLowerCase();
            const description = cve.descriptions?.find((d: { lang: string }) => d.lang === 'en')?.value ?? '';

            newCves.push({ cve_id: cveId, severity, description, published_date: cve.published, patch_version: null });
          }
        }
      } catch (err) {
        console.warn(`[check-cves] NVD fetch failed for ${modelKey}:`, err);
      }

      // Insert new CVEs into device_cves table
      for (const cve of newCves) {
        await supabase.from('device_cves').upsert({
          device_brand: brand,
          device_model: model,
          ...cve,
          is_patched: false,
        }, { onConflict: 'cve_id' });
        existingCveIds.add(cve.cve_id);
      }

      // Notify users with matching devices for critical/high CVEs
      const alertableCves = [...newCves, ...(existingCves ?? []).filter(
        (c: { device_brand: string; device_model: string; severity: string }) =>
          c.device_brand === brand && c.device_model === model && ALERT_SEVERITIES.has(c.severity)
      )].filter((c) => ALERT_SEVERITIES.has(c.severity));

      for (const cve of alertableCves) {
        for (const { userId, deviceId } of users) {
          const key = `${userId}|${deviceId}|${cve.cve_id}`;
          if (sentSet.has(key)) continue;

          const summary = ANTHROPIC_API_KEY
            ? await generateMaintenanceSummary('cve', {
                deviceBrand: brand,
                deviceModel: model,
                cveId: cve.cve_id,
                cveSeverity: cve.severity,
                cveDescription: cve.description,
                patchVersion: cve.patch_version ?? undefined,
              }, ANTHROPIC_API_KEY)
            : fallbackSummary('cve', {
                deviceBrand: brand,
                deviceModel: model,
                cveId: cve.cve_id,
                cveSeverity: cve.severity,
                cveDescription: cve.description,
                patchVersion: cve.patch_version ?? undefined,
              });

          await supabase.from('device_notifications').insert({
            user_id: userId,
            user_device_id: deviceId,
            notification_type: 'cve',
            device_brand: brand,
            device_model: model,
            reference_id: cve.cve_id,
            ai_summary: summary,
            severity: cve.severity === 'critical' ? 'critical' : 'high',
          });
          notificationsSent++;
          sentSet.add(key);
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
