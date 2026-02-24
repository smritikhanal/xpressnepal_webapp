import { Router } from 'express';
import {
  applyCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/coupon.controller.js';
import { protect, requireSuperAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public/authenticated routes
router.post('/apply', protect, applyCoupon);

// Admin routes
router.route('/')
  .get(requireSuperAdmin, getAllCoupons)
  .post(requireSuperAdmin, createCoupon);

router.route('/:id')
  .put(requireSuperAdmin, updateCoupon)
  .delete(requireSuperAdmin, deleteCoupon);

export default router;
