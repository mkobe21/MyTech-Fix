'use client';

import { Button } from '@/components/ui/button';
import { getStatusColor, type FullDiagnosticResults, type TestStatus } from '@/lib/diagnostics';
import { WifiChannelVisualizer } from './WifiChannelVisualizer';

interface DiagnosticResultsViewerProps {
  results: FullDiagnosticResults | any | null;
  analysis: string | null;
  onRequestAnalysis?: () => void;
  isAnalyzing?: boolean;
  /** If true, always show the analysis button area even if no results (for empty state) */
  compact?: boolean;
}

/**
 * Reusable presentational component for showing diagnostic test results + MyTech-Fix analysis.
 * Used inside the run/view dialog (dashboard) and the full Diagnostic Runs page.
 * Keeps color-coded cards, grid, system summary, and the AI analysis trigger/view.
 */
export function DiagnosticResultsViewer({
  results,
  analysis,
  onRequestAnalysis,
  isAnalyzing = false,
  compact = false,
}: DiagnosticResultsViewerProps) {
  const hasResults = !!results;

  if (!hasResults && !compact) {
    return (
      <div className="text-sm text-muted-foreground py-6 text-center">
        No results available for this run.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* WiFi Channel Scan (when this run was a wifi_channel_scan) */}
      {results?.wifiChannelScan && (
        <div>
          <div className="text-sm font-medium mb-2 text-primary">WiFi Channel Scan Results</div>
          <WifiChannelVisualizer
            scan={results.wifiChannelScan}
            userChannel={results.userChannel}
            compact
          />
        </div>
      )}

      {/* Test Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['internet', 'wifi', 'latency', 'dns'] as const).map((key) => {
          const r = results?.[key];
          if (!r) return null;
          const st: TestStatus = (r.status || 'unknown') as any;
          const colors = getStatusColor(st);
          return (
            <div key={key} className={`rounded-xl border p-4 ${colors.border} ${colors.bg}`}>
              <div className="flex justify-between items-start">
                <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${colors.text} ${colors.border}`}>
                  {st}
                </span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                {JSON.stringify(r, null, 2).replace(/[{}"]/g, '').trim()}
              </div>
            </div>
          );
        })}
      </div>

      {/* System info summary */}
      {results?.system && (
        <div className="text-xs text-muted-foreground border border-white/10 rounded p-3">
          System: {results.system.browser} on {results.system.os} • {results.system.device}
        </div>
      )}

      {/* MyTech-Fix Analysis */}
      <div>
        {!analysis ? (
          onRequestAnalysis ? (
            <Button
              onClick={onRequestAnalysis}
              disabled={isAnalyzing || !hasResults}
              className="w-full btn-premium"
            >
              {isAnalyzing ? 'MyTech-Fix is analyzing…' : 'Ask MyTech-Fix to Analyze Results'}
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground">No AI analysis available for this run.</div>
          )
        ) : (
          <div className="mt-2">
            <div className="text-sm font-medium mb-2 text-primary">MyTech-Fix Analysis</div>
            <div className="prose prose-sm prose-invert max-w-none bg-card/50 border border-white/10 rounded-xl p-4 whitespace-pre-wrap text-sm leading-relaxed">
              {analysis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiagnosticResultsViewer;
