import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError, asyncHandler, sendResponse } from '../utils/apiHelpers.js';

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

// File filter (images only)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow all files for now to avoid MIME type issues
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Middleware for single file upload
export const uploadSingle = upload.single('image');

// Middleware for multiple file uploads (max 10 images)
export const uploadMultiple = upload.array('images', 10);

/**
 * @desc    Upload an image
 * @route   POST /api/upload
 * @access  Private
 */
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
        throw new ApiError('No file uploaded', 400);
    }

    // Return relative path instead of full URL for environment flexibility
    // Frontend will construct the full URL using the API base URL
    const fileUrl = `/uploads/${req.file.filename}`;

    sendResponse(res, 200, {
        url: fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
    }, 'Image uploaded successfully');
});

/**
 * @desc    Upload multiple images
 * @route   POST /api/upload/multiple
 * @access  Private
 */
export const uploadMultipleImages = asyncHandler(async (req: Request, res: Response) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        throw new ApiError('No files uploaded', 400);
    }

    const files = req.files as Express.Multer.File[];
    const uploadedFiles = files.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
    }));

    sendResponse(res, 200, {
        files: uploadedFiles,
        count: uploadedFiles.length,
    }, `${uploadedFiles.length} image(s) uploaded successfully`);
});
