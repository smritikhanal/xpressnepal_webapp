import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  addToCartSchema,
  updateCartItemSchema,
  removeFromCartSchema,
} from '../validators/cart.validators.js';

const router = Router();

/**
 * Cart Routes - All Private (require authentication)
 * 
 * GET    /api/cart                    - Get current user's cart
 * POST   /api/cart/add                - Add item to cart
 * PUT    /api/cart/update             - Update item quantity
 * DELETE /api/cart/remove/:productId  - Remove item from cart
 * DELETE /api/cart/clear              - Clear entire cart
 */

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/add', validate(addToCartSchema), addToCart);
router.put('/update', validate(updateCartItemSchema), updateCartItem);
router.delete('/remove/:productId', validate(removeFromCartSchema), removeFromCart);
router.delete('/clear', clearCart);

export default router;
