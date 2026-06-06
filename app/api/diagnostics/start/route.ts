import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getDiagnosticLimit, isMonthlyDiagnosticLimit, type Tier } from '@/lib/tiers';

/**
 * Starts a diagnostic run (consumes 1 quota unit server-side).
 * Returns a skeleton record id that the client will complete after running the (expensive) client-side tests.
 * Strict server-side enforcement + monthly reset logic (copied/adapted from generate-image).
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const runType = (body.run_type as string) || 'full';

    // Fetch current usage/tier (prefer profiles, fallback user_tiers - same pattern as images)
    let profile: any = null;
    let t1: string | null = null;
    let t2: string | null = null;

    try {
      const res = await supabase
        .from('profiles')
        .select('tier, diagnostics_used, diagnostic_reset_date, sessions_used')
        .eq('id', user.id)
        .maybeSingle();
      profile = res.data;
      if (profile) t1 = profile.tier;
    } catch (e) { /* ignore */ }

    let utData: any = null;
    try {
      const { data: ut } = await supabase
        .from('user_tiers')
        .select('tier, diagnostics_used, diagnostic_reset_date')
        .eq('user_id', user.id)
        .maybeSingle();
      utData = ut;
      if (ut) t2 = ut.tier;
    } catch {}

    if (!profile && utData) {
      profile = utData;
    }

    if (!profile) {
      return NextResponse.json({ error: 'Could not load your diagnostic usage data.' }, { status: 500 });
    }

    const tier = (t1 as Tier) || (t2 as Tier) || 'free_trial';
    const isMonthly = isMonthlyDiagnosticLimit(tier);
    const limit = getDiagnosticLimit(tier);

    let currentUsed = profile.diagnostics_used || 0;
    const resetDate = profile.diagnostic_reset_date;

    // Server-side reset for monthly tiers (exact same logic as images)
    if (isMonthly && resetDate && new Date(resetDate) < new Date()) {
      const newReset = new Date();
      newReset.setMonth(newReset.getMonth() + 1);

      await supabase
        .from('profiles')
        .update({
          diagnostics_used: 0,
          diagnostic_reset_date: newReset.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      try {
        await supabase
          .from('user_tiers')
          .upsert({
            user_id: user.id,
            tier,
            diagnostics_used: 0,
            diagnostic_reset_date: newReset.toISOString(),
            updated_at: new Date().toISOString(),
          });
      } catch (resetSyncErr) {
        console.warn('Non-fatal: could not sync diagnostic reset to user_tiers:', resetSyncErr);
      }

      currentUsed = 0;
    }

    // Enforce limit strictly
    if (currentUsed >= limit) {
      const remaining = Math.max(0, limit - currentUsed);
      return NextResponse.json({
        error: `You've reached your ${limit} automated diagnostic run limit for this period.`,
        code: 'DIAGNOSTIC_LIMIT_REACHED',
        used: currentUsed,
        limit,
        remaining,
        tier,
        isMonthly,
      }, { status: 429 });
    }

    // Reserve the run (increment) + create skeleton record
    const newUsed = currentUsed + 1;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        diagnostics_used: newUsed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to reserve diagnostic run:', updateError);
      return NextResponse.json({ error: 'Failed to start diagnostic run.' }, { status: 500 });
    }

    // Keep user_tiers in sync (best effort)
    try {
      await supabase
        .from('user_tiers')
        .upsert({
          user_id: user.id,
          tier,
          diagnostics_used: newUsed,
          updated_at: new Date().toISOString(),
        });
    } catch (syncErr) {
      console.warn('Non-fatal: could not sync diagnostics_used to user_tiers:', syncErr);
    }

    // Create the run record (skeleton - results will be filled by /complete)
    const { data: newDiag, error: insertErr } = await supabase
      .from('user_diagnostics')
      .insert({
        user_id: user.id,
        run_type: runType,
        results: { status: 'running', startedAt: new Date().toISOString() },
        tier_at_run: tier,
      })
      .select('id')
      .single();

    if (insertErr || !newDiag) {
      console.error('Failed to create diagnostic run record:', insertErr);
      // best effort rollback of the count (non-critical)
      return NextResponse.json({ error: 'Failed to create diagnostic record.' }, { status: 500 });
    }

    const remaining = Math.max(0, limit - newUsed);

    return NextResponse.json({
      success: true,
      id: newDiag.id,
      used: newUsed,
      limit,
      remaining,
      tier,
    });
  } catch (error: any) {
    console.error('Diagnostics start API error:', error);
    return NextResponse.json({ error: 'Unexpected error starting diagnostics.' }, { status: 500 });
  }
}
