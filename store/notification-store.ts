import { create } from 'zustand';

interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order_status' | 'order_shipped' | 'order_delivered' | 'general';
  orderId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: (unreadOnly?: boolean) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (unreadOnly = false) => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');
      
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const url = unreadOnly 
        ? `${API_BASE}/api/notifications?unreadOnly=true`
        : `${API_BASE}/api/notifications`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        set({
          notifications: data.data || [],
          unreadCount: data.unreadCount || 0,
          isLoading: false,
        });
      } else {
        set({ notifications: [], unreadCount: 0, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ notifications: [], unreadCount: 0, isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) return;

      const response = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        const notifications = get().notifications.map(n => 
          n._id === id ? { ...n, isRead: true } : n
        );
        const unreadCount = notifications.filter(n => !n.isRead).length;
        
        set({ notifications, unreadCount });
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) return;

      const response = await fetch(`${API_BASE}/api/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        const notifications = get().notifications.map(n => ({ ...n, isRead: true }));
        set({ notifications, unreadCount: 0 });
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },

  deleteNotification: async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) return;

      const response = await fetch(`${API_BASE}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        const notifications = get().notifications.filter(n => n._id !== id);
        const unreadCount = notifications.filter(n => !n.isRead).length;
        
        set({ notifications, unreadCount });
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  },
}));
