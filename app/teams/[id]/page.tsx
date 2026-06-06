'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, UserPlus, Trash2, Shield, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  email?: string;
}

interface Team {
  id: string;
  name: string;
  owner_id: string;
}

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [inviting, setInviting] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);

  useEffect(() => {
    if (teamId) {
      fetchTeamData();
    }
  }, [teamId]);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) return;

      // Fetch team
      const { data: teamData } = await supabaseBrowser
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (teamData) setTeam(teamData);

      // Fetch current user's role
      const { data: myMembership } = await supabaseBrowser
        .from('team_members')
        .select('role')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .single();

      if (myMembership) setCurrentUserRole(myMembership.role);

      // Fetch team members (base data)
      const { data: membersData, error: membersError } = await supabaseBrowser
        .from('team_members')
        .select('id, user_id, role, joined_at')
        .eq('team_id', teamId);

      if (membersError) {
        console.error('Error fetching team members:', membersError);
      }

      if (membersData && membersData.length > 0) {
        // Fetch emails for these users from profiles in one query
        const userIds = membersData.map((m: any) => m.user_id);
        const { data: profiles } = await supabaseBrowser
          .from('profiles')
          .select('id, email')
          .in('id', userIds);

        const profileMap: Record<string, string> = {};
        (profiles || []).forEach((p: any) => {
          profileMap[p.id] = p.email;
        });

        const formatted = membersData.map((m: any) => ({
          id: m.id,
          user_id: m.user_id,
          role: m.role,
          joined_at: m.joined_at,
          email: profileMap[m.user_id] || m.user_id,
        }));
        setMembers(formatted);
      } else {
        setMembers([]);
      }

      // Fetch pending invites
      if (isAdmin) {
        const { data: invitesData } = await supabaseBrowser
          .from('team_invites')
          .select('id, email, role, created_at, expires_at')
          .eq('team_id', teamId)
          .is('accepted_at', null)
          .gt('expires_at', new Date().toISOString());

        if (invitesData) setPendingInvites(invitesData);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = ['owner', 'admin'].includes(currentUserRole);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    setInviting(true);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) return;

      const { error } = await supabaseBrowser
        .from('team_invites')
        .insert({
          team_id: teamId,
          email: inviteEmail.toLowerCase().trim(),
          role: inviteRole,
          invited_by: user.id,
        });

      if (error) throw error;

      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      const { error } = await supabaseBrowser
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Role updated');
      await fetchTeamData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async (memberId: string, userEmail: string) => {
    if (!confirm(`Remove ${userEmail} from the team?`)) return;

    try {
      const { error } = await supabaseBrowser
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Member removed');
      await fetchTeamData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  if (loading) {
    return <div className="p-8">Loading team...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              ← Back to Dashboard
            </Link>
            <Link href="/teams" className="text-sm text-primary hover:underline flex items-center gap-1 mt-1">
              ← Back to Teams
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight mt-2">{team?.name}</h1>
            <p className="text-muted-foreground">Team Management</p>
          </div>
          <Link href={`/teams/${teamId}/reports`}>
            <Button variant="outline" size="sm" className="gap-2">
              <BarChart3 className="h-4 w-4" /> View Reports
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Members List */}
          <div className="lg:col-span-2">
            <Card className="card-premium border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> Team Members ({members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="space-y-3"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  {members.map((member) => (
                    <motion.div key={member.id} variants={fadeInUp} className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-card/60">
                      <div>
                        <div className="font-medium">{member.email}</div>
                        <div className="text-xs text-muted-foreground">Joined {new Date(member.joined_at).toLocaleDateString()}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isAdmin && member.role !== 'owner' ? (
                          <select
                            value={member.role}
                            onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                            className="border border-white/10 bg-background rounded px-2 py-1 text-sm"
                          >
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        ) : (
                          <span className="text-sm capitalize px-3 py-1 bg-white/10 rounded border border-white/10">{member.role}</span>
                        )}

                        {isAdmin && member.role !== 'owner' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id, member.email || '')}
                            className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </div>

          {/* Invite Section */}
          <div>
            <Card className="card-premium border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" /> Invite New Member
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAdmin ? (
                  <>
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <Input
                        type="email"
                        placeholder="colleague@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="bg-background border-white/10"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as any)}
                        className="w-full border border-white/10 bg-background rounded px-3 py-2 text-sm"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>

                    <Button onClick={handleInvite} disabled={inviting || !inviteEmail} className="w-full btn-premium">
                      {inviting ? 'Sending Invite...' : 'Send Invitation'}
                    </Button>
                    <p className="text-xs text-muted-foreground">An invitation will be sent. The user can accept via email link.</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Only team admins and owners can invite new members.</p>
                )}
              </CardContent>
            </Card>

            {/* Pending Invites */}
            {isAdmin && pendingInvites.length > 0 && (
              <Card className="mt-6 card-premium border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <UserPlus className="h-4 w-4" /> Pending Invites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <AnimatePresence>
                    {pendingInvites.map((invite) => {
                      const inviteLink = `${window.location.origin}/invite/${invite.token || 'token-placeholder'}`;
                      return (
                        <motion.div 
                          key={invite.id} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg text-sm border border-white/10"
                        >
                          <div>
                            <div className="font-medium">{invite.email}</div>
                            <div className="text-xs text-zinc-500 capitalize">{invite.role} • Expires {new Date(invite.expires_at).toLocaleDateString()}</div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(inviteLink);
                              toast.success('Invite link copied to clipboard');
                            }}
                          >
                            Copy Link
                          </Button>
                        </motion.div>
                      );
                    })}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Invite + Pending + Roles */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" /> Invite New Member
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAdmin ? (
                  <>
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <Input
                        type="email"
                        placeholder="colleague@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="bg-background border-white/10"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as any)}
                        className="w-full border border-white/10 bg-background rounded px-3 py-2 text-sm"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>

                    <Button onClick={handleInvite} disabled={inviting || !inviteEmail} className="w-full btn-premium">
                      {inviting ? 'Sending Invite...' : 'Send Invitation'}
                    </Button>
                    <p className="text-xs text-muted-foreground">An invitation will be sent. The user can accept via email link.</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Only team admins and owners can invite new members.</p>
                )}
              </CardContent>
            </Card>

            {/* Pending Invites */}
            {isAdmin && pendingInvites.length > 0 && (
              <Card className="mt-6 card-premium border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <UserPlus className="h-4 w-4" /> Pending Invites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <AnimatePresence>
                    {pendingInvites.map((invite) => {
                      const inviteLink = `${window.location.origin}/invite/${invite.token || 'token-placeholder'}`;
                      return (
                        <motion.div 
                          key={invite.id} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg text-sm border border-white/10"
                        >
                          <div>
                            <div className="font-medium">{invite.email}</div>
                            <div className="text-xs text-zinc-500 capitalize">{invite.role} • Expires {new Date(invite.expires_at).toLocaleDateString()}</div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(inviteLink);
                              toast.success('Invite link copied to clipboard');
                            }}
                          >
                            Copy Link
                          </Button>
                        </motion.div>
                      );
                    })}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mt-6 text-xs text-muted-foreground">
              <strong>Roles:</strong><br />
              • <strong>Owner</strong>: Full control<br />
              • <strong>Admin</strong>: Manage members &amp; settings<br />
              • <strong>Member</strong>: Can participate in team chats<br />
              • <strong>Viewer</strong>: Read-only access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
