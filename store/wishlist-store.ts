'use client';

import { create } from 'zustand';
import { Product } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const GUEST_WISHLIST_KEY = 'guest-wishlist';

interface WishlistState {
  items: Product[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
  mergeGuestWishlist: () => Promise<void>;
}

/**
 * Zustand store for wishlist
 * DB-backed when authenticated; falls back to localStorage for guests.
 * On login, call mergeGuestWishlist() to sync guest items into the DB.
 */
export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  loading: false,

  fetchWishlist: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      // Guest: load from localStorage
      if (typeof window !== 'undefined') {
        try {
          const guest = localStorage.getItem(GUEST_WISHLIST_KEY);
          set({ items: guest ? JSON.parse(guest) : [] });
        } catch {
          set({ items: [] });
        }
      }
      return;
    }

    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      const data = await res.json();
      const products: Product[] = data.data?.products || [];
      set({ items: products });
    } catch (err) {
      console.error('fetchWishlist error:', err);
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (product) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      // Guest: persist to localStorage
      set((state) => {
        const exists = state.items.find((i) => i._id === product._id);
        if (exists) return state;
        const newItems = [...state.items, product];
        if (typeof window !== 'undefined') {
          localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(newItems));
        }
        return { items: newItems };
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/wishlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });
      if (!res.ok) throw new Error('Failed to add to wishlist');
      const data = await res.json();
      const products: Product[] = data.data?.products || [];
      set({ items: products });
    } catch (err) {
      console.error('addItem wishlist error:', err);
    }
  },

  removeItem: async (productId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      // Guest: remove from localStorage
      set((state) => {
        const newItems = state.items.filter((i) => i._id !== productId);
        if (typeof window !== 'undefined') {
          localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(newItems));
        }
        return { items: newItems };
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to remove from wishlist');
      const data = await res.json();
      const products: Product[] = data.data?.products || [];
      set({ items: products });
    } catch (err) {
      console.error('removeItem wishlist error:', err);
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item._id === productId);
  },

  clearWishlist: () => {
    set({ items: [] });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GUEST_WISHLIST_KEY);
    }
  },

  getItemCount: () => {
    return get().items.length;
  },

  /** Call this after a successful login to merge guest localStorage items into the DB. */
  mergeGuestWishlist: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token || typeof window === 'undefined') return;

    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    if (!raw) {
      // No guest items — just sync from DB
      await get().fetchWishlist();
      return;
    }

    let guestItems: Product[] = [];
    try {
      guestItems = JSON.parse(raw);
    } catch {
      guestItems = [];
    }

    // Fetch existing DB wishlist first
    await get().fetchWishlist();

    // Add each guest item to the DB
    for (const product of guestItems) {
      await get().addItem(product);
    }

    // Clear guest localStorage after merge
    localStorage.removeItem(GUEST_WISHLIST_KEY);
  },
}));
