'use client';

import React, {createContext, useContext, useEffect, useState} from 'react';
import {supabase} from '@/lib/supabase/client';
import type {User, Session} from '@supabase/supabase-js';
import type {Database, UserRole} from '@/lib/supabase/types';
import {apiFetch} from '@/utils/apiClient';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    organizationName?: string,
    collegeId?: string
  ) => Promise<{error: Error | null; profile: Profile | null}>;
  signIn: (email: string, password: string) => Promise<{error: Error | null; profile: Profile | null}>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => Promise<{error: Error | null}>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string): Promise<Profile | null> => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return null;
    }
    
    try {
      // Use apiPublicFetch to avoid redirect loops during profile loading
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setProfile(null);
        setLoading(false);
        return null;
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/profiles/user/${userId}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        return data; // Return the profile data
      } else {
        // Profile doesn't exist yet - this is normal for new users
        console.warn('Profile not found for user:', userId);
        setProfile(null);
        return null;
      }
    } catch (error) {
      // Network error or other issue - don't redirect, just log
      console.warn('Error loading profile:', error);
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    organizationName?: string,
    collegeId?: string
  ) => {
    try {
      const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            organization_name: organizationName || null,
            college_id: collegeId || null,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data.user) {
        const loadedProfile = await loadProfile(data.user.id);
        // Wait a bit for React state to update
        await new Promise(resolve => setTimeout(resolve, 100));
        return {error: null, profile: loadedProfile};
      }

      return {error: null, profile: null};
    } catch (error) {
      console.error('Sign up error:', error);
      return {error: error as Error, profile: null};
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const loadedProfile = await loadProfile(data.user.id);
        // Wait a bit for React state to update
        await new Promise(resolve => setTimeout(resolve, 100));
        return {error: null, profile: loadedProfile};
      }

      return {error: null, profile: null};
    } catch (error) {
      console.error('Sign in error:', error);
      return {error: error as Error, profile: null};
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return {error: new Error('Not authenticated')};

    try {
      // Convert snake_case keys to camelCase for backend
      const backendUpdates: any = {};
      for (const [key, value] of Object.entries(updates)) {
        // Convert snake_case to camelCase
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        backendUpdates[camelKey] = value;
      }

      await apiFetch(`/api/profiles/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(backendUpdates)
      });

      // Reload profile
      await loadProfile(user.id);

      return {error: null};
    } catch (error) {
      console.error('Update profile error:', error);
      return {error: error as Error};
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}
