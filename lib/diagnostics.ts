/**
 * Automated Diagnostics Library for MyTech-Fix.
 * Client-side network & system tests for the "Run Smart Diagnostics" feature.
 * All tests return color-coded status (good/fair/poor) based on sensible thresholds
 * for home/SMB troubleshooting scenarios.
 *
 * Quota enforcement and persistence happen server-side (see /api/diagnostics/*).
 * Speed/latency tests rely on lightweight companion endpoints (/ping, /speed).
 *
 * Usage:
 *   import { runFullDiagnostic, getStatusColor, type FullDiagnosticResults } from '@/lib/diagnostics';
 *   const results = await runFullDiagnostic((name, pct) => console.log(name, pct));
 *
 * WiFi Channel Scanner (new tool):
 *   import { analyzeWifiChannels, type WifiChannelScanResult } from '@/lib/diagnostics';
 *   const scan = analyzeWifiChannels([{ssid:'Neighbor', channel:1}, ...], 6);
 */

export type TestStatus = 'good' | 'fair' | 'poor';

export interface InternetSpeedResult {
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  status: TestStatus;
  details?: string;
}

export interface WifiResult {
  quality: string;
  downlink?: number;      // Mbps from browser
  rtt?: number;           // ms
  effectiveType?: string; // '4g' etc.
  status: TestStatus;
  note?: string;
}

export interface LatencyPacketResult {
  averageMs: number; minMs: number; maxMs: number; samples: number;
  packetLossPercent: number;
  status: TestStatus;
}

export interface DnsResult {
  resolved: boolean; timeMs?: number; status: TestStatus;
}

export interface SystemInfo {
  browser: string; os: string; device: string; userAgent: string;
  screen?: string; language?: string; connection?: any;
}

export interface FullDiagnosticResults {
  internet?: InternetSpeedResult;
  wifi?: WifiResult;
  latency?: LatencyPacketResult;
  dns?: DnsResult;
  system: SystemInfo;
  overall: TestStatus | 'unknown';
  timestamp: string;
}

/**
 * WiFi Channel Scanner types (new tool for interference analysis).
 * Because browsers cannot passively enumerate nearby BSSIDs + channels (security),
 * this is a user-assisted tool: the user provides the list of visible networks
 * (from phone WiFi list, router admin page, or free analyzer apps) + optionally
 * their own router's current channel.
 */
export interface WifiChannelNetwork {
  ssid?: string;           // optional, for display in results
  channel: number;         // 1-11 classic 2.4 GHz; higher numbers for 5 GHz (visualizer focuses on 2.4)
  band?: '2.4' | '5';
  signal?: number;         // optional, dBm (negative) or quality 0-100
}

export interface WifiChannelScanResult {
  networks: WifiChannelNetwork[];
  userChannel?: number;
  occupancy: Array<{ channel: number; count: number; affectingSsids: string[] }>;
  crowdedChannels: number[];
  recommendedChannels: Array<{ channel: number; count: number }>; // best of the non-overlapping set (1/6/11)
  currentStatus: TestStatus;   // good / fair / poor based on interference on the user's channel
  summary: string;
  details?: string;
}

// Public speed test endpoints (Cloudflare infrastructure - reliable, CORS-friendly for browser measurements, measures real internet not app server)
const SPEED_TEST_DOWNLOAD_URL = 'https://speed.cloudflare.com/__down';
const SPEED_TEST_UPLOAD_URL = 'https://speed.cloudflare.com/__up';

// --- Thresholds (tuneable for SMB/home use) ---
const THRESHOLDS = {
  downloadMbps: { good: 50, fair: 10 },
  uploadMbps: { good: 20, fair: 5 },
  latencyMs: { good: 50, fair: 150 },
  packetLoss: { good: 0.5, fair: 2.0 },
};

// --- Helpers ---
export function getStatus(value: number, good: number, fair: number): TestStatus {
  if (value <= good) return 'good';
  if (value <= fair) return 'fair';
  return 'poor';
}

export function getStatusColor(status: TestStatus) {
  if (status === 'good') return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Good' };
  if (status === 'fair') return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Fair' };
  return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Poor' };
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate incompressible random data for upload tests.
 * Using zeros or repeating patterns can sometimes be affected by compression on the path;
 * random data gives a more realistic "goodput" measurement.
 */
function generateIncompressibleData(sizeInBytes: number): ArrayBuffer {
  const data = new Uint8Array(sizeInBytes);
  const chunkSize = 65536; // 64KB chunks for performance
  for (let offset = 0; offset < sizeInBytes; offset += chunkSize) {
    const chunk = new Uint8Array(Math.min(chunkSize, sizeInBytes - offset));
    crypto.getRandomValues(chunk);
    data.set(chunk, offset);
  }
  // Return the underlying ArrayBuffer (our view starts at 0 with full length)
  return data.buffer as ArrayBuffer;
}

async function fetchWithTimeout(url: string, timeoutMs = 2000, options: RequestInit = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal, cache: 'no-store' });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

