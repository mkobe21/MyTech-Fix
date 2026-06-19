// Generates plain-English maintenance notification summaries via Claude.
// Used by Next.js API routes. Edge Functions use supabase/functions/_shared/maintenance-ai.ts.

export type MaintenanceNotificationType =
  | 'firmware_update'
  | 'cve'
  | 'eol_warning'
  | 'eol_final'
  | 'password_hygiene'
  | 'dns_security'
  | 'wifi_degradation'
  | 'battery_reminder'
  | 'warranty_expiry'
  | 'speed_vs_plan'
  | 'all_clear';

export interface MaintenanceSummaryContext {
  deviceBrand: string;
  deviceModel: string;
  currentVersion?: string;
  latestVersion?: string;
  releaseDate?: string;
  releaseNotesUrl?: string;
  cveId?: string;
  cveSeverity?: string;
  cveDescription?: string;
  patchVersion?: string;
  eolDate?: string;
  replacementSuggestion?: string;
  currentSpeed?: number;
  planSpeed?: number;
  baselineSpeed?: number;
  latencyAvg?: number;
  dnsServer?: string;
  purchaseDate?: string;
  warrantyMonths?: number;
}

const PROMPTS: Record<MaintenanceNotificationType, (ctx: MaintenanceSummaryContext) => string> = {
  firmware_update: (ctx) =>
    `Write a 2-3 sentence plain-English notification for a home user. Their ${ctx.deviceBrand} ${ctx.deviceModel} has a firmware update available: version ${ctx.latestVersion}${ctx.releaseDate ? ` (released ${ctx.releaseDate})` : ''}. Explain what this update likely means for them and why they should install it. Keep it friendly and non-technical. End with one sentence about how to install it on this specific device.`,

  cve: (ctx) =>
    `Write a 2-3 sentence plain-English security alert for a home user. Their ${ctx.deviceBrand} ${ctx.deviceModel} has a ${ctx.cveSeverity} severity security vulnerability (${ctx.cveId}): ${ctx.cveDescription}.${ctx.patchVersion ? ` A firmware update to version ${ctx.patchVersion} fixes this.` : ''} Explain the risk in plain language without causing panic, and give one clear action step. ${ctx.cveSeverity === 'critical' || ctx.cveSeverity === 'high' ? 'Convey appropriate urgency.' : ''}`,

  eol_warning: (ctx) =>
    `Write a 2-3 sentence plain-English notification for a home user. Their ${ctx.deviceBrand} ${ctx.deviceModel} will reach end of manufacturer support on ${ctx.eolDate}.${ctx.replacementSuggestion ? ` A popular replacement is ${ctx.replacementSuggestion}.` : ''} Explain what EOL means practically (no more security patches) without being alarmist. They have time to plan.`,

  eol_final: (ctx) =>
    `Write a 2-3 sentence plain-English notification for a home user. Their ${ctx.deviceBrand} ${ctx.deviceModel} has reached or is about to reach end of manufacturer support${ctx.eolDate ? ` on ${ctx.eolDate}` : ''}.${ctx.replacementSuggestion ? ` Consider replacing it with ${ctx.replacementSuggestion}.` : ''} Explain clearly why an unsupported device poses a security risk and what they should do now.`,

  password_hygiene: (ctx) =>
    `Write a 1-2 sentence plain-English reminder for a home user that their ${ctx.deviceBrand} ${ctx.deviceModel} may still be using its factory default admin password. Explain why this is a risk and what to do. Keep it simple and non-technical.`,

  dns_security: (ctx) =>
    `Write 2 sentences plain-English for a home user. Their network is using their ISP's default DNS server${ctx.dnsServer ? ` (${ctx.dnsServer})` : ''}. Explain the benefit of switching to a faster and more private DNS like Cloudflare (1.1.1.1) or Google (8.8.8.8), and how to do it on their router. Keep it friendly and actionable.`,

  wifi_degradation: (ctx) => {
    const speedPart = ctx.currentSpeed && ctx.planSpeed
      ? `Current average: ${ctx.currentSpeed} Mbps vs. ${ctx.planSpeed} Mbps on their plan.`
      : ctx.currentSpeed && ctx.baselineSpeed
      ? `Current 7-day average: ${ctx.currentSpeed} Mbps, down from a 30-day average of ${ctx.baselineSpeed} Mbps.`
      : 'Network performance has dropped noticeably.';
    return `Write a 2-3 sentence plain-English notification for a home user. Their home network performance has dropped: ${speedPart} Suggest 2 likely causes specific to this kind of degradation pattern and one immediate thing they can check.`;
  },

  speed_vs_plan: (ctx) =>
    `Write a 2-3 sentence plain-English notification for a home user. Their measured internet speed (${ctx.currentSpeed} Mbps average) is significantly below their ISP plan speed of ${ctx.planSpeed} Mbps. Give one likely explanation and one actionable first step — either a quick self-fix or advice on contacting their ISP.`,

  battery_reminder: (ctx) =>
    `Write a 1-2 sentence friendly reminder for a home user that it may be time to check or replace the battery in their ${ctx.deviceBrand} ${ctx.deviceModel}. Keep it brief and practical.`,

  warranty_expiry: (ctx) =>
    `Write a 1-2 sentence plain-English reminder for a home user that the manufacturer warranty on their ${ctx.deviceBrand} ${ctx.deviceModel} is expiring soon. Mention what they should do before it expires (document any issues, contact support if needed).`,

  all_clear: (ctx) =>
    `Write a single friendly sentence confirming that the user's ${ctx.deviceBrand} ${ctx.deviceModel} (and their other monitored devices if relevant) appear to be up to date with no pending security or firmware issues. Keep it positive and brief.`,
};

