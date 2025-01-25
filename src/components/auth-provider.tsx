import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import { signIn, signOut } from '@/lib/auth';

interface AuthContextType {
  session: any | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn();
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  const value = {
    session,
    signIn: handleSignIn,
    signOut: handleSignOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
