
import { useAuthStore } from '@/store/auth-store';
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

describe('Auth Store', () => {
    beforeEach(() => {
        // Reset store
        const { clearAuth } = useAuthStore.getState();
        act(() => {
            clearAuth();
        });
        localStorage.clear();
    });

    it('initializes with null user', () => {
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });

    it('sets authentication correctly', () => {
        const user = { _id: '1', name: 'Test User', email: 'test@example.com', role: 'customer' };
        const token = 'test-token';

        act(() => {
            useAuthStore.getState().setAuth(user as any, token);
        });

        const state = useAuthStore.getState();
        expect(state.user).toEqual(user);
        expect(state.token).toBe(token);
        expect(state.isAuthenticated).toBe(true);
    });

    it('persists token to localStorage', () => {
        const user = { _id: '1', name: 'Test User', email: 'test@example.com', role: 'customer' };
        const token = 'test-token';

        act(() => {
            useAuthStore.getState().setAuth(user as any, token);
        });

        expect(localStorage.getItem('token')).toBe(token);
    });

    it('clears authentication correctly', () => {
        const user = { _id: '1', name: 'Test User', email: 'test@example.com', role: 'customer' };
        const token = 'test-token';

        act(() => {
            useAuthStore.getState().setAuth(user as any, token);
            useAuthStore.getState().clearAuth();
        });

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(localStorage.getItem('token')).toBeNull();
    });

    it('updates user profile', () => {
        const user = { _id: '1', name: 'Test User', email: 'test@example.com', role: 'customer' };
        const token = 'test-token';

        act(() => {
            useAuthStore.getState().setAuth(user as any, token);
        });

        const updatedUser = { ...user, name: 'Updated Name' };

        act(() => {
            useAuthStore.getState().setUser(updatedUser as any);
        });

        const state = useAuthStore.getState();
        expect(state.user?.name).toBe('Updated Name');
        expect(state.token).toBe(token); // Token should remain same
    });
});
