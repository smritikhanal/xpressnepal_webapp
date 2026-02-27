import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Address from '../models/Address.js';
import { asyncHandler, sendResponse, getPagination, ApiError } from '../utils/apiHelpers.js';
import { createNotification } from './notification.controller.js';
import { emitOrderStatusUpdate, emitDeliveryTrackingUpdate, emitNewOrder } from '../utils/socketEvents.js';

/**
 * @desc    Create order from cart
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { shippingAddressId, paymentMethod, deliveryDate, deliveryTimeSlot } = req.body;

  interface PopulatedProduct {
  _id: mongoose.Types.ObjectId;
  title: string;
  price: number;
  discountPrice?: number;
  stock: number;
}

interface ICartItem {
  productId: mongoose.Types.ObjectId | PopulatedProduct;
  quantity: number;
}

  // Fetch the shipping address
  const address = await Address.findOne({
    _id: shippingAddressId,
    userId: req.user?.id,
  });

  if (!address) {
    throw new ApiError('Shipping address not found', 404);
  }

  // Convert address to plain object for order
  const shippingAddress = {
    fullName: address.fullName,
    phone: address.phone,
    country: address.country,
    state: address.state,
    city: address.city,
    street: address.street,
    postalCode: address.postalCode || '',
  };

  // Get user's cart
const cart = await Cart.findOne({ userId: req.user?.id })
  .populate<{ items: { productId: PopulatedProduct; quantity: number }[] }>('items.productId');

  if (!cart || cart.items.length === 0) {
    throw new ApiError('Cart is empty', 400);
  }

  // Build order items and calculate total
  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
  const product = item.productId;

  const quantity = item.quantity; 

 if (product.stock < quantity) {
    throw new ApiError(`Insufficient stock for ${product.title}`, 400);
  }

  const price = product.discountPrice ?? product.price;

  orderItems.push({
    productId: product._id, // already ObjectId
    title: product.title,
    quantity: item.quantity,
    price,
  });

  totalAmount += price * item.quantity;

  await Product.findByIdAndUpdate(product._id, {
    $inc: { stock: -item.quantity },
  });
}

  // Create order
  const order = await Order.create({
   userId: new mongoose.Types.ObjectId(req.user!.id),
    orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus: 'pending',
    orderStatus: 'placed',
    deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
    deliveryTimeSlot,
  });

  // Clear cart
  cart.items = [];
  await cart.save();

  sendResponse(res, 201, order, 'Order placed successfully');
});

/**
 * @desc    Get current user's orders
 * @route   GET /api/orders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query);

  const [orders, total] = await Promise.all([
    Order.find({ userId: req.user?.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Order.countDocuments({ userId: req.user?.id }),
  ]);

  sendResponse(res, 200, {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate('userId', 'name email');

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  // Check authorization
  const isCustomer = order.userId._id.toString() === req.user?.id;
  const isSuperAdmin = req.user?.role === 'superadmin';
  
  // For sellers, check if any product in the order belongs to them
  let isSeller = false;
  if (req.user?.role === 'seller') {
    const productIds = order.orderItems.map((item: any) => item.productId);
    const sellerProducts = await Product.find({
      _id: { $in: productIds },
      sellerId: req.user.id
    });
    isSeller = sellerProducts.length > 0;
  }

  if (!isCustomer && !isSuperAdmin && !isSeller) {
    throw new ApiError('Not authorized to view this order', 403);
  }

  sendResponse(res, 200, order);
});

/**
 * @desc    Update order status (Admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderStatus, paymentStatus } = req.body;

  console.log('📝 Update order status request:', { orderId: req.params.id, orderStatus, paymentStatus });

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  const oldStatus = order.orderStatus;
  console.log(`🔄 Changing order status from "${oldStatus}" to "${orderStatus}"`);

  if (orderStatus) {
    order.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }

  await order.save();
  console.log('💾 Order saved successfully');

  // Create notification for customer when order status changes
  if (orderStatus && orderStatus !== oldStatus) {
    const statusMessages: Record<string, string> = {
      confirmed: 'has been confirmed and is being processed',
      shipped: 'has been shipped and is on the way',
      delivered: 'has been delivered. Enjoy your purchase!',
      cancelled: 'has been cancelled'
    };

    const notificationType = 
      orderStatus === 'shipped' ? 'order_shipped' :
      orderStatus === 'delivered' ? 'order_delivered' :
      'order_status';

    const message = statusMessages[orderStatus] || `status has been updated to ${orderStatus}`;
    const orderIdShort = order._id.toString().slice(-8);

    await createNotification(
      order.userId.toString(),
      `Order ${orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}`,
      `Your order #${orderIdShort} ${message}`,
      notificationType,
      order._id.toString()
    );

    console.log('🔔 Notification created for user:', order.userId.toString());

    // Emit real-time socket event
    console.log('📡 Emitting socket event for order:', order._id.toString());
    emitOrderStatusUpdate(order._id.toString(), {
      userId: order.userId.toString(),
      status: orderStatus,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      updatedAt: order.updatedAt,
    });
  }

  sendResponse(res, 200, order, 'Order updated successfully');
});

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders/admin/all
 * @access  Private/Admin
 */
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status } = req.query;

  const filter: Record<string, unknown> = {};
  if (status) {
    filter.orderStatus = status;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('userId', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Order.countDocuments(filter),
  ]);

  sendResponse(res, 200, {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get orders containing seller's products
 * @route   GET /api/orders/seller/my-orders
 * @access  Private/Seller
 */
export const getSellerOrders = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query);

  // Get all product IDs owned by this seller
  const sellerProductIds = await Product.find({ sellerId: req.user?.id }).distinct('_id');

  // Find all orders that contain products owned by this seller
  const [orders, total] = await Promise.all([
    Order.find({
      'orderItems.productId': {
        $in: sellerProductIds,
      },
    })
      .populate('userId', 'name email')
      .populate('orderItems.productId', 'title images price')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Order.countDocuments({
      'orderItems.productId': {
        $in: sellerProductIds,
      },
    }),
  ]);

  sendResponse(res, 200, {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Update delivery tracking (GPS location)
 * @route   PUT /api/orders/:id/tracking
 * @access  Private/Admin/Seller
 */
export const updateDeliveryTracking = asyncHandler(async (req: Request, res: Response) => {
  const { latitude, longitude, deliveryPersonnel } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  // Update GPS location
  if (latitude !== undefined && longitude !== undefined) {
    order.currentLocation = {
      latitude,
      longitude,
      timestamp: new Date(),
    };
  }

  // Update delivery personnel
  if (deliveryPersonnel) {
    order.deliveryPersonnel = deliveryPersonnel;
  }

  await order.save();

  // Emit real-time delivery tracking update
  emitDeliveryTrackingUpdate(order._id.toString(), {
    currentLocation: order.currentLocation,
    deliveryPersonnel: order.deliveryPersonnel,
    updatedAt: order.updatedAt,
  });

  sendResponse(res, 200, order, 'Delivery tracking updated successfully');
});
