import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if this email has already claimed a free trial
    const { data: claim, error } = await supabaseAdmin
      .from('free_trial_claims')
      .select('email')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error('Error checking free trial claims:', error);
      return NextResponse.json({ 
        canClaim: false, 
        message: 'Unable to validate free trial eligibility. Please try again.' 
      }, { status: 503 });
    }

    const canClaim = !claim;

    return NextResponse.json({ 
      canClaim,
      message: canClaim 
        ? 'Eligible for free trial' 
        : 'You have already used your free trial. Please select a paid plan.'
    });

  } catch (error) {
    console.error('Can claim free trial error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
