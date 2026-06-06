'use client';

import React from 'react';
import { getStatusColor, type TestStatus } from '@/lib/diagnostics';
import type { WifiChannelScanResult } from '@/lib/diagnostics';

interface WifiChannelVisualizerProps {
  scan: WifiChannelScanResult;
  /** Optional override for display; falls back to scan.userChannel */
  userChannel?: number;
  /** Compact mode for history views (smaller bars, less padding) */
  compact?: boolean;
}

/**
 * Reusable presentational component that renders the classic 2.4 GHz channel
 * occupancy grid (channels 1-11) with bar heights, color coding, and the user's
 * current channel highlighted.
 *
 * Used both in the interactive WiFi Scanner dialog (live) and when viewing
 * saved wifi_channel_scan results from history (read-only).
 */
export function WifiChannelVisualizer({ scan, userChannel, compact = false }: WifiChannelVisualizerProps) {
  const uc = userChannel ?? scan.userChannel;
  const maxCount = Math.max(1, ...scan.occupancy.map((o) => o.count));

  const getOccupancyStatus = (count: number): TestStatus => {
    if (count === 0) return 'good';
    if (count <= 2) return 'fair';
    return 'poor';
  };

  return (
    <div className={compact ? 'space-y-2' : 'space-y-4'}>
      {/* Channel bars - improved for general users */}
      <div className="flex items-end gap-2 overflow-x-auto pb-2 px-1">
        {scan.occupancy.map((o) => {
          const status = getOccupancyStatus(o.count);
          const colors = getStatusColor(status);
          const heightPx = Math.max(24, Math.round((o.count / maxCount) * (compact ? 80 : 120)));
          const isUser = uc != null && o.channel === uc;

          return (
            <div key={o.channel} className="flex flex-col items-center flex-1 min-w-[28px] relative group">
              {/* Bar */}
              <div
                className={`w-full rounded-t-md transition-all border ${colors.bg} ${colors.border} ${isUser ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                style={{ height: `${heightPx}px` }}
                title={`Channel ${o.channel}: ${o.count} overlapping network(s) ${isUser ? '(YOUR CHANNEL)' : ''}`}
              >
                {/* Count inside bar if tall enough */}
                {o.count > 0 && heightPx > 30 && (
                  <div className="h-full flex items-end justify-center pb-0.5">
                    <span className="text-[10px] font-semibold text-foreground/80 drop-shadow-sm">{o.count}</span>
                  </div>
                )}
              </div>

              {/* Channel label */}
              <div
                className={`mt-1.5 text-xs font-mono tabular-nums px-1.5 py-0.5 rounded-md font-medium ${
                  isUser 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {o.channel}
              </div>

              {/* "Your channel" indicator */}
              {isUser && (
                <div className="absolute -top-2 text-[9px] bg-primary text-primary-foreground px-1 rounded-sm font-medium tracking-wide">
                  YOU
                </div>
              )}

              {/* Count below for small bars */}
              {o.count > 0 && heightPx <= 30 && (
                <div className="text-[10px] text-muted-foreground mt-0.5">{o.count}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend + user's channel status - friendlier for general users */}
      <div className="rounded-lg bg-muted/50 p-3 text-xs">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="font-medium text-foreground">How crowded is each channel?</div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-2.5 rounded bg-emerald-500/40 border border-emerald-500/50" /> 
              <span className="font-medium text-emerald-400">Clear (0)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-2.5 rounded bg-amber-500/40 border border-amber-500/50" /> 
              <span className="font-medium text-amber-400">Some interference (1-2)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-2.5 rounded bg-red-500/40 border border-red-500/50" /> 
              <span className="font-medium text-red-400">Very crowded (3+)</span>
            </span>
          </div>
        </div>

        {uc != null && (
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
            <span className="font-semibold">Your current channel (Ch {uc}):</span>
            <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${getStatusColor(scan.currentStatus).border} ${getStatusColor(scan.currentStatus).text} bg-background/50`}>
              {scan.currentStatus.toUpperCase()}
            </span>
            <span className="text-muted-foreground text-[10px]">
              {scan.currentStatus === 'good' && '— This channel looks good!'}
              {scan.currentStatus === 'fair' && '— Some neighbors are using nearby channels.'}
              {scan.currentStatus === 'poor' && '— Lots of interference. Switching is recommended.'}
            </span>
          </div>
        )}
      </div>

      {/* Recommendations - more prominent */}
      {scan.recommendedChannels && scan.recommendedChannels.length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
          <div className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
            <span>★ Recommended channels (least interference)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {scan.recommendedChannels.map((r, idx) => (
              <span key={idx} className="font-mono bg-background px-2 py-0.5 rounded text-sm border border-emerald-500/30">
                Channel {r.channel} <span className="text-emerald-400">({r.count} interfering)</span>
              </span>
            ))}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1.5">These are the classic non-overlapping channels for 2.4 GHz WiFi (1, 6, and 11).</div>
        </div>
      )}

      {scan.crowdedChannels && scan.crowdedChannels.length > 0 && (
        <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded p-2">
          ⚠️ These channels are heavily used by neighbors: <span className="font-mono">{scan.crowdedChannels.join(', ')}</span>
        </div>
      )}
    </div>
  );
}

export default WifiChannelVisualizer;
