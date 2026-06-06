'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Monitor, Smartphone, Home, ArrowRight, Plus, LogOut, User, RefreshCw, Clock, CheckCircle, Zap, Users, BarChart3, Database, Activity, Globe, Server } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { getImageLimit, isMonthlyImageLimit, getTierLabel, getLimit as getSessionLimit, getDiagnosticLimit, isMonthlyDiagnosticLimit, pickHighestTier } from '@/lib/tiers';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { runFullDiagnostic, getStatusColor, type FullDiagnosticResults, type TestStatus, analyzeWifiChannels, type WifiChannelScanResult } from '@/lib/diagnostics';
import { DiagnosticResultsViewer } from '@/components/DiagnosticResultsViewer';
import { WifiChannelVisualizer } from '@/components/WifiChannelVisualizer';
import { ThemeToggle } from '@/components/ThemeToggle';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  last_message?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [recentChats, setRecentChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [tier, setTier] = useState('free_trial');
  const [sessionsUsed, setSessionsUsed] = useState(0);
  const [remainingChats, setRemainingChats] = useState(0);
  const [username, setUsername] = useState('User');

  // Whether the user is on a business tier (used for conditional buttons)
  const [isBusinessUser, setIsBusinessUser] = useState(false);

  // Team leadership (for showing Reports button to owners/admins)
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  const [teamReportsLink, setTeamReportsLink] = useState<string | null>(null);

  // Track if the user is the owner of a team (for showing Upgrade and Manage Team buttons)
  const [isTeamOwner, setIsTeamOwner] = useState(false);

  // Value delivered stats (dynamic)
  const [issuesResolved, setIssuesResolved] = useState(0);
  const [hoursSaved, setHoursSaved] = useState(0);

  // Chat limit state
  const [isUnlimitedChats, setIsUnlimitedChats] = useState(false);

  // Image generation usage
  const [imagesUsed, setImagesUsed] = useState(0);
  const [imageLimit, setImageLimit] = useState(0);
  const [imageResetDate, setImageResetDate] = useState<string | null>(null);

  // === NEW: Automated Diagnostics usage + history + runner state ===
  const [diagnosticsUsed, setDiagnosticsUsed] = useState(0);
  const [diagnosticLimit, setDiagnosticLimit] = useState(1);
  const [diagnosticResetDate, setDiagnosticResetDate] = useState<string | null>(null);
  const [recentDiagnostics, setRecentDiagnostics] = useState<any[]>([]);

  const [showDiagnosticsDialog, setShowDiagnosticsDialog] = useState(false);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [currentTestName, setCurrentTestName] = useState('');
  const [liveResults, setLiveResults] = useState<any>(null); // partial during run
  const [finalDiagnosticResults, setFinalDiagnosticResults] = useState<FullDiagnosticResults | null>(null);
  const [diagnosticAnalysis, setDiagnosticAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentDiagnosticId, setCurrentDiagnosticId] = useState<string | null>(null); // for saving + analyzing
  const [viewingDiagnostic, setViewingDiagnostic] = useState<any>(null); // for history view mode

  // === WiFi Channel Scanner (new dedicated tool, consumes 1 diagnostic run quota) ===
  const [showWifiScanner, setShowWifiScanner] = useState(false);
  const [wifiNetworks, setWifiNetworks] = useState<Array<{ id: string; ssid: string; channel: number }>>([]);
  const [userWifiChannel, setUserWifiChannel] = useState<number | null>(null);
  const [wifiScanResult, setWifiScanResult] = useState<WifiChannelScanResult | null>(null);
  const [isSavingWifiScan, setIsSavingWifiScan] = useState(false);
  const [wifiAnalysis, setWifiAnalysis] = useState<string | null>(null);
  const [currentWifiDiagId, setCurrentWifiDiagId] = useState<string | null>(null);

  // isUnlimitedTier now derives from central getSessionLimit (9999 for business+)
  const isUnlimitedTier = (t: string) => getSessionLimit(t) >= 9999;

  // Dynamic greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // === NEW: Diagnostic runner & history helpers ===
  const startFullDiagnostic = async () => {
    if (diagnosticLimit - diagnosticsUsed <= 0) {
      toast.error('No diagnostic runs remaining for your plan this period.');
      return;
    }
    setShowDiagnosticsDialog(true);
    setIsRunningDiagnostic(true);
    setDiagnosticProgress(0);
    setCurrentTestName('');
    setLiveResults(null);
    setFinalDiagnosticResults(null);
    setDiagnosticAnalysis(null);
    setCurrentDiagnosticId(null);

    try {
      // 1. Reserve quota + get skeleton id (server enforces)
      const startRes = await fetch('/api/diagnostics/start', { method: 'POST' });
      const startData = await startRes.json();
      if (!startRes.ok) {
        toast.error(startData.error || 'Could not start diagnostic run.');
        setIsRunningDiagnostic(false);
        setShowDiagnosticsDialog(false);
        return;
      }
      setCurrentDiagnosticId(startData.id);

      // 2. Run the client tests with live progress
      const results = await runFullDiagnostic((testName, pct) => {
        setCurrentTestName(testName);
        setDiagnosticProgress(pct);
      });

      setLiveResults(results);

      // 3. Complete the run (save results)
      const completeRes = await fetch('/api/diagnostics/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: startData.id, results, overall_status: results.overall }),
      });
      if (!completeRes.ok) {
        const err = await completeRes.json().catch(() => ({}));
        toast.error(err.error || 'Failed to save diagnostic results (quota may have been affected).');
      } else {
        toast.success('Diagnostic run saved.');
      }

      setFinalDiagnosticResults(results);
      // Refresh usage + history
      await fetchDashboardData();
    } catch (e: any) {
      console.error('Full diagnostic run failed:', e);
      toast.error('Diagnostic run failed. Please try again.');
    } finally {
      setIsRunningDiagnostic(false);
      setCurrentTestName('');
    }
  };

  const startIndividualTest = async (which: 'speed' | 'latency') => {
    // Individuals are free (do not consume quota) for quick checks
    setShowDiagnosticsDialog(true);
    setIsRunningDiagnostic(true);
    setDiagnosticProgress(0);
    setLiveResults(null);
    setFinalDiagnosticResults(null);
    setDiagnosticAnalysis(null);

    try {
      let partial: any = {};
      const mod = await import('@/lib/diagnostics');
      if (which === 'speed') {
        setCurrentTestName('Internet Speed Test');
        partial.internet = await mod.testInternetSpeed();
        setDiagnosticProgress(100);
      } else {
        setCurrentTestName('Network Latency & Packet Loss');
        partial.latency = await mod.testLatencyAndPacketLoss(8);
        setDiagnosticProgress(100);
      }
      const sys = mod.getSystemInfo();
      const results = { ...partial, system: sys, overall: 'unknown' as const, timestamp: new Date().toISOString() };
      setLiveResults(results);
      setFinalDiagnosticResults(results as any);
    } catch (e) {
      toast.error('Quick test failed.');
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  // === WiFi Channel Scanner helpers ===
  const openWifiChannelScanner = () => {
    // Reset scanner state
    setWifiNetworks([]);
    setUserWifiChannel(null);
    setWifiScanResult(null);
    setWifiAnalysis(null);
    setCurrentWifiDiagId(null);
    setShowWifiScanner(true);
  };

  const closeWifiScanner = () => {
    setShowWifiScanner(false);
    // Keep the result/analysis in case user wants to re-open from recent list later
  };

  const addWifiNetwork = () => {
    setWifiNetworks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ssid: '', channel: 6 },
    ]);
  };

  const updateWifiNetwork = (id: string, field: 'ssid' | 'channel', value: string | number) => {
    setWifiNetworks((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [field]: value } : n))
    );
  };

  const removeWifiNetwork = (id: string) => {
    setWifiNetworks((prev) => prev.filter((n) => n.id !== id));
  };

  const loadExampleCrowded24 = () => {
    // Realistic crowded apartment example
    setWifiNetworks([
      { id: crypto.randomUUID(), ssid: 'Neighbor1', channel: 1 },
      { id: crypto.randomUUID(), ssid: 'Neighbor2', channel: 1 },
      { id: crypto.randomUUID(), ssid: 'Neighbor3', channel: 6 },
      { id: crypto.randomUUID(), ssid: 'Neighbor4', channel: 6 },
      { id: crypto.randomUUID(), ssid: 'Neighbor5', channel: 11 },
      { id: crypto.randomUUID(), ssid: 'MyRouter?', channel: 1 },
    ]);
    setUserWifiChannel(1);
    setWifiScanResult(null);
    setWifiAnalysis(null);
  };

  const runWifiChannelAnalysis = () => {
    if (wifiNetworks.length === 0) {
      toast.error('Add at least one nearby network to analyze.');
      return;
    }
    const normalized = wifiNetworks.map((n) => ({
      ssid: n.ssid || undefined,
      channel: Number(n.channel),
      band: Number(n.channel) > 11 ? ('5' as const) : ('2.4' as const),
    }));
    const res = analyzeWifiChannels(normalized, userWifiChannel || undefined);
    setWifiScanResult(res);
  };

  const saveAndAskGrokForWifi = async () => {
    if (!wifiScanResult) return;

    if (diagnosticLimit - diagnosticsUsed <= 0) {
      toast.error('No diagnostic runs remaining for your plan this period.');
      return;
    }

    setIsSavingWifiScan(true);
    try {
      // 1. Reserve quota
      const startRes = await fetch('/api/diagnostics/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ run_type: 'wifi_channel_scan' }),
      });
      const startData = await startRes.json();
      if (!startRes.ok) {
        toast.error(startData.error || 'Could not start WiFi scan (quota may be reached).');
        return;
      }
      setCurrentWifiDiagId(startData.id);

      // 2. Build payload (shape understood by analyze route + viewer)
      const payloadResults = {
        wifiChannelScan: wifiScanResult,
        userChannel: userWifiChannel,
        networks: wifiNetworks,
        overall: wifiScanResult.currentStatus,
        timestamp: new Date().toISOString(),
      };

      // 3. Complete the record
      const completeRes = await fetch('/api/diagnostics/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: startData.id,
          results: payloadResults,
          overall_status: wifiScanResult.currentStatus,
          summary: wifiScanResult.summary,
        }),
      });
      if (!completeRes.ok) {
        const err = await completeRes.json().catch(() => ({}));
        toast.error(err.error || 'Failed to save WiFi scan results.');
      } else {
        toast.success('WiFi Channel Scan saved.');
      }

      // 4. Ask MyTech-Fix (re-uses the existing analyze endpoint which now supports wifi scans)
      const analyzeRes = await fetch('/api/diagnostics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: startData.id, results: payloadResults }),
      });
      const aData = await analyzeRes.json();
      if (analyzeRes.ok && aData.analysis) {
        setWifiAnalysis(aData.analysis);
      } else {
        toast.error(aData.error || 'Failed to get MyTech-Fix analysis for the scan.');
      }

      // 5. Refresh dashboard (used count + recent list)
      await fetchDashboardData();
    } catch (e: any) {
      console.error('WiFi scanner save/analyze failed:', e);
      toast.error('Something went wrong saving or analyzing the WiFi scan.');
    } finally {
      setIsSavingWifiScan(false);
    }
  };

  const requestAIAnalysis = async () => {
    if (!finalDiagnosticResults) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/diagnostics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentDiagnosticId, results: finalDiagnosticResults }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Analysis failed.');
      } else {
        setDiagnosticAnalysis(data.analysis);
        toast.success('MyTech-Fix analysis ready.');
        await fetchDashboardData(); // refresh history in case analysis was persisted
      }
    } catch (e) {
      toast.error('Could not get analysis from MyTech-Fix right now.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openDiagnosticView = async (diag: any) => {
    // Open dialog in view mode. Fetch full record if we only have summary.
    setShowDiagnosticsDialog(true);
    setViewingDiagnostic(diag);
    setFinalDiagnosticResults(null);
    setDiagnosticAnalysis(diag.ai_analysis || null);
    setCurrentDiagnosticId(diag.id);

    // If the list item doesn't have the full results, fetch it
    if (!diag.results) {
      try {
        const { data: full } = await supabaseBrowser
          .from('user_diagnostics')
          .select('results, ai_analysis, overall_status')
          .eq('id', diag.id)
          .maybeSingle();
        if (full?.results) {
          setFinalDiagnosticResults(full.results as FullDiagnosticResults);
          if (full.ai_analysis) setDiagnosticAnalysis(full.ai_analysis);
        }
      } catch {}
    } else {
      setFinalDiagnosticResults(diag.results);
    }
  };

  const closeDiagnosticsDialog = () => {
    setShowDiagnosticsDialog(false);
    setIsRunningDiagnostic(false);
    setDiagnosticProgress(0);
    setCurrentTestName('');
    setLiveResults(null);
    setFinalDiagnosticResults(null);
    setDiagnosticAnalysis(null);
    setCurrentDiagnosticId(null);
    setViewingDiagnostic(null);
  };

  const fetchDashboardData = useCallback(async () => {
    setRefreshing(true);
    setIsTeamOwner(false);
    setIsBusinessUser(false);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      // Fetch the display name from account page (profiles.full_name) if set, with fallback to user_tiers and then email
      let displayName = user.email?.split('@')[0] || 'User';
      try {
        const { data: nameProfile } = await supabaseBrowser
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();
        if (nameProfile?.full_name && nameProfile.full_name.trim()) {
          displayName = nameProfile.full_name.trim();
        } else {
          // fallback to user_tiers
          const { data: ut } = await supabaseBrowser
            .from('user_tiers')
            .select('full_name')
            .eq('user_id', user.id)
            .maybeSingle();
          if (ut?.full_name && ut.full_name.trim()) {
            displayName = ut.full_name.trim();
          }
        }
      } catch (e) {
        // ignore, use email fallback
      }
      setUsername(displayName);

      // Tier from profiles + user_tiers with pickHighestTier for full resilience (handles cases
      // where only one table was updated by webhook/upgrade or manual admin). Usage still prefers
      // profiles when the row exists.
      let currentTier: string = 'free_trial';
      let used = 0;
      let imgUsed = 0;
      let imgLimit = 5;
      let imageReset: string | null = null;
      let isBiz = false;
      let isUnlim = false;
      let rem = 5;

      try {
        const { data: prof } = await supabaseBrowser
          .from('profiles')
          .select('tier, sessions_used, images_used, image_reset_date')
          .eq('id', user.id)
          .maybeSingle();

        const { data: ut } = await supabaseBrowser
          .from('user_tiers')
          .select('tier, sessions_used, images_used, image_reset_date')
          .eq('user_id', user.id)
          .maybeSingle();

        currentTier = pickHighestTier(prof?.tier, ut?.tier);

        // Usage: prefer profiles row if it exists (more authoritative for some fields), else ut
        if (prof) {
          used = prof.sessions_used || 0;
          imgUsed = prof.images_used || 0;
          imageReset = prof.image_reset_date || null;
        } else if (ut) {
          used = ut.sessions_used || 0;
          imgUsed = ut.images_used || 0;
          imageReset = ut.image_reset_date || null;
        }
      } catch (e) {
        // use defaults (free_trial)
      }

      // Apply resolved tier + usage to state immediately (plan display, image card, conditionals)
      setTier(currentTier);
      setSessionsUsed(used);
      setImagesUsed(imgUsed);
      imgLimit = getImageLimit(currentTier);
      setImageLimit(imgLimit);
      setImageResetDate(imageReset);

      // === NEW: Diagnostics usage (profiles + user_tiers fallback, same resilient pattern)
      let diagUsed = 0;
      let diagLimit = 1;
      let diagReset: string | null = null;
      try {
        const { data: dprof } = await supabaseBrowser
          .from('profiles')
          .select('tier, diagnostics_used, diagnostic_reset_date')
          .eq('id', user.id)
          .maybeSingle();
        const { data: dut } = await supabaseBrowser
          .from('user_tiers')
          .select('tier, diagnostics_used, diagnostic_reset_date')
          .eq('user_id', user.id)
          .maybeSingle();
        const dsrc = dprof || dut;
        if (dsrc) {
          diagUsed = (dsrc as any).diagnostics_used || 0;
          diagReset = (dsrc as any).diagnostic_reset_date || null;
        }
        diagLimit = getDiagnosticLimit(currentTier);
      } catch {}
      setDiagnosticsUsed(diagUsed);
      setDiagnosticLimit(diagLimit);
      setDiagnosticResetDate(diagReset);

      // Load recent diagnostic runs for history list (lightweight select) — show up to 3 on dashboard
      try {
        const { data: diags } = await supabaseBrowser
          .from('user_diagnostics')
          .select('id, created_at, overall_status, summary, ai_analysis, run_type')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
        setRecentDiagnostics(diags || []);
      } catch (e) {
        setRecentDiagnostics([]);
      }

      isBiz = currentTier === 'business' || currentTier === 'business_plus';
      setIsBusinessUser(isBiz);

      isUnlim = isUnlimitedTier(currentTier);
      setIsUnlimitedChats(isUnlim);

      if (isUnlim) {
        rem = 0;
      } else {
        const limit = getSessionLimit(currentTier);
        rem = Math.max(0, limit - used);
      }
      setRemainingChats(rem);

      // Small delay *after* tier resolution to allow any in-flight DB sync (webhook after checkout redirect etc)
      // before loading chats / counts that depend on business status.
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get recent chats - personal + team sessions for business users
      let chatsQuery = supabaseBrowser
        .from('chat_sessions')
        .select(`
          id, 
          title, 
          created_at,
          team_id,
          chat_messages(content, created_at)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      const isBizUser = currentTier === 'business' || currentTier === 'business_plus';

      if (isBizUser) {
        const { data: memberships } = await supabaseBrowser
          .from('team_members')
          .select('team_id')
          .eq('user_id', user.id);

        const teamIds = memberships?.map((m: any) => m.team_id) || [];

        if (teamIds.length > 0) {
          chatsQuery = chatsQuery.or(`user_id.eq.${user.id},team_id.in.(${teamIds.join(',')})`);
        } else {
          chatsQuery = chatsQuery.eq('user_id', user.id);
        }

        // Check if user is owner or admin of any team → show "View Reports" button
        const { data: leadership } = await supabaseBrowser
          .from('team_members')
          .select('team_id')
          .eq('user_id', user.id)
          .in('role', ['owner', 'admin']);

        if (leadership && leadership.length > 0) {
          setIsTeamLeader(true);
          setTeamReportsLink(`/teams/${leadership[0].team_id}/reports`);
        } else {
          setIsTeamLeader(false);
          setTeamReportsLink(null);
        }

        // Check if the user is the owner (not just admin/member) of any team
        const { data: ownerMembership } = await supabaseBrowser
          .from('team_members')
          .select('team_id')
          .eq('user_id', user.id)
          .eq('role', 'owner');

        setIsTeamOwner(!!ownerMembership && ownerMembership.length > 0);
      } else {
        chatsQuery = chatsQuery.eq('user_id', user.id);
        setIsTeamLeader(false);
        setTeamReportsLink(null);
        setIsTeamOwner(false);
        setIsBusinessUser(false);
      }

      const { data: chats } = await chatsQuery;

      // Calculate total issues resolved (chat sessions) this period
      let countQuery = supabaseBrowser
        .from('chat_sessions')
        .select('*', { count: 'exact', head: true });

      if (currentTier === 'business' || currentTier === 'business_plus') {
        const { data: memberships } = await supabaseBrowser
          .from('team_members')
          .select('team_id')
          .eq('user_id', user.id);

        const teamIds = memberships?.map((m: any) => m.team_id) || [];

        if (teamIds.length > 0) {
          countQuery = countQuery.or(`user_id.eq.${user.id},team_id.in.(${teamIds.join(',')})`);
        } else {
          countQuery = countQuery.eq('user_id', user.id);
        }
      } else {
        countQuery = countQuery.eq('user_id', user.id);
      }

      const { count: totalSessions } = await countQuery;
      const resolved = totalSessions || 0;
      setIssuesResolved(resolved);

      // Estimate time saved (assume ~15 minutes per troubleshooting session)
      const estimatedHours = Math.round((resolved * 15) / 60 * 10) / 10;
      setHoursSaved(estimatedHours);

      const formattedChats = (chats || []).map((chat: any) => ({
        id: chat.id,
        title: chat.title || "Untitled Conversation",
        created_at: chat.created_at,
        last_message: chat.chat_messages?.[0]?.content?.substring(0, 85) || "No messages yet"
      }));

      setRecentChats(formattedChats);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setIsTeamOwner(false);
      setIsBusinessUser(false);
      setIsTeamLeader(false);
      setTeamReportsLink(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar - Premium Glass */}
      <nav className="border-b border-white/10 bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white ring-1 ring-white/20">🔧</div>
              <span className="font-semibold text-xl tracking-tight">MyTech-Fix</span>
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-primary">Dashboard</Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{username}</span>
            </div>

            <Link href="/account" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Account
            </Link>

            <ThemeToggle />

            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-muted-foreground hover:text-red-400"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-semibold tracking-tighter text-white">
              {greeting}, {username.split(' ')[0]}
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Let's get your tech working smoothly today.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              size="lg"
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Link href="/chat">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="h-4 w-4" /> Start New Session
              </Button>
            </Link>
            
            {/* Upgrade Plan - only visible to team owners (or non-team users) */}
            {(!isBusinessUser || isTeamOwner) && (
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="gap-2">
                  Upgrade Plan
                </Button>
              </Link>
            )}

            {/* Manage Team - only visible to team owners */}
            {isTeamOwner && (
              <Link href="/teams">
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="h-4 w-4" /> Manage Team
                </Button>
              </Link>
            )}

            {/* View Reports - only for team owners/admins */}
            {isTeamLeader && teamReportsLink && (
              <Link href={teamReportsLink}>
                <Button size="lg" variant="outline" className="gap-2">
                  <BarChart3 className="h-4 w-4" /> View Reports
                </Button>
              </Link>
            )}

            {/* Device Inventory - available to all business team members and owners */}
            {isBusinessUser && (
              <Link href="/inventory">
                <Button size="lg" variant="outline" className="gap-2">
                  <Database className="h-4 w-4" /> Device Inventory
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Usage Snapshot */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {[1,2].map(i => (
              <div key={i} className="h-[160px] bg-card rounded-2xl skeleton" />
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid md:grid-cols-2 gap-4 mb-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Plan & Usage */}
            <motion.div variants={fadeInUp} className="h-full">
            <Card className="h-full border-white/10 bg-gradient-to-br from-card to-background/80 card-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-medium text-primary uppercase tracking-wider">Current Plan</div>
                    <div className="text-2xl font-semibold mt-1">{getTierLabel(tier)}</div>
                  </div>
                  <Link href="/pricing">
                    <Button variant="outline" size="sm" className="border-white/10">Manage Plan</Button>
                  </Link>
                </div>

                <div className="flex items-baseline gap-3">
                  {isUnlimitedChats ? (
                    <>
                      <div className="text-5xl font-semibold text-primary">Unlimited</div>
                      <div className="text-xl text-muted-foreground">chats</div>
                    </>
                  ) : (
                    <>
                      <div className="text-5xl font-semibold tabular-nums text-primary">{remainingChats}</div>
                      <div className="text-xl text-muted-foreground">chats left this period</div>
                    </>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {sessionsUsed} used • {getTierLabel(tier)} {isUnlimitedChats ? 'includes unlimited chats' : `includes up to ${getSessionLimit(tier)} chats`}
                </div>
              </CardContent>
            </Card>
            </motion.div>

            {/* Value Delivered */}
            <motion.div variants={fadeInUp} className="h-full">
            <Card className="h-full bg-card/80 border-white/10 card-premium">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                  <Zap className="h-4 w-4" /> This Period
                </div>
                <div className="text-4xl font-semibold mb-1">{issuesResolved}</div>
                <div className="text-sm text-muted-foreground">issues resolved</div>
                <div className="mt-3 text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> ~{hoursSaved} hours saved
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Image Generation Usage Card */}
        <div className="mb-8">
          <Card className="card-premium border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Zap className="h-4 w-4" /> AI Image Generation
                  </div>
                  <div className="text-lg font-semibold mt-1">Visual Aids & Diagrams</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold tabular-nums text-primary">
                    {imagesUsed} <span className="text-base font-normal text-muted-foreground">/ {imageLimit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">used this period</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/10 rounded-full h-2.5 mb-3 overflow-hidden">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all" 
                  style={{ width: `${imageLimit > 0 ? Math.min((imagesUsed / imageLimit) * 100, 100) : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">
                  {imageLimit - imagesUsed} images remaining
                  {imageResetDate && isMonthlyImageLimit(tier) && (
                    <span className="ml-2 text-xs">• resets {new Date(imageResetDate).toLocaleDateString()}</span>
                  )}
                </div>
                {(imagesUsed / imageLimit > 0.6 || imagesUsed >= imageLimit) && (
                  <Link href="/pricing?buy=images">
                    <Button size="sm" variant="outline" className="text-xs border-primary/30 hover:bg-primary/10">
                      Buy More Images
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* === NEW: Automated Smart Diagnostics Section (prominent, per requirements) === */}
        <div className="mb-8">
          <Card className="card-premium border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary uppercase tracking-wider">Smart Diagnostics</div>
                    <div className="text-lg font-semibold">Automated Network Health Check</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold tabular-nums text-primary">
                    {diagnosticLimit - diagnosticsUsed} <span className="text-base font-normal text-muted-foreground">/ {diagnosticLimit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">runs remaining</div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-4">
                Run automatic tests (speed, latency, etc.) or use <strong>Check WiFi Interference</strong> to see which channels your neighbors are using and get the best recommendation (usually channel 1, 6, or 11). MyTech-Fix can then give you step-by-step fixes.
                {diagnosticResetDate && isMonthlyDiagnosticLimit(tier) && (
                  <span className="ml-2">• resets {new Date(diagnosticResetDate).toLocaleDateString()}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={startFullDiagnostic}
                  disabled={diagnosticLimit - diagnosticsUsed <= 0 || isRunningDiagnostic}
                  className="btn-premium px-8"
                >
                  {isRunningDiagnostic ? 'Running Tests...' : 'Run Full Network Health Check'}
                </Button>

                {/* Quick individual tests (do not consume quota) */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startIndividualTest('latency')}
                  disabled={isRunningDiagnostic}
                  className="border-white/10"
                >
                  Test Latency & Loss
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startIndividualTest('speed')}
                  disabled={isRunningDiagnostic}
                  className="border-white/10"
                >
                  Test Speed
                </Button>

                {/* New WiFi Channel Scanner (consumes 1 diagnostic run quota per the tier rules) */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openWifiChannelScanner}
                  disabled={diagnosticLimit - diagnosticsUsed <= 0 || isRunningDiagnostic}
                  className="border-white/10"
                >
                  Check WiFi Interference
                </Button>
              </div>

              {diagnosticsUsed > 0 && diagnosticsUsed / diagnosticLimit > 0.7 && (
                <p className="text-xs text-amber-400 mt-3">Running low on diagnostic runs — consider upgrading for more frequent checks.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Diagnostic History (lightweight list) */}
        {recentDiagnostics.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" /> Recent Diagnostic Runs
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={fetchDashboardData} className="text-xs">Refresh</Button>
                <Link href="/diagnostics" className="text-xs text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              {recentDiagnostics.map((d) => {
                const st = (d.overall_status || 'unknown') as TestStatus;
                const colors = getStatusColor(st);
                return (
                  <div
                    key={d.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-card/60 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => openDiagnosticView(d)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-0.5 rounded text-[10px] font-medium border ${colors.border} ${colors.text}`}>
                        {st.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {new Date(d.created_at).toLocaleString()} • {d.run_type === 'wifi_channel_scan' ? 'WiFi Channel Scan' : (d.run_type || 'full')}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{d.summary || 'Run completed'}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs border-white/10">View Report</Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Quick Start */}
          <div className="lg:col-span-5">
            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Quick Start</h2>
                <p className="text-sm text-muted-foreground">Jump into the most common issues</p>
              </div>
            </div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {[
                { icon: Wifi, label: "Wi-Fi Problems", desc: "Dropping, slow, or no connection" },
                { icon: Monitor, label: "Computer Issues", desc: "Freezing, slow, crashes" },
                { icon: Smartphone, label: "Phone & Tablet", desc: "Connectivity or app problems" },
                { icon: Home, label: "Smart Home", desc: "Lights, cameras, devices offline" },
              ].map((item, i) => (
                <Link key={i} href="/chat">
                  <motion.div variants={fadeInUp} className="group h-full card-premium border border-white/10 hover:border-primary/40 bg-card rounded-2xl p-5 transition-all flex flex-col">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors mb-4">
                      <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <h3 className="font-semibold text-[15px] mb-1">{item.label}</h3>
                    <p className="text-sm text-muted-foreground flex-1">{item.desc}</p>
                    <div className="mt-3 text-xs font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Start troubleshooting <ArrowRight className="h-3 w-3" />
                    </div>
                  </motion.div>
                </Link>
              ))}

              {/* Business-specific quick starts for business users */}
              {(tier === 'business' || tier === 'business_plus') && (
                <>
                  <Link href="/chat">
                    <motion.div variants={fadeInUp} className="group h-full card-premium border border-primary/20 hover:border-primary/50 bg-primary/5 rounded-2xl p-5 transition-all flex flex-col">
                      <div className="text-xs font-semibold text-primary mb-1">B2B</div>
                      <h3 className="font-semibold text-[15px] mb-1">POS / Payment Terminal</h3>
                      <p className="text-sm text-muted-foreground flex-1">POS system not connecting or processing payments</p>
                    </motion.div>
                  </Link>
                  <Link href="/chat">
                    <motion.div variants={fadeInUp} className="group h-full card-premium border border-primary/20 hover:border-primary/50 bg-primary/5 rounded-2xl p-5 transition-all flex flex-col">
                      <div className="text-xs font-semibold text-primary mb-1">B2B</div>
                      <h3 className="font-semibold text-[15px] mb-1">VoIP Phone Problems</h3>
                      <p className="text-sm text-muted-foreground flex-1">Office phones have no dial tone or poor quality</p>
                    </motion.div>
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-7">
            <div className="mb-4 flex items-center justify-between px-1">
              <h2 className="text-xl font-semibold tracking-tight">Recent Troubleshooting</h2>
              <Link href="/history" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <Card className="card-premium border-white/10">
              <CardContent className="p-0">
                {loading ? (
                  <div className="divide-y divide-white/10">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="px-6 py-4 animate-pulse">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/10 rounded w-3/4"></div>
                            <div className="h-3 bg-white/10 rounded w-1/2"></div>
                          </div>
                          <div className="h-3 bg-white/10 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentChats.length > 0 ? (
                  <motion.div 
                    className="divide-y divide-white/10"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                  >
                    {recentChats.map((chat, index) => {
                      // Simple category inference for demo
                      const getCategory = (title: string) => {
                        const lower = title.toLowerCase();
                        if (lower.includes('wifi') || lower.includes('internet') || lower.includes('network')) return { label: 'Wi-Fi', color: 'bg-blue-500/15 text-blue-400' };
                        if (lower.includes('printer')) return { label: 'Printer', color: 'bg-purple-500/15 text-purple-400' };
                        if (lower.includes('smart') || lower.includes('light') || lower.includes('camera')) return { label: 'Smart Home', color: 'bg-emerald-500/15 text-emerald-400' };
                        if (lower.includes('mac') || lower.includes('laptop') || lower.includes('computer')) return { label: 'Computer', color: 'bg-orange-500/15 text-orange-400' };
                        return { label: 'General', color: 'bg-white/10 text-muted-foreground' };
                      };

                      const category = getCategory(chat.title);
                      const status = index === 0 ? 'Resolved' : 'In Progress'; // Demo status
                      const statusColor = status === 'Resolved' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400';

                      return (
                        <motion.div key={chat.id} variants={fadeInUp}>
                        <Link 
                          href={`/chat?session=${chat.id}`}
                          className="block px-6 py-4 hover:bg-white/5 transition-all group"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${category.color}`}>
                                  {category.label}
                                </span>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor}`}>
                                  {status}
                                </span>
                              </div>
                              
                              <div className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                                {chat.title}
                              </div>
                              <div className="text-sm text-muted-foreground line-clamp-2 mt-1 pr-4">
                                {chat.last_message}
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1 text-xs text-muted-foreground shrink-0">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(chat.created_at).toLocaleDateString()}
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all sm:mt-1" />
                            </div>
                          </div>
                        </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Zap className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">No recent sessions yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
                      Start your first troubleshooting session and it will appear here.
                    </p>
                    <Link href="/chat">
                      <Button className="btn-premium">Start Your First Session</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upgrade Banner */}
        {(tier === 'free_trial' || tier === 'single_use') && (
          <div className="mt-10 rounded-3xl bg-gradient-to-r from-primary to-cyan-600 p-8 text-primary-foreground card-premium">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">Running low on chats?</h3>
                <p className="text-primary-foreground/80 mt-1 max-w-md">
                  Upgrade to the Home Plan for 30 chats per month, priority responses, and more.
                </p>
              </div>
              <Link href="/pricing">
                <Button size="lg" variant="secondary" className="bg-white text-black hover:bg-white/90 shrink-0 btn-premium">
                  See Upgrade Options
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* === Diagnostics Runner / Viewer Dialog === */}
      <Dialog open={showDiagnosticsDialog} onOpenChange={(open) => { if (!open) closeDiagnosticsDialog(); }}>
        <DialogContent className="max-w-3xl max-h-[85vh] bg-background border-white/10 flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> {viewingDiagnostic && (finalDiagnosticResults || liveResults)?.wifiChannelScan ? 'WiFi Channel Scan Report' : (viewingDiagnostic ? 'Diagnostic Report' : 'Smart Diagnostics')}
            </DialogTitle>
            <DialogDescription>
              {isRunningDiagnostic ? 'Running tests client-side…' : viewingDiagnostic ? 'Historical run details' : 'Results + MyTech-Fix analysis'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto pr-2 -mr-2 space-y-4">
            {/* Live progress during run */}
            {isRunningDiagnostic && (
              <div className="space-y-4 py-4">
                <div className="flex justify-between text-sm">
                  <div className="font-medium">{currentTestName || 'Preparing...'}</div>
                  <div>{diagnosticProgress}%</div>
                </div>
                <div className="w-full bg-white/10 rounded h-2 overflow-hidden">
                  <div className="bg-primary h-2 transition-all" style={{ width: `${diagnosticProgress}%` }} />
                </div>
                <div className="text-xs text-muted-foreground">Tests run entirely in your browser for privacy and accuracy.</div>
              </div>
            )}

            {/* Live / Final Results Grid + Analysis (shared viewer) */}
            {(liveResults || finalDiagnosticResults) && !isRunningDiagnostic && (
              <DiagnosticResultsViewer
                results={finalDiagnosticResults || liveResults}
                analysis={diagnosticAnalysis}
                onRequestAnalysis={requestAIAnalysis}
                isAnalyzing={isAnalyzing}
              />
            )}

            {/* WiFi Channel Scan results (when viewing a saved wifi_channel_scan run or after scanner save) */}
            {(finalDiagnosticResults || liveResults)?.wifiChannelScan && !isRunningDiagnostic && (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-primary">WiFi Channel Interference Results</div>
                <WifiChannelVisualizer
                  scan={(finalDiagnosticResults || liveResults).wifiChannelScan}
                  userChannel={(finalDiagnosticResults || liveResults).userChannel}
                />
              </div>
            )}

            {/* View-only historical content */}
            {viewingDiagnostic && !finalDiagnosticResults && !isRunningDiagnostic && (
              <div className="text-sm text-muted-foreground">Loading full report…</div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10 mt-2">
            <Button variant="outline" onClick={closeDiagnosticsDialog}>Close</Button>
            {finalDiagnosticResults && !isRunningDiagnostic && (
              <Button onClick={fetchDashboardData} variant="outline">Refresh Dashboard</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* === NEW: WiFi Channel Scanner / Interference Analyzer Dialog (MVP manual input) === */}
      <Dialog open={showWifiScanner} onOpenChange={(open) => { if (!open) closeWifiScanner(); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] bg-background border-white/10 flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" /> WiFi Channel Scanner / Interference Analyzer
            </DialogTitle>
            <DialogDescription>
              Identify crowded channels from neighboring networks. Results are saved as a diagnostic run and can be analyzed by MyTech-Fix.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto pr-2 -mr-2 space-y-5 text-sm">
            {/* Improved Guidance for general users */}
            <div className="bg-muted/40 border border-white/10 rounded-xl p-4 text-sm">
              <div className="font-semibold mb-2 flex items-center gap-2">
                <span>How to use this tool (2 minutes)</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground pl-1">
                <li><strong>Find your router&apos;s channel:</strong> Log into your router (usually at 192.168.1.1 or 192.168.0.1 in a browser). Look for &quot;Wireless&quot; or &quot;WiFi settings&quot; — it will show your current channel (often 1, 6, or 11).</li>
                <li><strong>See neighboring networks:</strong> On your phone, go to Wi-Fi settings and look at the list of networks. For exact channels, use a free app: &quot;WiFi Analyzer&quot; (Android) or &quot;Airport Utility&quot; (iOS, enable in settings).</li>
                <li><strong>Enter what you see below</strong> (you don&apos;t need every SSID — just the channels matter most).</li>
              </ol>
              <div className="mt-2 text-[11px] text-muted-foreground">Tip: Most interference happens on 2.4 GHz. Channels 1, 6, and 11 don&apos;t overlap with each other.</div>
            </div>

            {/* Your current channel - more prominent */}
            <div className="space-y-1.5">
              <div className="font-medium">1. What channel is YOUR router using right now?</div>
              <div className="flex items-center gap-3">
                <select
                  value={userWifiChannel ?? ''}
                  onChange={(e) => setUserWifiChannel(e.target.value ? Number(e.target.value) : null)}
                  className="bg-card border border-white/10 rounded-lg px-4 py-2 text-sm font-medium w-56"
                >
                  <option value="">I don&apos;t know yet (recommended to check)</option>
                  {[1,2,3,4,5,6,7,8,9,10,11].map((c) => (
                    <option key={c} value={c}>Channel {c}</option>
                  ))}
                </select>
                <span className="text-xs text-muted-foreground">Most people are on 1, 6, or 11</span>
              </div>
            </div>

            {/* Nearby networks - much friendlier input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">2. Add the networks you can see around you</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={addWifiNetwork} className="border-white/10 text-xs">+ Add one</Button>
                  <Button variant="ghost" size="sm" onClick={loadExampleCrowded24} className="text-xs">Use example</Button>
                </div>
              </div>

              {/* Quick add helpers for general users */}
              <div className="flex flex-wrap gap-1.5">
                <div className="text-[10px] text-muted-foreground self-center mr-1">Quick add neighbors on common channels:</div>
                {[1,6,11].map(ch => (
                  <Button key={ch} variant="outline" size="sm" className="h-7 px-2 text-xs border-white/10" onClick={() => {
                    // Add 2-3 anonymous on that channel
                    const newOnes = Array.from({length: 2}, () => ({
                      id: crypto.randomUUID(),
                      ssid: `Neighbor on ${ch}`,
                      channel: ch
                    }));
                    setWifiNetworks(prev => [...prev, ...newOnes]);
                  }}>
                    +2 on Ch {ch}
                  </Button>
                ))}
              </div>

              {wifiNetworks.length === 0 && (
                <div className="text-xs text-muted-foreground bg-card/50 border border-white/10 rounded-lg p-3">
                  No networks added. Use the quick buttons above or &quot;+ Add one&quot; for each network you see.
                </div>
              )}

              <div className="space-y-1.5">
                {wifiNetworks.map((n, index) => (
                  <div key={n.id} className="flex items-center gap-2 bg-card/60 border border-white/10 rounded-lg p-2 pl-3">
                    <div className="text-[10px] text-muted-foreground w-4 text-right">#{index + 1}</div>
                    <input
                      type="text"
                      placeholder="Network name (optional)"
                      value={n.ssid}
                      onChange={(e) => updateWifiNetwork(n.id, 'ssid', e.target.value)}
                      className="flex-1 bg-background border border-white/10 rounded-md px-2.5 py-1 text-sm"
                    />
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">on</div>
                    <select
                      value={n.channel}
                      onChange={(e) => updateWifiNetwork(n.id, 'channel', Number(e.target.value))}
                      className="bg-background border border-white/10 rounded-md px-2 py-1 text-sm w-24"
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11].map((c) => (
                        <option key={c} value={c}>Ch {c}</option>
                      ))}
                      {[36,40,44,48,149,153,157,161].map((c) => (
                        <option key={c} value={c}>Ch {c} (5G)</option>
                      ))}
                    </select>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeWifiNetwork(n.id)} 
                      className="h-7 w-7 text-red-400/80 hover:text-red-400 hover:bg-red-500/10"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Analyze button - clearer */}
            <div className="pt-1">
              <Button 
                onClick={runWifiChannelAnalysis} 
                className="btn-premium w-full" 
                disabled={wifiNetworks.length === 0}
                size="lg"
              >
                Analyze My WiFi Channels
              </Button>
              <div className="text-center text-[10px] text-muted-foreground mt-1">This runs locally in your browser — nothing is sent yet.</div>
            </div>

            {/* Results visual - much friendlier presentation */}
            {wifiScanResult && (
              <div className="space-y-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-primary text-base">Your WiFi Interference Results</div>
                  <div className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Local analysis</div>
                </div>

                <WifiChannelVisualizer scan={wifiScanResult} userChannel={userWifiChannel || undefined} />

                {/* Summary callout */}
                <div className="bg-card/60 border border-white/10 rounded-xl p-3 text-sm">
                  {wifiScanResult.summary}
                </div>

                {/* Ask MyTech-Fix - prominent and clear */}
                <div className="pt-1">
                  {!wifiAnalysis ? (
                    <div className="space-y-2">
                      <Button
                        onClick={saveAndAskGrokForWifi}
                        disabled={isSavingWifiScan || (diagnosticLimit - diagnosticsUsed <= 0)}
                        className="w-full btn-premium py-6 text-base"
                        size="lg"
                      >
                        {isSavingWifiScan ? 'Saving & asking MyTech-Fix…' : 'Get personalized advice from MyTech-Fix'}
                      </Button>
                      <div className="text-center text-xs text-muted-foreground">
                        This will use 1 of your diagnostic runs and save the scan to your history
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-sm font-semibold text-primary">MyTech-Fix&apos;s WiFi Advice</div>
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed">
                        {wifiAnalysis}
                      </div>
                    </div>
                  )}
                </div>

                {diagnosticLimit - diagnosticsUsed <= 0 && !wifiAnalysis && (
                  <p className="text-xs text-amber-400 bg-amber-500/10 p-2 rounded">You have no diagnostic runs remaining this period. You can still view the local analysis above.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-2">
            <div className="text-xs text-muted-foreground">
              Changes are local until you click &quot;Get personalized advice&quot;
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={closeWifiScanner}>Close</Button>
              {wifiScanResult && !wifiAnalysis && (
                <Button variant="outline" onClick={() => { setWifiScanResult(null); setWifiAnalysis(null); }}>Edit Inputs</Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
