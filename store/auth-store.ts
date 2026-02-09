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
          // Also store in cookie for middleware
          document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
        }
        set({ user, token, isAuthenticated: true });
      },
      
      setUser: (user) => {
        set({ user });
      },
      
      clearAuth: () => {
        // Clear token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Also clear cookie
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
