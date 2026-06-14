'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Clock, Search, Filter, ArrowRight, Trash2, ArrowUpDown, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  last_message?: string;
  resolved: boolean;
}

const categories = ['All', 'Wi-Fi', 'Computer', 'Smart Home', 'Printer', 'Other'] as const;

type Category = typeof categories[number];

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title-asc' | 'title-desc'>('newest');

  useEffect(() => {
    const fetchAllSessions = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (!user) {
          router.push('/auth/signin');
          return;
        }

        // Get all sessions - personal + team for business users
        let historyQuery = supabaseBrowser
          .from('chat_sessions')
          .select(`
            id,
            title,
            created_at,
            team_id,
            resolved,
            chat_messages(content, created_at)
          `)
          .order('created_at', { ascending: false });

        // Tier from profiles (authoritative source); fallback if needed for business history/CSV.
        let tier = '';
        try {
          const { data: prof } = await supabaseBrowser
            .from('profiles')
            .select('tier')
            .eq('id', user.id)
            .maybeSingle();
          if (prof?.tier) {
            tier = prof.tier;
          } else {
            const { data: ut } = await supabaseBrowser
              .from('user_tiers')
              .select('tier')
              .eq('user_id', user.id)
              .maybeSingle();
            if (ut?.tier) tier = ut.tier;
          }
        } catch {}
        const isBusinessUser = tier === 'business' || tier === 'business_plus';

        if (isBusinessUser) {
          const { data: memberships } = await supabaseBrowser
            .from('team_members')
            .select('team_id')
            .eq('user_id', user.id);

          const teamIds = memberships?.map((m: any) => m.team_id) || [];

          if (teamIds.length > 0) {
            historyQuery = historyQuery.or(`user_id.eq.${user.id},team_id.in.(${teamIds.join(',')})`);
          } else {
            historyQuery = historyQuery.eq('user_id', user.id);
          }
        } else {
          historyQuery = historyQuery.eq('user_id', user.id);
        }

        const { data: chats } = await historyQuery;

        const formatted = (chats || []).map((chat: any) => ({
          id: chat.id,
          title: chat.title || "Untitled Conversation",
          created_at: chat.created_at,
          resolved: chat.resolved ?? false,
          last_message: chat.chat_messages?.[0]?.content?.substring(0, 120) || "No messages yet",
        }));

        setSessions(formatted);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSessions();
  }, [router]);

  // Helper to infer category (same logic as dashboard)
  const getCategory = (title: string): Category => {
    const lower = title.toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet') || lower.includes('network')) return 'Wi-Fi';
    if (lower.includes('printer')) return 'Printer';
    if (lower.includes('smart') || lower.includes('light') || lower.includes('camera')) return 'Smart Home';
    if (lower.includes('mac') || lower.includes('laptop') || lower.includes('computer') || lower.includes('windows')) return 'Computer';
    return 'Other';
  };

  const handleDeleteSession = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?\nThis action cannot be undone and will remove all messages in this session.`)) {
      return;
    }

    try {
      // Delete messages first (in case no cascade)
      await supabaseBrowser
        .from('chat_messages')
        .delete()
        .eq('session_id', id);

      // Then delete the session
      const { error } = await supabaseBrowser
        .from('chat_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setSessions(prev => prev.filter(s => s.id !== id));
      
      toast.success('Session deleted successfully');
    } catch (err) {
      console.error('Failed to delete session:', err);
      toast.error('Failed to delete session. Please try again.');
    }
  };

  // Export all history to CSV
  const handleExportCSV = async () => {
    try {
      toast.loading('Preparing CSV export...', { id: 'export' });

      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to export history', { id: 'export' });
        return;
      }

      // Determine business user status (same logic) preferring profiles tier
      let tier = '';
      try {
        const { data: prof } = await supabaseBrowser
          .from('profiles')
          .select('tier')
          .eq('id', user.id)
          .maybeSingle();
        if (prof?.tier) {
          tier = prof.tier;
        } else {
          const { data: ut } = await supabaseBrowser
            .from('user_tiers')
            .select('tier')
            .eq('user_id', user.id)
            .maybeSingle();
          if (ut?.tier) tier = ut.tier;
        }
      } catch {}
      const isBusinessUser = tier === 'business' || tier === 'business_plus';

      // Fetch all sessions with message count
      let exportQuery = supabaseBrowser
        .from('chat_sessions')
        .select(`
          id, 
          title, 
          created_at,
          team_id,
          chat_messages(count)
        `)
        .order('created_at', { ascending: false });

      let teamMap: Record<string, string> = {};

      if (isBusinessUser) {
        const { data: memberships } = await supabaseBrowser
          .from('team_members')
          .select('team_id')
          .eq('user_id', user.id);

        const teamIds = memberships?.map((m: any) => m.team_id) || [];

        if (teamIds.length > 0) {
          exportQuery = exportQuery.or(`user_id.eq.${user.id},team_id.in.(${teamIds.join(',')})`);

          // Fetch team names for the export
          const { data: teams } = await supabaseBrowser
            .from('teams')
            .select('id, name')
            .in('id', teamIds);

          teamMap = (teams || []).reduce((acc: any, t: any) => {
            acc[t.id] = t.name;
            return acc;
          }, {});
        } else {
          exportQuery = exportQuery.eq('user_id', user.id);
        }
      } else {
        exportQuery = exportQuery.eq('user_id', user.id);
      }

      const { data: allSessions } = await exportQuery;

      if (!allSessions || allSessions.length === 0) {
        toast.error('No sessions to export', { id: 'export' });
        return;
      }

      // Build CSV rows
      const rows: string[][] = [
        ['Date', 'Time', 'Title', 'Category', 'Messages', 'Team', 'Session ID']
      ];

      allSessions.forEach((session: any) => {
        const date = new Date(session.created_at);
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        const category = getCategory(session.title || '');
        const messageCount = session.chat_messages?.[0]?.count ?? 0;
        const teamName = session.team_id ? (teamMap[session.team_id] || 'Team') : '';

        rows.push([
          dateStr,
          timeStr,
          session.title || 'Untitled Conversation',
          category,
          String(messageCount),
          teamName,
          session.id
        ]);
      });

      // Convert to CSV string with proper escaping
      const csvContent = rows
        .map(row =>
          row.map(cell => {
            const str = String(cell ?? '').replace(/"/g, '""');
            return str.includes(',') || str.includes('"') || str.includes('\n') 
              ? `"${str}"` 
              : str;
          }).join(',')
        )
        .join('\n');

      // Trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStamp = new Date().toISOString().split('T')[0];
      link.download = `mytech-fix-history-${dateStamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${allSessions.length} sessions to CSV`, { id: 'export' });
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export history. Please try again.', { id: 'export' });
    }
  };

  // Filtered sessions
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (session.last_message || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const sessionCategory = getCategory(session.title);
    const matchesCategory = activeCategory === 'All' || sessionCategory === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sorted sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'title-desc') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-white/[0.07] bg-[#0A0F1E]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <div className="h-5 w-px bg-white/[0.07]" />
            <div>
              <h1 className="font-sora text-lg font-bold text-slate-50 tracking-tight">Chat History</h1>
              <p className="text-xs text-slate-500">All your troubleshooting sessions</p>
            </div>
          </div>

          <Link href="/chat">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-5">
              New Session
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <div className="text-sm text-muted-foreground">Your complete history</div>
            <div className="text-3xl font-semibold tracking-tight mt-1">
              {loading ? '...' : `${sessions.length} sessions`}
            </div>
          </div>

          <Button 
            onClick={handleExportCSV} 
            variant="outline"
            className="gap-2 border-white/10 hover:bg-white/5"
            disabled={loading || sessions.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-white/10"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 text-sm rounded-full border transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-white/10 hover:border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center text-sm text-muted-foreground">
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Sort
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-card border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title-asc">Title A → Z</option>
              <option value="title-desc">Title Z → A</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="text-sm text-muted-foreground mb-4 px-1">
            Showing {sortedSessions.length} of {sessions.length} sessions
            {searchTerm && ` matching "${searchTerm}"`}
            {sortBy !== 'newest' && ` • Sorted by ${sortBy.replace('-', ' ')}`}
          </div>
        )}

        {/* Sessions List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card-premium border border-white/10 rounded-2xl p-6 animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 w-16 bg-white/10 rounded-full" />
                      <div className="h-5 w-20 bg-white/10 rounded-full" />
                    </div>
                    <div className="h-5 bg-white/10 rounded w-2/3" />
                    <div className="h-4 bg-white/10 rounded w-4/5" />
                  </div>
                  <div className="h-4 w-24 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedSessions.length > 0 ? (
          <motion.div
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {sortedSessions.map((session) => {
              const category = getCategory(session.title);
              const categoryColor = 
                category === 'Wi-Fi' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                category === 'Computer' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' :
                category === 'Smart Home' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                category === 'Printer' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' :
                'bg-white/10 text-muted-foreground border border-white/10';

              return (
                <motion.div key={session.id} variants={fadeInUp}>
                <Link
                  href={`/chat?session=${session.id}`}
                  className="block card-premium border border-white/10 hover:border-primary/40 rounded-2xl p-6 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor.replace('bg-', 'bg-white/10 text-').replace('text-blue-700', 'text-blue-400').replace('text-orange-700', 'text-orange-400').replace('text-emerald-700', 'text-emerald-400').replace('text-purple-700', 'text-purple-400').replace('text-zinc-700', 'text-muted-foreground')}`}>
                          {category}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${session.resolved ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                          {session.resolved ? 'Resolved' : 'In Progress'}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(session.created_at).toLocaleDateString()} at {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {session.title}
                      </h3>

                      {session.last_message && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3 pr-4">
                          {session.last_message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-1 text-sm shrink-0">
                      <span className="text-primary font-medium group-hover:underline">View conversation</span>
                      <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-0.5 transition-transform" />

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteSession(session.id, session.title);
                        }}
                        className="ml-2 p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete session"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="card-premium border border-white/10 rounded-3xl p-16 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Filter className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No sessions found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {searchTerm || activeCategory !== 'All' 
                ? "Try adjusting your search or filters."
                : "You haven't started any troubleshooting sessions yet."}
            </p>
            <Link href="/chat" className="mt-6 inline-block">
              <Button className="btn-premium">Start Your First Session</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
