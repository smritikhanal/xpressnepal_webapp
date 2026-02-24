import { useWishlistStore } from '@/store/wishlist-store';
import { act } from '@testing-library/react';

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

describe('Wishlist Store', () => {
  beforeEach(() => {
    // Clear localStorage and reset store
    localStorage.clear();
    act(() => {
      useWishlistStore.getState().clearWishlist();
    });
  });

  it('initializes with empty items', () => {
    const state = useWishlistStore.getState();
    expect(state.items).toEqual([]);
    expect(state.getItemCount()).toBe(0);
  });

  it('adds item to wishlist', () => {
    const mockProduct = {
      _id: 'prod1',
      title: 'Test Product',
      slug: 'test-product',
      description: 'Test description',
      price: 100,
      images: ['image1.jpg'],
      categoryId: 'test-category',
      sellerId: 'seller1',
      stock: 10,
      ratingAvg: 0,
      ratingCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    act(() => {
      useWishlistStore.getState().addItem(mockProduct);
    });

    const state = useWishlistStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockProduct);
    expect(state.getItemCount()).toBe(1);
  });

  it('does not add duplicate items', () => {
    const mockProduct = {
      _id: 'prod1',
      title: 'Test Product',
      slug: 'test-product',
      description: 'Test description',
      price: 100,
      images: ['image1.jpg'],
      categoryId: 'test-category',
      sellerId: 'seller1',
      stock: 10,
      ratingAvg: 0,
      ratingCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    act(() => {
      useWishlistStore.getState().addItem(mockProduct);
      useWishlistStore.getState().addItem(mockProduct);
    });

    const state = useWishlistStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.getItemCount()).toBe(1);
  });

  it('removes item from wishlist', () => {
    const mockProduct = {
      _id: 'prod1',
      title: 'Test Product',
      slug: 'test-product',
      description: 'Test description',
      price: 100,
      images: ['image1.jpg'],
      categoryId: 'test-category',
      sellerId: 'seller1',
      stock: 10,
      ratingAvg: 0,
      ratingCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    act(() => {
      useWishlistStore.getState().addItem(mockProduct);
      useWishlistStore.getState().removeItem('prod1');
    });

    const state = useWishlistStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.getItemCount()).toBe(0);
  });

  it('checks if item is in wishlist', () => {
    const mockProduct = {
      _id: 'prod1',
      title: 'Test Product',
      slug: 'test-product',
      description: 'Test description',
      price: 100,
      images: ['image1.jpg'],
      categoryId: 'test-category',
      sellerId: 'seller1',
      stock: 10,
      ratingAvg: 0,
      ratingCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    act(() => {
      useWishlistStore.getState().addItem(mockProduct);
    });

    expect(useWishlistStore.getState().isInWishlist('prod1')).toBe(true);
    expect(useWishlistStore.getState().isInWishlist('prod2')).toBe(false);
  });

  it('clears all items', () => {
    const mockProducts = [
      {
        _id: 'prod1',
        title: 'Product 1',
        slug: 'product-1',
        description: 'Test description 1',
        price: 100,
        images: [],
        categoryId: 'test-category',
        sellerId: 'seller1',
        stock: 10,
        ratingAvg: 0,
        ratingCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'prod2',
        title: 'Product 2',
        slug: 'product-2',
        description: 'Test description 2',
        price: 200,
        images: [],
        categoryId: 'test-category',
        sellerId: 'seller1',
        stock: 5,
        ratingAvg: 0,
        ratingCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    act(() => {
      mockProducts.forEach((p) => useWishlistStore.getState().addItem(p));
      useWishlistStore.getState().clearWishlist();
    });

    const state = useWishlistStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.getItemCount()).toBe(0);
  });

  it('handles adding multiple different items', () => {
    const mockProducts = [
      {
        _id: 'prod1',
        title: 'Product 1',
        slug: 'product-1',
        description: 'Test description 1',
        price: 100,
        images: [],
        categoryId: 'test-category',
        sellerId: 'seller1',
        stock: 10,
        ratingAvg: 0,
        ratingCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'prod2',
        title: 'Product 2',
        slug: 'product-2',
        description: 'Test description 2',
        price: 200,
        images: [],
        categoryId: 'test-category',
        sellerId: 'seller1',
        stock: 5,
        ratingAvg: 0,
        ratingCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    act(() => {
      mockProducts.forEach((p) => useWishlistStore.getState().addItem(p));
    });

    const state = useWishlistStore.getState();
    expect(state.items).toHaveLength(2);
    expect(state.getItemCount()).toBe(2);
  });
});
