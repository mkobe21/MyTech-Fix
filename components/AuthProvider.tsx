'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import AuthModal from './AuthModal';
import type { User } from '@supabase/supabase-js';

type AuthContextType = {
  openSignIn: () => void;
  openSignUp: () => void;
  user: User | null;
  userLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Global auth user listener (single source so UserMenu, ThemeToggle etc. don't duplicate)
  useEffect(() => {
    let mounted = true;

    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUser(data.user);
        setUserLoading(false);
      }
    });

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user || null);
        setUserLoading(false);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        openSignIn: () => setShowSignIn(true),
        openSignUp: () => setShowSignUp(true),
        user,
        userLoading,
      }}
    >
      {children}
      <AuthModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} mode="signIn" />
      <AuthModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} mode="signUp" />
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};