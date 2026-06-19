import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// IMPORTANT: Use SERVICE ROLE key here only (bypasses RLS). Never expose to browser.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
]);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return new NextResponse('Missing signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = (session.metadata?.plan as string) || 'home';
        const isImagePack = session.metadata?.isImagePack === 'true';

        if (!userId) break;

        if (isImagePack) {
          // Credit images by reducing images_used (packs add credit)
          const packMap: Record<string, number> = {
            images_20: 20,
            images_50: 50,
            images_100: 100,
          };
          const credit = packMap[plan] || 0;

          if (credit > 0) {
            // Get current (include tier for potential user_tiers upsert)
            const { data: prof } = await supabaseAdmin
              .from('profiles')
              .select('images_used, tier')
              .eq('id', userId)
              .single();

            const currentUsed = prof?.images_used || 0;
            const newUsed = Math.max(0, currentUsed - credit);
            const currentTier = prof?.tier || 'free_trial';

            await supabaseAdmin
              .from('profiles')
              .update({
                images_used: newUsed,
                updated_at: new Date().toISOString(),
              })
              .eq('id', userId);

            // Sync user_tiers (upsert in case row is missing; include tier as safe default)
            await supabaseAdmin
              .from('user_tiers')
              .upsert({
                user_id: userId,
                tier: currentTier,
                images_used: newUsed,
                updated_at: new Date().toISOString(),
              });

            console.log(`[Stripe] Credited ${credit} images to user ${userId} via ${plan}`);
          }
        } else {
          // Existing plan upgrade logic
          const tierMap: Record<string, string> = {
            single: 'single_use',
            home: 'home',
            home_pro: 'home_pro',
            business: 'business',
            business_plus: 'business_plus',
          };

          const newTier = tierMap[plan] || 'home';

          await supabaseAdmin
            .from('profiles')
            .update({
              tier: newTier,
              sessions_used: 0,
              stripe_customer_id: session.customer as string | null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          // Sync to user_tiers for consistency (upsert creates row if missing)
          await supabaseAdmin
            .from('user_tiers')
            .upsert({
              user_id: userId,
              tier: newTier,
              sessions_used: 0,
              updated_at: new Date().toISOString(),
            });

          console.log(`[Stripe] Upgraded user ${userId} to ${plan}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        // Downgrade on cancel. We use 'single_use' as a safe paid entry-level tier
        // instead of free_trial (which has very strict limits). Customize as needed for your admin accounts.
        // For true admin accounts that were manually set to high tiers (e.g. business_plus), 
        // consider adding a "tier_locked" boolean column to profiles and skipping downgrade if true,
        // or checking if the user owns any teams.
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', sub.customer as string)
          .single();

        if (profile) {
          await supabaseAdmin
            .from('profiles')
            .update({ tier: 'single_use', updated_at: new Date().toISOString() })
            .eq('id', profile.id);

          // Also sync user_tiers to prevent inconsistency (upsert for safety)
          await supabaseAdmin
            .from('user_tiers')
            .upsert({
              user_id: profile.id,
              tier: 'single_use',
              updated_at: new Date().toISOString(),
            });
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;

        // Only reset usage on recurring renewals — the initial charge is already
        // handled by checkout.session.completed, so double-processing is skipped.
        if (invoice.billing_reason !== 'subscription_cycle') break;

        const customerId = invoice.customer as string;
        if (!customerId) break;

        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!profile) {
          console.warn(`[Stripe] invoice.paid: no profile for customer ${customerId}`);
          break;
        }

        const now = new Date().toISOString();

        await supabaseAdmin
          .from('profiles')
          .update({
            sessions_used: 0,
            images_used: 0,
            diagnostics_used: 0,
            image_reset_date: now,
            diagnostic_reset_date: now,
            updated_at: now,
          })
          .eq('id', profile.id);

        await supabaseAdmin
          .from('user_tiers')
          .upsert({
            user_id: profile.id,
            sessions_used: 0,
            images_used: 0,
            diagnostics_used: 0,
            image_reset_date: now,
            diagnostic_reset_date: now,
            updated_at: now,
          });

        console.log(`[Stripe] Renewal reset for user ${profile.id} (customer ${customerId})`);
        break;
      }

      default:
        console.log(`Unhandled relevant event: ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    // Still return 200 to Stripe so it doesn't retry forever on our bugs
    return NextResponse.json({ error: 'Handler error (logged)' }, { status: 200 });
  }

  return NextResponse.json({ received: true });
}
