import { Router } from 'express';
import { uploadImage, uploadSingle } from '../controllers/upload.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protect, uploadSingle, uploadImage);

export default router;
