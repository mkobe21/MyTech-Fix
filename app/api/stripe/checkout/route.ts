import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { stripe } from '@/lib/stripe';

// Map our internal plan keys to Stripe Price IDs (user must create these in Stripe dashboard)
const PRICE_MAP: Record<string, string> = {
  single:        process.env.STRIPE_PRICE_SINGLE        || 'price_single_placeholder',
  home:          process.env.STRIPE_PRICE_HOME          || 'price_home_placeholder',
  home_pro:      process.env.STRIPE_PRICE_HOME_PRO      || 'price_home_pro_placeholder',
  business:      process.env.STRIPE_PRICE_BUSINESS      || 'price_business_placeholder',
  business_plus: process.env.STRIPE_PRICE_BUSINESS_PLUS || 'price_business_plus_placeholder',
  // Image packs (one-time purchases)
  images_20:  process.env.STRIPE_PRICE_IMAGES_20  || 'price_images_20_placeholder',
  images_50:  process.env.STRIPE_PRICE_IMAGES_50  || 'price_images_50_placeholder',
  images_100: process.env.STRIPE_PRICE_IMAGES_100 || 'price_images_100_placeholder',
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan = 'home' } = await request.json();

    const isImagePack = plan.startsWith('images_');
    const validPlans = ['single', 'home', 'home_pro', 'business', 'business_plus', 'images_20', 'images_50', 'images_100'];

    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan or pack' }, { status: 400 });
    }

    const priceId = PRICE_MAP[plan];
    if (priceId.includes('placeholder')) {
      return NextResponse.json(
        { error: 'Stripe price IDs not configured. Add STRIPE_PRICE_* to env.' },
        { status: 500 }
      );
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: isImagePack || plan === 'single' ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.nextUrl.origin}/dashboard?${isImagePack ? 'images_purchased=' + plan : 'upgraded=' + plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      customer_email: user.email || undefined,
      metadata: {
        userId: user.id,
        plan,
        isImagePack: isImagePack ? 'true' : 'false',
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
