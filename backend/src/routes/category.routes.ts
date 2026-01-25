import { Router } from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { protect, requireSuperAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from '../validators/category.validators.js';

const router = Router();

/**
 * Category Routes
 * 
 * GET    /api/categories          - List all categories (Public)
 * GET    /api/categories/:slug    - Get category by slug (Public)
 * POST   /api/categories          - Create category (Superadmin)
 * PUT    /api/categories/:id      - Update category (Superadmin)
 * DELETE /api/categories/:id      - Delete category (Superadmin)
 */

router.route('/')
  .get(getCategories)
  .post(protect, requireSuperAdmin, validate(createCategorySchema), createCategory);

router.route('/:slug')
  .get(getCategoryBySlug);

router.route('/id/:id')
  .put(protect, requireSuperAdmin, validate(updateCategorySchema), updateCategory)
  .delete(protect, requireSuperAdmin, validate(deleteCategorySchema), deleteCategory);

export default router;
