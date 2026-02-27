'use client';

import { useEffect } from 'react';
import { useSocket } from '@/hooks/use-socket';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';

export default function RealtimeNotifications() {
  const { isConnected, on, off } = useSocket();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!isConnected || !user) return;

    // Handle new notifications
    const handleNotification = (data: any) => {
      addNotification({
        id: data.id,
        type: data.type || 'general',
        title: data.title,
        message: data.message,
        isRead: false,
        createdAt: data.createdAt || new Date().toISOString(),
        orderId: data.relatedId,
      });

      toast(data.message, {
        icon: '🔔',
        duration: 5000,
      });
    };

    // Handle new orders (for sellers/admins)
    const handleNewOrder = (data: any) => {
      if (user.role === 'seller' || user.role === 'admin') {
        toast.success(`🎉 New Order Received! Order #${data.orderId?.slice(-6)} - ${data.totalAmount} NPR`, {
          duration: 5000,
        });

        addNotification({
          id: `temp_${Date.now()}`,
          type: 'general',
          title: 'New Order',
          message: `You have received a new order worth ${data.totalAmount} NPR`,
          isRead: false,
          orderId: data.orderId,
          createdAt: new Date().toISOString(),
        });
      }
    };

    // Handle product stock updates
    const handleStockUpdate = (data: any) => {
      if (user.role === 'seller' || user.role === 'admin') {
        if (data.stock <= 5) {
          toast.error(`⚠️ Low Stock Alert! ${data.productName} is running low (${data.stock} left)`, {
            duration: 6000,
          });

          addNotification({
            id: `temp_${Date.now()}`,
            type: 'general',
            title: 'Low Stock',
            message: `${data.productName} has only ${data.stock} items left`,
            isRead: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
    };

    // Handle new messages
    const handleNewMessage = (data: any) => {
      toast(data.message?.substring(0, 50) || 'You have a new message', {
        icon: '💬',
        duration: 4000,
      });

      addNotification({
        id: `temp_${Date.now()}`,
        type: 'general',
        title: 'New Message',
        message: data.message || 'You have a new message',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    };

    // Handle order status updates (for real-time feedback, notification comes via notification:new)
    const handleOrderUpdate = (data: any) => {
      const orderIdShort = data.orderId?.slice(-8) || 'N/A';
      const statusMessage = data.message || `Order #${orderIdShort} status updated`;
      
      toast(statusMessage, {
        icon: '📦',
        duration: 5000,
      });
      
      // Note: Notification is handled by notification:new event from backend
      // This handler is just for immediate visual feedback
    };

    // Register event listeners
    on('notification:new', handleNotification);
    on('order:new', handleNewOrder);
    on('order:updated', handleOrderUpdate);
    on('product:stock-updated', handleStockUpdate);
    on('message:new', handleNewMessage);

    // Cleanup
    return () => {
      off('notification:new', handleNotification);
      off('order:new', handleNewOrder);
      off('order:updated', handleOrderUpdate);
      off('product:stock-updated', handleStockUpdate);
      off('message:new', handleNewMessage);
    };
  }, [isConnected, user, on, off, addNotification]);

  // This component doesn't render anything visible
  return null;
}
