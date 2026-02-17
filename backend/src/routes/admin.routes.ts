import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/admin.controller.js';
import { protect, requireSuperAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

// Protect all routes
router.use(protect);
router.use(requireSuperAdmin);

router.route('/users')
    .get(getUsers)
    .post(upload.single('image'), createUser);

router.route('/users/:id')
    .get(getUserById)
    .put(upload.single('image'), updateUser)
    .delete(deleteUser);

export default router;