// --- Individual Tests ---

/** Internet Speed (download/upload + basic ping via our endpoints) */
export async function testInternetSpeed(): Promise<InternetSpeedResult> {
  try {
    // Use public Cloudflare speed test infrastructure for accurate *internet* (not localhost) measurement.
    // Local /api/diagnostics/speed was only measuring loopback/dev server, which wildly over-reported (hundreds of Mbps even on slow links).
    // Cloudflare endpoints are designed for browser speed tests and are CORS-friendly for this purpose.
    const BYTES_DL = 5 * 1024 * 1024; // 5MB per connection
    const NUM_CONN_DL = 4;            // parallel connections for better saturation on fast links
    const BYTES_UL = 2 * 1024 * 1024;
    const NUM_CONN_UL = 3;

    // Warmup to get past TCP slow-start (small transfer, ignore result)
    try {
      await fetch(`${SPEED_TEST_DOWNLOAD_URL}?bytes=128000&t=${Date.now()}`, { cache: 'no-store' });
    } catch {}

    // DOWNLOAD with multiple parallel connections for accuracy
    const dlStart = performance.now();
    const dlPromises = Array.from({ length: NUM_CONN_DL }, () =>
      fetch(`${SPEED_TEST_DOWNLOAD_URL}?bytes=${BYTES_DL}&t=${Date.now() + Math.random()}`, {
        cache: 'no-store',
      }).then(r => r.arrayBuffer())
    );
    await Promise.all(dlPromises);
    const dlDur = (performance.now() - dlStart) / 1000;
    const totalDlMB = (NUM_CONN_DL * (BYTES_DL / (1024 * 1024)));
    const downloadMbps = parseFloat(((totalDlMB / dlDur) * 8).toFixed(1));

    // UPLOAD with multiple parallel connections.
    // Generate separate buffers because a single body cannot be consumed by multiple concurrent fetches.
    const ulPayloads = Array.from({ length: NUM_CONN_UL }, () => generateIncompressibleData(BYTES_UL));
    const ulStart = performance.now();
    const ulPromises = ulPayloads.map(data =>
      fetch(SPEED_TEST_UPLOAD_URL, {
        method: 'POST',
        // Blob around ArrayBuffer is clean and works everywhere
        body: new Blob([data]),
        cache: 'no-store',
      })
    );
    await Promise.all(ulPromises);
    const ulDur = (performance.now() - ulStart) / 1000;
    const totalUlMB = (NUM_CONN_UL * (BYTES_UL / (1024 * 1024)));
    const uploadMbps = parseFloat(((totalUlMB / ulDur) * 8).toFixed(1));

    // Representative internet "ping" (small request RTT to public test server). Average a few for stability.
    let pingSum = 0;
    let pingSamples = 0;
    for (let p = 0; p < 3; p++) {
      const pStart = performance.now();
      try {
        await fetch(`${SPEED_TEST_DOWNLOAD_URL}?bytes=1000&t=${Date.now() + p}`, { cache: 'no-store' });
        pingSum += (performance.now() - pStart);
        pingSamples++;
      } catch {}
      await sleep(20);
    }
    const pingMs = pingSamples > 0 ? Math.round(pingSum / pingSamples) : 999;

    const dlStatus = getStatus(downloadMbps, THRESHOLDS.downloadMbps.good, THRESHOLDS.downloadMbps.fair);
    const ulStatus = getStatus(uploadMbps, THRESHOLDS.uploadMbps.good, THRESHOLDS.uploadMbps.fair);
    const pingStatus = getStatus(pingMs, THRESHOLDS.latencyMs.good, THRESHOLDS.latencyMs.fair);

    // Overall for this group: worst of the three
    let status: TestStatus = 'good';
    if ([dlStatus, ulStatus, pingStatus].includes('poor')) status = 'poor';
    else if ([dlStatus, ulStatus, pingStatus].includes('fair')) status = 'fair';

    return {
      downloadMbps,
      uploadMbps,
      pingMs,
      status,
      details: `DL ${downloadMbps} Mbps, UL ${uploadMbps} Mbps, ping ${pingMs} ms (approx via Cloudflare multi-conn test; native speedtest apps can differ slightly)`,
    };
  } catch (e: any) {
    return { downloadMbps: 0, uploadMbps: 0, pingMs: 999, status: 'poor', details: 'Speed test failed (network or browser limitation)' };
  }
}

