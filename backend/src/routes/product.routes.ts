import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { protect, requireSellerOrSuperAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  getProductsSchema,
} from '../validators/product.validators.js';

const router = Router();

/**
 * Product Routes
 * 
 * GET    /api/products              - List products with filters (Public)
 *        Query params: page, limit, category, brand, minPrice, maxPrice, search, sort
 * GET    /api/products/:slug        - Get product by slug (Public)
 * GET    /api/products/id/:id       - Get product by ID (Seller/Superadmin)
 * POST   /api/products              - Create product (Seller/Superadmin)
 * PUT    /api/products/id/:id       - Update product (Seller/Superadmin)
 * DELETE /api/products/id/:id       - Delete product (Seller/Superadmin)
 */

router.route('/')
  .get(validate(getProductsSchema), getProducts)
  .post(protect, requireSellerOrSuperAdmin, validate(createProductSchema), createProduct);

router.route('/:slug')
  .get(getProductBySlug);

router.route('/id/:id')
  .get(protect, requireSellerOrSuperAdmin, getProductById)
  .put(protect, requireSellerOrSuperAdmin, validate(updateProductSchema), updateProduct)
  .delete(protect, requireSellerOrSuperAdmin, validate(deleteProductSchema), deleteProduct);

export default router;
