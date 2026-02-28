/**
 * Integration Test: Authentication Flow
 *
 * Tests authentication state transitions using the Zustand auth store:
 * login, logout, user update, role-based data, and state persistence.
 */

import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/store/auth-store';
import { User } from '@/types';

// Helper to create mock user
const createMockUser = (overrides: Partial<User> = {}): User => ({
  _id: '123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'customer',
  isVerified: true,
  authProvider: 'local',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('Authentication Flow (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    act(() => { useAuthStore.getState().clearAuth(); });
  });

  afterEach(() => {
    localStorage.clear();
    act(() => { useAuthStore.getState().clearAuth(); });
    jest.clearAllMocks();
  });

  describe('Login Flow', () => {
    it('should store authentication data correctly', async () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = createMockUser();
      const mockToken = 'mock-jwt-token';

      await act(async () => {
        result.current.setAuth(mockUser, mockToken);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
      expect(localStorage.getItem('token')).toBe(mockToken);
    });

    it('should handle unauthenticated state correctly', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('should update user data', async () => {
      const { result } = renderHook(() => useAuthStore());

      const initialUser = createMockUser();

      await act(async () => {
        result.current.setAuth(initialUser, 'token-123');
      });

      expect(result.current.user?.name).toBe('Test User');

      const updatedUser = createMockUser({ name: 'Updated Name' });

      await act(async () => {
        result.current.setUser(updatedUser);
      });

      expect(result.current.user?.name).toBe('Updated Name');
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('Logout Flow', () => {
    it('should complete full logout flow', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        result.current.setAuth(createMockUser(), 'mock-token');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(localStorage.getItem('token')).toBe('mock-token');

      await act(async () => {
        result.current.clearAuth();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('State Persistence', () => {
    it('should persist auth state across multiple auth operations', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        result.current.setAuth(createMockUser(), 'token-1');
      });

      expect(result.current.isAuthenticated).toBe(true);

      await act(async () => {
        result.current.clearAuth();
      });

      expect(result.current.isAuthenticated).toBe(false);

      await act(async () => {
        result.current.setAuth(
          createMockUser({
            _id: '456',
            email: 'another@example.com',
            name: 'Another User',
            role: 'seller',
          }),
          'token-2'
        );
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe('another@example.com');
    });
  });

  describe('Role-based Data', () => {
    it('should store different user roles correctly', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        result.current.setAuth(
          createMockUser({ _id: '1', email: 'customer@example.com', name: 'Customer', role: 'customer' }),
          'token-1'
        );
      });

      expect(result.current.user?.role).toBe('customer');

      await act(async () => {
        result.current.clearAuth();
        result.current.setAuth(
          createMockUser({ _id: '2', email: 'seller@example.com', name: 'Seller', role: 'seller' }),
          'token-2'
        );
      });

      expect(result.current.user?.role).toBe('seller');

      await act(async () => {
        result.current.clearAuth();
        result.current.setAuth(
          createMockUser({ _id: '3', email: 'admin@example.com', name: 'Admin', role: 'superadmin' }),
          'token-3'
        );
      });

      expect(result.current.user?.role).toBe('superadmin');
    });
  });
});
