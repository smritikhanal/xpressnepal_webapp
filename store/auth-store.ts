'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

/**
 * Zustand store for authentication state
 * Persists to localStorage automatically
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        // Store token in localStorage for axios interceptor
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        set({ user, token, isAuthenticated: true });
      },
      
      setUser: (user) => {
        set({ user });
      },
      
      clearAuth: () => {
        // Immediately set state to null
        set({ user: null, token: null, isAuthenticated: false });
        
        // Clear all auth-related items from localStorage and cookies
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('auth-storage');
          // Clear the entire localStorage to prevent any rehydration issues
          localStorage.clear();
          
          // Clear cookies as well
          document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.split('=');
            document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
