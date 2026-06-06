'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabaseBrowser } from '@/lib/supabase';
import Link from 'next/link';
import { toast } from 'sonner';
import { passwordRequirements, validatePassword, passwordsMatch } from '@/lib/utils';
import BusinessOnboarding from '@/components/BusinessOnboarding';

function SignupContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'free';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [freeTrialBlocked, setFreeTrialBlocked] = useState(false);
  const [businessData, setBusinessData] = useState<any>(null);

  const planInfo = {
    free: { name: "Free Trial", price: "0", desc: "1 Free Session" },
    single: { name: "Single Use", price: "9.99", desc: "One Session" },
    home: { name: "Home Plan", price: "9.99", desc: "Monthly" },
    business: { name: "Small Business", price: "29.99", desc: "IT Support for up to 5 Team Members" },
    business_plus: { name: "Small Business Plus", price: "59.99", desc: "IT Support for up to 15 Team Members" }
  }[plan] || { name: "Plan", price: "", desc: "" };

  const { isValid: passwordIsValid } = validatePassword(password);
  const passwordsDoMatch = passwordsMatch(password, confirmPassword);

  const canSubmit = email && passwordIsValid && passwordsDoMatch && !loading;

  const handleSignup = async () => {
    if (!canSubmit) return;

    setLoading(true);
    try {
      // Server-side validation (email uniqueness + free trial eligibility)
      const checkRes = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkRes.json();

      if (!checkRes.ok || !checkData.available) {
        toast.error(checkData.message || "An account with this email already exists. Please sign in instead.");
        setLoading(false);
        return;
      }

      // Additional check: Free trial can only be claimed once per email
      if (plan === 'free') {
        const trialRes = await fetch('/api/auth/can-claim-free-trial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const trialData = await trialRes.json();

        if (!trialRes.ok || !trialData.canClaim) {
          setFreeTrialBlocked(true);
          setLoading(false);
          return;
        }
      }

      const { error } = await supabaseBrowser.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/chat`,
        }
      });

      if (error) throw error;

      toast.success(`Account created! Welcome to ${planInfo.name}`);

      // If this is a business plan signup, auto-create the team
      if ((plan === 'business' || plan === 'business_plus') && businessData) {
        try {
          const { data: { user: newUser } } = await supabaseBrowser.auth.getUser();
          if (newUser) {
            const { data: newTeam } = await supabaseBrowser
              .from('teams')
              .insert({
                name: businessData.companyName || `${planInfo.name} Team`,
                owner_id: newUser.id,
              })
              .select()
              .single();

            if (newTeam) {
              await supabaseBrowser.from('team_members').insert({
                team_id: newTeam.id,
                user_id: newUser.id,
                role: 'owner',
              });

              // TODO: Save businessData (locations, pain points) somewhere useful
            }
          }
        } catch (teamErr) {
          console.error('Team creation failed after signup:', teamErr);
        }
      }
      
      // Redirect to chat after successful signup
      setTimeout(() => {
        window.location.href = '/chat';
      }, 1500);
    } catch (error: any) {
      const message = error.message || "Failed to create account";

      // Better handling for Supabase password policy errors
      if (message.toLowerCase().includes("password")) {
        toast.error("Password does not meet security requirements. Please check the requirements below.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-md mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold mb-3">Create Your Account</h1>
          <p className="text-xl font-medium text-blue-600">
            {planInfo.name} — ${planInfo.price}
          </p>
          <p className="text-zinc-600 mt-1">{planInfo.desc}</p>
        </div>

        <div className="card-premium border-white/10 rounded-3xl p-8">
          {freeTrialBlocked && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="font-semibold text-amber-800">Free trial already claimed</p>
              <p className="mt-1 text-sm text-amber-700">
                This email has already used the free trial. Please select a paid plan to continue.
              </p>
              <Link href="/pricing" className="mt-4 inline-block">
                <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          )}

          {/* Business Onboarding */}
          {(plan === 'business' || plan === 'business_plus') && !businessData && (
            <div className="mb-6">
              <div className="mb-4">
                <h3 className="font-semibold">Tell us about your business</h3>
                <p className="text-sm text-zinc-600">This helps us set up your team workspace.</p>
              </div>
              <BusinessOnboarding onComplete={(data) => setBusinessData(data)} />
              <div className="mt-4 text-xs text-zinc-500">You can update these details later in Team Settings.</div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Password Requirements */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-medium text-zinc-700 mb-3">Password must contain:</div>
              <ul className="space-y-1.5 text-sm">
                {passwordRequirements.map((req, index) => {
                  const isMet = req.test(password);
                  return (
                    <li key={index} className={`flex items-center gap-2 ${isMet ? 'text-green-600' : 'text-zinc-600'}`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${isMet ? 'bg-green-500' : 'bg-white/20'}`} />
                      {req.label}
                    </li>
                  );
                })}
              </ul>
              {password && confirmPassword && !passwordsDoMatch && (
                <p className="text-red-600 text-sm mt-3">Passwords do not match.</p>
              )}
            </div>

            <Button 
              onClick={handleSignup} 
              disabled={!canSubmit || freeTrialBlocked}
              className="w-full py-7 text-lg"
            >
              {freeTrialBlocked 
                ? "Free Trial Unavailable" 
                : loading 
                  ? "Creating Account..." 
                  : `Create Account & ${plan === 'free' ? 'Start Free Trial' : 'Continue'}`}
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Already have an account? <Link href="/chat" className="text-blue-600 hover:underline">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}