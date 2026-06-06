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

    // Check auth.users (most authoritative source)
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1,
      page: 1,
    });

    if (listError) {
      console.error('Error listing users:', listError);
      return NextResponse.json({ 
        available: false, 
        message: 'Unable to validate email at this time. Please try again.' 
      }, { status: 503 });
    }

    const emailExistsInAuth = users.users.some(
      (user) => user.email?.toLowerCase() === normalizedEmail
    );

    // Check profiles table (now safe because email column exists)
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (emailExistsInAuth || profile) {
      return NextResponse.json({ 
        available: false, 
        message: 'An account with this email already exists' 
      });
    }

    return NextResponse.json({ available: true });

  } catch (error) {
    console.error('Check email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
