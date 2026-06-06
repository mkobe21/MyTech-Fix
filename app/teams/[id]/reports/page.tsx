'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Users, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface ReportData {
  totalSessions: number;
  sessionsByMember: { email: string; count: number }[];
  commonCategories: { category: string; count: number }[];
  estimatedTimeSaved: number; // in hours
}

export default function TeamReportsPage() {
  const params = useParams();
  const teamId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ReportData | null>(null);
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    if (teamId) fetchReport();
  }, [teamId]);

  const getCategory = (title: string): string => {
    const lower = title.toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet') || lower.includes('network')) return 'Wi-Fi';
    if (lower.includes('printer')) return 'Printer';
    if (lower.includes('smart') || lower.includes('light') || lower.includes('camera')) return 'Smart Home';
    if (lower.includes('mac') || lower.includes('laptop') || lower.includes('computer') || lower.includes('windows')) return 'Computer';
    return 'Other';
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) return;

      // Verify user has access to this team
      const { data: membership } = await supabaseBrowser
        .from('team_members')
        .select('role')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .single();

      if (!membership) {
        toast.error("You don't have access to this team's reports");
        return;
      }

      // Get team name
      const { data: team } = await supabaseBrowser
        .from('teams')
        .select('name')
        .eq('id', teamId)
        .single();
      if (team) setTeamName(team.name);

      // Fetch all sessions for the team
      const { data: sessions } = await supabaseBrowser
        .from('chat_sessions')
        .select(`
          id,
          title,
          created_at,
          user_id,
          chat_messages(content)
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (!sessions) {
        setReport({ totalSessions: 0, sessionsByMember: [], commonCategories: [], estimatedTimeSaved: 0 });
        return;
      }

      // Calculate stats
      const totalSessions = sessions.length;

      // Sessions by member - try to resolve emails from profiles
      const memberCounts: Record<string, number> = {};
      const userIds = Array.from(new Set(sessions.map((s: any) => s.user_id).filter(Boolean)));

      let profileMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabaseBrowser
          .from('profiles')
          .select('id, email')
          .in('id', userIds);
        if (profiles) {
          profileMap = Object.fromEntries(profiles.map((p: any) => [p.id, p.email]));
        }
      }

      sessions.forEach((s: any) => {
        const key = s.user_id || 'unknown';
        memberCounts[key] = (memberCounts[key] || 0) + 1;
      });

      const sessionsByMember = Object.entries(memberCounts)
        .map(([userId, count]) => ({
          email: profileMap[userId] || userId.substring(0, 8) + '…',
          count,
          userId,
        }))
        .sort((a, b) => b.count - a.count);

      // Common categories
      const categoryCounts: Record<string, number> = {};
      sessions.forEach((s: any) => {
        const cat = getCategory(s.title || '');
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      const commonCategories = Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      // Rough estimate: assume average session saves 15 minutes
      const estimatedTimeSaved = Math.round((totalSessions * 15) / 60 * 10) / 10;

      setReport({
        totalSessions,
        sessionsByMember,
        commonCategories,
        estimatedTimeSaved,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to load team reports');
    } finally {
      setLoading(false);
    }
  };

  const exportHistory = async () => {
    try {
      const { data: sessions } = await supabaseBrowser
        .from('chat_sessions')
        .select(`
          id,
          title,
          created_at,
          chat_messages(content, role, created_at)
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: true });

      if (!sessions) return;

      let csv = 'Session ID,Title,Date,Messages\n';

      sessions.forEach((session: any) => {
        const messages = (session.chat_messages || []).length;
        const date = new Date(session.created_at).toISOString().split('T')[0];
        csv += `"${session.id}","${session.title || ''}","${date}",${messages}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${teamName.replace(/\s+/g, '_')}_history.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Conversation history exported');
    } catch (error) {
      toast.error('Failed to export history');
    }
  };

  if (loading) {
    return <div className="p-8 text-muted-foreground">Loading team reports...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-primary hover:underline flex items-center gap-1">
            ← Back to Dashboard
          </Link>
          <Link href={`/teams/${teamId}`} className="text-primary hover:underline flex items-center gap-1 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Team
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">Team Reports</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold">{teamName || 'Team'} - IT Health Overview</h2>
          <p className="text-muted-foreground">Insights and analytics for your team’s troubleshooting activity</p>
        </div>

        {/* Summary Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
          <Card className="card-premium border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                <BarChart3 className="h-4 w-4" /> Total Sessions
              </div>
              <div className="text-4xl font-semibold">{report?.totalSessions || 0}</div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
          <Card className="card-premium border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                <Users className="h-4 w-4" /> Estimated Time Saved
              </div>
              <div className="text-4xl font-semibold">{report?.estimatedTimeSaved || 0} hrs</div>
              <p className="text-xs text-emerald-600 mt-1">Based on average resolution time</p>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
          <Card className="card-premium border-white/10">
            <CardContent className="p-6 flex flex-col justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Top Issue Category</div>
                <div className="text-2xl font-semibold">
                  {report?.commonCategories?.[0]?.category || 'N/A'}
                </div>
              </div>
              <Button onClick={exportHistory} variant="outline" size="sm" className="mt-4 gap-2 w-fit border-white/10">
                <Download className="h-4 w-4" /> Export Full History (CSV)
              </Button>
            </CardContent>
          </Card>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Usage by Team Member */}
          <Card>
            <CardHeader>
              <CardTitle>Usage by Team Member</CardTitle>
            </CardHeader>
            <CardContent>
              {report && report.sessionsByMember.length > 0 ? (
                <motion.div 
                  className="space-y-3"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  {report.sessionsByMember.map((member, index) => (
                    <motion.div key={index} variants={fadeInUp} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="font-medium">{member.email}</span>
                      <span className="text-sm bg-white/10 px-3 py-1 rounded-full border border-white/10">
                        {member.count} sessions
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <p className="text-sm text-muted-foreground">No session data yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Most Common Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Most Common Issues</CardTitle>
            </CardHeader>
            <CardContent>
              {report && report.commonCategories.length > 0 ? (
                <motion.div 
                  className="space-y-3"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  {report.commonCategories.map((cat, index) => (
                    <motion.div key={index} variants={fadeInUp} className="flex justify-between items-center">
                      <span>{cat.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-2 bg-primary rounded-full" 
                            style={{ width: `${Math.min((cat.count / (report.totalSessions || 1)) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm w-8 text-right">{cat.count}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <p className="text-sm text-muted-foreground">No data available yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-xs text-zinc-500">
          Reports are generated from your team’s chat history. Data updates in real time.
        </div>
      </div>
    </div>
  );
}
