/**
 * Single source of truth for all plan/tier logic in MyTech-Fix.
 * Used by: chat enforcement, dashboard display, pricing, API prompts, upgrade flows.
 *
 * IMPORTANT: This is the ONLY place limits and labels should be defined.
 */

export type Tier = 'free_trial' | 'single_use' | 'home' | 'business' | 'business_plus';

export interface TierConfig {
  key: Tier;
  label: string;
  limit: number;           // max sessions per period
  imageLimit: number;      // AI image generations: lifetime total for one-time tiers, per month for subscriptions
  diagnosticLimit: number; // automated diagnostic runs (full health checks). total for one-time tiers, per month for subscriptions
  price?: string;          // display only
  period?: string;
  description?: string;    // short marketing description for pricing page
  features: string[];
  promptStyle: 'concise' | 'detailed' | 'rich';
}

export const TIERS: Record<Tier, TierConfig> = {
  free_trial: {
    key: 'free_trial',
    label: 'Free Trial',
    limit: 5,
    imageLimit: 1,
    diagnosticLimit: 1,
    price: '0',
    period: 'one-time',
    features: [
      '5 troubleshooting sessions',
      'Basic IoT & device help',
      'Image analysis',
      'Limited how-to guidance',
      '1 AI-generated image total',
      '1 automated diagnostic run (speed, latency, packet loss, DNS, WiFi + WiFi Channel Scanner / interference analysis + MyTech-Fix AI analysis)',
      'General cybersecurity event awareness and high-level guidance (with professional referral)',
    ],
    promptStyle: 'concise',
  },
  single_use: {
    key: 'single_use',
    label: 'Single Use',
    limit: 10,
    imageLimit: 3,
    diagnosticLimit: 3,
    price: '9.99',
    period: 'per session',
    features: [
      '10 troubleshooting sessions',
      'Full IoT & smart home support',
      'Image analysis included',
      '3 AI-generated images total',
      'Basic productivity help',
      '3 automated diagnostic runs (speed, latency, packet loss, DNS, WiFi + WiFi Channel Scanner / interference analysis + MyTech-Fix AI analysis)',
      'General cybersecurity event awareness and high-level guidance (with professional referral)',
    ],
    promptStyle: 'concise',
  },
  home: {
    key: 'home',
    label: 'Home Plan',
    limit: 30,
    imageLimit: 10,
    diagnosticLimit: 10,
    price: '9.99',
    period: 'per month',
    features: [
      '30 chats per month',
      'Unlimited image analysis',
      '10 AI-generated images per month (diagrams, visuals, layouts)',
      'Detailed how-to guidance',
      'Productivity app support (Excel, Word)',
      'Priority responses',
      '10 automated diagnostic runs per month (speed, latency, packet loss, DNS, WiFi + WiFi Channel Scanner / interference analysis + MyTech-Fix AI analysis)',
      'General cybersecurity event guidance and awareness (with professional referral)',
    ],
    promptStyle: 'detailed',
  },
  business: {
    key: 'business',
    label: 'Small Business',
    limit: 9999,
    imageLimit: 50,
    diagnosticLimit: 50,
    price: '29.99',
    period: 'per month',
    description: 'IT Support for up to 5 Team Members',
    features: [
      'Up to 5 team members',
      'Unlimited chats for the whole team',
      'Team accounts & shared conversation history',
      'Business device inventory & tagging',
      'Advanced productivity + workflow assistance',
      '50 AI-generated images per month (diagrams, wiring, layouts)',
      'Priority + faster AI responses',
      'Admin dashboard with usage reports',
      'Multi-location & department support',
      '50 automated diagnostic runs per month (speed, latency, packet loss, DNS, WiFi + WiFi Channel Scanner / interference analysis + MyTech-Fix AI analysis)',
      'General cybersecurity event guidance, awareness, and team-oriented response basics (always with strong professional referral)',
    ],
    promptStyle: 'rich',
  },
  business_plus: {
    key: 'business_plus',
    label: 'Small Business Plus',
    limit: 9999,
    imageLimit: 100,
    diagnosticLimit: 100,
    price: '59.99',
    period: 'per month',
    description: 'IT Support for up to 15 Team Members',
    features: [
      'Up to 15 team members',
      'Unlimited chats for the whole team',
      'Team accounts & shared conversation history',
      'Business device inventory & tagging',
      'Advanced productivity + workflow assistance',
      '100 AI-generated images per month (diagrams, wiring, layouts)',
      'Priority + faster AI responses',
      'Admin dashboard with usage reports',
      'Multi-location & department support',
      'Usage analytics per team member',
      'Export conversation history',
      '100 automated diagnostic runs per month (speed, latency, packet loss, DNS, WiFi + WiFi Channel Scanner / interference analysis + MyTech-Fix AI analysis)',
      'General cybersecurity event guidance, awareness, and team-oriented response basics (always with strong professional referral)',
    ],
    promptStyle: 'rich',
  },
};

