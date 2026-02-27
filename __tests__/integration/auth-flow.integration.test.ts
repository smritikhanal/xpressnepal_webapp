/**
 * Integration Test Example: Authentication Flow
 * 
 * This test demonstrates how to write integration tests that test
 * multiple components working together across the authentication flow.
 */

import { renderHook } from '@testing-library/react';
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
    // Clear auth state before each test
    localStorage.clear();
    useAuthStore.getState().clearAuth();
  });

  afterEach(() => {
    // Cleanup
    localStorage.clear();
    useAuthStore.getState().clearAuth();
    jest.clearAllMocks();
  });

  describe('Login Flow', () => {
    it('should store authentication data correctly', async () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = createMockUser();
      const mockToken = 'mock-jwt-token';

      // Execute setAuth (simulating successful login)
      result.current.setAuth(mockUser, mockToken);

      // Verify auth state
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
      expect(localStorage.getItem('token')).toBe(mockToken);
    });

    it('should handle unauthenticated state correctly', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Verify initial unauthenticated state
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('should update user data', async () => {
      const { result } = renderHook(() => useAuthStore());

      const initialUser = createMockUser();

      // Set initial auth
      result.current.setAuth(initialUser, 'token-123');
      expect(result.current.user?.name).toBe('Test User');

      // Update user data
      const updatedUser = createMockUser({ name: 'Updated Name' });
      result.current.setUser(updatedUser);

      // Verify user updated
      expect(result.current.user?.name).toBe('Updated Name');
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('Logout Flow', () => {
    it('should complete full logout flow', async () => {
      const { result } = renderHook(() => useAuthStore());
      
      // Set initial authenticated state
      result.current.setAuth(createMockUser(), 'mock-token');

      expect(result.current.isAuthenticated).toBe(true);
      expect(localStorage.getItem('token')).toBe('mock-token');

      // Execute clearAuth (logout)
      result.current.clearAuth();

      // Verify complete logout
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('State Persistence', () => {
    it('should persist auth state across multiple auth operations', async () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      result.current.setAuth(createMockUser(), 'token-1');

      expect(result.current.isAuthenticated).toBe(true);

      // Clear auth
      result.current.clearAuth();
      expect(result.current.isAuthenticated).toBe(false);

      // Login again
      result.current.setAuth(
        createMockUser({
          _id: '456',
          email: 'another@example.com',
          name: 'Another User',
          role: 'seller',
        }),
        'token-2'
      );

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe('another@example.com');
    });
  });

  describe('Role-based Data', () => {
    it('should store different user roles correctly', async () => {
      const { result } = renderHook(() => useAuthStore());

      // Test customer role
      result.current.setAuth(
        createMockUser({ _id: '1', email: 'customer@example.com', name: 'Customer', role: 'customer' }),
        'token-1'
      );

      expect(result.current.user?.role).toBe('customer');

      // Clear and test seller role
      result.current.clearAuth();
      result.current.setAuth(
        createMockUser({ _id: '2', email: 'seller@example.com', name: 'Seller', role: 'seller' }),
        'token-2'
      );

      expect(result.current.user?.role).toBe('seller');

      // Clear and test admin role
      result.current.clearAuth();
      result.current.setAuth(
        createMockUser({ _id: '3', email: 'admin@example.com', name: 'Admin', role: 'superadmin' }),
        'token-3'
      );

      expect(result.current.user?.role).toBe('superadmin');
    });
  });
});
