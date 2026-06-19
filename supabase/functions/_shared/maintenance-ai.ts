// Deno-compatible version of lib/maintenance-ai.ts for use in Edge Functions.

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
  cveId?: string;
  cveSeverity?: string;
  cveDescription?: string;
  patchVersion?: string;
  eolDate?: string;
  replacementSuggestion?: string;
  currentSpeed?: number;
  planSpeed?: number;
  baselineSpeed?: number;
  dnsServer?: string;
  purchaseDate?: string;
  warrantyMonths?: number;
}

const PROMPTS: Record<MaintenanceNotificationType, (ctx: MaintenanceSummaryContext) => string> = {
  firmware_update: (ctx) =>
    `Write a 2-3 sentence plain-English notification for a home user. Their ${ctx.deviceBrand} ${ctx.deviceModel} has a firmware update available: version ${ctx.latestVersion}${ctx.releaseDate ? ` (released ${ctx.releaseDate})` : ''}. Explain why they should install it. Keep it friendly and non-technical. End with one sentence on how to install it.`,

  cve: (ctx) =>
    `Write a 2-3 sentence plain-English security alert for a home user. Their ${ctx.deviceBrand} ${ctx.deviceModel} has a ${ctx.cveSeverity} severity vulnerability (${ctx.cveId}): ${ctx.cveDescription}.${ctx.patchVersion ? ` Firmware version ${ctx.patchVersion} fixes this.` : ''} Explain the risk plainly and give one clear action step. ${ctx.cveSeverity === 'critical' || ctx.cveSeverity === 'high' ? 'Convey urgency.' : ''}`,

  eol_warning: (ctx) =>
    `Write a 2-3 sentence plain-English notification for a home user. Their ${ctx.deviceBrand} ${ctx.deviceModel} reaches end of support on ${ctx.eolDate}.${ctx.replacementSuggestion ? ` A popular replacement is ${ctx.replacementSuggestion}.` : ''} Explain what EOL means (no more security patches) without alarming them — they have time to plan.`,

  eol_final: (ctx) =>
    `Write a 2-3 sentence plain-English notification for a home user. Their ${ctx.deviceBrand} ${ctx.deviceModel} has reached end of manufacturer support${ctx.eolDate ? ` on ${ctx.eolDate}` : ''}.${ctx.replacementSuggestion ? ` Consider replacing it with ${ctx.replacementSuggestion}.` : ''} Explain the security risk and what they should do now.`,

  password_hygiene: (ctx) =>
    `Write 1-2 sentences plain-English reminding a home user that their ${ctx.deviceBrand} ${ctx.deviceModel} may still use its factory default admin password. Explain the risk and what to do. Keep it simple.`,

  dns_security: (ctx) =>
    `Write 2 sentences plain-English for a home user. Their network uses the ISP's default DNS${ctx.dnsServer ? ` (${ctx.dnsServer})` : ''}. Recommend switching to Cloudflare (1.1.1.1) or Google (8.8.8.8) for speed and privacy, and say how to do it on their router.`,

  wifi_degradation: (ctx) => {
    const speedPart = ctx.currentSpeed && ctx.planSpeed
      ? `Current average: ${ctx.currentSpeed} Mbps vs. ${ctx.planSpeed} Mbps plan speed.`
      : ctx.currentSpeed && ctx.baselineSpeed
      ? `Current 7-day average: ${ctx.currentSpeed} Mbps, down from 30-day average of ${ctx.baselineSpeed} Mbps.`
      : 'Network performance has dropped noticeably.';
    return `Write 2-3 sentences plain-English for a home user. Their home network performance has dropped: ${speedPart} Suggest 2 likely causes and one immediate thing they can check.`;
  },

  speed_vs_plan: (ctx) =>
    `Write 2-3 sentences plain-English for a home user. Their measured speed (${ctx.currentSpeed} Mbps) is significantly below their ${ctx.planSpeed} Mbps ISP plan. Give one likely explanation and one actionable step.`,

  battery_reminder: (ctx) =>
    `Write 1-2 sentences friendly reminder for a home user to check or replace the battery in their ${ctx.deviceBrand} ${ctx.deviceModel}. Keep it brief and practical.`,

  warranty_expiry: (ctx) =>
    `Write 1-2 sentences reminding a home user that the warranty on their ${ctx.deviceBrand} ${ctx.deviceModel} is expiring soon. Tell them what to do before it expires.`,

  all_clear: (ctx) =>
    `Write a single friendly sentence confirming the user's ${ctx.deviceBrand} ${ctx.deviceModel} appears up to date with no pending security or firmware issues.`,
};

export async function generateMaintenanceSummary(
  type: MaintenanceNotificationType,
  context: MaintenanceSummaryContext,
  anthropicApiKey: string,
): Promise<string> {
  const prompt = PROMPTS[type]?.(context);
  if (!prompt) return fallbackSummary(type, context);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        system: 'You write short, friendly maintenance notifications for home tech users. Max 100 words. Plain English only — no jargon. Always end with one concrete action step. Never use markdown or bullet points.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) return fallbackSummary(type, context);
    const data = await res.json();
    const text = data?.content?.[0]?.text?.trim();
    return text || fallbackSummary(type, context);
  } catch {
    return fallbackSummary(type, context);
  }
}

export function fallbackSummary(type: MaintenanceNotificationType, ctx: MaintenanceSummaryContext): string {
  const device = `${ctx.deviceBrand} ${ctx.deviceModel}`;
  switch (type) {
    case 'firmware_update':
      return `A firmware update (${ctx.latestVersion ?? 'unknown version'}) is available for your ${device}. Check the manufacturer app or admin panel to install it.`;
    case 'cve':
      return `A ${ctx.cveSeverity ?? ''} security vulnerability (${ctx.cveId ?? ''}) affects your ${device}. ${ctx.patchVersion ? `Update to firmware ${ctx.patchVersion} to resolve it.` : 'Check the manufacturer website for a security patch.'}`;
    case 'eol_warning':
      return `Your ${device} is approaching end of manufacturer support${ctx.eolDate ? ` on ${ctx.eolDate}` : ''}. Plan to replace it before then to avoid unpatched security risks.`;
    case 'eol_final':
      return `Your ${device} has reached end of manufacturer support and will no longer receive security updates. Consider replacing it soon.`;
    case 'password_hygiene':
      return `Your ${device} may still use its factory default admin password. Log into the device admin panel and change it to a unique password.`;
    case 'dns_security':
      return `Your network uses an ISP default DNS server. Switching to Cloudflare (1.1.1.1) or Google (8.8.8.8) improves speed and privacy. Update this in your router's WAN settings.`;
    case 'wifi_degradation':
      return `Your network performance has dropped. Try restarting your router and checking for interference from neighboring networks.`;
    case 'speed_vs_plan':
      return `Your measured speeds (${ctx.currentSpeed ?? '?'} Mbps) are below your plan speed (${ctx.planSpeed ?? '?'} Mbps). Try a restart, then contact your ISP if it persists.`;
    case 'battery_reminder':
      return `It may be time to replace or check the battery in your ${device}. Check the manufacturer app for current battery level.`;
    case 'warranty_expiry':
      return `The warranty on your ${device} is expiring soon. Document any issues and contact support before it ends.`;
    case 'all_clear':
      return `Your ${device} is up to date with no pending security or firmware issues.`;
    default:
      return `Action recommended for your ${device}. Check the MyTech-Fix app for details.`;
  }
}