export const ALL_TIERS = Object.values(TIERS) as TierConfig[];

/** Returns the numeric limit for a tier (safe default = 5) */
export function getLimit(tier: string | null | undefined): number {
  const t = (tier as Tier) || 'free_trial';
  return TIERS[t]?.limit ?? 5;
}

/** Human-friendly label */
export function getTierLabel(tier: string | null | undefined): string {
  const t = (tier as Tier) || 'free_trial';
  return TIERS[t]?.label ?? 'Free Trial';
}

/** Remaining chats (clamped to >= 0) */
export function getRemaining(tier: string | null | undefined, used: number): number {
  return Math.max(0, getLimit(tier) - (used || 0));
}

/** Which prompt style the AI should use */
export function getPromptStyle(tier: string | null | undefined): TierConfig['promptStyle'] {
  const t = (tier as Tier) || 'free_trial';
  return TIERS[t]?.promptStyle ?? 'concise';
}

/** Is this a paid recurring plan? */
export function isPaidPlan(tier: string | null | undefined): boolean {
  return tier === 'home' || tier === 'business' || tier === 'business_plus';
}

/** Should we show upgrade CTAs for this tier? */
export function shouldShowUpgrade(tier: string | null | undefined): boolean {
  return tier === 'free_trial' || tier === 'single_use';
}

/** Map from pricing page plan param → internal tier key */
export const PRICING_PLAN_TO_TIER: Record<string, Tier> = {
  free: 'free_trial',
  single: 'single_use',
  home: 'home',
  business: 'business',
  business_plus: 'business_plus',
};

/** Reverse map (for upgrade links etc.) */
export function getPricingPlanKey(tier: Tier): string {
  const reverse: Record<Tier, string> = {
    free_trial: 'free',
    single_use: 'single',
    home: 'home',
    business: 'business',
    business_plus: 'business_plus',
  };
  return reverse[tier] || 'free';
}

/** Get the image generation limit for a tier */
export function getImageLimit(tier: string | null | undefined): number {
  const t = (tier as Tier) || 'free_trial';
  return TIERS[t]?.imageLimit ?? 0;
}

/** Whether the tier uses monthly resets (subscriptions) or lifetime total (one-time) */
export function isMonthlyImageLimit(tier: string | null | undefined): boolean {
  const t = (tier as Tier) || 'free_trial';
  return ['home', 'business', 'business_plus'].includes(t);
}

/** Get the automated diagnostics run limit for a tier */
export function getDiagnosticLimit(tier: string | null | undefined): number {
  const t = (tier as Tier) || 'free_trial';
  return TIERS[t]?.diagnosticLimit ?? 1;
}

/** Whether the tier uses monthly resets for diagnostics (subscriptions) or lifetime total (one-time) */
export function isMonthlyDiagnosticLimit(tier: string | null | undefined): boolean {
  const t = (tier as Tier) || 'free_trial';
  return ['home', 'business', 'business_plus'].includes(t);
}

/** Image pack products for "Buy More Images" (one-time Stripe purchases) */
export const IMAGE_PACKS: Record<string, { count: number; price: string; label: string }> = {
  pack_20: { count: 20, price: '3.99', label: '20 Extra Images' },
  pack_50: { count: 50, price: '8.99', label: '50 Extra Images' },
  pack_100: { count: 100, price: '15.99', label: '100 Extra Images' },
};

