'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, UserPlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface Team {
  id: string;
  name: string;
  role: string;
  member_count: number;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) {
        console.warn('No user found when fetching teams');
        setLoading(false);
        return;
      }

      console.log('Fetching teams for user:', user.id);

      const { data, error } = await supabaseBrowser
        .from('team_members')
        .select(`
          role,
          teams:team_id (
            id,
            name
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Supabase Error fetching teams:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        toast.error('Failed to load teams');
        setLoading(false);
        return;
      }

      console.log('Raw team_members data:', data);

      const formatted = await Promise.all(
        (data || []).map(async (m: any) => {
          const { count } = await supabaseBrowser
            .from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', m.teams.id);

          return {
            id: m.teams.id,
            name: m.teams.name,
            role: m.role,
            member_count: count || 1,
          };
        })
      );

      console.log('Formatted teams:', formatted);
      setTeams(formatted);
    } catch (error: any) {
      console.error('Unexpected error fetching teams:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;

    setCreating(true);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) return;

      const { data: team, error } = await supabaseBrowser
        .from('teams')
        .insert({ 
          name: newTeamName.trim(), 
          owner_id: user.id 
        })
        .select()
        .single();

      if (error) throw error;

      await supabaseBrowser
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'owner',
        });

      toast.success('Team created successfully');
      await fetchTeams();
      setNewTeamName('');
      setShowCreateForm(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard" className="text-sm text-primary hover:underline flex items-center gap-1">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight mt-1">Team Management</h1>
            <p className="text-muted-foreground mt-1">Manage your teams and collaborate with your employees</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="btn-premium gap-2">
            <Plus className="h-4 w-4" /> Create New Team
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-8 max-w-md card-premium border-white/10">
            <CardHeader>
              <CardTitle>Create New Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Team name (e.g. Downtown Office Team)"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="flex-1 bg-background border-white/10"
                />
                <Button 
                  onClick={handleCreateTeam} 
                  disabled={creating || !newTeamName.trim()}
                  className="btn-premium"
                >
                  {creating ? 'Creating...' : 'Create'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewTeamName('');
                  }}
                  className="border-white/10 hover:bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-48 card-premium border-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : teams.length > 0 ? (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {teams.map((team) => (
              <motion.div key={team.id} variants={fadeInUp}>
              <Card className="card-premium border-white/10 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    {team.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm mb-6">
                    <div>
                      <span className="text-muted-foreground">Your role: </span>
                      <span className="font-medium capitalize">{team.role}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {team.member_count} members
                    </div>
                  </div>

                  <Link href={`/teams/${team.id}`} className="block">
                    <Button className="w-full gap-2 btn-premium">
                      Manage Team <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-card/60">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Create your first team to collaborate with employees and share troubleshooting history.
            </p>
            <Button onClick={() => setShowCreateForm(true)} className="btn-premium">
              Create Your First Team
            </Button>
          </div>
        )}

        <div className="mt-10 text-sm text-zinc-500">
          Team features are available on <span className="font-medium">Small Business</span> and <span className="font-medium">Small Business Plus</span> plans.
          <Link href="/pricing" className="text-blue-600 hover:underline ml-1">Upgrade here</Link>
        </div>
      </div>
    </div>
  );
}
