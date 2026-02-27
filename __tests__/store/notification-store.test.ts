import { useNotificationStore } from '@/store/notification-store';
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

describe('Notification Store', () => {
  beforeEach(() => {
    // Reset store
    act(() => {
      useNotificationStore.setState({
        notifications: [],
        unreadCount: 0,
        isLoading: false,
      });
    });
    localStorage.clear();
    (global.fetch as jest.Mock).mockClear();
  });

  it('initializes with empty notifications', () => {
    const state = useNotificationStore.getState();
    expect(state.notifications).toEqual([]);
    expect(state.unreadCount).toBe(0);
    expect(state.isLoading).toBe(false);
  });

  it('fetches notifications successfully', async () => {
    const mockNotifications = [
      {
        _id: 'notif1',
        userId: 'user1',
        title: 'Order Shipped',
        message: 'Your order has been shipped',
        type: 'order_shipped' as const,
        orderId: 'order1',
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'notif2',
        userId: 'user1',
        title: 'Order Delivered',
        message: 'Your order has been delivered',
        type: 'order_delivered' as const,
        orderId: 'order2',
        isRead: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem('token', 'test-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: { notifications: mockNotifications, unreadCount: 1 },
      }),
    });

    await act(async () => {
      await useNotificationStore.getState().fetchNotifications();
    });

    const state = useNotificationStore.getState();
    expect(state.notifications).toEqual(mockNotifications);
    expect(state.unreadCount).toBe(1);
    expect(state.isLoading).toBe(false);
  });

  it('fetches unread notifications only', async () => {
    localStorage.setItem('token', 'test-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: { notifications: [], unreadCount: 0 },
      }),
    });

    await act(async () => {
      await useNotificationStore.getState().fetchNotifications(true);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('unreadOnly=true'),
      expect.any(Object)
    );
  });

  it('handles fetch error gracefully', async () => {
    localStorage.setItem('token', 'test-token');
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await useNotificationStore.getState().fetchNotifications();
    });

    const state = useNotificationStore.getState();
    expect(state.notifications).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it('adds notification to store', () => {
    const newNotification = {
      title: 'New Order',
      message: 'You have a new order',
      type: 'general' as const,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    act(() => {
      useNotificationStore.getState().addNotification(newNotification);
    });

    const state = useNotificationStore.getState();
    expect(state.notifications).toHaveLength(1);
    expect(state.notifications[0].title).toBe('New Order');
  });

  it('handles notification without token gracefully', async () => {
    await act(async () => {
      await useNotificationStore.getState().fetchNotifications();
    });

    const state = useNotificationStore.getState();
    expect(state.isLoading).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('updates unread count correctly', async () => {
    const mockNotifications = [
      {
        _id: 'notif1',
        userId: 'user1',
        title: 'Test 1',
        message: 'Message 1',
        type: 'general' as const,
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'notif2',
        userId: 'user1',
        title: 'Test 2',
        message: 'Message 2',
        type: 'general' as const,
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem('token', 'test-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: { notifications: mockNotifications, unreadCount: 2 },
      }),
    });

    await act(async () => {
      await useNotificationStore.getState().fetchNotifications();
    });

    expect(useNotificationStore.getState().unreadCount).toBe(2);
  });
});
