import Stripe from 'stripe';

// Lazy server-only Stripe client (avoids build-time instantiation without env vars)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    // Pinned API version. If you see "dahlia" or future-dated versions in your account, update to a stable
    // version listed at https://stripe.com/docs/upgrades (e.g. a 2025- or 2026-YY-MM version).
    // Current value chosen at project time; change deliberately and test webhooks + checkout after update.
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    });
  }
  return _stripe;
}

// For convenience in most routes
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});

export type { Stripe };
