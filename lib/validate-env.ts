/**
 * Lightweight server-side env validation for MyTech-Fix.
 * Call early (e.g. in middleware or top of critical API routes) to fail fast
 * with actionable messages instead of opaque crashes on missing ! assertions.
 *
 * This does NOT eliminate all non-null assertions in one pass (many are spread
 * across client bundles too), but provides a central place and clear startup errors.
 */

export type EnvCheckResult = {
  ok: boolean;
  missingRequired: string[];
  warnings: string[];
};

const REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

const AI_CHAT = ['GROK_API_KEY', 'XAI_API_KEY'] as const; // at least one for chat
const AI_IMAGE = ['OPENAI_API_KEY', 'XAI_API_KEY', 'GROK_API_KEY'] as const; // at least one recommended

const STRIPE = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
] as const;

export function validateServerEnv(): EnvCheckResult {
  const missingRequired: string[] = [];
  const warnings: string[] = [];

  for (const key of REQUIRED) {
    if (!process.env[key]) missingRequired.push(key);
  }

  // AI for chat (soft — app can still boot but chat will 401/500)
  const hasChatKey = AI_CHAT.some(k => !!process.env[k]);
  if (!hasChatKey) {
    warnings.push('No GROK_API_KEY or XAI_API_KEY found. Chat and diagnostics analysis will fail.');
  }

  // Image gen (very nice to have)
  const hasImageKey = AI_IMAGE.some(k => !!process.env[k]);
  if (!hasImageKey) {
    warnings.push('No image generation key (OPENAI_API_KEY or XAI_API_KEY/GROK_API_KEY). Visual aids will be disabled.');
  }

  // Stripe (billing flows will error gracefully with clear messages today)
  for (const key of STRIPE) {
    if (!process.env[key]) warnings.push(`${key} not set — Stripe checkout/portal/webhook will not work.`);
  }

  // Warn on placeholder price IDs (common source of 500s)
  const priceKeys = [
    'STRIPE_PRICE_SINGLE',
    'STRIPE_PRICE_HOME',
    'STRIPE_PRICE_BUSINESS',
    'STRIPE_PRICE_IMAGES_20',
    'STRIPE_PRICE_IMAGES_50',
    'STRIPE_PRICE_IMAGES_100',
  ];
  for (const pk of priceKeys) {
    const v = process.env[pk];
    if (!v || v.includes('placeholder')) {
      warnings.push(`${pk} is missing or still a placeholder. Set real Stripe Price IDs.`);
    }
  }

  return {
    ok: missingRequired.length === 0,
    missingRequired,
    warnings,
  };
}

export function assertServerEnv() {
  const result = validateServerEnv();
  if (!result.ok) {
    const msg = `Missing required environment variables: ${result.missingRequired.join(', ')}. Copy .env.example to .env.local and restart.`;
    // Throw so it surfaces immediately on server boot / first request hitting middleware
    throw new Error(msg);
  }
  // Log warnings once at startup (non-fatal)
  if (result.warnings.length > 0 && process.env.NODE_ENV !== 'test') {
    console.warn('[env] Non-fatal configuration warnings:\n  ' + result.warnings.join('\n  '));
  }
}
