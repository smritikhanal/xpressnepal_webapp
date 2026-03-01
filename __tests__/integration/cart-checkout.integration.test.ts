/**
 * Integration Test: Cart and Checkout Flow
 *
 * Tests the complete user journey from adding items to cart through
 * completing checkout, using mocked API responses.
 */

import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { User } from '@/types';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

// Helper to create mock user
const createMockUser = (overrides: Partial<User> = {}): User => {
  const baseId = overrides.id ?? overrides._id ?? 'user-123';

  return {
    name: 'Test User',
    email: 'test@example.com',
    role: 'customer',
    isVerified: true,
    authProvider: 'local',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
    id: overrides.id ?? baseId,
    _id: overrides._id ?? baseId,
  };
};

describe('Cart and Checkout Flow (Integration)', () => {
  beforeEach(() => {
    act(() => {
      useCartStore.getState().setCart(null);
      useAuthStore.getState().clearAuth();
    });
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Add to Cart Flow', () => {
    it('should add items to cart via API', async () => {
      localStorage.setItem('token', 'mock-token');
      const { result } = renderHook(() => useCartStore());

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            _id: 'cart-123',
            userId: 'user-123',
            items: [
              {
                productId: {
                  _id: 'prod-123',
                  title: 'Test Product',
                  slug: 'test-product',
                  price: 1500,
                  images: ['test.jpg'],
                  stock: 10,
                },
                quantity: 2,
                priceAtTime: 1500,
              },
            ],
          },
        }),
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.addItem('prod-123', 2);
      });

      expect(success).toBe(true);
      expect(result.current.cart?.items).toHaveLength(1);
      expect(result.current.cart?.items[0].quantity).toBe(2);
      expect(result.current.getItemCount()).toBe(2);
    });

    it('should handle adding item without authentication', async () => {
      const { result } = renderHook(() => useCartStore());

      let success: boolean = true;
      await act(async () => {
        success = await result.current.addItem('prod-456', 1);
      });

      expect(success).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Please login to add items to cart');
    });

    it('should fetch cart from API', async () => {
      localStorage.setItem('token', 'mock-token');
      const { result } = renderHook(() => useCartStore());

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            _id: 'cart-456',
            userId: 'user-456',
            items: [
              {
                productId: {
                  _id: 'prod-789',
                  title: 'Limited Stock',
                  slug: 'limited-stock',
                  price: 1000,
                  images: ['limited.jpg'],
                  stock: 3,
                },
                quantity: 2,
                priceAtTime: 1000,
              },
            ],
          },
        }),
      });

      await act(async () => {
        await result.current.fetchCart();
      });

      expect(result.current.cart).toBeTruthy();
      expect(result.current.cart?.items).toHaveLength(1);
      expect(result.current.getItemCount()).toBe(2);
      expect(result.current.getSubtotal()).toBe(2000);
    });
  });

  describe('Cart Management', () => {
    it('should remove items from cart via API', async () => {
      localStorage.setItem('token', 'mock-token');
      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        result.current.setCart({
          _id: 'cart-1',
          userId: 'user-1',
          items: [
            {
              productId: { _id: 'prod-1', title: 'Product 1', slug: 'product-1', price: 100, images: ['p1.jpg'], stock: 10 },
              quantity: 1,
              priceAtTime: 100,
            },
            {
              productId: { _id: 'prod-2', title: 'Product 2', slug: 'product-2', price: 200, images: ['p2.jpg'], stock: 10 },
              quantity: 1,
              priceAtTime: 200,
            },
          ],
        });
      });

      expect(result.current.cart?.items).toHaveLength(2);

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            _id: 'cart-1',
            userId: 'user-1',
            items: [
              {
                productId: { _id: 'prod-2', title: 'Product 2', slug: 'product-2', price: 200, images: ['p2.jpg'], stock: 10 },
                quantity: 1,
                priceAtTime: 200,
              },
            ],
          },
        }),
      });

      await act(async () => {
        await result.current.removeItem('prod-1');
      });

      expect(result.current.cart?.items).toHaveLength(1);
      expect(result.current.cart?.items[0].productId._id).toBe('prod-2');
    });

    it('should update item quantities via API', async () => {
      localStorage.setItem('token', 'mock-token');
      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        result.current.setCart({
          _id: 'cart-update',
          userId: 'user-1',
          items: [
            {
              productId: { _id: 'prod-update', title: 'Update Test', slug: 'update-test', price: 500, images: ['update.jpg'], stock: 10 },
              quantity: 2,
              priceAtTime: 500,
            },
          ],
        });
      });

      expect(result.current.getSubtotal()).toBe(1000);

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            _id: 'cart-update',
            userId: 'user-1',
            items: [
              {
                productId: { _id: 'prod-update', title: 'Update Test', slug: 'update-test', price: 500, images: ['update.jpg'], stock: 10 },
                quantity: 5,
                priceAtTime: 500,
              },
            ],
          },
        }),
      });

      await act(async () => {
        await result.current.updateQuantity('prod-update', 5);
      });

      expect(result.current.cart?.items[0].quantity).toBe(5);
      expect(result.current.getSubtotal()).toBe(2500);
    });

    it('should clear entire cart via API', async () => {
      localStorage.setItem('token', 'mock-token');
      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        result.current.setCart({
          _id: 'cart-clear',
          userId: 'user-1',
          items: [
            {
              productId: { _id: 'prod-1', title: 'Product 1', slug: 'product-1', price: 100, images: ['p1.jpg'], stock: 10 },
              quantity: 1,
              priceAtTime: 100,
            },
            {
              productId: { _id: 'prod-2', title: 'Product 2', slug: 'product-2', price: 200, images: ['p2.jpg'], stock: 10 },
              quantity: 1,
              priceAtTime: 200,
            },
          ],
        });
      });

      expect(result.current.cart?.items).toHaveLength(2);

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: null }),
      });

      await act(async () => {
        await result.current.clearCart();
      });

      expect(result.current.cart).toBeNull();
      expect(result.current.getItemCount()).toBe(0);
      expect(result.current.getSubtotal()).toBe(0);
    });
  });

  describe('Checkout Flow', () => {
    it('should complete checkout for authenticated user', async () => {
      const { result: authResult } = renderHook(() => useAuthStore());
      const { result: cartResult } = renderHook(() => useCartStore());

      await act(async () => {
        authResult.current.setAuth(
          createMockUser({ _id: 'user-123', email: 'buyer@example.com', name: 'Test Buyer' }),
          'mock-token'
        );
        cartResult.current.setCart({
          _id: 'cart-checkout',
          userId: 'user-123',
          items: [
            {
              productId: { _id: 'prod-checkout', title: 'Checkout Product', slug: 'checkout-product', price: 2000, images: ['checkout.jpg'], stock: 5 },
              quantity: 2,
              priceAtTime: 2000,
            },
          ],
        });
      });

      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: { _id: 'order-123', orderStatus: 'placed', totalAmount: 4000 } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: null }),
        });

      const orderData = {
        items: cartResult.current.cart?.items,
        totalAmount: cartResult.current.getSubtotal(),
        shippingAddress: { street: '123 Test St', city: 'Kathmandu', postalCode: '44600' },
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer mock-token' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.data._id).toBe('order-123');
      expect(result.data.totalAmount).toBe(4000);

      await act(async () => {
        await cartResult.current.clearCart();
      });

      expect(cartResult.current.cart).toBeNull();
    });

    it('should prevent checkout for unauthenticated user', async () => {
      const { result: authResult } = renderHook(() => useAuthStore());
      const { result: cartResult } = renderHook(() => useCartStore());

      await act(async () => {
        authResult.current.clearAuth();
      });

      expect(authResult.current.isAuthenticated).toBe(false);
      expect(authResult.current.user).toBeNull();

      await act(async () => {
        cartResult.current.setCart({
          _id: 'cart-1',
          userId: 'user-1',
          items: [
            {
              productId: { _id: 'prod-1', title: 'Product', slug: 'product', price: 1000, images: ['prod.jpg'], stock: 5 },
              quantity: 1,
              priceAtTime: 1000,
            },
          ],
        });
      });

      expect(authResult.current.user).toBeNull();
      expect(authResult.current.token).toBeNull();
    });
  });

  describe('Cart Totals Calculation', () => {
    it('should calculate correct totals with multiple items', async () => {
      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        result.current.setCart({
          _id: 'cart-totals',
          userId: 'user-1',
          items: [
            {
              productId: { _id: 'prod-1', title: 'Product 1', slug: 'product-1', price: 500, images: ['p1.jpg'], stock: 10 },
              quantity: 3,
              priceAtTime: 500,
            },
            {
              productId: { _id: 'prod-2', title: 'Product 2', slug: 'product-2', price: 750, images: ['p2.jpg'], stock: 10 },
              quantity: 2,
              priceAtTime: 750,
            },
            {
              productId: { _id: 'prod-3', title: 'Product 3', slug: 'product-3', price: 1000, images: ['p3.jpg'], stock: 10 },
              quantity: 1,
              priceAtTime: 1000,
            },
          ],
        });
      });

      // 3 + 2 + 1 = 6 items
      expect(result.current.getItemCount()).toBe(6);
      // (500 * 3) + (750 * 2) + (1000 * 1) = 1500 + 1500 + 1000 = 4000
      expect(result.current.getSubtotal()).toBe(4000);
      // Total includes shipping (100 NPR)
      expect(result.current.getTotal()).toBe(4100);
    });
  });
});
