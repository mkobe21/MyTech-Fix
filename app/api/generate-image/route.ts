import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getImageLimit, isMonthlyImageLimit, type Tier } from '@/lib/tiers';
import { generateImage } from '@/lib/image-generation';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, context } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return NextResponse.json({ error: 'A detailed prompt is required for image generation.' }, { status: 400 });
    }

    // Fetch current usage/tier using highest tier from profiles or user_tiers
    let profile: any = null;
    let profileError: any = null;
    let t1: string | null = null;
    let t2: string | null = null;
    try {
      const res = await supabase
        .from('profiles')
        .select('tier, images_used, image_reset_date, sessions_used')
        .eq('id', user.id)
        .maybeSingle();
      profile = res.data;
      profileError = res.error;
      if (profile) t1 = profile.tier;
    } catch (e) { profileError = e; }

    let utData: any = null;
    try {
      const { data: ut } = await supabase
        .from('user_tiers')
        .select('tier, images_used, image_reset_date, sessions_used')
        .eq('user_id', user.id)
        .maybeSingle();
      utData = ut;
      if (ut) t2 = ut.tier;
    } catch {}

    if (!profile && utData) {
      profile = utData;
      profileError = null;
    }

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Could not load your usage data.' }, { status: 500 });
    }

    const tier = (t1 as Tier) || (t2 as Tier) || 'free_trial';
    const isMonthly = isMonthlyImageLimit(tier);
    const limit = getImageLimit(tier);

    let currentUsed = profile.images_used || 0;
    const resetDate = profile.image_reset_date;

    // Server-side reset for monthly tiers
    if (isMonthly && resetDate && new Date(resetDate) < new Date()) {
      // Reset
      const newReset = new Date();
      newReset.setMonth(newReset.getMonth() + 1);

      await supabase
        .from('profiles')
        .update({
          images_used: 0,
          image_reset_date: newReset.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      // Keep user_tiers in sync on reset too (upsert is safe)
      try {
        await supabase
          .from('user_tiers')
          .upsert({
            user_id: user.id,
            tier,
            images_used: 0,
            image_reset_date: newReset.toISOString(),
            updated_at: new Date().toISOString(),
          });
      } catch (resetSyncErr) {
        console.warn('Non-fatal: could not sync reset to user_tiers:', resetSyncErr);
      }

      currentUsed = 0;
    }

    // Enforce limit strictly (server-side)
    if (currentUsed >= limit) {
      const remaining = Math.max(0, limit - currentUsed);
      return NextResponse.json({
        error: `You've reached your ${limit} image limit for this period.`,
        code: 'IMAGE_LIMIT_REACHED',
        used: currentUsed,
        limit,
        remaining,
        tier,
        isMonthly,
      }, { status: 429 });
    }

    // Generate the image
    const fullPrompt = context 
      ? `${prompt}. Context from troubleshooting: ${context}` 
      : prompt;

    if (process.env.NODE_ENV !== 'production') {
      console.log('[generate-image] About to call image gen. OPENAI_API_KEY?', !!process.env.OPENAI_API_KEY, 'XAI_API_KEY?', !!process.env.XAI_API_KEY, 'GROK_API_KEY(fallback)?', !!process.env.GROK_API_KEY, 'XAI_IMAGE_MODEL=', process.env.XAI_IMAGE_MODEL || '(grok-imagine-image-quality)');
    }
    const imageUrl = await generateImage(fullPrompt);

    if (!imageUrl) {
      console.error('Image generation returned no URL for user', user.id, 'tier', tier, 'used', currentUsed, 'limit', limit);
      return NextResponse.json({ 
        error: 'Failed to generate image. For best results (accurate spelling + high quality diagrams), add OPENAI_API_KEY to .env.local (uses DALL-E 3 hd) and restart the server. Check server logs for provider details.',
        code: 'IMAGE_GEN_PROVIDER_FAILED'
      }, { status: 503 });
    }

    // Increment usage (server-side enforcement)
    const newUsed = currentUsed + 1;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        images_used: newUsed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to update image usage:', updateError);
      // Still return the image since generation succeeded, but log the issue
    }

    // Sync usage to user_tiers (upsert creates the row if missing for brand-new users,
    // using the tier we just resolved. Safe even without the signup trigger migration.)
    try {
      await supabase
        .from('user_tiers')
        .upsert({
          user_id: user.id,
          tier,
          images_used: newUsed,
          updated_at: new Date().toISOString(),
        });
    } catch (syncErr) {
      console.warn('Could not sync image usage to user_tiers (non-fatal):', syncErr);
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      used: newUsed,
      limit,
      remaining: Math.max(0, limit - newUsed),
      tier,
    });

  } catch (error: any) {
    console.error('Generate image API error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error generating image. Please try again.' 
    }, { status: 500 });
  }
}