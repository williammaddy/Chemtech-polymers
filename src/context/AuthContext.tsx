import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  failedAttempts: number;
  lockoutRemaining: number;
  login: (email: string, pass: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_SEC = 60;
const STORAGE_LOCKOUT_KEY = 'chemtech_admin_lockout';
const STORAGE_ATTEMPTS_KEY = 'chemtech_admin_attempts';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Check initial lockout state
  useEffect(() => {
    const checkLockout = () => {
      const lockoutUntil = localStorage.getItem(STORAGE_LOCKOUT_KEY);
      if (lockoutUntil) {
        const remaining = Math.max(0, Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 1000));
        setLockoutRemaining(remaining);
        if (remaining <= 0) {
          localStorage.removeItem(STORAGE_LOCKOUT_KEY);
          localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
          setFailedAttempts(0);
        }
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  // Supabase Auth listener (or local demo session restoration)
  useEffect(() => {
    if (!isSupabaseConfigured) {
      const savedDemo = localStorage.getItem('chemtech_demo_admin_session');
      if (savedDemo) {
        try {
          const parsed = JSON.parse(savedDemo);
          const demoUser: User = {
            id: 'demo-admin-id',
            app_metadata: {},
            user_metadata: { name: 'Demo Chemtech Administrator' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            email: parsed.email || 'admin@chemtechpolymers.com',
          } as User;

          const demoSession: Session = {
            access_token: 'demo-local-access-token',
            refresh_token: 'demo-local-refresh-token',
            expires_in: 86400,
            token_type: 'bearer',
            user: demoUser,
          } as Session;

          setSession(demoSession);
          setUser(demoUser);
        } catch {
          localStorage.removeItem('chemtech_demo_admin_session');
        }
      }
      setLoading(false);
      return;
    }

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<{ error: string | null }> => {
    // Check lockout first
    const lockoutUntil = localStorage.getItem(STORAGE_LOCKOUT_KEY);
    if (lockoutUntil) {
      const remaining = Math.max(0, Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 1000));
      if (remaining > 0) {
        return { error: `Too many failed attempts. Login locked for ${remaining} seconds.` };
      }
    }

    // If Supabase is not configured, allow seamless Demo Mode access
    if (!isSupabaseConfigured) {
      const demoEmail = email.trim().toLowerCase() || 'admin@chemtechpolymers.com';
      const demoUser: User = {
        id: 'demo-admin-id',
        app_metadata: {},
        user_metadata: { name: 'Demo Chemtech Administrator' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: demoEmail,
      } as User;

      const demoSession: Session = {
        access_token: 'demo-local-access-token',
        refresh_token: 'demo-local-refresh-token',
        expires_in: 86400,
        token_type: 'bearer',
        user: demoUser,
      } as Session;

      localStorage.setItem('chemtech_demo_admin_session', JSON.stringify({ email: demoEmail }));
      setSession(demoSession);
      setUser(demoUser);
      setFailedAttempts(0);
      setLockoutRemaining(0);
      localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
      localStorage.removeItem(STORAGE_LOCKOUT_KEY);
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        localStorage.setItem(STORAGE_ATTEMPTS_KEY, newAttempts.toString());

        if (newAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockTime = Date.now() + LOCKOUT_DURATION_SEC * 1000;
          localStorage.setItem(STORAGE_LOCKOUT_KEY, lockTime.toString());
          setLockoutRemaining(LOCKOUT_DURATION_SEC);
          return { error: `Maximum login attempts exceeded. Locked out for ${LOCKOUT_DURATION_SEC} seconds.` };
        }

        return { error: `${error.message} (${MAX_FAILED_ATTEMPTS - newAttempts} attempts remaining)` };
      }

      // Success: reset attempts
      setFailedAttempts(0);
      setLockoutRemaining(0);
      localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
      localStorage.removeItem(STORAGE_LOCKOUT_KEY);
      setSession(data.session);
      setUser(data.user);
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'An unexpected error occurred during login.' };
    }
  }, [failedAttempts]);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('chemtech_demo_admin_session');
    setSession(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAuthenticated: Boolean(session && user),
        failedAttempts,
        lockoutRemaining,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
