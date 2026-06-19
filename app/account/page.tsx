'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import PlanBadge from '@/components/PlanBadge';
import { getTierLabel, pickHighestTier, getLimit, getImageLimit, getDiagnosticLimit } from '@/lib/tiers';
import { ArrowLeft, Sun, Moon, Monitor, MessageSquare, History, Activity, Users, Database, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { useTheme } from 'next-themes';

interface Profile {
  id: string;
  email: string;
  tier: string;
  full_name?: string;
  stripe_customer_id?: string;
  created_at: string;
  theme_preference?: 'light' | 'dark' | 'system';
  sessions_used?: number;
  images_used?: number;
  diagnostics_used?: number;
}

function UsageBar({ used, limit, label, color }: { used: number; limit: number; label: string; color: string }) {
  const pct = limit > 0 && limit < 9999 ? Math.min(100, Math.round((used / limit) * 100)) : null;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">
          {limit >= 9999 ? `${used} / Unlimited` : `${used} / ${limit}`}
        </span>
      </div>
      {pct !== null && (
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-red-400' : pct >= 70 ? 'bg-amber-400' : color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

function Avatar({ name, email }: { name?: string; email?: string }) {
  const initials = (() => {
    if (name?.trim()) {
      return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
    }
    return (email?.[0] ?? '?').toUpperCase();
  })();
  return (
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg select-none flex-shrink-0">
      {initials}
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [isBusinessUser, setIsBusinessUser] = useState(false);
  const [isTeamOwner, setIsTeamOwner] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const { setTheme } = useTheme();
  const [themePref, setThemePref] = useState<'light' | 'dark' | 'system'>('dark');

  useEffect(() => {
    const loadUserAndProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) { router.push('/auth/signin'); return; }
      setUser(user);

      try {
        let { data: profileData } = await supabaseBrowser
          .from('profiles')
          .select('id, email, full_name, tier, stripe_customer_id, created_at, theme_preference, sessions_used, images_used, diagnostics_used')
          .eq('id', user.id)
          .maybeSingle();

        if (!profileData) {
          const { data: created } = await supabaseBrowser
            .from('profiles')
            .upsert({ id: user.id, email: user.email || '', tier: 'free_trial', theme_preference: 'dark' }, { onConflict: 'id' })
            .select('id, email, full_name, tier, stripe_customer_id, created_at, theme_preference, sessions_used, images_used, diagnostics_used')
            .single();
          profileData = created;
        }

        const prof = (profileData || {
          id: user.id, email: user.email || '', tier: 'free_trial',
          created_at: new Date().toISOString(), theme_preference: 'dark',
        }) as Profile;

        let displayTier = prof.tier || 'free_trial';
        try {
          const { data: ut } = await supabaseBrowser.from('user_tiers').select('tier').eq('user_id', user.id).maybeSingle();
          displayTier = pickHighestTier(prof.tier, ut?.tier);
        } catch {}

        const finalProf = displayTier !== prof.tier ? { ...prof, tier: displayTier } : prof;
        setProfile(finalProf as Profile);
        setFullName(finalProf.full_name || '');
        if (finalProf.theme_preference) { setThemePref(finalProf.theme_preference); setTheme(finalProf.theme_preference); }

        const biz = displayTier === 'business' || displayTier === 'business_plus';
        setIsBusinessUser(biz);

        if (biz) {
          const { data: membership } = await supabaseBrowser
            .from('team_members').select('role, teams:team_id (name)').eq('user_id', user.id).maybeSingle();
          if (membership) {
            setUserRole(membership.role as string);
            setIsTeamOwner(membership.role === 'owner');
            setTeamName((membership.teams as any)?.name || null);
          }
        } else {
          setUserRole('Individual');
          setIsTeamOwner(true);
        }
      } catch (err) {
        console.error('Account load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUserAndProfile();
  }, [router]);

  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    setSaving(true);
    try {
      const { error } = await supabaseBrowser.from('profiles').upsert({
        id: user.id, email: profile.email || user.email || '',
        full_name: fullName.trim() || null, tier: profile.tier || 'free_trial',
        theme_preference: profile.theme_preference || themePref,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
      if (error) throw error;
      setProfile({ ...profile, full_name: fullName.trim() || undefined });
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleManageBilling = async () => {
    if (!user) return;
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to open billing portal');
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message || 'Failed to open billing portal. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!profile?.email) return;
    setResetLoading(true);
    try {
      const { error } = await supabaseBrowser.auth.resetPasswordForEmail(profile.email, { redirectTo: `${window.location.origin}/account` });
      if (error) throw error;
      toast.success('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send password reset email');
    } finally {
      setResetLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    setExportLoading(true);
    try {
      toast.loading('Preparing export…', { id: 'export' });

      const { data: chats } = await supabaseBrowser
        .from('chat_sessions')
        .select('id, title, created_at, resolved, chat_messages(count)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!chats || chats.length === 0) { toast.error('No sessions to export', { id: 'export' }); return; }

      const getCategory = (title: string) => {
        const l = title.toLowerCase();
        if (l.includes('wifi') || l.includes('internet') || l.includes('network')) return 'Wi-Fi';
        if (l.includes('printer')) return 'Printer';
        if (l.includes('smart') || l.includes('light') || l.includes('camera')) return 'Smart Home';
        if (l.includes('mac') || l.includes('laptop') || l.includes('computer') || l.includes('windows')) return 'Computer';
        return 'Other';
      };

      const rows = [['Date', 'Title', 'Category', 'Status', 'Messages', 'Session ID']];
      chats.forEach((s: any) => {
        rows.push([
          new Date(s.created_at).toISOString().split('T')[0],
          s.title || 'Untitled',
          getCategory(s.title || ''),
          s.resolved ? 'Resolved' : 'In Progress',
          String(s.chat_messages?.[0]?.count ?? 0),
          s.id,
        ]);
      });

      const csv = rows.map(r => r.map(c => { const s = String(c ?? '').replace(/"/g, '""'); return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s; }).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `mytech-fix-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      toast.success(`Exported ${chats.length} sessions`, { id: 'export' });
    } catch (err) {
      console.error(err);
      toast.error('Export failed', { id: 'export' });
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) { setShowDeleteConfirm(true); return; }
    setDeleteLoading(true);
    try {
      const res = await fetch('/api/auth/delete-account', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete account');
      await supabaseBrowser.auth.signOut();
      router.push('/');
      toast.success('Account deleted. Sorry to see you go.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete account. Contact support.');
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-white/10 rounded w-1/3" />
            <div className="h-64 bg-white/5 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const tier = profile?.tier || 'free_trial';
  const sessionsUsed = profile?.sessions_used ?? 0;
  const imagesUsed = profile?.images_used ?? 0;
  const diagsUsed = profile?.diagnostics_used ?? 0;
  const sessionLimit = getLimit(tier);
  const imageLimit = getImageLimit(tier);
  const diagLimit = getDiagnosticLimit(tier);
  const canManageBilling = !isBusinessUser || isTeamOwner;
  const displayRole = userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your profile and subscription</p>
        </div>

        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>

          {/* Profile Information */}
          <motion.div variants={fadeInUp}>
            <Card className="mb-6 card-premium border-white/10">
              <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar name={fullName || profile?.full_name} email={profile?.email || user?.email} />
                  <div className="min-w-0">
                    <div className="font-semibold text-lg truncate">{fullName || profile?.full_name || 'No name set'}</div>
                    <div className="text-sm text-muted-foreground truncate">{profile?.email || user?.email}</div>
                    <PlanBadge tier={tier} className="mt-1.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
                  <div className="p-3 bg-white/5 rounded-xl text-foreground font-medium border border-white/10">
                    {profile?.email || user?.email}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">To change your email, contact support.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Full Name</label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="bg-background border-white/10"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving} className="btn-premium px-8">
                    {saving ? 'Saving…' : 'Save Changes'}
                  </Button>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
                  <Button variant="outline" onClick={handleResetPassword} disabled={resetLoading} className="border-white/10 hover:bg-white/5">
                    {resetLoading ? 'Sending…' : 'Send Password Reset Email'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">We'll email you a secure link to reset your password.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Usage Snapshot */}
          <motion.div variants={fadeInUp}>
            <Card className="mb-6 card-premium border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Usage This Period</CardTitle>
                  {profile?.created_at && (
                    <span className="text-xs text-muted-foreground">
                      Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <UsageBar used={sessionsUsed} limit={sessionLimit} label="Chat Sessions" color="bg-blue-400" />
                <UsageBar used={imagesUsed} limit={imageLimit} label="Visual Aids" color="bg-purple-400" />
                <UsageBar used={diagsUsed} limit={diagLimit} label="Network Diagnostics" color="bg-cyan-400" />
                {canManageBilling && (
                  <div className="pt-2">
                    <Link href="/pricing">
                      <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-xs">
                        View all plans →
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeInUp}>
            <Card className="mb-6 card-premium border-white/10">
              <CardHeader><CardTitle>Quick Links</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { href: '/chat',        Icon: MessageSquare, label: 'New Chat',    always: true },
                    { href: '/history',     Icon: History,       label: 'Chat History', always: true },
                    { href: '/diagnostics', Icon: Activity,      label: 'Diagnostics',  always: true },
                    { href: '/teams',       Icon: Users,         label: 'Teams',        always: isBusinessUser },
                    { href: '/inventory',   Icon: Database,      label: 'Inventory',    always: isBusinessUser },
                  ].filter(l => l.always).map(({ href, Icon, label }) => (
                    <Link key={href} href={href}>
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group cursor-pointer">
                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance */}
          <motion.div variants={fadeInUp}>
            <Card className="mb-6 card-premium border-white/10">
              <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Your preference is saved and applied on every device after login.</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light' as const, label: 'Light', Icon: Sun,     desc: 'Bright interface' },
                    { value: 'dark'  as const, label: 'Dark',  Icon: Moon,    desc: 'Premium dark (default)' },
                    { value: 'system'as const, label: 'System',Icon: Monitor, desc: 'Follows your device' },
                  ].map(({ value, label, Icon, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={async () => {
                        setThemePref(value);
                        setTheme(value);
                        if (user && profile) {
                          try {
                            await supabaseBrowser.from('profiles').upsert({
                              id: user.id, email: profile.email || user.email || '',
                              full_name: profile.full_name || null, tier: profile.tier || 'free_trial',
                              theme_preference: value, updated_at: new Date().toISOString(),
                            }, { onConflict: 'id' });
                            setProfile({ ...profile, theme_preference: value });
                            toast.success(`Theme set to ${label}`);
                          } catch { toast.error('Failed to save theme preference'); }
                        }
                      }}
                      className={`group flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all active:scale-[0.985] ${themePref === value ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                    >
                      <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      <div className="text-sm font-semibold">{label}</div>
                      <div className="text-[10px] text-muted-foreground text-center leading-tight">{desc}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subscription & Billing */}
          <motion.div variants={fadeInUp}>
            <Card className="mb-6 card-premium border-white/10">
              <CardHeader><CardTitle>Subscription &amp; Billing</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Current Plan</div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold">{getTierLabel(tier)}</span>
                      <PlanBadge tier={tier} />
                    </div>
                  </div>
                  {displayRole && (
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Role</div>
                      <div className="text-sm font-medium">{displayRole}{teamName && ` · ${teamName}`}</div>
                    </div>
                  )}
                </div>

                {canManageBilling ? (
                  <>
                    <Button onClick={handleManageBilling} disabled={portalLoading} className="w-full py-6 text-lg btn-premium">
                      {portalLoading ? 'Opening Stripe…' : 'Manage Billing & Subscription'}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground -mt-2">
                      Update payment method, view invoices, or cancel securely via Stripe.
                    </p>
                    {!['free_trial', 'single_use'].includes(tier) && (
                      <div className="pt-2 border-t border-white/10">
                        <Button variant="outline" onClick={handleManageBilling} className="w-full text-red-400 border-red-400/30 hover:bg-red-500/10 hover:text-red-400">
                          Cancel Subscription
                        </Button>
                        <p className="text-[11px] text-center text-muted-foreground mt-2">
                          Access continues until the end of the current billing period.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-amber-500/10 border border-amber-400/30 rounded-xl text-sm">
                    <p className="text-amber-400 font-medium">Billing managed by team owner</p>
                    <p className="text-amber-400/80 mt-1 text-xs">Contact your team owner for billing changes.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Data & Privacy */}
          <motion.div variants={fadeInUp}>
            <Card className="mb-6 card-premium border-white/10">
              <CardHeader><CardTitle>Data &amp; Privacy</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download a CSV of all your troubleshooting sessions including title, category, status, and message count.
                  </p>
                  <Button variant="outline" onClick={handleExportData} disabled={exportLoading} className="gap-2 border-white/10 hover:bg-white/5">
                    <Download className="h-4 w-4" />
                    {exportLoading ? 'Preparing…' : 'Download My Data'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={fadeInUp}>
            <Card className="border-red-500/30 card-premium">
              <CardHeader><CardTitle className="text-red-400">Danger Zone</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This cannot be undone and will cancel any active subscription.
                </p>
                {showDeleteConfirm ? (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl space-y-3">
                    <p className="text-sm text-red-300 font-medium">Are you absolutely sure? This will delete all your chats, diagnostics, and account data permanently.</p>
                    <div className="flex gap-3">
                      <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteLoading} className="flex-1">
                        {deleteLoading ? 'Deleting…' : 'Yes, delete my account'}
                      </Button>
                      <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="border-white/10">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(true)} className="text-red-400 border-red-400/30 hover:bg-red-500/10 hover:text-red-400">
                    Delete Account
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
