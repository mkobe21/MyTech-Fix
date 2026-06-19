'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Clock, Search, ArrowUpDown, Download, Trash2, Activity, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { getStatusColor, type FullDiagnosticResults, type TestStatus } from '@/lib/diagnostics';
import { DiagnosticResultsViewer } from '@/components/DiagnosticResultsViewer';
import { WifiChannelVisualizer } from '@/components/WifiChannelVisualizer';

export default function DiagnosticRunsPage() {
  const router = useRouter();
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<'All' | 'Good' | 'Fair' | 'Poor'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Detail viewer modal state (mirrors dashboard behavior for viewing + on-demand AI analysis)
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedDiag, setSelectedDiag] = useState<any>(null);
  const [selectedResults, setSelectedResults] = useState<any>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Runner states (for "Run New" directly from this page - reuses same APIs + client lib)
  const [showRunnerDialog, setShowRunnerDialog] = useState(false);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [currentTestName, setCurrentTestName] = useState('');
  const [liveResults, setLiveResults] = useState<any>(null);
  const [finalDiagnosticResults, setFinalDiagnosticResults] = useState<any>(null);
  const [currentDiagnosticId, setCurrentDiagnosticId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllDiagnostics = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (!user) {
          router.push('/auth/signin');
          return;
        }

        // Personal diagnostics only (table + RLS is user_id scoped; team diagnostics not yet modeled in schema)
        const { data: diags } = await supabaseBrowser
          .from('user_diagnostics')
          .select('id, created_at, overall_status, summary, ai_analysis, run_type, results, tier_at_run')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setDiagnostics(diags || []);
      } catch (err) {
        console.error('Failed to load diagnostic runs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDiagnostics();
  }, [router]);

  const refreshList = async () => {
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) return;
      const { data: diags } = await supabaseBrowser
        .from('user_diagnostics')
        .select('id, created_at, overall_status, summary, ai_analysis, run_type, results, tier_at_run')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setDiagnostics(diags || []);
    } catch {}
  };

  // Open a historical run in the detail dialog (load full if needed, though list fetch includes results)
  const openReport = async (diag: any) => {
    setSelectedDiag(diag);
    setSelectedResults(diag.results || null);
    setSelectedAnalysis(diag.ai_analysis || null);
    setShowReportDialog(true);

    // If lightweight row somehow lacks results, fetch the full record
    if (!diag.results && diag.id) {
      try {
        const { data: full } = await supabaseBrowser
          .from('user_diagnostics')
          .select('results, ai_analysis, overall_status')
          .eq('id', diag.id)
          .maybeSingle();
        if (full?.results) {
          setSelectedResults(full.results);
          if (full.ai_analysis) setSelectedAnalysis(full.ai_analysis);
        }
      } catch {}
    }
  };

  const closeReportDialog = () => {
    setShowReportDialog(false);
    // keep selected for a moment in case of analyze race; cleared on next open
  };

  // Inject the selected diagnostic (from history) into chat.
  const injectSelectedDiagnosticToChat = () => {
    if (selectedDiag?.id) {
      closeReportDialog();
      router.push(`/chat?diagnostic=${selectedDiag.id}`);
    }
  };

  // Request AI analysis for the currently selected report (persists via the API route)
  const requestAIAnalysis = async () => {
    if (!selectedDiag || !selectedResults) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/diagnostics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedDiag.id, results: selectedResults }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Analysis failed.');
      } else {
        setSelectedAnalysis(data.analysis);
        // Update in main list too so badge/list reflects immediately
        setDiagnostics((prev) =>
          prev.map((d) => (d.id === selectedDiag.id ? { ...d, ai_analysis: data.analysis } : d))
        );
        toast.success('MyTech-Fix analysis ready.');
      }
    } catch (e) {
      toast.error('Could not get analysis from MyTech-Fix right now.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteDiagnostic = async (id: string, createdAt: string) => {
    if (!confirm(`Are you sure you want to delete the diagnostic run from ${new Date(createdAt).toLocaleString()}?\nThis cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabaseBrowser
        .from('user_diagnostics')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDiagnostics((prev) => prev.filter((d) => d.id !== id));

      if (selectedDiag?.id === id) {
        setShowReportDialog(false);
        setSelectedDiag(null);
        setSelectedResults(null);
        setSelectedAnalysis(null);
      }

      toast.success('Diagnostic run deleted');
    } catch (err) {
      console.error('Failed to delete diagnostic:', err);
      toast.error('Failed to delete diagnostic run. Please try again.');
    }
  };

  // Export all visible (filtered) runs to CSV - flattens key metrics from results JSONB
  const handleExportCSV = async () => {
    try {
      toast.loading('Preparing CSV export...', { id: 'export-diag' });

      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to export', { id: 'export-diag' });
        return;
      }

      // Re-fetch full for export (in case filters), personal only
      const { data: all } = await supabaseBrowser
        .from('user_diagnostics')
        .select('id, created_at, overall_status, summary, ai_analysis, run_type, results, tier_at_run')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!all || all.length === 0) {
        toast.error('No diagnostic runs to export', { id: 'export-diag' });
        return;
      }

      const rows: string[][] = [
        ['Date', 'Time', 'Run Type', 'Overall', 'Download (Mbps)', 'Upload (Mbps)', 'Ping (ms)', 'Packet Loss (%)', 'DNS (ms)', 'WiFi Quality', 'Has AI Analysis', 'Summary', 'Tier at Run', 'ID']
      ];

      (all as any[]).forEach((d) => {
        const date = new Date(d.created_at);
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        const r = d.results || {};
        const internet = r.internet || {};
        const latency = r.latency || {};
        const dns = r.dns || {};
        const wifi = r.wifi || {};

        rows.push([
          dateStr,
          timeStr,
          d.run_type === 'wifi_channel_scan' ? 'WiFi Channel Scan' : (d.run_type || 'full'),
          (d.overall_status || '').toUpperCase(),
          internet.downloadMbps != null ? String(internet.downloadMbps) : '',
          internet.uploadMbps != null ? String(internet.uploadMbps) : '',
          internet.pingMs != null ? String(internet.pingMs) : (latency.averageMs != null ? String(latency.averageMs) : ''),
          latency.packetLossPercent != null ? String(latency.packetLossPercent) : '',
          dns.timeMs != null ? String(dns.timeMs) : '',
          wifi.quality || '',
          d.ai_analysis ? 'Yes' : 'No',
          (d.summary || '').replace(/[\n\r]/g, ' '),
          d.tier_at_run || '',
          d.id
        ]);
      });

      const csvContent = rows
        .map((row) =>
          row
            .map((cell) => {
              const str = String(cell ?? '').replace(/"/g, '""');
              return str.includes(',') || str.includes('"') || str.includes('\n')
                ? `"${str}"`
                : str;
            })
            .join(',')
        )
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStamp = new Date().toISOString().split('T')[0];
      link.download = `mytech-fix-diagnostics-${dateStamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${all.length} diagnostic runs to CSV`, { id: 'export-diag' });
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export diagnostics. Please try again.', { id: 'export-diag' });
    }
  };

  // Client-side filter + sort (same pattern as /history)
  const filteredDiagnostics = diagnostics.filter((d) => {
    const text = `${d.summary || ''} ${d.run_type || ''} ${d.overall_status || ''}`.toLowerCase();
    const matchesSearch = !searchTerm || text.includes(searchTerm.toLowerCase());

    const st = (d.overall_status || '').toLowerCase();
    const matchesStatus =
      activeStatus === 'All' ||
      (activeStatus === 'Good' && st === 'good') ||
      (activeStatus === 'Fair' && st === 'fair') ||
      (activeStatus === 'Poor' && st === 'poor');

    return matchesSearch && matchesStatus;
  });

  const sortedDiagnostics = [...filteredDiagnostics].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  // --- Runner: allow starting a fresh full diagnostic directly from the archive page ---
  // (replicates the essential flow from dashboard so the page is self-sufficient)
  const startNewDiagnostic = async () => {
    // We don't have live quota numbers here; the /start endpoint will enforce + return 429 if over limit.
    setShowRunnerDialog(true);
    setIsRunningDiagnostic(true);
    setDiagnosticProgress(0);
    setCurrentTestName('');
    setLiveResults(null);
    setFinalDiagnosticResults(null);
    setSelectedAnalysis(null); // for potential auto-open after

    try {
      const startRes = await fetch('/api/diagnostics/start', { method: 'POST' });
      const startData = await startRes.json();
      if (!startRes.ok) {
        toast.error(startData.error || 'Could not start diagnostic run (quota may be reached).');
        setIsRunningDiagnostic(false);
        setShowRunnerDialog(false);
        return;
      }
      setCurrentDiagnosticId(startData.id);

      const results = await (await import('@/lib/diagnostics')).runFullDiagnostic((testName, pct) => {
        setCurrentTestName(testName);
        setDiagnosticProgress(pct);
      });

      setLiveResults(results);

      const completeRes = await fetch('/api/diagnostics/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: startData.id, results, overall_status: results.overall }),
      });
      if (!completeRes.ok) {
        const err = await completeRes.json().catch(() => ({}));
        toast.error(err.error || 'Failed to save the run (quota already counted).');
      } else {
        toast.success('Diagnostic run saved.');
      }

      setFinalDiagnosticResults(results);

      // Refresh list and auto-open the just-completed report in the viewer
      await refreshList();
      // Find the fresh row (or use in-memory)
      const fresh = (await supabaseBrowser
        .from('user_diagnostics')
        .select('*')
        .eq('id', startData.id)
        .maybeSingle()).data;

      setIsRunningDiagnostic(false);
      setShowRunnerDialog(false);

      // Open viewer immediately with what we have (prefer DB row for ai_analysis etc.)
      const toView = fresh || { id: startData.id, results, overall_status: results.overall, run_type: 'full', created_at: new Date().toISOString(), summary: 'Completed' };
      // slight delay so dialog close anim settles
      setTimeout(() => {
        setSelectedDiag(toView);
        setSelectedResults(results);
        setSelectedAnalysis(toView.ai_analysis || null);
        setShowReportDialog(true);
      }, 120);
    } catch (e: any) {
      console.error('Diagnostic run from page failed:', e);
      toast.error('Diagnostic run failed. Please try again.');
      setIsRunningDiagnostic(false);
      setShowRunnerDialog(false);
    } finally {
      setCurrentTestName('');
    }
  };

  const closeRunnerDialog = () => {
    if (isRunningDiagnostic) {
      // prevent accidental close mid-run
      if (!confirm('A diagnostic is still running. Close anyway?')) return;
    }
    setShowRunnerDialog(false);
    setIsRunningDiagnostic(false);
    setDiagnosticProgress(0);
    setCurrentTestName('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header + actions */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <div className="text-sm text-muted-foreground">Your complete diagnostic history</div>
            <div className="text-3xl font-semibold tracking-tight mt-1">
              {loading ? '...' : `${diagnostics.length} runs`}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={startNewDiagnostic}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl gap-2"
              disabled={isRunningDiagnostic}
            >
              <Activity className="h-4 w-4" />
              Run New
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="gap-2 border-white/10 hover:bg-white/5"
              disabled={loading || diagnostics.length === 0}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters (search + status pills + sort) */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search summaries, types, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-white/10"
            />
          </div>

          {/* Status Filters - analogous to category pills */}
          <div className="flex flex-wrap gap-2">
            {(['All', 'Good', 'Fair', 'Poor'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-4 py-1.5 text-sm rounded-full border transition-all ${
                  activeStatus === status
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-white/10 hover:border-white/20'
                }`}
              >
                {status}
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
            </select>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <div className="text-sm text-muted-foreground mb-4 px-1">
            Showing {sortedDiagnostics.length} of {diagnostics.length} runs
            {searchTerm && ` matching "${searchTerm}"`}
            {activeStatus !== 'All' && ` • ${activeStatus} only`}
          </div>
        )}

        {/* Runs List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-premium border border-white/10 rounded-2xl p-6 animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 w-16 bg-white/10 rounded-full" />
                      <div className="h-5 w-14 bg-white/10 rounded-full" />
                    </div>
                    <div className="h-5 bg-white/10 rounded w-2/3" />
                    <div className="h-4 bg-white/10 rounded w-4/5" />
                  </div>
                  <div className="h-4 w-24 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedDiagnostics.length > 0 ? (
          <motion.div
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {sortedDiagnostics.map((d) => {
              const st = (d.overall_status || 'unknown') as TestStatus;
              const colors = getStatusColor(st);
              return (
                <motion.div key={d.id} variants={fadeInUp}>
                  <div
                    onClick={() => openReport(d)}
                    className="block card-premium border border-white/10 hover:border-primary/40 rounded-2xl p-6 transition-all group cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.border} ${colors.text}`}>
                            {st.toUpperCase()}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(d.created_at).toLocaleDateString()} at {new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-muted-foreground">
                            {d.run_type || 'full'}
                          </span>
                          {d.ai_analysis && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">AI analyzed</span>
                          )}
                        </div>

                        <div className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {d.summary || 'Network health check completed'}
                        </div>

                        {d.tier_at_run && (
                          <div className="text-xs text-muted-foreground mt-1">Tier at time: {d.tier_at_run}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-2 text-sm shrink-0">
                        <span className="text-primary font-medium group-hover:underline">View full report</span>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteDiagnostic(d.id, d.created_at);
                          }}
                          className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete run"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="card-premium border border-white/10 rounded-3xl p-16 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Filter className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No diagnostic runs found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {searchTerm || activeStatus !== 'All'
                ? 'Try adjusting your search or filters.'
                : "You haven't run any diagnostics yet."}
            </p>
            <Button onClick={startNewDiagnostic} className="mt-6 btn-premium">Run Your First Diagnostic</Button>
          </div>
        )}
      </div>

      {/* Detail Report Dialog (re-uses the shared viewer + supports on-demand MyTech-Fix analysis) */}
      <Dialog open={showReportDialog} onOpenChange={(open) => { if (!open) closeReportDialog(); }}>
        <DialogContent className="max-w-3xl max-h-[85vh] bg-background border-white/10 flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> Diagnostic Report
            </DialogTitle>
            <DialogDescription>
              {selectedDiag && new Date(selectedDiag.created_at).toLocaleString()} • {(selectedDiag?.run_type === 'wifi_channel_scan' ? 'WiFi Channel Scan' : (selectedDiag?.run_type || 'full')).toUpperCase()}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto pr-2 -mr-2 space-y-4">
            {selectedResults ? (
              <DiagnosticResultsViewer
                results={selectedResults}
                analysis={selectedAnalysis}
                onRequestAnalysis={requestAIAnalysis}
                isAnalyzing={isAnalyzing}
                onInjectToChat={injectSelectedDiagnosticToChat}
              />
            ) : (
              <div className="text-sm text-muted-foreground">Loading full results…</div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10 mt-2">
            <Button variant="outline" onClick={closeReportDialog}>Close</Button>
            <Button variant="outline" onClick={refreshList}>Refresh List</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Runner Progress Dialog (shown when starting a new run from this page) */}
      <Dialog open={showRunnerDialog} onOpenChange={(open) => { if (!open) closeRunnerDialog(); }}>
        <DialogContent className="max-w-md bg-background border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> Running Network Health Check
            </DialogTitle>
            <DialogDescription>
              Tests execute in your browser for accuracy and privacy.
            </DialogDescription>
          </DialogHeader>

          {isRunningDiagnostic && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between text-sm">
                <div className="font-medium">{currentTestName || 'Preparing...'}</div>
                <div>{diagnosticProgress}%</div>
              </div>
              <div className="w-full bg-white/10 rounded h-2 overflow-hidden">
                <div className="bg-primary h-2 transition-all" style={{ width: `${diagnosticProgress}%` }} />
              </div>
              <div className="text-xs text-muted-foreground">Do not close this window until complete.</div>
            </div>
          )}

          {finalDiagnosticResults && !isRunningDiagnostic && (
            <div className="text-sm">Run complete. Opening report…</div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={closeRunnerDialog} disabled={isRunningDiagnostic}>
              {isRunningDiagnostic ? 'Running...' : 'Close'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
