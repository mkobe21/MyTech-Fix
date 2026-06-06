'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface InviteDetails {
  id: string;
  team_id: string;
  email: string;
  role: string;
  team_name: string;
  expires_at: string;
  accepted_at: string | null;
}

export default function AcceptInvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      fetchInvite();
    }
  }, [token]);

  const fetchInvite = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseBrowser
        .from('team_invites')
        .select(`
          id,
          team_id,
          email,
          role,
          expires_at,
          accepted_at,
          teams:team_id (name)
        `)
        .eq('token', token)
        .single();

      if (error || !data) {
        setError('This invitation link is invalid or has expired.');
        return;
      }

      if (data.accepted_at) {
        setError('This invitation has already been accepted.');
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setError('This invitation has expired.');
        return;
      }

      setInvite({
        id: data.id,
        team_id: data.team_id,
        email: data.email,
        role: data.role,
        team_name: (data.teams as any)?.name || 'Team',
        expires_at: data.expires_at,
        accepted_at: data.accepted_at,
      });
    } catch (err) {
      setError('Failed to load invitation details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    setJoining(true);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();

      if (!user) {
        // Redirect to signup/login with token
        toast.info('Please sign in or create an account to accept the invitation.');
        router.push(`/signup?invite_token=${token}`);
        return;
      }

      // Check if email matches (basic security)
      if (user.email?.toLowerCase() !== invite?.email.toLowerCase()) {
        toast.error(`This invitation was sent to ${invite?.email}. Please sign in with that email.`);
        return;
      }

      // Add user to team
      const { error: memberError } = await supabaseBrowser
        .from('team_members')
        .insert({
          team_id: invite!.team_id,
          user_id: user.id,
          role: invite!.role,
        });

      if (memberError) {
        if (memberError.code === '23505') { // Unique violation
          toast.error('You are already a member of this team.');
        } else {
          throw memberError;
        }
        return;
      }

      // Mark invite as accepted
      await supabaseBrowser
        .from('team_invites')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', invite!.id);

      setSuccess(true);
      toast.success(`Welcome to ${invite?.team_name}!`);

      // Redirect to team page after a moment
      setTimeout(() => {
        router.push(`/teams/${invite?.team_id}`);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to accept invitation.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">Loading invitation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-xl font-semibold mb-2">Invitation Problem</h1>
            <p className="text-zinc-600 mb-6">{error}</p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Welcome to the team!</h1>
            <p className="text-zinc-600">Redirecting you to your team dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            Team Invitation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-zinc-600">You have been invited to join</p>
            <p className="text-2xl font-semibold mt-1">{invite?.team_name}</p>
            <p className="text-sm text-zinc-500 mt-1">as <span className="font-medium capitalize">{invite?.role}</span></p>
          </div>

          <div className="bg-background p-4 rounded-xl text-sm">
            <p><strong>Invited email:</strong> {invite?.email}</p>
            <p className="mt-1 text-xs text-zinc-500">This invitation expires on {new Date(invite!.expires_at).toLocaleDateString()}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleAcceptInvite} 
              disabled={joining}
              className="w-full"
            >
              {joining ? 'Joining team...' : 'Accept Invitation & Join Team'}
            </Button>

            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Maybe Later
              </Button>
            </Link>
          </div>

          <p className="text-xs text-center text-zinc-500">
            You must be signed in with <strong>{invite?.email}</strong> to accept this invitation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
