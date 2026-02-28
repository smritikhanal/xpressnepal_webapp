import { Router } from 'express';
import { register, login, updateProfile, forgotPassword, resetPassword, changePassword } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validators.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect, changePassword);
router.put('/:id', protect, upload.single('image'), updateProfile);

export default router;
