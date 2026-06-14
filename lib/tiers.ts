/**
 * Single source of truth for all plan/tier logic in MyTech-Fix.
 * Used by: chat enforcement, dashboard display, pricing, API prompts, upgrade flows.
 *
 * IMPORTANT: This is the ONLY place limits and labels should be defined.
 */

export type Tier = 'free_trial' | 'single_use' | 'home' | 'home_pro' | 'business' | 'business_plus';

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
    limit: 3,
    imageLimit: 0,
    diagnosticLimit: 1,
    price: '0',
    period: 'one-time',
    features: [
      '3 troubleshooting sessions',
      'Basic device & IoT help',
      'Image & screenshot analysis',
      '1 automated diagnostic run',
      'General cybersecurity guidance (with professional referral)',
    ],
    promptStyle: 'concise',
  },
  single_use: {
    key: 'single_use',
    label: 'Quick Fix Pack',
    limit: 5,
    imageLimit: 1,
    diagnosticLimit: 1,
    price: '7.99',
    period: 'one-time',
    features: [
      '5 troubleshooting sessions',
      'Full IoT & smart home support',
      'Image & screenshot analysis',
      '1 AI-generated diagram',
      '1 automated diagnostic run',
      'General cybersecurity guidance (with professional referral)',
    ],
    promptStyle: 'concise',
  },
  home: {
    key: 'home',
    label: 'Home',
    limit: 9999,
    imageLimit: 10,
    diagnosticLimit: 10,
    price: '9.99',
    period: 'per month',
    description: 'Best for individuals & families',
    features: [
      'Unlimited chats',
      'Image & screenshot analysis',
      '10 AI-generated diagrams / month',
      '10 automated diagnostics / month',
      'Detailed how-to guidance',
      'Productivity app support (Excel, Word)',
      'Full chat history',
      'General cybersecurity guidance (with professional referral)',
    ],
    promptStyle: 'detailed',
  },
  home_pro: {
    key: 'home_pro',
    label: 'Home Pro',
    limit: 9999,
    imageLimit: 30,
    diagnosticLimit: 30,
    price: '19.99',
    period: 'per month',
    description: 'Power users & home offices',
    features: [
      'Unlimited chats',
      'Image & screenshot analysis',
      '30 AI-generated diagrams / month',
      '30 automated diagnostics / month',
      'Priority AI responses',
      'Productivity app support (Excel, Word)',
      'Full chat history + CSV export',
      'General cybersecurity guidance (with professional referral)',
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
    description: 'IT support for up to 5 team members',
    features: [
      'Up to 5 seats',
      'Unlimited chats for the whole team',
      'Shared history & device inventory',
      '50 AI-generated diagrams / month',
      '50 automated diagnostics / month',
      'Admin dashboard & usage reports',
      'Multi-location support',
      'Advanced productivity + workflow assistance',
      'General cybersecurity guidance (with professional referral)',
    ],
    promptStyle: 'rich',
  },
  business_plus: {
    key: 'business_plus',
    label: 'Business Plus',
    limit: 9999,
    imageLimit: 150,
    diagnosticLimit: 150,
    price: '49.99',
    period: 'per month',
    description: 'IT support for up to 15 team members',
    features: [
      'Up to 15 seats',
      'Unlimited chats for the whole team',
      'Shared history & device inventory',
      '150 AI-generated diagrams / month',
      '150 automated diagnostics / month',
      'Admin dashboard & usage reports',
      'Usage analytics per team member',
      'Multi-location support',
      'Export conversation history',
      'Advanced productivity + workflow assistance',
      'General cybersecurity guidance (with professional referral)',
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
  return tier === 'home' || tier === 'home_pro' || tier === 'business' || tier === 'business_plus';
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
  home_pro: 'home_pro',
  business: 'business',
  business_plus: 'business_plus',
};

/** Reverse map (for upgrade links etc.) */
export function getPricingPlanKey(tier: Tier): string {
  const reverse: Record<Tier, string> = {
    free_trial: 'free',
    single_use: 'single',
    home: 'home',
    home_pro: 'home_pro',
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
  return ['home', 'home_pro', 'business', 'business_plus'].includes(t);
}

/** Get the automated diagnostics run limit for a tier */
export function getDiagnosticLimit(tier: string | null | undefined): number {
  const t = (tier as Tier) || 'free_trial';
  return TIERS[t]?.diagnosticLimit ?? 1;
}

/** Whether the tier uses monthly resets for diagnostics (subscriptions) or lifetime total (one-time) */
export function isMonthlyDiagnosticLimit(tier: string | null | undefined): boolean {
  const t = (tier as Tier) || 'free_trial';
  return ['home', 'home_pro', 'business', 'business_plus'].includes(t);
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
  home_pro: 3,
  business: 4,
  business_plus: 5,
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