/** WiFi / Connection quality via browser NetworkInformation API (best effort) */
export async function testWifiSignal(): Promise<WifiResult> {
  // @ts-ignore - experimental
  const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  if (!conn) {
    return {
      quality: 'Unknown',
      status: 'fair',
      note: 'Limited browser support. Check OS Wi-Fi settings or router admin page for signal strength (dBm).',
    };
  }

  const downlink = conn.downlink || 0; // Mbps
  const rtt = conn.rtt || 0;
  const eff = conn.effectiveType || 'unknown';

  let status: TestStatus = 'good';
  let quality = 'Excellent';

  if (downlink < 5 || rtt > 200 || ['2g', 'slow-2g'].includes(eff)) {
    status = 'poor';
    quality = 'Poor';
  } else if (downlink < 20 || rtt > 100) {
    status = 'fair';
    quality = 'Fair';
  }

  return {
    quality,
    downlink: parseFloat(downlink.toFixed(1)),
    rtt,
    effectiveType: eff,
    status,
    note: 'Browser-estimated (not direct Wi-Fi RSSI).',
  };
}

/** 
 * Latency + Packet Loss using public internet endpoints (Cloudflare speed test infra).
 * This measures real internet latency/packet loss, not localhost loopback.
 * Small 1KB "pings" repeated to simulate packet behavior.
 */
export async function testLatencyAndPacketLoss(probes = 10): Promise<LatencyPacketResult> {
  const times: number[] = [];
  let lost = 0;
  const smallPingUrl = `${SPEED_TEST_DOWNLOAD_URL}?bytes=1024&t=`;

  for (let i = 0; i < probes; i++) {
    const t0 = performance.now();
    try {
      // Small payload to approximate a "ping" packet over HTTP
      await fetchWithTimeout(`${smallPingUrl}${Date.now() + i}`, 2000);
      times.push(performance.now() - t0);
    } catch {
      lost++;
    }
    await sleep(50 + Math.random() * 30); // light jitter between probes
  }

  const samples = times.length;
  const averageMs = samples ? Math.round(times.reduce((a, b) => a + b, 0) / samples) : 0;
  const minMs = samples ? Math.round(Math.min(...times)) : 0;
  const maxMs = samples ? Math.round(Math.max(...times)) : 0;
  const packetLossPercent = Math.round((lost / probes) * 1000) / 10;

  let status: TestStatus = 'good';
  if (packetLossPercent > THRESHOLDS.packetLoss.fair || averageMs > THRESHOLDS.latencyMs.fair) status = 'poor';
  else if (packetLossPercent > THRESHOLDS.packetLoss.good || averageMs > THRESHOLDS.latencyMs.good) status = 'fair';

  return { averageMs, minMs, maxMs, samples, packetLossPercent, status };
}

/** DNS resolution (simple timing of a small external fetch as proxy for DNS+connect) */
export async function testDnsResolution(): Promise<DnsResult> {
  try {
    const t0 = performance.now();
    // Use a tiny, cache-busted resource (no-cors still exercises DNS/TCP for timing)
    await fetch(`https://www.cloudflare.com/favicon.ico?t=${Date.now()}`, {
      mode: 'no-cors',
      cache: 'no-store',
    });
    const timeMs = Math.round(performance.now() - t0);
    const status = getStatus(timeMs, 150, 400);
    return { resolved: true, timeMs, status };
  } catch {
    return { resolved: false, status: 'poor' };
  }
}

/** Basic system / browser info (no external deps) */
export function getSystemInfo(): SystemInfo {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';
  let device = /Mobi|Android/i.test(ua) ? 'Mobile' : 'Desktop';

  if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  // @ts-ignore
  const conn = (navigator as any).connection;
  const connectionInfo = conn ? { effectiveType: conn.effectiveType, downlink: conn.downlink, rtt: conn.rtt } : null;

  return {
    browser,
    os,
    device,
    userAgent: ua,
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    connection: connectionInfo,
  };
}

