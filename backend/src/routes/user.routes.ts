import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleSellerStatus,
} from '../controllers/user.controller.js';
import { protect, requireSuperAdmin } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * User Management Routes (Admin only)
 * 
 * GET    /api/users           - Get all users (can filter by role)
 * GET    /api/users/:id       - Get user by ID
 * PATCH  /api/users/:id       - Update user
 * DELETE /api/users/:id       - Delete user
 * PATCH  /api/users/:id/toggle-seller - Toggle seller active status
 */

// All routes require superadmin role
router.use(protect, requireSuperAdmin);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/toggle-seller', toggleSellerStatus);

export default router;
