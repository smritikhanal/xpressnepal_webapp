import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  addToWishlistSchema,
  removeFromWishlistSchema,
} from '../validators/wishlist.validators.js';

const router = Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/add', validate(addToWishlistSchema), addToWishlist);
router.delete('/remove/:productId', validate(removeFromWishlistSchema), removeFromWishlist);

export default router;
