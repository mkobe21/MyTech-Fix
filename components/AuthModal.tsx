'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { passwordRequirements, validatePassword, passwordsMatch } from '@/lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signIn' | 'signUp';
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [freeTrialBlocked, setFreeTrialBlocked] = useState(false);

  const { isValid: passwordIsValid } = validatePassword(password);
  const passwordsDoMatch = passwordsMatch(password, confirmPassword);

  const canSignUp = mode === 'signUp' 
    ? email && passwordIsValid && passwordsDoMatch 
    : true;

  const handleAuth = async () => {
    if (mode === 'signUp' && !canSignUp) return;

    setLoading(true);
    try {
      if (mode === 'signUp') {
        // Server-side validation (email uniqueness + free trial eligibility)
        const checkRes = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const checkData = await checkRes.json();

        if (!checkRes.ok || !checkData.available) {
          toast.error(checkData.message || "An account with this email already exists. Please sign in instead.");
          setTimeout(() => onClose(), 1800);
          return;
        }

        // Check if this email has already claimed a free trial
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

        // Create account
        const { error } = await supabaseBrowser.auth.signUp({
          email,
          password,
          options: { 
            emailRedirectTo: `${window.location.origin}/chat` 
          },
        });

        if (error) {
          const message = error.message || "";

          if (message.toLowerCase().includes("password")) {
            toast.error("Password does not meet the security requirements.");
          } else {
            toast.error(message);
          }
          return;
        }

        toast.success('Account created! Please check your email to confirm.');
        onClose();
      } else {
        // Sign In
        const { error } = await supabaseBrowser.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        toast.success('Signed in successfully!');
        onClose();
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabaseBrowser.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;

      setResetSent(true);
      toast.success("Password reset link sent! Check your email.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {forgotMode ? "Reset Your Password" : 
             mode === 'signUp' ? 'Create Your Account' : 'Sign In to MyTech-Fix'}
          </DialogTitle>
          <DialogDescription>
            {forgotMode 
              ? "Enter your email and we'll send you a reset link." 
              : mode === 'signUp' 
                ? 'Enter your email and create a password.' 
                : 'Sign in to access your dashboard and saved sessions.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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

          {!forgotMode && (
            <>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {mode === 'signUp' && (
                <>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {/* Password Requirements Checklist */}
                  <div className="rounded-lg bg-white/5 border border-white/[0.07] p-3 text-sm">
                    <div className="font-medium text-slate-400 mb-2 text-xs">Password requirements:</div>
                    <ul className="space-y-1">
                      {passwordRequirements.map((req, index) => {
                        const isMet = req.test(password);
                        return (
                          <li key={index} className={`flex items-center gap-2 text-xs ${isMet ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <span className={`inline-block w-1 h-1 rounded-full ${isMet ? 'bg-emerald-500' : 'bg-white/20'}`} />
                            {req.label}
                          </li>
                        );
                      })}
                    </ul>
                    {password && confirmPassword && !passwordsDoMatch && (
                      <p className="text-red-600 text-xs mt-2">Passwords do not match.</p>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {mode === 'signIn' && !forgotMode && (
            <button
              onClick={() => setForgotMode(true)}
              className="text-sm text-blue-400 hover:text-blue-300 hover:underline text-left w-full"
            >
              Forgot your password?
            </button>
          )}

          {mode === 'signUp' && freeTrialBlocked ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
                <p className="font-medium text-amber-300">Free trial already used</p>
                <p className="text-amber-400/80 mt-1">
                  This email has already claimed a free trial. Please choose a paid plan to continue.
                </p>
              </div>
              <Button 
                onClick={() => {
                  onClose();
                  window.location.href = '/pricing';
                }} 
                className="w-full"
              >
                View Pricing Plans
              </Button>
              <button 
                onClick={() => {
                  setFreeTrialBlocked(false);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-sm text-blue-400 hover:text-blue-300 hover:underline w-full"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <Button 
              onClick={forgotMode ? handlePasswordReset : handleAuth} 
              className="w-full" 
              disabled={loading || !email || (mode === 'signUp' && !canSignUp)}
            >
              {loading 
                ? (forgotMode ? "Sending Reset Link..." : "Processing...") 
                : forgotMode 
                  ? "Send Reset Link" 
                  : mode === 'signUp' 
                    ? 'Create Account' 
                    : 'Sign In'
              }
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}