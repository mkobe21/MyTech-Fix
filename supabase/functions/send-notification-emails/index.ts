// Edge Function: send-notification-emails
// Runs daily at 8 AM UTC.
// Batches unread, unsent notifications and sends email digests.
// Security alerts (critical/high CVEs) go immediately; others batch as weekly digests.
//
// Schedule: "0 8 * * *"
//
// TODO: Replace the sendEmail stub with your chosen email provider:
//   - Resend: https://resend.com/docs/send-with-supabase-edge-functions
//   - Postmark: https://postmarkapp.com/developer/api/email-api
//   - SendGrid: https://docs.sendgrid.com/api-reference/mail-send/mail-send
// Set RESEND_API_KEY (or equivalent) in Supabase Edge Function secrets.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SITE_URL = Deno.env.get('NEXT_PUBLIC_SITE_URL') ?? 'https://mytech-fix.com';
// TODO: const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const jobName = 'send-notification-emails';
  let emailsSent = 0;

  try {
    // Fetch unsent notifications with user preference join
    const { data: pending, error } = await supabase
      .from('device_notifications')
      .select(`
        id, user_id, notification_type, device_brand, device_model,
        ai_summary, severity, sent_at,
        profiles:user_id ( email, full_name ),
        prefs:user_notification_preferences!left ( email_enabled, firmware_updates, firmware_frequency, maintenance_tips, monthly_summary )
      `)
      .eq('email_sent', false)
      .not('ai_summary', 'is', null)
      .order('sent_at', { ascending: false })
      .limit(500);

    if (error) throw new Error(`fetch pending: ${error.message}`);
    if (!pending || pending.length === 0) {
      await logJob(supabase, jobName, 'success', 0);
      return new Response(JSON.stringify({ ok: true, emailsSent: 0 }), { status: 200 });
    }

    // Group notifications by user
    const byUser = new Map<string, typeof pending>();
    for (const n of pending) {
      if (!byUser.has(n.user_id)) byUser.set(n.user_id, []);
      byUser.get(n.user_id)!.push(n);
    }

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday
    const isWeeklyDigestDay = dayOfWeek === 0; // send weekly digests on Sundays

    const emailedIds: string[] = [];

    for (const [userId, notifications] of byUser) {
      const profile = notifications[0]?.profiles as { email?: string; full_name?: string } | null;
      const prefs = notifications[0]?.prefs as {
        email_enabled?: boolean;
        firmware_updates?: boolean;
        firmware_frequency?: string;
        maintenance_tips?: boolean;
        monthly_summary?: boolean;
      } | null;

      // Skip if email disabled (default is enabled — no prefs row = all on)
      if (prefs?.email_enabled === false) continue;
      if (!profile?.email) continue;

      const email = profile.email;
      const name = profile.full_name ?? 'there';

      // Security alerts — always send immediately
      const securityAlerts = notifications.filter((n) =>
        (n.notification_type === 'cve' || n.notification_type === 'eol_final') &&
        (n.severity === 'critical' || n.severity === 'high')
      );

      if (securityAlerts.length > 0) {
        const subject = securityAlerts.some((n) => n.severity === 'critical')
          ? `⚠️ Security alert for your devices — action needed`
          : `Security advisory for your devices`;

        const body = buildSecurityEmailBody(name, securityAlerts, SITE_URL);
        const sent = await sendEmail(email, subject, body);
        if (sent) {
          emailedIds.push(...securityAlerts.map((n: { id: string }) => n.id));
          emailsSent++;
        }
      }

      // Firmware + maintenance digest — only on weekly digest day (or per user preference)
      const digestNotifs = notifications.filter((n) =>
        !['cve', 'eol_final'].includes(n.notification_type) ||
        (n.notification_type === 'eol_final' && n.severity !== 'high' && n.severity !== 'critical')
      );

      const firmwareUpdates = digestNotifs.filter((n) => n.notification_type === 'firmware_update');
      const maintenanceTips = digestNotifs.filter((n) =>
        !['firmware_update', 'cve', 'eol_final'].includes(n.notification_type)
      );

      const wantsFirmware = prefs?.firmware_updates !== false;
      const wantsMaintenance = prefs?.maintenance_tips !== false;
      const firmwareFreq = prefs?.firmware_frequency ?? 'weekly';
      const sendFirmware = wantsFirmware && (firmwareFreq === 'weekly' ? isWeeklyDigestDay : today.getDate() === 1);

      const digestItems = [
        ...(sendFirmware ? firmwareUpdates : []),
        ...(wantsMaintenance && isWeeklyDigestDay ? maintenanceTips : []),
      ];

      if (digestItems.length > 0) {
        const subject = `Your MyTech-Fix weekly device report`;
        const body = buildDigestEmailBody(name, digestItems, SITE_URL);
        const sent = await sendEmail(email, subject, body);
        if (sent) {
          emailedIds.push(...digestItems.map((n: { id: string }) => n.id));
          emailsSent++;
        }
      }
    }

    // Mark emailed notifications
    if (emailedIds.length > 0) {
      await supabase
        .from('device_notifications')
        .update({ email_sent: true, email_sent_at: new Date().toISOString() })
        .in('id', emailedIds);
    }

    await logJob(supabase, jobName, 'success', emailsSent);
    return new Response(JSON.stringify({ ok: true, emailsSent }), { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[${jobName}]`, msg);
    await logJob(supabase, jobName, 'error', emailsSent, msg);
    return new Response(JSON.stringify({ ok: false, error: msg }), { status: 500 });
  }
});

// TODO: Replace this with your email provider's SDK
async function sendEmail(_to: string, _subject: string, _htmlBody: string): Promise<boolean> {
  // Example Resend implementation:
  // const res = await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     from: 'MyTech-Fix <alerts@mytech-fix.com>',
  //     to: _to,
  //     subject: _subject,
  //     html: _htmlBody,
  //   }),
  // });
  // return res.ok;
  console.warn('[send-notification-emails] Email provider not configured. Skipping email to', _to);
  return false; // return true once email provider is configured
}

function buildSecurityEmailBody(
  name: string,
  alerts: Array<{ notification_type: string; device_brand: string; device_model: string; ai_summary: string; severity: string; id: string }>,
  siteUrl: string,
): string {
  const items = alerts
    .map((a) => `
      <div style="border-left:3px solid #ef4444;padding:12px 16px;margin-bottom:12px;background:#fef2f2;border-radius:4px">
        <strong style="color:#991b1b">${a.device_brand} ${a.device_model}</strong><br>
        <span style="color:#374151;font-size:14px">${a.ai_summary}</span>
      </div>`)
    .join('');

  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#111827;max-width:600px;margin:0 auto;padding:20px">
    <h1 style="font-size:20px;margin-bottom:4px">Security Alert</h1>
    <p style="color:#6b7280;margin-bottom:20px">Hi ${name}, action may be required for your devices.</p>
    ${items}
    <p style="margin-top:20px"><a href="${siteUrl}/chat" style="background:#3b82f6;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block">Get help from MyTech-Fix AI →</a></p>
    <p style="margin-top:30px;color:#9ca3af;font-size:12px">
      Manage notification preferences: <a href="${siteUrl}/account/notifications">${siteUrl}/account/notifications</a>
    </p>
  </body></html>`;
}

function buildDigestEmailBody(
  name: string,
  items: Array<{ notification_type: string; device_brand: string; device_model: string; ai_summary: string; id: string }>,
  siteUrl: string,
): string {
  const rows = items
    .map((n) => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb">
          <strong>${n.device_brand} ${n.device_model}</strong><br>
          <span style="color:#6b7280;font-size:13px">${n.ai_summary}</span>
        </td>
      </tr>`)
    .join('');

  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#111827;max-width:600px;margin:0 auto;padding:20px">
    <h1 style="font-size:20px;margin-bottom:4px">Your Weekly Device Report</h1>
    <p style="color:#6b7280;margin-bottom:20px">Hi ${name}, here's what we found this week.</p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
      ${rows}
    </table>
    <p style="margin-top:20px"><a href="${siteUrl}/chat" style="background:#3b82f6;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block">Chat with MyTech-Fix AI →</a></p>
    <p style="margin-top:30px;color:#9ca3af;font-size:12px">
      Manage preferences: <a href="${siteUrl}/account/notifications">${siteUrl}/account/notifications</a>
    </p>
  </body></html>`;
}

async function logJob(
  supabase: ReturnType<typeof createClient>,
  jobName: string,
  status: 'success' | 'partial' | 'error',
  notificationsSent: number,
  errorMessage?: string,
) {
  await supabase.from('maintenance_job_logs').insert({
    job_name: jobName,
    status,
    devices_processed: 0,
    notifications_sent: notificationsSent,
    error_message: errorMessage ?? null,
  });
}