export async function generateMaintenanceSummary(
  type: MaintenanceNotificationType,
  context: MaintenanceSummaryContext,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[maintenance-ai] ANTHROPIC_API_KEY not set — returning fallback summary');
    return fallbackSummary(type, context);
  }

  const prompt = PROMPTS[type]?.(context);
  if (!prompt) return fallbackSummary(type, context);

  const systemPrompt =
    'You write short, friendly maintenance notifications for home tech users. ' +
    'Max 100 words. Plain English only — no jargon. ' +
    'Always end with one concrete action step. Never use markdown or bullet points.';

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error('[maintenance-ai] Claude API error:', res.status, await res.text());
      return fallbackSummary(type, context);
    }

    const data = await res.json();
    const text = data?.content?.[0]?.text?.trim();
    return text || fallbackSummary(type, context);
  } catch (err) {
    console.error('[maintenance-ai] fetch error:', err);
    return fallbackSummary(type, context);
  }
}

function fallbackSummary(type: MaintenanceNotificationType, ctx: MaintenanceSummaryContext): string {
  const device = `${ctx.deviceBrand} ${ctx.deviceModel}`;
  switch (type) {
    case 'firmware_update':
      return `A firmware update (version ${ctx.latestVersion ?? 'unknown'}) is available for your ${device}. Check the manufacturer app or admin panel to install it.`;
    case 'cve':
      return `A ${ctx.cveSeverity ?? ''} security vulnerability (${ctx.cveId ?? ''}) has been found affecting the ${device}. ${ctx.patchVersion ? `Update to firmware version ${ctx.patchVersion} to resolve it.` : 'Check the manufacturer website for a security patch.'}`;
    case 'eol_warning':
      return `Your ${device} is approaching end of manufacturer support${ctx.eolDate ? ` on ${ctx.eolDate}` : ''}. Plan to replace it before that date to avoid unpatched security risks.`;
    case 'eol_final':
      return `Your ${device} has reached end of manufacturer support and will no longer receive security updates. Consider replacing it soon.`;
    case 'password_hygiene':
      return `Your ${device} may still be using its default admin password. Log into the device admin panel and change it to a unique password.`;
    case 'dns_security':
      return `Your network is using an ISP default DNS server. Switching to Cloudflare (1.1.1.1) or Google (8.8.8.8) can improve speed and privacy. Update this in your router's WAN settings.`;
    case 'wifi_degradation':
      return `Your network performance has dropped compared to your baseline. Try restarting your router and checking for interference from neighboring networks.`;
    case 'speed_vs_plan':
      return `Your measured speeds (${ctx.currentSpeed ?? '?'} Mbps) are significantly below your plan speed (${ctx.planSpeed ?? '?'} Mbps). Try a restart, then contact your ISP if the issue persists.`;
    case 'battery_reminder':
      return `It may be time to replace or check the battery in your ${device}. Check the manufacturer app for current battery level.`;
    case 'warranty_expiry':
      return `The warranty on your ${device} is expiring soon. Document any existing issues and contact support before the warranty ends.`;
    case 'all_clear':
      return `Your ${device} is up to date with no pending security or firmware issues.`;
    default:
      return `Action recommended for your ${device}. Check the MyTech-Fix app for details.`;
  }
}