// --- Full runner (sequential for clear UX feedback) ---
export async function runFullDiagnostic(
  onProgress?: (testName: string, pct: number) => void
): Promise<FullDiagnosticResults> {
  const results: any = { system: getSystemInfo(), timestamp: new Date().toISOString() };

  onProgress?.('Internet Speed Test', 8);
  results.internet = await testInternetSpeed();

  onProgress?.('WiFi / Connection Quality', 28);
  results.wifi = await testWifiSignal();

  onProgress?.('Network Latency & Packet Loss', 52);
  results.latency = await testLatencyAndPacketLoss(8);

  onProgress?.('DNS Resolution', 75);
  results.dns = await testDnsResolution();

  onProgress?.('System Info', 92);
  // system already captured

  // Overall
  const allStatuses = [results.internet?.status, results.wifi?.status, results.latency?.status, results.dns?.status].filter(Boolean);
  if (allStatuses.includes('poor')) results.overall = 'poor';
  else if (allStatuses.includes('fair')) results.overall = 'fair';
  else results.overall = 'good';

  onProgress?.('Complete', 100);
  return results as FullDiagnosticResults;
}

// ============================================================
// WiFi Channel Scanner / Interference Analyzer (new diagnostic tool)
// ============================================================

/**
 * Simple realistic overlap model for 2.4 GHz channels (channels are 5 MHz apart,
 * 20 MHz signals mean roughly +/- 4 channels of meaningful overlap).
 */
function getAffected2_4Channels(ch: number): number[] {
  const res: number[] = [];
  for (let i = Math.max(1, ch - 4); i <= Math.min(11, ch + 4); i++) {
    res.push(i);
  }
  return res;
}

/**
 * Analyze a list of observed WiFi networks for 2.4 GHz interference.
 * Pure function (great for testing and for the interactive scanner UI).
 *
 * - Focuses visual/occupancy on classic 1-11.
 * - Higher channels (5 GHz) are accepted and stored but do not affect the 2.4 grid.
 * - Recommends the least-crowded member(s) of the classic non-overlapping set {1,6,11}.
 * - currentStatus is computed only when userCurrentChannel is provided.
 */
export function analyzeWifiChannels(
  networks: WifiChannelNetwork[],
  userCurrentChannel?: number
): WifiChannelScanResult {
  const channels24 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const occupancyMap: Record<number, { count: number; ssids: string[] }> = {};
  channels24.forEach((ch) => {
    occupancyMap[ch] = { count: 0, ssids: [] };
  });

  // Only 2.4 GHz networks (or unknown band + channel in 1-11) participate in occupancy
  const networks24 = networks.filter(
    (n) => !n.band || n.band === '2.4' || (n.channel >= 1 && n.channel <= 11)
  );

  networks24.forEach((net) => {
    const affected = getAffected2_4Channels(net.channel);
    affected.forEach((ch) => {
      if (occupancyMap[ch]) {
        occupancyMap[ch].count++;
        if (net.ssid) {
          occupancyMap[ch].ssids.push(net.ssid);
        }
      }
    });
  });

  const occupancy = channels24.map((ch) => ({
    channel: ch,
    count: occupancyMap[ch].count,
    affectingSsids: Array.from(new Set(occupancyMap[ch].ssids)),
  }));

  const crowdedChannels = occupancy.filter((o) => o.count >= 3).map((o) => o.channel);

  // Recommend the best (lowest interference) of the classic non-overlapping trio
  const recommendedChannels = [1, 6, 11]
    .map((ch) => ({ channel: ch, count: occupancyMap[ch].count }))
    .sort((a, b) => a.count - b.count);

  let currentStatus: TestStatus = 'unknown' as any;
  let summary = 'Enter nearby networks (from your phone or router) and your current channel, then analyze.';

  if (userCurrentChannel != null) {
    const myCount = occupancyMap[userCurrentChannel]?.count ?? 0;
    if (myCount === 0) currentStatus = 'good';
    else if (myCount <= 2) currentStatus = 'fair';
    else currentStatus = 'poor';

    summary = `Your channel ${userCurrentChannel} has ${myCount} overlapping networks. `;
    if (currentStatus === 'good') {
      summary += 'Excellent — very little co-channel or adjacent interference.';
    } else if (currentStatus === 'fair') {
      summary += 'Moderate interference. Switching to a clearer channel (usually 1, 6 or 11) will help.';
    } else {
      summary += 'High interference. Strongly consider changing your router to a less crowded channel.';
    }
  }

  return {
    networks,
    userChannel: userCurrentChannel,
    occupancy,
    crowdedChannels,
    recommendedChannels,
    currentStatus,
    summary,
    details: `${networks24.length} 2.4 GHz networks analyzed. Non-overlapping channels 1/6/11 are usually best. 5 GHz channels (36+) have less overlap but shorter range.`,
  };
}