/** Internal rank so we can prefer the "highest" tier when profiles and user_tiers disagree
 * (helps admin/manual-restore accounts stay on business_plus even if a webhook downgraded one table).
 */
const TIER_RANK: Record<Tier, number> = {
  free_trial: 0,
  single_use: 1,
  home: 2,
  business: 3,
  business_plus: 4,
};

/** Pick the highest tier from two (possibly null) sources. Used for resilient display + gating. */
export function pickHighestTier(a: string | null | undefined, b: string | null | undefined): Tier {
  const ta = (a as Tier) || 'free_trial';
  const tb = (b as Tier) || 'free_trial';
  return (TIER_RANK[tb] > TIER_RANK[ta] ? tb : ta);
}

// ============================================================
// Shared server helper: authoritative tier + live usage snapshot
// ============================================================

export interface UserTierUsage {
  tier: Tier;
  sessionsUsed: number;
  imagesUsed: number;
  diagnosticsUsed: number;
  chatLimit: number;
  imageLimit: number;
  diagnosticLimit: number;
  imageResetDate: string | null;
  diagnosticResetDate: string | null;
  isUnlimitedChats: boolean;
}

/**
 * Single source for "what is this user's current tier (highest wins) and usage numbers".
 * Performs the profiles + user_tiers dual read + pickHighestTier.
 * Does NOT perform resets or increments (callers do that with the returned values).
 *
 * Use from server routes (pass a server Supabase client created via createSupabaseServerClient or supabaseAdmin).
 * Returns safe defaults for brand new / missing rows.
 */
export async function getUserTierAndUsage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any, // server client (SupabaseClient); any to avoid heavy import cycles / generated types requirement
  userId: string
): Promise<UserTierUsage> {
  let pTier: string | null = null;
  let pSessions = 0;
  let pImages = 0;
  let pDiags = 0;
  let pImageReset: string | null = null;
  let pDiagReset: string | null = null;

  let uTier: string | null = null;
  let uSessions = 0;
  let uImages = 0;
  let uDiags = 0;
  let uImageReset: string | null = null;
  let uDiagReset: string | null = null;

  try {
    const { data: prof } = await supabase
      .from('profiles')
      .select('tier, sessions_used, images_used, diagnostics_used, image_reset_date, diagnostic_reset_date')
      .eq('id', userId)
      .maybeSingle();
    if (prof) {
      pTier = prof.tier;
      pSessions = prof.sessions_used || 0;
      pImages = prof.images_used || 0;
      pDiags = prof.diagnostics_used || 0;
      pImageReset = prof.image_reset_date || null;
      pDiagReset = prof.diagnostic_reset_date || null;
    }
  } catch {}

  try {
    const { data: ut } = await supabase
      .from('user_tiers')
      .select('tier, sessions_used, images_used, diagnostics_used, image_reset_date, diagnostic_reset_date')
      .eq('user_id', userId)
      .maybeSingle();
    if (ut) {
      uTier = ut.tier;
      uSessions = ut.sessions_used || 0;
      uImages = ut.images_used || 0;
      uDiags = ut.diagnostics_used || 0;
      uImageReset = ut.image_reset_date || null;
      uDiagReset = ut.diagnostic_reset_date || null;
    }
  } catch {}

  const resolvedTier = pickHighestTier(pTier, uTier);
  const sessionsUsed = Math.max(pSessions, uSessions); // take the higher observed (defensive)
  const imagesUsed = Math.max(pImages, uImages);
  const diagnosticsUsed = Math.max(pDiags, uDiags);

  // Prefer a non-null reset date from either source
  const imageResetDate = pImageReset || uImageReset || null;
  const diagnosticResetDate = pDiagReset || uDiagReset || null;

  const chatLimit = getLimit(resolvedTier);
  const imageLimit = getImageLimit(resolvedTier);
  const diagnosticLimit = getDiagnosticLimit(resolvedTier);

  return {
    tier: resolvedTier,
    sessionsUsed,
    imagesUsed,
    diagnosticsUsed,
    chatLimit,
    imageLimit,
    diagnosticLimit,
    imageResetDate,
    diagnosticResetDate,
    isUnlimitedChats: chatLimit >= 9999,
  };
}
