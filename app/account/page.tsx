'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { getTierLabel, pickHighestTier } from '@/lib/tiers';
import { ArrowLeft, Sun, Moon, Monitor } from 'lucide-react';
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
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Team billing permission
  const [isBusinessUser, setIsBusinessUser] = useState(false);
  const [isTeamOwner, setIsTeamOwner] = useState(false);

  // User's role and team info
  const [userRole, setUserRole] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const { setTheme } = useTheme();
  const [themePref, setThemePref] = useState<'light' | 'dark' | 'system'>('dark');

  useEffect(() => {
    const loadUserAndProfile = async () => {
      setLoading(true);

      const { data: { user } } = await supabaseBrowser.auth.getUser();

      if (!user) {
        router.push('/auth/signin');
        return;
      }

      setUser(user);

      // Fetch profile (primary source of truth for tier, full_name, etc.).
      // Use maybeSingle() so "no row" (common after rebuild for existing auth users, or pre-trigger) is not an error.
      // If missing, auto-create a minimal row (client insert allowed by RLS policy) so the account page always loads.
      // This prevents "Failed to load profile: {}" and lets users see/edit name + see the tier set via Stripe/restore.
      try {
        let { data: profileData, error: fetchErr } = await supabaseBrowser
          .from('profiles')
          .select('id, email, full_name, tier, stripe_customer_id, created_at, theme_preference')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchErr) {
          // Real DB/RLS error (not the normal no-row case). Log richly so we never see opaque {} again.
          console.error('Failed to fetch profile (real error):', {
            message: fetchErr?.message,
            code: fetchErr?.code,
            details: fetchErr?.details,
            hint: fetchErr?.hint,
            full: fetchErr,
          });
        }

        let profileDataToUse: Profile | null = profileData;

        if (!profileDataToUse) {
          console.info('No profiles row for current user (expected after schema rebuild for prior auth users). Creating minimal row...');
          const { data: created, error: createErr } = await supabaseBrowser
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.email || '',
              tier: 'free_trial',
              theme_preference: 'dark',
              // Minimal payload only. Omit sessions/images/created_at etc. so this works even on drifted pre-rebuild schemas
              // (table has defaults for most NOT NULL cols after complete_supabase_rebuild or the ensure migrations).
            }, { onConflict: 'id' })
            .select('id, email, full_name, tier, stripe_customer_id, created_at, theme_preference')
            .single();

          if (createErr || !created) {
            console.error('Failed to auto-create profile row:', {
              message: createErr?.message,
              code: createErr?.code,
              details: createErr?.details,
              hint: createErr?.hint,
              full: createErr,
            });
            // Fallback in-memory so the page renders fully (Current Plan, name input, role, billing UI etc. still work).
            // Save will also use upsert to ensure the row gets persisted.
            profileDataToUse = {
              id: user.id,
              email: user.email || '',
              tier: 'free_trial',
              full_name: undefined,
              stripe_customer_id: undefined,
              created_at: new Date().toISOString(),
              theme_preference: 'dark',
            } as Profile;
          } else {
            profileDataToUse = created;
          }
        }

        const prof = profileDataToUse as Profile;
        setProfile(prof);
        setFullName(prof.full_name || '');
        if (prof.theme_preference) {
          setThemePref(prof.theme_preference);
          // Also apply immediately (in addition to global ThemeSync)
          setTheme(prof.theme_preference);
        }

        // Tier: query user_tiers too and pickHighestTier so that business_plus (or higher) is shown
        // even if only one of the two tables has the updated tier (common after Stripe webhooks or restores).
        let displayTier = prof.tier || 'free_trial';
        try {
          const { data: ut } = await supabaseBrowser
            .from('user_tiers')
            .select('tier')
            .eq('user_id', user.id)
            .maybeSingle();
          displayTier = pickHighestTier(prof.tier, ut?.tier);
        } catch {}
        const biz = displayTier === 'business' || displayTier === 'business_plus';
        setIsBusinessUser(biz);
        // If we resolved a better tier than what was on the prof row, reflect it in local profile for "Current Plan" tile etc.
        if (displayTier !== prof.tier) {
          setProfile({ ...prof, tier: displayTier } as Profile);
        }

        if (biz) {
          const { data: membership } = await supabaseBrowser
            .from('team_members')
            .select(`
              role,
              teams:team_id (name)
            `)
            .eq('user_id', user.id)
            .maybeSingle();

          if (membership) {
            const role = membership.role as string;
            setUserRole(role);
            setIsTeamOwner(role === 'owner');
            setTeamName((membership.teams as any)?.name || null);
          } else {
            setUserRole(null);
            setIsTeamOwner(false);
            setTeamName(null);
          }
        } else {
          setUserRole('Individual');
          setIsTeamOwner(true);
          setTeamName(null);
        }

        // Best-effort ensure user_tiers row (for name sync + image tracking in other flows). Non-fatal; RLS denies client inserts.
        try {
          await supabaseBrowser
            .from('user_tiers')
            .upsert({
              user_id: user.id,
              tier: prof.tier || 'free_trial',
              sessions_used: 0,
              images_used: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
        } catch (utErr) {
          console.warn('Could not ensure user_tiers row (may be unused or RLS-protected):', utErr);
        }
      } catch (loadErr) {
        console.error('Unexpected error in loadUserAndProfile:', loadErr);
        // Do not block the page; set minimal so UI shows.
        const fallback: Profile = {
          id: user.id,
          email: user.email || '',
          tier: 'free_trial',
          full_name: undefined,
          stripe_customer_id: undefined,
          created_at: new Date().toISOString(),
          theme_preference: 'dark',
        };
        setProfile(fallback);
        setFullName('');
        setIsBusinessUser(false);
        setUserRole('Individual');
        setIsTeamOwner(true);
        setTeamName(null);
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
      // Use upsert so save also creates the row if it somehow still doesn't exist (resilience after rebuilds).
      // Preserve the loaded tier (don't accidentally downgrade); only name + timestamps are the intent of this form.
      const { error } = await supabaseBrowser
        .from('profiles')
        .upsert({
          id: user.id,
          email: profile.email || user.email || '',
          full_name: fullName.trim() || null,
          tier: profile.tier || 'free_trial',
          theme_preference: profile.theme_preference || themePref,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (error) throw error;

      // Also sync to user_tiers for consistency (name is personal info)
      // Non-fatal if column not present yet or no row (RLS may prevent client create)
      try {
        await supabaseBrowser
          .from('user_tiers')
          .update({
            full_name: fullName.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      } catch (syncErr) {
        console.warn('Could not sync full_name to user_tiers (may not have column yet or row):', syncErr);
      }

      setProfile({ ...profile, full_name: fullName.trim() || undefined });
      toast.success('Profile updated successfully');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleManageBilling = async () => {
    if (!user) return;

    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to open billing portal');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to open billing portal. Please try again.');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    const confirmed = confirm(
      'Are you sure you want to cancel your subscription?\n\n' +
      'Your access will continue until the end of the current billing period, then your account will be downgraded.'
    );

    if (!confirmed) return;

    // For safety and PCI compliance, we redirect to Stripe Portal for cancellation
    await handleManageBilling();
  };

  const canManageBilling = !isBusinessUser || isTeamOwner;

  const handleResetPassword = async () => {
    if (!profile?.email) return;

    setResetLoading(true);
    try {
      const { error } = await supabaseBrowser.auth.resetPasswordForEmail(profile.email, {
        redirectTo: `${window.location.origin}/account`, // user will be redirected back after reset
      });

      if (error) throw error;

      toast.success('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send password reset email');
    } finally {
      setResetLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-white/10 rounded w-1/3" />
            <div className="h-64 bg-white/5 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const currentPlan = getTierLabel(profile?.tier);
  const displayRole = userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-4xl font-semibold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your profile and subscription</p>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
        {/* Profile Section */}
        <motion.div variants={fadeInUp}>
        <Card className="mb-8 card-premium border-white/10">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
              <div className="p-3 bg-white/5 rounded-xl text-foreground font-medium border border-white/10">
                {profile?.email || user?.email}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                To change your email, please contact support.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Full Name</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="text-lg bg-background border-white/10"
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSaveProfile} 
                disabled={saving}
                className="btn-premium px-8"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

            {/* Reset Password */}
            <div className="pt-4 border-t border-white/10">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
              <Button
                variant="outline"
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="border-white/10 hover:bg-white/5"
              >
                {resetLoading ? 'Sending reset link...' : 'Send Password Reset Email'}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                We'll email you a secure link to reset your password.
              </p>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Appearance / Theme Preference (user preference persisted in profiles) */}
        <motion.div variants={fadeInUp}>
          <Card className="mb-8 card-premium border-white/10">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Choose how MyTech-Fix looks on this account. Your preference is saved and applied on every device after login.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { value: 'light' as const, label: 'Light', Icon: Sun, desc: 'Bright, clean interface' },
                  { value: 'dark' as const, label: 'Dark', Icon: Moon, desc: 'Premium dark (default)' },
                  { value: 'system' as const, label: 'System', Icon: Monitor, desc: 'Follows your device' },
                ].map(({ value, label, Icon, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={async () => {
                      setThemePref(value);
                      setTheme(value);

                      // Persist immediately (user preference)
                      if (user && profile) {
                        try {
                          await supabaseBrowser.from('profiles').upsert({
                            id: user.id,
                            email: profile.email || user.email || '',
                            full_name: profile.full_name || null,
                            tier: profile.tier || 'free_trial',
                            theme_preference: value,
                            updated_at: new Date().toISOString(),
                          }, { onConflict: 'id' });

                          // Also keep local profile state in sync
                          setProfile({ ...profile, theme_preference: value });
                          toast.success(`Theme set to ${label}`);
                        } catch (e: any) {
                          toast.error('Failed to save theme preference');
                        }
                      } else {
                        toast.success(`Theme set to ${label}`);
                      }
                    }}
                    className={`group flex flex-col items-center gap-2 rounded-2xl border p-4 text-left transition-all active:scale-[0.985] ${
                      themePref === value
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    <div className="font-semibold">{label}</div>
                    <div className="text-[11px] text-muted-foreground text-center leading-tight">{desc}</div>
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-muted-foreground pt-1">
                The nav bar toggle (sun/moon/monitor icon) also cycles through these options and saves automatically.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription & Billing */}
        <motion.div variants={fadeInUp}>
        <Card className="mb-8 card-premium border-white/10">
          <CardHeader>
            <CardTitle>Subscription & Billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-white/5 rounded-2xl space-y-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Current Plan</div>
                  <div className="text-2xl font-semibold flex items-center gap-3">
                    {currentPlan}
                    {canManageBilling && (
                      <Link 
                        href="/pricing" 
                        className="text-sm font-normal text-primary hover:underline ml-2"
                      >
                        Change Plan
                      </Link>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Member since</div>
                  <div className="text-sm font-medium">
                    {profile?.created_at 
                      ? new Date(profile.created_at).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        }) 
                      : '—'}
                  </div>
                </div>
              </div>

              {userRole && (
                <div>
                  <div className="text-sm text-muted-foreground">Your Role</div>
                  <div className="text-lg font-medium">
                    {displayRole}
                    {teamName && ` of ${teamName}`}
                  </div>
                </div>
              )}
            </div>

            {canManageBilling ? (
              <>
                <div className="pt-2">
                  <Button
                    onClick={handleManageBilling}
                    disabled={portalLoading}
                    className="w-full py-6 text-lg btn-premium bg-primary hover:bg-primary/90"
                  >
                    {portalLoading ? 'Opening Stripe...' : 'Manage Billing & Subscription'}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Update payment method, view invoices, or cancel your subscription securely via Stripe.
                  </p>
                </div>

                {profile?.tier && !['free_trial', 'single_use'].includes(profile.tier) && (
                  <div className="pt-4 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={handleCancelSubscription}
                      className="w-full text-red-400 border-red-400/30 hover:bg-red-500/10 hover:text-red-400"
                    >
                      Cancel Subscription
                    </Button>
                    <p className="text-[11px] text-center text-muted-foreground mt-2">
                      Your subscription will remain active until the end of the current billing period.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="pt-2 p-4 bg-amber-500/10 border border-amber-400/30 rounded-xl text-sm">
                <p className="text-amber-400 font-medium">Billing managed by team owner</p>
                <p className="text-amber-400/80 mt-1 text-xs">
                  Subscription and payment settings are controlled by the owner of your team. 
                  Contact your team owner for billing changes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={fadeInUp}>
        <Card className="border-red-500/30 card-premium">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Need to delete your account? This action is permanent and will cancel any active subscription.
            </p>
            <Button 
              variant="outline" 
              className="text-red-400 border-red-400/30 hover:bg-red-500/10"
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                  toast.error('Account deletion is not yet implemented. Please contact support.');
                }
              }}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
