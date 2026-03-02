import { useCartStore } from '@/store/cart-store';
import { act } from '@testing-library/react';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store
    act(() => {
      useCartStore.setState({ cart: null, loading: false });
    });
    localStorage.clear();
    (global.fetch as jest.Mock).mockClear();
  });

  it('initializes with null cart', () => {
    const state = useCartStore.getState();
    expect(state.cart).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('sets cart correctly', () => {
    const mockCart = {
      _id: 'cart1',
      userId: 'user1',
      items: [],
    };

    act(() => {
      useCartStore.getState().setCart(mockCart);
    });

    expect(useCartStore.getState().cart).toEqual(mockCart);
  });

  it('fetches cart successfully', async () => {
    const mockCart = {
      _id: 'cart1',
      userId: 'user1',
      items: [
        {
          productId: {
            _id: 'prod1',
            title: 'Test Product',
            slug: 'test-product',
            price: 100,
            images: ['image1.jpg'],
            stock: 10,
          },
          quantity: 2,
          priceAtTime: 100,
        },
      ],
    };

    localStorage.setItem('token', 'test-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, data: mockCart }),
    });

    await act(async () => {
      await useCartStore.getState().fetchCart();
    });

    expect(useCartStore.getState().cart).toEqual(mockCart);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/cart'),
      expect.objectContaining({
        headers: { Authorization: 'Bearer test-token' },
      })
    );
  });

  it('filters out invalid cart items when product is not populated', async () => {
    const malformedCart = {
      _id: 'cart1',
      userId: 'user1',
      items: [
        {
          productId: 'prod1',
          quantity: 1,
          priceAtTime: 100,
        },
        {
          productId: null,
          quantity: 2,
          priceAtTime: 200,
        },
      ],
    };

    localStorage.setItem('token', 'test-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ success: true, data: malformedCart }),
    });

    await act(async () => {
      await useCartStore.getState().fetchCart();
    });

    expect(useCartStore.getState().cart).toEqual({
      _id: 'cart1',
      userId: 'user1',
      items: [],
    });
  });

  it('handles fetch cart error gracefully', async () => {
    localStorage.setItem('token', 'test-token');
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await useCartStore.getState().fetchCart();
    });

    expect(useCartStore.getState().cart).toBeNull();
    expect(useCartStore.getState().loading).toBe(false);
  });

  it('calculates item count correctly', () => {
    const mockCart = {
      _id: 'cart1',
      userId: 'user1',
      items: [
        {
          productId: {
            _id: 'prod1',
            title: 'Product 1',
            slug: 'product-1',
            price: 100,
            images: [],
            stock: 10,
          },
          quantity: 2,
          priceAtTime: 100,
        },
        {
          productId: {
            _id: 'prod2',
            title: 'Product 2',
            slug: 'product-2',
            price: 200,
            images: [],
            stock: 5,
          },
          quantity: 3,
          priceAtTime: 200,
        },
      ],
    };

    act(() => {
      useCartStore.getState().setCart(mockCart);
    });

    expect(useCartStore.getState().getItemCount()).toBe(5); // 2 + 3
  });

  it('calculates subtotal correctly', () => {
    const mockCart = {
      _id: 'cart1',
      userId: 'user1',
      items: [
        {
          productId: {
            _id: 'prod1',
            title: 'Product 1',
            slug: 'product-1',
            price: 100,
            images: [],
            stock: 10,
          },
          quantity: 2,
          priceAtTime: 100,
        },
        {
          productId: {
            _id: 'prod2',
            title: 'Product 2',
            slug: 'product-2',
            price: 200,
            images: [],
            stock: 5,
          },
          quantity: 3,
          priceAtTime: 200,
        },
      ],
    };

    act(() => {
      useCartStore.getState().setCart(mockCart);
    });

    expect(useCartStore.getState().getSubtotal()).toBe(800); // (100*2) + (200*3)
  });

  it('returns 0 for empty cart item count', () => {
    act(() => {
      useCartStore.getState().setCart(null);
    });

    expect(useCartStore.getState().getItemCount()).toBe(0);
  });

  it('returns 0 for empty cart subtotal', () => {
    act(() => {
      useCartStore.getState().setCart(null);
    });

    expect(useCartStore.getState().getSubtotal()).toBe(0);
  });
});
