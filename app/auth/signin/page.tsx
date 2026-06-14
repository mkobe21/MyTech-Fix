'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';

export default function SignInPrompt() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-8 bg-primary/10 rounded-full flex items-center justify-center ring-1 ring-white/10">
          <span className="text-4xl">🔧</span>
        </div>

        <h1 className="font-sora text-4xl font-bold text-slate-50 mb-4">
          Welcome to MyTech<span className="text-blue-400">Fix</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Sign in to save your chats and get personalized help
        </p>

        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full text-lg py-7 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-900/40"
            onClick={() => setShowSignIn(true)}
          >
            Sign In
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full text-lg py-7 rounded-2xl border-white/[0.12] text-slate-200 hover:bg-white/5 hover:border-white/25"
            onClick={() => setShowSignUp(true)}
          >
            Create Free Account
          </Button>
        </div>

        <p className="text-xs text-slate-500 mt-10">
          No credit card required • Takes 30 seconds
        </p>

        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mt-8 inline-block">
          ← Back to Home
        </Link>
      </div>

      {/* Global Modals */}
      <AuthModal 
        isOpen={showSignIn} 
        onClose={() => setShowSignIn(false)} 
        mode="signIn" 
      />
      <AuthModal 
        isOpen={showSignUp} 
        onClose={() => setShowSignUp(false)} 
        mode="signUp" 
      />
    </div>
  );
}