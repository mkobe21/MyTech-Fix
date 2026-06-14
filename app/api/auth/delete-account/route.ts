import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Delete user data in dependency order
    const { data: sessions } = await supabaseAdmin.from('chat_sessions').select('id').eq('user_id', userId);
    const sessionIds = (sessions || []).map((s: any) => s.id);
    if (sessionIds.length > 0) {
      await supabaseAdmin.from('chat_messages').delete().in('session_id', sessionIds);
    }
    await supabaseAdmin.from('chat_sessions').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_diagnostics').delete().eq('user_id', userId);
    await supabaseAdmin.from('team_members').delete().eq('user_id', userId);
    await supabaseAdmin.from('profiles').delete().eq('id', userId);
    await supabaseAdmin.from('user_tiers').delete().eq('user_id', userId);

    // Delete the auth user last
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete account' }, { status: 500 });
  }
}
