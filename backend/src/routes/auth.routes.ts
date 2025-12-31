import { Router } from 'express';
import { register, login} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validators.js';

const router = Router();

/**
 * Auth Routes
 * 
 * POST /api/auth/register      - Create new user account
 * POST /api/auth/login         - Authenticate and get token
 * GET  /api/auth/me            - Get current user (protected)
 * POST /api/auth/become-seller - Upgrade customer to seller (protected)
 */

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
