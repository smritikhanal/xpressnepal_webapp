import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getSellerOrders,
  updateDeliveryTracking,
} from '../controllers/order.controller.js';
import { protect, requireSuperAdmin, requireSellerOrSuperAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  getOrderByIdSchema,
} from '../validators/order.validators.js';

const router = Router();

/**
 * Order Routes
 * 
 * POST   /api/orders              - Create order from cart (Authenticated)
 * GET    /api/orders              - Get current user's orders (Authenticated)
 * GET    /api/orders/:id          - Get single order (Authenticated)
 * PUT    /api/orders/:id/status   - Update order status (Seller/Superadmin)
 * GET    /api/orders/admin/all    - Get all orders (Superadmin)
 */

// All order routes require authentication
router.use(protect);

router.route('/')
  .get(getMyOrders)
  .post(validate(createOrderSchema), createOrder);

router.get('/admin/all', requireSuperAdmin, getAllOrders);
router.get('/seller/my-orders', requireSellerOrSuperAdmin, getSellerOrders);

router.route('/:id')
  .get(validate(getOrderByIdSchema), getOrderById);

router.put('/:id/status', requireSellerOrSuperAdmin, validate(updateOrderStatusSchema), updateOrderStatus);
router.put('/:id/tracking', requireSellerOrSuperAdmin, updateDeliveryTracking);

export default router;
