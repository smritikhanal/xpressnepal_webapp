import { Router } from 'express';
import { uploadImage, uploadSingle, uploadMultipleImages, uploadMultiple } from '../controllers/upload.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protect, uploadSingle, uploadImage);
router.post('/multiple', protect, uploadMultiple, uploadMultipleImages);

export default router;
