'use client';

// Note: requires `status` column on devices table.
// Migration: ALTER TABLE devices ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase';
import { pickHighestTier } from '@/lib/tiers';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import {
  Plus, Edit2, Trash2, ArrowLeft, Database, MessageSquare, Download,
  Laptop, Monitor, Printer, Wifi, Server, Smartphone, CreditCard, Phone, Cpu,
  ArrowUpDown, ArrowUp, ArrowDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEVICE_TYPES = [
  'Laptop', 'Desktop', 'Printer', 'Router/WiFi', 'Server',
  'Phone/Tablet', 'POS Terminal', 'VoIP Phone', 'Other',
] as const;

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active:          { label: 'Active',          className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  needs_attention: { label: 'Needs Attention', className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  offline:         { label: 'Offline',         className: 'bg-slate-500/15 text-slate-400 border-slate-500/20' },
  retired:         { label: 'Retired',         className: 'bg-red-500/15 text-red-400 border-red-500/20' },
};

type SortField = 'name' | 'device_type' | 'status' | 'location' | 'assigned_to' | 'last_troubleshot_at';

function DeviceTypeIcon({ type }: { type: string | null }) {
  switch (type) {
    case 'Laptop':       return <Laptop className="h-3.5 w-3.5 flex-shrink-0" />;
    case 'Desktop':      return <Monitor className="h-3.5 w-3.5 flex-shrink-0" />;
    case 'Printer':      return <Printer className="h-3.5 w-3.5 flex-shrink-0" />;
    case 'Router/WiFi':  return <Wifi className="h-3.5 w-3.5 flex-shrink-0" />;
    case 'Server':       return <Server className="h-3.5 w-3.5 flex-shrink-0" />;
    case 'Phone/Tablet': return <Smartphone className="h-3.5 w-3.5 flex-shrink-0" />;
    case 'POS Terminal': return <CreditCard className="h-3.5 w-3.5 flex-shrink-0" />;
    case 'VoIP Phone':   return <Phone className="h-3.5 w-3.5 flex-shrink-0" />;
    default:             return <Cpu className="h-3.5 w-3.5 flex-shrink-0" />;
  }
}

function SortIcon({ field, sortField, dir }: { field: SortField; sortField: SortField; dir: 'asc' | 'desc' }) {
  if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-30" />;
  return dir === 'asc'
    ? <ArrowUp className="h-3.5 w-3.5 ml-1 text-primary" />
    : <ArrowDown className="h-3.5 w-3.5 ml-1 text-primary" />;
}

interface Device {
  id: string;
  name: string;
  device_type: string | null;
  status: string | null;
  location: string | null;
  assigned_to: string | null;
  assigned_to_name?: string | null;
  notes: string | null;
  last_troubleshot_at: string | null;
  team_id: string;
  team_name?: string;
}

interface Team {
  id: string;
  name: string;
}

const EMPTY_FORM = {
  name: '',
  device_type: '',
  status: 'active',
  location: '',
  assigned_to: '',
  notes: '',
  team_id: '',
};

export default function InventoryPage() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBusinessUser, setIsBusinessUser] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string; email?: string }>>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeamId, setFilterTeamId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) { router.push('/auth/signin'); return; }

      let tier = '';
      try {
        const [{ data: prof }, { data: ut }] = await Promise.all([
          supabaseBrowser.from('profiles').select('tier').eq('id', user.id).maybeSingle(),
          supabaseBrowser.from('user_tiers').select('tier').eq('user_id', user.id).maybeSingle(),
        ]);
        tier = pickHighestTier(prof?.tier, ut?.tier);
      } catch {}

      const business = tier === 'business' || tier === 'business_plus';
      setIsBusinessUser(business);
      if (!business) { setLoading(false); return; }

      const { data: memberships } = await supabaseBrowser
        .from('team_members')
        .select('team_id, teams:team_id (id, name)')
        .eq('user_id', user.id);

      const userTeams: Team[] = (memberships || []).map((m: any) => ({
        id: m.team_id,
        name: m.teams?.name || 'Unnamed Team',
      }));
      setTeams(userTeams);

      if (userTeams.length === 0) { setLoading(false); return; }

      const teamIds = userTeams.map(t => t.id);

      let memberMap: Record<string, string> = {};
      try {
        const { data: memberData } = await supabaseBrowser
          .from('team_members')
          .select('user_id, profiles!inner (id, full_name, email)')
          .in('team_id', teamIds);
        if (memberData) {
          const formatted = memberData.map((m: any) => ({
            id: m.user_id,
            name: m.profiles?.full_name || (m.profiles?.email ? m.profiles.email.split('@')[0] : 'User'),
            email: m.profiles?.email,
          }));
          setTeamMembers(formatted);
          memberMap = formatted.reduce((acc: any, m) => { acc[m.id] = m.name; return acc; }, {});
        }
      } catch (e) {
        console.error('Failed to load team members:', e);
      }

      const { data: devicesData, error } = await supabaseBrowser
        .from('devices')
        .select('id, name, device_type, status, location, assigned_to, notes, last_troubleshot_at, team_id, teams:team_id (name)')
        .in('team_id', teamIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load devices:', error);
        toast.error('Failed to load inventory');
      } else if (devicesData) {
        setDevices(devicesData.map((d: any) => ({
          id: d.id,
          name: d.name,
          device_type: d.device_type,
          status: d.status || 'active',
          location: d.location,
          assigned_to: d.assigned_to,
          assigned_to_name: d.assigned_to && memberMap[d.assigned_to] ? memberMap[d.assigned_to] : d.assigned_to,
          notes: d.notes,
          last_troubleshot_at: d.last_troubleshot_at,
          team_id: d.team_id,
          team_name: d.teams?.name || 'Unknown Team',
        })));
      }

      setLoading(false);
    };
    load();
  }, [router]);

  const processedDevices = useMemo(() => {
    let result = [...devices];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(term) ||
        (d.device_type || '').toLowerCase().includes(term) ||
        (d.location || '').toLowerCase().includes(term) ||
        (d.assigned_to_name || d.assigned_to || '').toLowerCase().includes(term) ||
        (d.team_name || '').toLowerCase().includes(term) ||
        (d.notes || '').toLowerCase().includes(term)
      );
    }
    if (filterTeamId) result = result.filter(d => d.team_id === filterTeamId);
    if (filterStatus) result = result.filter(d => (d.status || 'active') === filterStatus);
    result.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';
      if (sortField === 'last_troubleshot_at') {
        valA = a.last_troubleshot_at ? new Date(a.last_troubleshot_at).getTime() : 0;
        valB = b.last_troubleshot_at ? new Date(b.last_troubleshot_at).getTime() : 0;
      } else if (sortField === 'assigned_to') {
        valA = a.assigned_to_name || a.assigned_to || '';
        valB = b.assigned_to_name || b.assigned_to || '';
      } else if (sortField === 'device_type') {
        valA = a.device_type || ''; valB = b.device_type || '';
      } else if (sortField === 'location') {
        valA = a.location || ''; valB = b.location || '';
      } else if (sortField === 'status') {
        valA = a.status || ''; valB = b.status || '';
      } else {
        valA = a.name || ''; valB = b.name || '';
      }
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [devices, searchTerm, filterTeamId, filterStatus, sortField, sortDirection]);

  const stats = useMemo(() => ({
    total: devices.length,
    unassigned: devices.filter(d => !d.assigned_to).length,
    needsAttention: devices.filter(d => d.status === 'needs_attention').length,
    neverTroubleshot: devices.filter(d => !d.last_troubleshot_at).length,
  }), [devices]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const resetForm = () => {
    setFormData({ ...EMPTY_FORM, team_id: teams.length > 0 ? teams[0].id : '' });
    setEditingDevice(null);
    setShowForm(false);
  };

  const handleAddDevice = () => {
    if (teams.length === 0) { toast.error('You need to be part of a team to add devices.'); return; }
    setFormData({ ...EMPTY_FORM, team_id: teams[0].id });
    setEditingDevice(null);
    setShowForm(true);
  };

  const handleEditDevice = (device: Device) => {
    setFormData({
      name: device.name,
      device_type: device.device_type || '',
      status: device.status || 'active',
      location: device.location || '',
      assigned_to: device.assigned_to || '',
      notes: device.notes || '',
      team_id: device.team_id,
    });
    setEditingDevice(device);
    setShowForm(true);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const { error } = await supabaseBrowser.from('devices').delete().eq('id', confirmDelete.id);
      if (error) throw error;
      setDevices(prev => prev.filter(d => d.id !== confirmDelete.id));
      toast.success('Device deleted');
    } catch {
      toast.error('Failed to delete device');
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const handleTroubleshoot = async (device: Device) => {
    const now = new Date().toISOString();
    try {
      await supabaseBrowser.from('devices').update({ last_troubleshot_at: now }).eq('id', device.id);
      setDevices(prev => prev.map(d => d.id === device.id ? { ...d, last_troubleshot_at: now } : d));
    } catch {}
    const params = new URLSearchParams({ device_name: device.name });
    if (device.device_type) params.set('device_type', device.device_type);
    if (device.location) params.set('device_location', device.location);
    router.push(`/chat?${params.toString()}`);
  };

  const exportCSV = () => {
    const headers = ['Device Name', 'Type', 'Status', 'Location', 'Assigned To', 'Team', 'Last Troubleshot', 'Notes'];
    const rows = processedDevices.map(d => [
      d.name,
      d.device_type || '',
      d.status ? (STATUS_CONFIG[d.status]?.label || d.status) : 'Active',
      d.location || '',
      d.assigned_to_name || d.assigned_to || '',
      d.team_name || '',
      d.last_troubleshot_at ? new Date(d.last_troubleshot_at).toLocaleDateString() : 'Never',
      d.notes || '',
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'device-inventory.csv';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    toast.success('Inventory exported');
  };

  const handleSubmitDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Device name is required'); return; }
    if (!formData.team_id) { toast.error('Please select a team'); return; }
    setSubmitting(true);
    try {
      const deviceData = {
        name: formData.name.trim(),
        device_type: formData.device_type || null,
        status: formData.status || 'active',
        location: formData.location.trim() || null,
        assigned_to: formData.assigned_to || null,
        notes: formData.notes.trim() || null,
        team_id: formData.team_id,
      };

      if (editingDevice) {
        const { error } = await supabaseBrowser.from('devices').update(deviceData).eq('id', editingDevice.id);
        if (error) throw error;
        setDevices(prev => prev.map(d =>
          d.id === editingDevice.id ? {
            ...d, ...deviceData,
            team_name: teams.find(t => t.id === formData.team_id)?.name || d.team_name,
            assigned_to_name: deviceData.assigned_to
              ? teamMembers.find(m => m.id === deviceData.assigned_to)?.name || deviceData.assigned_to
              : null,
          } : d
        ));
        toast.success('Device updated');
      } else {
        const { data: newDevice, error } = await supabaseBrowser.from('devices').insert(deviceData).select().single();
        if (error) throw error;
        setDevices(prev => [{
          ...newDevice,
          status: newDevice.status || 'active',
          team_name: teams.find(t => t.id === formData.team_id)?.name || 'Unknown Team',
          assigned_to_name: newDevice.assigned_to
            ? teamMembers.find(m => m.id === newDevice.assigned_to)?.name || newDevice.assigned_to
            : null,
        } as Device, ...prev]);
        toast.success('Device added to inventory');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err?.message || err?.hint || 'Failed to save device');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-2" />
          <div className="h-5 w-72 bg-white/5 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
            ))}
          </div>
          <Card className="border-white/10">
            <CardContent className="p-0">
              <div className="p-4 border-b border-white/10">
                <div className="h-9 w-64 bg-white/5 rounded animate-pulse" />
              </div>
              <div className="divide-y divide-white/[0.05]">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-6 p-4">
                    <div className="h-4 w-36 bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-28 bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-white/5 rounded animate-pulse ml-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ── Tier gate ─────────────────────────────────────────────────────────────
  if (!isBusinessUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-semibold mb-4">Device Inventory</h1>
          <p className="text-muted-foreground mb-8">
            Device inventory is only available on Small Business and Business Plus plans.
          </p>
          <Link href="/pricing"><Button className="btn-premium">View Business Plans</Button></Link>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-semibold mb-4">Device Inventory</h1>
          <p className="text-muted-foreground mb-8">
            You need to be part of a business team to manage device inventory.
          </p>
          <Link href="/teams"><Button className="btn-premium">Go to Teams</Button></Link>
        </div>
      </div>
    );
  }

  // ── Main view ─────────────────────────────────────────────────────────────
  const hasFilters = searchTerm || filterTeamId || filterStatus;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link href="/dashboard" className="text-sm text-primary hover:underline flex items-center gap-1 mb-2">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight">Device Inventory</h1>
            <p className="text-muted-foreground mt-1">
              Manage hardware across your team{teams.length > 1 ? 's' : ''}.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {devices.length > 0 && (
              <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2 border-white/10 hidden sm:flex">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            )}
            <Button onClick={handleAddDevice} className="btn-premium gap-2">
              <Plus className="h-4 w-4" /> Add Device
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        {devices.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total Devices',     value: stats.total,           color: 'text-foreground' },
              { label: 'Unassigned',        value: stats.unassigned,      color: stats.unassigned > 0 ? 'text-slate-300' : 'text-muted-foreground' },
              { label: 'Needs Attention',   value: stats.needsAttention,  color: stats.needsAttention > 0 ? 'text-amber-400' : 'text-muted-foreground' },
              { label: 'Never Troubleshot', value: stats.neverTroubleshot, color: stats.neverTroubleshot > 0 ? 'text-amber-500/70' : 'text-muted-foreground' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl border border-white/[0.07] bg-card/60 px-4 py-3">
                <div className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Devices table */}
        {devices.length > 0 ? (
          <Card className="card-premium border-white/10">
            <CardContent className="p-0">
              {/* Filters */}
              <div className="p-4 flex flex-wrap gap-3 border-b border-white/10 items-center">
                <Input
                  placeholder="Search devices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-background border-white/10 w-44"
                />
                {teams.length > 1 && (
                  <select
                    value={filterTeamId}
                    onChange={(e) => setFilterTeamId(e.target.value)}
                    className="border border-white/10 bg-background rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">All Teams</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                )}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-white/10 bg-background rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All Statuses</option>
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
                {hasFilters && (
                  <Button
                    variant="outline" size="sm"
                    onClick={() => { setSearchTerm(''); setFilterTeamId(''); setFilterStatus(''); }}
                    className="border-white/10"
                  >
                    Clear
                  </Button>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {processedDevices.length} of {devices.length} device{devices.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      {(
                        [
                          { field: 'name' as SortField,               label: 'Device' },
                          { field: 'device_type' as SortField,        label: 'Type' },
                          { field: 'status' as SortField,             label: 'Status' },
                          { field: 'location' as SortField,           label: 'Location' },
                          { field: 'assigned_to' as SortField,        label: 'Assigned To' },
                          { field: 'last_troubleshot_at' as SortField, label: 'Last Troubleshot' },
                        ] as { field: SortField; label: string }[]
                      ).map(col => (
                        <th
                          key={col.field}
                          className="text-left p-4 font-medium cursor-pointer hover:bg-white/5 select-none whitespace-nowrap"
                          onClick={() => toggleSort(col.field)}
                        >
                          <span className="flex items-center">
                            {col.label}
                            <SortIcon field={col.field} sortField={sortField} dir={sortDirection} />
                          </span>
                        </th>
                      ))}
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedDevices.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                          No devices match your filters.{' '}
                          <button
                            onClick={() => { setSearchTerm(''); setFilterTeamId(''); setFilterStatus(''); }}
                            className="text-primary hover:underline"
                          >
                            Clear filters
                          </button>{' '}
                          to see all {devices.length} device{devices.length !== 1 ? 's' : ''}.
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence>
                        {processedDevices.map((device) => {
                          const statusCfg = STATUS_CONFIG[device.status || 'active'] || STATUS_CONFIG.active;
                          return (
                            <motion.tr
                              key={device.id}
                              className="border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                            >
                              <td className="p-4 font-medium">
                                <div>{device.name}</div>
                                {device.notes && (
                                  <div className="text-xs text-muted-foreground mt-0.5 max-w-[220px] truncate" title={device.notes}>
                                    {device.notes}
                                  </div>
                                )}
                              </td>
                              <td className="p-4 text-muted-foreground">
                                {device.device_type ? (
                                  <span className="flex items-center gap-1.5">
                                    <DeviceTypeIcon type={device.device_type} />
                                    {device.device_type}
                                  </span>
                                ) : '—'}
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusCfg.className}`}>
                                  {statusCfg.label}
                                </span>
                              </td>
                              <td className="p-4 text-muted-foreground">{device.location || '—'}</td>
                              <td className="p-4 text-muted-foreground">
                                {device.assigned_to_name || device.assigned_to || '—'}
                              </td>
                              <td className="p-4 text-xs">
                                {device.last_troubleshot_at ? (
                                  <span className="text-muted-foreground">
                                    {new Date(device.last_troubleshot_at).toLocaleDateString()}
                                  </span>
                                ) : (
                                  <span className="text-amber-500/70">Never</span>
                                )}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleTroubleshoot(device)}
                                    className="gap-1.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                    title="Troubleshoot in Chat"
                                  >
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    <span className="hidden xl:inline">Troubleshoot</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditDevice(device)}
                                    className="hover:bg-white/5"
                                    title="Edit device"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setConfirmDelete({ id: device.id, name: device.name })}
                                    className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                    title="Delete device"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl bg-card/60">
            <Database className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No devices in inventory yet</h3>
            <p className="text-muted-foreground mb-6">Start tracking your team's hardware and equipment.</p>
            <Button onClick={handleAddDevice} className="btn-premium gap-2">
              <Plus className="h-4 w-4" /> Add Your First Device
            </Button>
          </div>
        )}
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl bg-background border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDevice ? 'Edit Device' : 'Add New Device'}</DialogTitle>
            <DialogDescription>
              {editingDevice
                ? `Update details for ${editingDevice.name}.`
                : 'Add a new device to your team inventory.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitDevice} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Device Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Front Desk Printer"
                  required
                  autoFocus
                  className="bg-background border-white/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Device Type</label>
                <select
                  value={formData.device_type}
                  onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                  className="w-full border border-white/10 bg-background rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select type...</option>
                  {DEVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-white/10 bg-background rounded-lg px-3 py-2 text-sm"
                >
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Office - 2nd Floor"
                  className="bg-background border-white/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assigned To</label>
                <select
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  className="w-full border border-white/10 bg-background rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}{member.email ? ` (${member.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Team</label>
                <select
                  value={formData.team_id}
                  onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                  className="w-full border border-white/10 bg-background rounded-lg px-3 py-2 text-sm"
                >
                  {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Maintenance history, known issues, serial number..."
                  rows={3}
                  className="w-full border border-white/10 bg-background rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <Button type="button" variant="outline" onClick={resetForm} className="border-white/10 hover:bg-white/5">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="btn-premium">
                {submitting ? 'Saving...' : editingDevice ? 'Update Device' : 'Add Device'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => { if (!open) setConfirmDelete(null); }}>
        <DialogContent className="max-w-sm bg-background border-white/10">
          <DialogHeader>
            <DialogTitle>Delete device?</DialogTitle>
            <DialogDescription>
              Delete <span className="text-foreground font-medium">{confirmDelete?.name}</span>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" className="border-white/10" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
