'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Plus, Edit2, Trash2, ArrowLeft, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface Device {
  id: string;
  name: string;
  device_type: string | null;
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

export default function InventoryPage() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBusinessUser, setIsBusinessUser] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Array<{id: string; name: string; email?: string}>>([]);

  // Table search / filters / sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeamId, setFilterTeamId] = useState('');
  const [sortField, setSortField] = useState<'name' | 'device_type' | 'location' | 'assigned_to' | 'team_name' | 'last_troubleshot_at'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Form state for add/edit
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    device_type: '',
    location: '',
    assigned_to: '',
    notes: '',
    team_id: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadInventory = async () => {
      setLoading(true);

      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      // Check tier from profiles (authoritative); fallback to user_tiers if needed.
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
      const business = tier === 'business' || tier === 'business_plus';
      setIsBusinessUser(business);

      if (!business) {
        setLoading(false);
        return;
      }

      // Get user's teams
      const { data: memberships } = await supabaseBrowser
        .from('team_members')
        .select(`
          team_id,
          teams:team_id (id, name)
        `)
        .eq('user_id', user.id);

      const userTeams: Team[] = (memberships || []).map((m: any) => ({
        id: m.team_id,
        name: m.teams?.name || 'Unnamed Team',
      }));

      setTeams(userTeams);

      if (userTeams.length === 0) {
        setLoading(false);
        return;
      }

      const teamIds = userTeams.map(t => t.id);

      // Load team members for Assigned To dropdown (from actual team members)
      let memberMap: Record<string, string> = {};
      try {
        const { data: memberData } = await supabaseBrowser
          .from('team_members')
          .select(`
            user_id,
            profiles:user_id (
              id,
              full_name,
              email
            )
          `)
          .in('team_id', teamIds);

        if (memberData) {
          const formattedMembers = memberData.map((m: any) => ({
            id: m.user_id,
            name: m.profiles?.full_name || (m.profiles?.email ? m.profiles.email.split('@')[0] : 'User'),
            email: m.profiles?.email,
          }));
          setTeamMembers(formattedMembers);
          memberMap = formattedMembers.reduce((acc: any, m) => {
            acc[m.id] = m.name;
            return acc;
          }, {});
        }
      } catch (e) {
        console.error('Failed to load team members for assignment:', e);
      }

      // Get all devices for user's teams
      const { data: devicesData, error } = await supabaseBrowser
        .from('devices')
        .select(`
          id,
          name,
          device_type,
          location,
          assigned_to,
          notes,
          last_troubleshot_at,
          team_id,
          teams:team_id (name)
        `)
        .in('team_id', teamIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load devices:', error);
        toast.error('Failed to load inventory');
      } else if (devicesData) {
        const formatted = devicesData.map((d: any) => ({
          id: d.id,
          name: d.name,
          device_type: d.device_type,
          location: d.location,
          assigned_to: d.assigned_to,
          assigned_to_name: d.assigned_to && memberMap[d.assigned_to] ? memberMap[d.assigned_to] : d.assigned_to,
          notes: d.notes,
          last_troubleshot_at: d.last_troubleshot_at,
          team_id: d.team_id,
          team_name: d.teams?.name || 'Unknown Team',
        }));
        setDevices(formatted);
      }

      setLoading(false);
    };

    loadInventory();
  }, [router]);

  const resetForm = () => {
    setFormData({
      name: '',
      device_type: '',
      location: '',
      assigned_to: '',
      notes: '',
      team_id: teams.length > 0 ? teams[0].id : '',
    });
    setEditingDevice(null);
    setShowForm(false);
  };

  const handleAddDevice = () => {
    if (teams.length === 0) {
      toast.error('You need to be part of a team to add devices.');
      return;
    }
    setFormData({
      name: '',
      device_type: '',
      location: '',
      assigned_to: '',
      notes: '',
      team_id: teams[0].id,
    });
    setEditingDevice(null);
    setShowForm(true);
  };

  const handleEditDevice = (device: Device) => {
    setFormData({
      name: device.name,
      device_type: device.device_type || '',
      location: device.location || '',
      assigned_to: device.assigned_to || '',
      notes: device.notes || '',
      team_id: device.team_id,
    });
    setEditingDevice(device);
    setShowForm(true);
  };

  const handleDeleteDevice = async (deviceId: string, deviceName: string) => {
    if (!confirm(`Delete device "${deviceName}"? This cannot be undone.`)) return;

    try {
      const { error } = await supabaseBrowser
        .from('devices')
        .delete()
        .eq('id', deviceId);

      if (error) throw error;

      setDevices(prev => prev.filter(d => d.id !== deviceId));
      toast.success('Device deleted');
    } catch (err: any) {
      toast.error('Failed to delete device');
      console.error(err);
    }
  };

  const handleSubmitDevice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Device name is required');
      return;
    }

    if (!formData.team_id) {
      toast.error('Please select a team for the device');
      return;
    }

    setSubmitting(true);

    try {
      const deviceData = {
        name: formData.name.trim(),
        device_type: formData.device_type.trim() || null,
        location: formData.location.trim() || null,
        assigned_to: formData.assigned_to.trim() || null,
        notes: formData.notes.trim() || null,
        team_id: formData.team_id,
      };

      if (editingDevice) {
        // Update
        const { error } = await supabaseBrowser
          .from('devices')
          .update(deviceData)
          .eq('id', editingDevice.id);

        if (error) throw error;

        setDevices(prev =>
          prev.map(d =>
            d.id === editingDevice.id
              ? { 
                  ...d, 
                  ...deviceData, 
                  team_name: teams.find(t => t.id === formData.team_id)?.name || d.team_name,
                  assigned_to_name: deviceData.assigned_to && teamMembers.find(m => m.id === deviceData.assigned_to)?.name || deviceData.assigned_to 
                }
              : d
          )
        );
        toast.success('Device updated');
      } else {
        // Create
        const { data: newDevice, error } = await supabaseBrowser
          .from('devices')
          .insert(deviceData)
          .select()
          .single();

        if (error) throw error;

        const team = teams.find(t => t.id === formData.team_id);
        setDevices(prev => [
          {
            ...newDevice,
            team_name: team?.name || 'Unknown Team',
            assigned_to_name: newDevice.assigned_to && teamMembers.find(m => m.id === newDevice.assigned_to)?.name || newDevice.assigned_to,
          } as Device,
          ...prev,
        ]);
        toast.success('Device added to inventory');
      }

      resetForm();
    } catch (err: any) {
      console.error('Device save error (full):', JSON.stringify(err, null, 2));

      // Show better error message to the user
      const message = 
        err?.message || 
        err?.details || 
        err?.hint || 
        'Failed to save device. Check the console for the full error.';

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const processedDevices = useMemo(() => {
    let result = [...devices];

    // search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(d =>
        d.name.toLowerCase().includes(term) ||
        (d.device_type || '').toLowerCase().includes(term) ||
        (d.location || '').toLowerCase().includes(term) ||
        (d.assigned_to_name || d.assigned_to || '').toLowerCase().includes(term) ||
        (d.team_name || '').toLowerCase().includes(term) ||
        (d.notes || '').toLowerCase().includes(term)
      );
    }

    // team filter
    if (filterTeamId) {
      result = result.filter(d => d.team_id === filterTeamId);
    }

    // sort
    result.sort((a, b) => {
      let valA: any = '';
      let valB: any = '';
      if (sortField === 'last_troubleshot_at') {
        valA = a.last_troubleshot_at ? new Date(a.last_troubleshot_at).getTime() : 0;
        valB = b.last_troubleshot_at ? new Date(b.last_troubleshot_at).getTime() : 0;
      } else if (sortField === 'assigned_to') {
        valA = a.assigned_to_name || a.assigned_to || '';
        valB = b.assigned_to_name || b.assigned_to || '';
      } else if (sortField === 'team_name') {
        valA = a.team_name || '';
        valB = b.team_name || '';
      } else if (sortField === 'device_type') {
        valA = a.device_type || '';
        valB = b.device_type || '';
      } else if (sortField === 'location') {
        valA = a.location || '';
        valB = b.location || '';
      } else {
        valA = a.name || '';
        valB = b.name || '';
      }
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [devices, searchTerm, filterTeamId, sortField, sortDirection]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="animate-pulse">Loading inventory...</div>
        </div>
      </div>
    );
  }

  if (!isBusinessUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-semibold mb-4">Device Inventory</h1>
          <p className="text-muted-foreground mb-8">
            Device inventory is only available on Small Business and Business Pro plans.
          </p>
          <Link href="/pricing">
            <Button>View Business Plans</Button>
          </Link>
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
          <Link href="/teams">
            <Button>Go to Teams</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard" className="text-sm text-primary hover:underline flex items-center gap-1 mb-2">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight">Device Inventory</h1>
            <p className="text-muted-foreground mt-1">
              Manage hardware across your team{teams.length > 1 ? 's' : ''}.
            </p>
          </div>

          <Button onClick={handleAddDevice} className="btn-premium gap-2">
            <Plus className="h-4 w-4" /> Add Device
          </Button>
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
          <Card className="mb-8 card-premium border-white/10">
            <CardHeader>
              <CardTitle>{editingDevice ? 'Edit Device' : 'Add New Device'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitDevice} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="device-name" className="block text-sm font-medium mb-1">Device Name *</label>
                    <Input
                      id="device-name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Front Desk Printer"
                      required
                      className="bg-background border-white/10"
                    />
                  </div>

                  <div>
                    <label htmlFor="device-type" className="block text-sm font-medium mb-1">Device Type</label>
                    <Input
                      id="device-type"
                      name="device_type"
                      value={formData.device_type}
                      onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                      placeholder="Printer, Router, Laptop, etc."
                      className="bg-background border-white/10"
                    />
                  </div>

                  <div>
                    <label htmlFor="device-location" className="block text-sm font-medium mb-1">Location</label>
                    <Input
                      id="device-location"
                      name="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Office - 2nd Floor"
                      className="bg-background border-white/10"
                    />
                  </div>

                  <div>
                    <label htmlFor="device-assigned" className="block text-sm font-medium mb-1">Assigned To</label>
                    <select
                      id="device-assigned"
                      name="assigned_to"
                      value={formData.assigned_to}
                      onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                      className="w-full border border-white/10 bg-background rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">Unassigned</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name} {member.email ? `(${member.email})` : ''}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Select from team members</p>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="device-team" className="block text-sm font-medium mb-1">Team</label>
                    <select
                      id="device-team"
                      name="team_id"
                      value={formData.team_id}
                      onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                      className="w-full border border-white/10 bg-background rounded-lg px-3 py-2 text-sm"
                    >
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="device-notes" className="block text-sm font-medium mb-1">Notes</label>
                    <Input
                      id="device-notes"
                      name="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any additional details..."
                      className="bg-background border-white/10"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={submitting} className="btn-premium">
                    {submitting ? 'Saving...' : editingDevice ? 'Update Device' : 'Add Device'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-white/10 hover:bg-white/5">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Devices Table */}
        {devices.length > 0 ? (
          <Card className="card-premium border-white/10">
            <CardContent className="p-0">
              {/* Search / Filters */}
              <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-white/10">
                <Input
                  placeholder="Search name, type, location, notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-background border-white/10 max-w-xs"
                />
                <select
                  value={filterTeamId}
                  onChange={(e) => setFilterTeamId(e.target.value)}
                  className="border border-white/10 bg-background rounded-lg px-3 py-2 text-sm max-w-[180px]"
                >
                  <option value="">All Teams</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { setSearchTerm(''); setFilterTeamId(''); }} 
                  className="border-white/10"
                >
                  Clear
                </Button>
                <span className="text-xs text-muted-foreground self-center ml-auto hidden sm:block">
                  Showing {processedDevices.length} of {devices.length}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 font-medium cursor-pointer hover:bg-white/5 select-none" onClick={() => toggleSort('name')}>Device {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
                      <th className="text-left p-4 font-medium cursor-pointer hover:bg-white/5 select-none" onClick={() => toggleSort('device_type')}>Type {sortField === 'device_type' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
                      <th className="text-left p-4 font-medium cursor-pointer hover:bg-white/5 select-none" onClick={() => toggleSort('location')}>Location {sortField === 'location' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
                      <th className="text-left p-4 font-medium cursor-pointer hover:bg-white/5 select-none" onClick={() => toggleSort('assigned_to')}>Assigned To {sortField === 'assigned_to' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
                      <th className="text-left p-4 font-medium cursor-pointer hover:bg-white/5 select-none" onClick={() => toggleSort('team_name')}>Team {sortField === 'team_name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
                      <th className="text-left p-4 font-medium cursor-pointer hover:bg-white/5 select-none" onClick={() => toggleSort('last_troubleshot_at')}>Last Troubleshot {sortField === 'last_troubleshot_at' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                    {processedDevices.map((device) => (
                      <motion.tr 
                        key={device.id} 
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="p-4 font-medium">{device.name}</td>
                        <td className="p-4 text-muted-foreground">{device.device_type || '—'}</td>
                        <td className="p-4 text-muted-foreground">{device.location || '—'}</td>
                        <td className="p-4 text-muted-foreground">{device.assigned_to_name || device.assigned_to || '—'}</td>
                        <td className="p-4 text-muted-foreground">{device.team_name}</td>
                        <td className="p-4 text-muted-foreground text-xs">
                          {device.last_troubleshot_at
                            ? new Date(device.last_troubleshot_at).toLocaleDateString()
                            : 'Never'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditDevice(device)}
                              className="hover:bg-white/5"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDevice(device.id, device.name)}
                              className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    </AnimatePresence>
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
    </div>
  );
}
