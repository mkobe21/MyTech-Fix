'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function UserMenu() {
  const { openSignIn, openSignUp, user, userLoading: loading } = useAuth();

  const handleSignOut = async () => {
    const { supabaseBrowser } = await import('@/lib/supabase');
    await supabaseBrowser.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={openSignIn}>Sign In</Button>
        <Button onClick={openSignUp}>Sign Up</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {user.email?.[0].toUpperCase() || 'U'}
        </div>
        <span className="text-sm hidden md:block text-muted-foreground">
          {user.email?.split('@')[0]}
        </span>
      </div>

      <Link href="/account" className="text-sm text-muted-foreground hover:text-foreground hidden md:block">
        Account
      </Link>

      <Button variant="ghost" size="icon" onClick={handleSignOut}>
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
}