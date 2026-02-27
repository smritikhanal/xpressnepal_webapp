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
  addNotification: (notification: Omit<Notification, '_id' | 'userId' | 'updatedAt'> & { id?: string; read?: boolean }) => void;
  lastFetchTime: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  lastFetchTime: 0,

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
        const serverNotifications = Array.isArray(data.data) ? data.data : (data.data?.notifications || []);
        const currentNotifications = get().notifications;
        
        // Merge server notifications with any temporary real-time ones
        // Keep temporary notifications that are newer than last fetch
        const tempNotifications = currentNotifications.filter(
          n => n._id.startsWith('temp_') && new Date(n.createdAt).getTime() > get().lastFetchTime
        );
        
        // Combine and deduplicate
        const allNotifications = [...tempNotifications, ...serverNotifications];
        const uniqueNotifications = allNotifications.filter(
          (notification, index, self) => 
            index === self.findIndex(n => n._id === notification._id)
        );
        
        set({
          notifications: uniqueNotifications,
          unreadCount: data.unreadCount || uniqueNotifications.filter(n => !n.isRead).length,
          isLoading: false,
          lastFetchTime: Date.now(),
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ isLoading: false });
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

  addNotification: (notification) => {
    const newNotification: Notification = {
      _id: notification.id || `temp_${Date.now()}`,
      userId: '',
      title: notification.title,
      message: notification.message,
      type: notification.type as any,
      orderId: notification.orderId,
      isRead: notification.read || false,
      createdAt: notification.createdAt,
      updatedAt: notification.createdAt,
    };

    // Check if notification already exists (prevent duplicates)
    const exists = get().notifications.some(
      n => n._id === newNotification._id || 
          (n.title === newNotification.title && 
           n.message === newNotification.message && 
           Math.abs(new Date(n.createdAt).getTime() - new Date(newNotification.createdAt).getTime()) < 5000)
    );

    if (exists) {
      console.log('Notification already exists, skipping duplicate');
      return;
    }

    const notifications = [newNotification, ...get().notifications];
    const unreadCount = notifications.filter(n => !n.isRead).length;

    set({ notifications, unreadCount });
    
    // Fetch from server after a short delay to get the real notification with proper ID
    setTimeout(() => {
      get().fetchNotifications();
    }, 2000);
  },
}));
