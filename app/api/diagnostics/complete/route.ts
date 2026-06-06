import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

/**
 * Completes a previously started diagnostic run by saving the client-computed results.
 * The quota was already reserved in /start.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, results, overall_status, summary } = body || {};

    if (!id || !results) {
      return NextResponse.json({ error: 'Missing id or results' }, { status: 400 });
    }

    // Update the skeleton row (RLS ensures only owner can touch it)
    const { error: updateErr } = await supabase
      .from('user_diagnostics')
      .update({
        results,
        overall_status: overall_status || results.overall || 'unknown',
        summary: summary || null,
        // tier_at_run already set at start
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (updateErr) {
      console.error('Failed to complete diagnostic run:', updateErr);
      return NextResponse.json({ error: 'Failed to save diagnostic results.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Diagnostics complete API error:', error);
    return NextResponse.json({ error: 'Unexpected error completing diagnostics.' }, { status: 500 });
  }
}
