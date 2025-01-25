import { hashPassword, verifyPassword } from './utils';
import { supabase } from './supabase';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';
let cachedHashedPassword: string | null = null;

export async function checkAdminPassword(password: string): Promise<boolean> {
  try {
    if (!cachedHashedPassword) {
      cachedHashedPassword = await hashPassword(ADMIN_PASSWORD);
      console.log('Hashed admin password (cached):', cachedHashedPassword);
    }
    const isValid = await verifyPassword(password, cachedHashedPassword);
    console.log('Password verification result:', isValid);
    return isValid;
  } catch (error) {
    console.error('Error during password check:', error);
    return false;
  }
}

export async function getSession() {
  return await supabase.auth.getSession();
}

export async function signIn() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'password123',
  });

  if (error) {
    console.error('Error signing in:', error);
    return null;
  }

  return data;
}

export async function signOut() {
  return await supabase.auth.signOut();
}
