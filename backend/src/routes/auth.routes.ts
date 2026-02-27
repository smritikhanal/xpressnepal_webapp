import { Router } from 'express';
import { register, login, updateProfile, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validators.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, (req, res) => {
  // JWT is stateless, so logout is handled client-side
  // This endpoint exists for consistency and future token blacklisting if needed
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/:id', protect, upload.single('image'), updateProfile);

export default router;
