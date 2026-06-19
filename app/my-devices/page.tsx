'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase';
import DeviceMaintenanceTab from '@/components/DeviceMaintenanceTab';
import MaintenanceBadge from '@/components/MaintenanceBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Plus, Trash2, Wifi, Thermometer, Camera, Printer, Cpu,
  ChevronDown, ChevronUp, Shield, MessageSquare, Download,
  Laptop, Monitor, Server, CreditCard, Phone,
  MapPin, User, ArrowUpDown, ArrowUp, ArrowDown,
} from 'lucide-react';
import Link from 'next/link';

interface UserDevice {
  id: string;
  user_id: string;
  device_brand: string;
  device_model: string;
  device_type: string | null;
  nickname: string | null;
  status: string | null;
  location: string | null;
  assigned_to: string | null;
  notes: string | null;
  purchase_date: string | null;
  warranty_months: number | null;
  plan_speed_mbps: number | null;
  is_battery_powered: boolean;
  battery_last_replaced: string | null;
  default_password_confirmed_changed: boolean;
  created_at: string;
}

interface DeviceNotificationSummary {
  notification_type: string;
  severity: string | null;
  read_at: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active:           { label: 'Active',           className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  needs_attention:  { label: 'Needs Attention',  className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  offline:          { label: 'Offline',          className: 'bg-slate-500/15 text-slate-400 border-slate-500/20' },
  retired:          { label: 'Retired',          className: 'bg-red-500/15 text-red-400 border-red-500/20' },
};

const DEVICE_TYPES = [
  'Router/WiFi', 'Smart Thermostat', 'Smart Camera', 'Smart Doorbell',
  'Smart Light', 'Smart Speaker', 'Laptop', 'Desktop', 'Server',
  'Printer', 'Phone/Tablet', 'POS Terminal', 'VoIP Phone', 'Other',
] as const;

const DEVICE_TYPE_BRANDS: Record<string, string[]> = {
  'Router/WiFi':      ['Eero', 'Netgear', 'TP-Link', 'Asus', 'Linksys', 'Google', 'Other'],
  'Smart Thermostat': ['Google (Nest)', 'Ecobee', 'Honeywell', 'Emerson', 'Other'],
  'Smart Camera':     ['Arlo', 'Ring', 'Wyze', 'Nest', 'Blink', 'Other'],
  'Smart Doorbell':   ['Ring', 'Nest', 'Arlo', 'Eufy', 'Other'],
  'Smart Light':      ['Philips (Hue)', 'LIFX', 'Wyze', 'Other'],
  'Smart Speaker':    ['Amazon (Echo)', 'Google', 'Apple (HomePod)', 'Other'],
  'Laptop':           ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Microsoft', 'Other'],
  'Desktop':          ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Other'],
  'Server':           ['Dell', 'HP', 'Lenovo', 'Supermicro', 'Other'],
  'Printer':          ['HP', 'Canon', 'Epson', 'Brother', 'Other'],
  'Phone/Tablet':     ['Apple', 'Samsung', 'Google', 'Other'],
  'POS Terminal':     ['Square', 'Clover', 'Verifone', 'Other'],
  'VoIP Phone':       ['Poly', 'Cisco', 'Yealink', 'Other'],
  'Other':            ['Other'],
};

type SortField = 'nickname' | 'device_type' | 'status' | 'location' | 'assigned_to';

function DeviceTypeIcon({ type }: { type: string | null }) {
  switch (type) {
    case 'Router/WiFi':      return <Wifi className="w-4 h-4" />;
    case 'Smart Thermostat': return <Thermometer className="w-4 h-4" />;
    case 'Smart Camera':
    case 'Smart Doorbell':   return <Camera className="w-4 h-4" />;
    case 'Laptop':           return <Laptop className="w-4 h-4" />;
    case 'Desktop':          return <Monitor className="w-4 h-4" />;
    case 'Server':           return <Server className="w-4 h-4" />;
    case 'Printer':          return <Printer className="w-4 h-4" />;
    case 'POS Terminal':     return <CreditCard className="w-4 h-4" />;
    case 'VoIP Phone':       return <Phone className="w-4 h-4" />;
    default:                 return <Cpu className="w-4 h-4" />;
  }
}

function SortIcon({ field, sortField, dir }: { field: SortField; sortField: SortField; dir: 'asc' | 'desc' }) {
  if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-30" />;
  return dir === 'asc'
    ? <ArrowUp className="h-3 w-3 ml-1 text-blue-400" />
    : <ArrowDown className="h-3 w-3 ml-1 text-blue-400" />;
}

const EMPTY_FORM = {
  device_brand: '',
  device_model: '',
  device_type: '' as string,
  nickname: '',
  status: 'active',
  location: '',
  assigned_to: '',
  notes: '',
  purchase_date: '',
  warranty_months: '',
  plan_speed_mbps: '',
  is_battery_powered: false,
  default_password_confirmed_changed: false,
};

export default function MyDevicesPage() {
  const router = useRouter();
  const [devices, setDevices] = useState<UserDevice[]>([]);
  const [notifsByDevice, setNotifsByDevice] = useState<Record<string, DeviceNotificationSummary[]>>({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<UserDevice | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [expandedDevice, setExpandedDevice] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState<SortField>('nickname');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const load = useCallback(async () => {
    const { data: { user } } = await supabaseBrowser.auth.getUser();
    if (!user) { router.push('/'); return; }
    setUserId(user.id);

    const [devRes, notifRes] = await Promise.all([
      supabaseBrowser.from('user_devices').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabaseBrowser.from('device_notifications').select('user_device_id, notification_type, severity, read_at').eq('user_id', user.id),
    ]);

    setDevices((devRes.data as UserDevice[]) ?? []);

    const map: Record<string, DeviceNotificationSummary[]> = {};
    for (const n of (notifRes.data ?? []) as Array<{ user_device_id: string } & DeviceNotificationSummary>) {
      if (!map[n.user_device_id]) map[n.user_device_id] = [];
      map[n.user_device_id].push({ notification_type: n.notification_type, severity: n.severity, read_at: n.read_at });
    }
    setNotifsByDevice(map);
    setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  function openAddDialog() {
    setEditingDevice(null);
    setFormData({ ...EMPTY_FORM });
    setDialogOpen(true);
  }

  function openEditDialog(device: UserDevice) {
    setEditingDevice(device);
    setFormData({
      device_brand: device.device_brand,
      device_model: device.device_model,
      device_type: device.device_type ?? '',
      nickname: device.nickname ?? '',
      status: device.status ?? 'active',
      location: device.location ?? '',
      assigned_to: device.assigned_to ?? '',
      notes: device.notes ?? '',
      purchase_date: device.purchase_date ?? '',
      warranty_months: device.warranty_months?.toString() ?? '',
      plan_speed_mbps: device.plan_speed_mbps?.toString() ?? '',
      is_battery_powered: device.is_battery_powered,
      default_password_confirmed_changed: device.default_password_confirmed_changed,
    });
    setDialogOpen(true);
  }

  function handleTypeChange(type: string) {
    setFormData((f) => ({ ...f, device_type: type, device_brand: '' }));
  }

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  }

  const processedDevices = useMemo(() => {
    let result = [...devices];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((d) =>
        [d.nickname, d.device_brand, d.device_model, d.device_type, d.location, d.assigned_to, d.notes]
          .some((v) => v?.toLowerCase().includes(q))
      );
    }
    if (filterStatus) result = result.filter((d) => (d.status ?? 'active') === filterStatus);
    result.sort((a, b) => {
      const av = (sortField === 'nickname' ? (a.nickname || `${a.device_brand} ${a.device_model}`) : a[sortField]) ?? '';
      const bv = (sortField === 'nickname' ? (b.nickname || `${b.device_brand} ${b.device_model}`) : b[sortField]) ?? '';
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return result;
  }, [devices, searchTerm, filterStatus, sortField, sortDir]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !formData.device_brand || !formData.device_model) {
      toast.error('Brand and model are required');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        device_brand: formData.device_brand.trim(),
        device_model: formData.device_model.trim(),
        device_type: formData.device_type || null,
        nickname: formData.nickname.trim() || null,
        status: formData.status || 'active',
        location: formData.location.trim() || null,
        assigned_to: formData.assigned_to.trim() || null,
        notes: formData.notes.trim() || null,
        purchase_date: formData.purchase_date || null,
        warranty_months: formData.warranty_months ? parseInt(formData.warranty_months) : null,
        plan_speed_mbps: formData.plan_speed_mbps ? parseInt(formData.plan_speed_mbps) : null,
        is_battery_powered: formData.is_battery_powered,
        default_password_confirmed_changed: formData.default_password_confirmed_changed,
        updated_at: new Date().toISOString(),
      };

      if (editingDevice) {
        const { data, error } = await supabaseBrowser.from('user_devices').update(payload).eq('id', editingDevice.id).select().single();
        if (error) throw error;
        setDevices((prev) => prev.map((d) => d.id === editingDevice.id ? data as UserDevice : d));
        toast.success('Device updated');
      } else {
        const { data, error } = await supabaseBrowser.from('user_devices').insert({ ...payload, user_id: userId }).select().single();
        if (error) throw error;
        setDevices((prev) => [data as UserDevice, ...prev]);
        toast.success('Device added');
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save device');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(deviceId: string) {
    const { error } = await supabaseBrowser.from('user_devices').delete().eq('id', deviceId);
    if (error) { toast.error('Failed to remove device'); return; }
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    toast.success('Device removed');
    setDeleteConfirm(null);
  }

  function exportCSV() {
    const headers = ['Name', 'Brand', 'Model', 'Type', 'Status', 'Location', 'Assigned To', 'Notes', 'Purchase Date', 'Warranty (months)'];
    const rows = devices.map((d) => [
      d.nickname || `${d.device_brand} ${d.device_model}`,
      d.device_brand, d.device_model, d.device_type ?? '',
      d.status ?? 'active', d.location ?? '', d.assigned_to ?? '',
      d.notes ?? '', d.purchase_date ?? '', d.warranty_months ?? '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'my-devices.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  function buildTroubleshootLink(device: UserDevice) {
    const name = device.nickname || `${device.device_brand} ${device.device_model}`;
    return `/chat?context=${encodeURIComponent(`I need help troubleshooting my ${name}${device.device_type ? ` (${device.device_type})` : ''}.`)}`;
  }

  const unreadCount = Object.values(notifsByDevice).flat().filter((n) => !n.read_at).length;
  const criticalCount = Object.values(notifsByDevice).flat().filter((n) =>
    !n.read_at && (n.severity === 'critical' || n.severity === 'high')
  ).length;
  const stats = {
    total: devices.length,
    needsAttention: devices.filter((d) => (d.status ?? 'active') === 'needs_attention').length,
    unassigned: devices.filter((d) => !d.assigned_to).length,
    offline: devices.filter((d) => (d.status ?? 'active') === 'offline').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-8" />
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/5 border border-white/10 rounded-2xl animate-pulse mb-3" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link href="/dashboard" className="text-sm text-primary hover:underline flex items-center gap-1 mb-2">
              <Shield className="w-4 h-4" /> Dashboard
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight">Devices</h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {devices.length > 0 && (
              <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2 border-white/10 hidden sm:flex">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            )}
            <Button onClick={openAddDialog} className="btn-premium gap-2">
              <Plus className="w-4 h-4" /> Add Device
            </Button>
          </div>
        </div>

        {/* Summary banner */}
        {devices.length > 0 && (
          <div className={`rounded-2xl border px-5 py-4 mb-6 flex flex-wrap items-center gap-4 ${
            criticalCount > 0 ? 'border-red-500/25 bg-red-500/5'
            : unreadCount > 0 ? 'border-amber-500/25 bg-amber-500/5'
            : 'border-emerald-500/20 bg-emerald-500/5'
          }`}>
            <div className="flex-1 text-sm text-slate-200">
              {criticalCount > 0
                ? <><span className="font-semibold text-red-400">{criticalCount} security alert{criticalCount > 1 ? 's' : ''}</span> require attention.</>
                : unreadCount > 0
                ? <><span className="font-semibold text-amber-400">{unreadCount} notification{unreadCount > 1 ? 's' : ''}</span> waiting across {devices.length} device{devices.length > 1 ? 's' : ''}.</>
                : <><span className="font-semibold text-emerald-400">All {devices.length} device{devices.length > 1 ? 's' : ''} up to date.</span> Automated checks run nightly.</>
              }
            </div>
            <Link href="/account/notifications" className="text-xs text-slate-400 hover:text-slate-200 whitespace-nowrap">
              Notification settings →
            </Link>
          </div>
        )}

        {/* Stats bar */}
        {devices.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Devices',    value: stats.total,           color: 'text-foreground' },
              { label: 'Needs Attention',  value: stats.needsAttention,  color: stats.needsAttention  > 0 ? 'text-amber-400'  : 'text-muted-foreground' },
              { label: 'Offline',          value: stats.offline,         color: stats.offline         > 0 ? 'text-slate-300'  : 'text-muted-foreground' },
              { label: 'Unassigned',       value: stats.unassigned,      color: stats.unassigned      > 0 ? 'text-slate-400'  : 'text-muted-foreground' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/[0.07] bg-card/60 px-4 py-3">
                <div className={`text-2xl font-semibold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        {devices.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            <Input
              placeholder="Search devices…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background border-white/10 w-48"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-white/10 bg-background rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            {(searchTerm || filterStatus) && (
              <Button variant="outline" size="sm" className="border-white/10"
                onClick={() => { setSearchTerm(''); setFilterStatus(''); }}>
                Clear
              </Button>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {processedDevices.length} of {devices.length} device{devices.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Sort header (table-style) */}
        {devices.length > 0 && (
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 px-5 py-2 text-xs text-slate-500 border-b border-white/[0.06] mb-1">
            {([
              { field: 'nickname'    as SortField, label: 'Device'      },
              { field: 'device_type' as SortField, label: 'Type'        },
              { field: 'status'      as SortField, label: 'Status'      },
              { field: 'location'    as SortField, label: 'Location'    },
              { field: 'assigned_to' as SortField, label: 'Assigned To' },
            ]).map((col) => (
              <button
                key={col.field}
                onClick={() => toggleSort(col.field)}
                className="flex items-center text-left hover:text-slate-300 transition-colors select-none"
              >
                {col.label}<SortIcon field={col.field} sortField={sortField} dir={sortDir} />
              </button>
            ))}
            <span>Actions</span>
          </div>
        )}

        {/* Device list */}
        {devices.length === 0 ? (
          <Card className="border-dashed border-white/10">
            <CardContent className="py-16 text-center">
              <Shield className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h2 className="text-lg font-medium mb-2">No devices yet</h2>
              <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                Add your router, thermostat, cameras, laptops, or any connected device — we&apos;ll monitor them automatically.
              </p>
              <Button onClick={openAddDialog} className="btn-premium gap-2">
                <Plus className="w-4 h-4" /> Add Your First Device
              </Button>
            </CardContent>
          </Card>
        ) : processedDevices.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-12">
            No devices match your filters.{' '}
            <button onClick={() => { setSearchTerm(''); setFilterStatus(''); }} className="text-primary hover:underline">Clear filters</button>
          </p>
        ) : (
          <div className="space-y-2">
            {processedDevices.map((device) => {
              const notifs = notifsByDevice[device.id] ?? [];
              const isExpanded = expandedDevice === device.id;
              const displayName = device.nickname || `${device.device_brand} ${device.device_model}`;
              const statusCfg = STATUS_CONFIG[device.status ?? 'active'] ?? STATUS_CONFIG.active;

              return (
                <div key={device.id} className="rounded-2xl border border-white/10 bg-card/40 overflow-hidden">
                  {/* Main row */}
                  <div className="flex items-center gap-3 px-5 py-4">
                    <div className="text-slate-500 flex-shrink-0">
                      <DeviceTypeIcon type={device.device_type} />
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-100 truncate">{displayName}</div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                        <span className="text-xs text-slate-500">{device.device_brand} {device.device_model}{device.device_type ? ` · ${device.device_type}` : ''}</span>
                        {device.location && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />{device.location}
                          </span>
                        )}
                        {device.assigned_to && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <User className="w-2.5 h-2.5" />{device.assigned_to}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Badges — hidden on mobile, shown on sm+ */}
                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                      <MaintenanceBadge notifications={notifs} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link
                        href={buildTroubleshootLink(device)}
                        title="Troubleshoot"
                        className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openEditDialog(device)}
                        className="p-2 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors text-xs font-medium"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setExpandedDevice(isExpanded ? null : device.id)}
                        className="p-2 text-slate-500 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(device.id)}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Notes (if any) */}
                  {device.notes && !isExpanded && (
                    <div className="px-5 pb-3 -mt-1">
                      <p className="text-xs text-slate-500 truncate">{device.notes}</p>
                    </div>
                  )}

                  {/* Expanded maintenance tab */}
                  {isExpanded && (
                    <div className="border-t border-white/[0.06] px-5 py-4 bg-white/[0.02]">
                      {device.notes && (
                        <p className="text-xs text-slate-500 mb-4 italic">{device.notes}</p>
                      )}
                      <DeviceMaintenanceTab device={device} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add / Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-[#0A0F1E] border-white/10 max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDevice ? 'Edit Device' : 'Add Device'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">

              {/* Type */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Device Type</label>
                <select
                  value={formData.device_type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full border border-white/10 bg-background rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select type…</option>
                  {DEVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Brand + Model */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Brand *</label>
                  {formData.device_type && DEVICE_TYPE_BRANDS[formData.device_type] ? (
                    <select
                      value={formData.device_brand}
                      onChange={(e) => setFormData((f) => ({ ...f, device_brand: e.target.value }))}
                      className="w-full border border-white/10 bg-background rounded-lg px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select brand…</option>
                      {DEVICE_TYPE_BRANDS[formData.device_type].map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  ) : (
                    <Input value={formData.device_brand} onChange={(e) => setFormData((f) => ({ ...f, device_brand: e.target.value }))}
                      placeholder="e.g. Netgear" className="bg-background border-white/10" required />
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Model *</label>
                  <Input value={formData.device_model} onChange={(e) => setFormData((f) => ({ ...f, device_model: e.target.value }))}
                    placeholder="e.g. Orbi RBK50" className="bg-background border-white/10" required />
                </div>
              </div>

              {/* Nickname + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Nickname</label>
                  <Input value={formData.nickname} onChange={(e) => setFormData((f) => ({ ...f, nickname: e.target.value }))}
                    placeholder="e.g. Office Router" className="bg-background border-white/10" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
                    className="w-full border border-white/10 bg-background rounded-lg px-3 py-2 text-sm">
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Location + Assigned To */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Location</label>
                  <Input value={formData.location} onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Server Room" className="bg-background border-white/10" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Assigned To</label>
                  <Input value={formData.assigned_to} onChange={(e) => setFormData((f) => ({ ...f, assigned_to: e.target.value }))}
                    placeholder="e.g. Jane Smith" className="bg-background border-white/10" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Serial number, purchase info, known issues…"
                  rows={2}
                  className="w-full border border-white/10 bg-background rounded-lg px-3 py-2 text-sm resize-none"
                />
              </div>

              {/* Purchase Date + Warranty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Purchase Date</label>
                  <Input type="date" value={formData.purchase_date} onChange={(e) => setFormData((f) => ({ ...f, purchase_date: e.target.value }))}
                    className="bg-background border-white/10" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Warranty (months)</label>
                  <Input type="number" value={formData.warranty_months} onChange={(e) => setFormData((f) => ({ ...f, warranty_months: e.target.value }))}
                    placeholder="e.g. 24" className="bg-background border-white/10" min="1" max="120" />
                </div>
              </div>

              {/* ISP Speed — only for routers */}
              {formData.device_type === 'Router/WiFi' && (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">ISP Plan Speed (Mbps)</label>
                  <Input type="number" value={formData.plan_speed_mbps} onChange={(e) => setFormData((f) => ({ ...f, plan_speed_mbps: e.target.value }))}
                    placeholder="e.g. 500" className="bg-background border-white/10" min="1" />
                  <p className="text-xs text-slate-600 mt-1">Used to detect if your speed drops below plan.</p>
                </div>
              )}

              {/* Checkboxes */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={formData.is_battery_powered}
                    onChange={(e) => setFormData((f) => ({ ...f, is_battery_powered: e.target.checked }))} className="rounded" />
                  <span className="text-slate-300">Battery powered</span>
                  <span className="text-xs text-slate-600">(enables battery reminders)</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={formData.default_password_confirmed_changed}
                    onChange={(e) => setFormData((f) => ({ ...f, default_password_confirmed_changed: e.target.checked }))} className="rounded" />
                  <span className="text-slate-300">Default admin password has been changed</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="border-white/10 flex-1" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="btn-premium flex-1" disabled={submitting}>
                  {submitting ? 'Saving…' : editingDevice ? 'Save Changes' : 'Add Device'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete confirm */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="bg-[#0A0F1E] border-white/10 max-w-sm">
            <DialogHeader><DialogTitle>Remove device?</DialogTitle></DialogHeader>
            <p className="text-sm text-slate-400 mt-2">
              This removes the device and all its notification history. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="border-white/10 flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Remove</Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
