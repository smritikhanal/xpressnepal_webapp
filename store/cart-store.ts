'use client';

import { create } from 'zustand';
import toast from 'react-hot-toast';

export interface CartItem {
  productId: {
    _id: string;
    title: string;
    slug: string;
    price: number;
    discountPrice?: number;
    images: string[];
    stock: number;
  };
  quantity: number;
  priceAtTime: number;
}

interface RawCartItem {
  productId: unknown;
  quantity: number;
  priceAtTime: number;
}

interface RawCart {
  _id: string;
  userId: string;
  items: RawCartItem[];
}

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

interface CartState {
  cart: Cart | null;
  loading: boolean;
  setCart: (cart: Cart | null) => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<boolean>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const isPopulatedProduct = (value: unknown): value is CartItem['productId'] => {
  if (!value || typeof value !== 'object') return false;

  const product = value as Record<string, unknown>;
  return (
    typeof product._id === 'string' &&
    typeof product.title === 'string' &&
    typeof product.slug === 'string' &&
    typeof product.price === 'number' &&
    Array.isArray(product.images) &&
    typeof product.stock === 'number'
  );
};

const normalizeCart = (rawCart: RawCart | Cart | null): Cart | null => {
  if (!rawCart) return null;

  const safeItems = (rawCart.items || [])
    .filter((item): item is RawCartItem => isPopulatedProduct(item?.productId))
    .map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      priceAtTime: item.priceAtTime,
    }));

  return {
    _id: rawCart._id,
    userId: rawCart.userId,
    items: safeItems,
  };
};

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  loading: false,

  setCart: (cart) => set({ cart: normalizeCart(cart) }),

  fetchCart: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      set({ loading: true });
      const response = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        set({ cart: normalizeCart(data.data as RawCart) });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return false;
      }

      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (data.success) {
        set({ cart: normalizeCart(data.data as RawCart) });
        return true;
      } else {
        toast.error(data.message || 'Failed to add item to cart');
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('An error occurred');
      return false;
    }
  },

  removeItem: async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        set({ cart: normalizeCart(data.data as RawCart) });
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (data.success) {
        set({ cart: normalizeCart(data.data as RawCart) });
      } else {
        toast.error(data.message || 'Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  },

  clearCart: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/cart/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        set({ cart: null });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  },

  getItemCount: () => {
    const cart = get().cart;
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    const cart = get().cart;
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (total, item) => total + item.priceAtTime * item.quantity,
      0
    );
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const shipping = subtotal > 0 ? 100 : 0;
    return subtotal + shipping;
  },
}));
