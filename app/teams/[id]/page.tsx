'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UserPlus, Trash2, Users, BarChart3, ChevronRight } from 'lucide-react';
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
  const [confirmRemove, setConfirmRemove] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    if (teamId) fetchTeamData();
  }, [teamId]);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) return;

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

      const role = myMembership?.role || '';
      if (role) setCurrentUserRole(role);

      // Fetch all members + resolve emails in one batch
      const { data: membersData, error: membersError } = await supabaseBrowser
        .from('team_members')
        .select('id, user_id, role, joined_at')
        .eq('team_id', teamId);

      if (membersError) console.error('Error fetching members:', membersError);

      if (membersData && membersData.length > 0) {
        const userIds = membersData.map((m: any) => m.user_id);
        const { data: profiles } = await supabaseBrowser
          .from('profiles')
          .select('id, email')
          .in('id', userIds);

        const profileMap: Record<string, string> = {};
        (profiles || []).forEach((p: any) => { profileMap[p.id] = p.email; });

        setMembers(
          membersData.map((m: any) => ({
            id: m.id,
            user_id: m.user_id,
            role: m.role,
            joined_at: m.joined_at,
            email: profileMap[m.user_id] || m.user_id,
          }))
        );
      } else {
        setMembers([]);
      }

      // Use freshly fetched role — not the stale `isAdmin` derived from state
      const userIsAdmin = ['owner', 'admin'].includes(role);
      if (userIsAdmin) {
        const { data: invitesData } = await supabaseBrowser
          .from('team_invites')
          .select('id, email, role, token, created_at, expires_at')
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
      await fetchTeamData(); // refresh pending invites list
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

      // Update local state only — no full refetch needed
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
      toast.success('Role updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async () => {
    if (!confirmRemove) return;
    try {
      const { error } = await supabaseBrowser
        .from('team_members')
        .delete()
        .eq('id', confirmRemove.id);
      if (error) throw error;

      setMembers(prev => prev.filter(m => m.id !== confirmRemove.id));
      toast.success('Member removed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove member');
    } finally {
      setConfirmRemove(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="h-6 w-64 bg-white/10 rounded animate-pulse mb-6" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
            <div className="h-64 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Breadcrumb + header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/teams" className="hover:text-foreground transition-colors">Teams</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground font-medium">{team?.name}</span>
            </nav>
            <h1 className="text-3xl font-semibold tracking-tight">{team?.name}</h1>
            <p className="text-muted-foreground">Manage members and send invitations</p>
          </div>
          <Link href={`/teams/${teamId}/reports`}>
            <Button variant="outline" size="sm" className="gap-2 border-white/[0.12]">
              <BarChart3 className="h-4 w-4" /> View Reports
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Members list */}
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
                    <motion.div
                      key={member.id}
                      variants={fadeInUp}
                      className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-card/60"
                    >
                      <div>
                        <div className="font-medium">{member.email}</div>
                        <div className="text-xs text-muted-foreground">
                          Joined {new Date(member.joined_at).toLocaleDateString()}
                        </div>
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
                          <span className="text-sm capitalize px-3 py-1 bg-white/10 rounded border border-white/10">
                            {member.role}
                          </span>
                        )}

                        {isAdmin && member.role !== 'owner' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmRemove({ id: member.id, email: member.email || member.user_id })}
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

          {/* Right sidebar: invite + pending + roles legend */}
          <div className="space-y-6">
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
                      <label className="text-sm font-medium mb-1 block">Email Address</label>
                      <Input
                        type="email"
                        placeholder="colleague@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                        className="bg-background border-white/10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Role</label>
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
                    <Button
                      onClick={handleInvite}
                      disabled={inviting || !inviteEmail}
                      className="w-full btn-premium"
                    >
                      {inviting ? 'Sending Invite...' : 'Send Invitation'}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      An invitation email will be sent. The user accepts via the link.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Only team admins and owners can invite new members.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Pending invites */}
            {isAdmin && pendingInvites.length > 0 && (
              <Card className="card-premium border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <UserPlus className="h-4 w-4" /> Pending Invites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {pendingInvites.map((invite) => {
                        const inviteLink = `${window.location.origin}/invite/${invite.token}`;
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
                              <div className="text-xs text-slate-500 capitalize">
                                {invite.role} · Expires {new Date(invite.expires_at).toLocaleDateString()}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/[0.12] text-xs"
                              onClick={() => {
                                navigator.clipboard.writeText(inviteLink);
                                toast.success('Invite link copied');
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

            {/* Roles legend */}
            <div className="rounded-xl border border-white/[0.07] bg-card/40 px-4 py-4">
              <div className="text-sm font-semibold text-slate-200 mb-2">Roles</div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><span className="text-slate-200 font-medium">Owner</span> — Full control, billing access</li>
                <li><span className="text-slate-200 font-medium">Admin</span> — Manage members &amp; settings</li>
                <li><span className="text-slate-200 font-medium">Member</span> — Participate in team chats</li>
                <li><span className="text-slate-200 font-medium">Viewer</span> — Read-only access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Remove member confirmation dialog */}
      <Dialog open={!!confirmRemove} onOpenChange={(open) => { if (!open) setConfirmRemove(null); }}>
        <DialogContent className="max-w-sm bg-background border-white/10">
          <DialogHeader>
            <DialogTitle>Remove member?</DialogTitle>
            <DialogDescription>
              Remove <span className="text-foreground font-medium">{confirmRemove?.email}</span> from this team? They will lose access immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" className="border-white/10" onClick={() => setConfirmRemove(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember}>
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
