import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export const setSocketIO = (socketIO: SocketIOServer) => {
  io = socketIO;
};

export const getSocketIO = (): SocketIOServer | null => {
  return io;
};

/**
 * Emit order status update to customer and seller
 */
export const emitOrderStatusUpdate = (orderId: string, orderData: any) => {
  if (!io) {
    console.warn('⚠️ Socket.IO not initialized, cannot emit order status update');
    return;
  }

  console.log('🚀 Emitting order status update:', { orderId, status: orderData.orderStatus });

  // Emit to order tracking room
  io.to(`order:${orderId}`).emit('order:status-updated', {
    orderId,
    status: orderData.status,
    orderStatus: orderData.orderStatus,
    paymentStatus: orderData.paymentStatus,
    updatedAt: orderData.updatedAt,
  });

  console.log(`📡 Emitted to room: order:${orderId}`);

  // Emit to customer
  if (orderData.userId) {
    io.to(`user:${orderData.userId}`).emit('order:updated', {
      orderId,
      message: `Your order status has been updated to: ${orderData.orderStatus}`,
      orderData,
    });
    console.log(`📧 Emitted to user: ${orderData.userId}`);
  }

  // Emit to seller if exists
  if (orderData.sellerId) {
    io.to(`user:${orderData.sellerId}`).emit('order:updated', {
      orderId,
      message: `Order ${orderId} status updated`,
      orderData,
    });
    console.log(`📧 Emitted to seller: ${orderData.sellerId}`);
  }

  console.log(`✅ Order status update emitted for order: ${orderId}`);
};

/**
 * Emit delivery tracking update
 */
export const emitDeliveryTrackingUpdate = (orderId: string, trackingData: any) => {
  if (!io) return;

  io.to(`order:${orderId}`).emit('delivery:tracking-updated', {
    orderId,
    ...trackingData,
  });

  console.log(`Delivery tracking update emitted for order: ${orderId}`);
};

/**
 * Emit new order notification to sellers
 */
export const emitNewOrder = (orderData: any) => {
  if (!io) return;

  // Notify all sellers
  io.to('role:seller').emit('order:new', {
    orderId: orderData._id,
    message: 'New order received!',
    orderData,
  });

  // Notify specific seller if exists
  if (orderData.sellerId) {
    io.to(`user:${orderData.sellerId}`).emit('order:new', {
      orderId: orderData._id,
      message: 'You have received a new order!',
      orderData,
    });
  }

  console.log(`New order notification emitted: ${orderData._id}`);
};

/**
 * Emit notification to specific user
 */
export const emitNotification = (userId: string, notification: any) => {
  if (!io) return;

  io.to(`user:${userId}`).emit('notification:new', notification);

  console.log(`Notification emitted to user: ${userId}`);
};

/**
 * Emit real-time message
 */
export const emitNewMessage = (senderId: string, receiverId: string, messageData: any) => {
  if (!io) return;

  // Emit to receiver
  io.to(`user:${receiverId}`).emit('message:new', messageData);

  // Emit to sender for confirmation
  io.to(`user:${senderId}`).emit('message:sent', messageData);

  console.log(`Message emitted from ${senderId} to ${receiverId}`);
};

/**
 * Emit product stock update
 */
export const emitProductStockUpdate = (productId: string, stock: number) => {
  if (!io) return;

  io.emit('product:stock-updated', {
    productId,
    stock,
  });

  console.log(`Product stock update emitted for product: ${productId}`);
};
