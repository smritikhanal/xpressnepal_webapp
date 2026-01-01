import { Request, Response } from 'express';
import Category from '../models/Category.js';
import { asyncHandler, sendResponse, getPagination, ApiError } from '../utils/apiHelpers.js';

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query);
  
  const [categories, total] = await Promise.all([
    Category.find({ isActive: true })
      .populate('parentCategory', 'name slug')
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 }),
    Category.countDocuments({ isActive: true }),
  ]);

  sendResponse(res, 200, {
    categories,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get single category by slug
 * @route   GET /api/categories/:slug
 * @access  Public
 */
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findOne({ 
    slug: req.params.slug, 
    isActive: true 
  }).populate('parentCategory', 'name slug');

  if (!category) {
    throw new ApiError('Category not found', 404);
  }

  sendResponse(res, 200, category);
});

/**
 * @desc    Create category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug, description, parentCategory, isActive } = req.body;

  // Check for duplicate slug
  const existing = await Category.findOne({ slug });
  if (existing) {
    throw new ApiError('Category with this slug already exists', 400);
  }

  const category = await Category.create({
    name,
    slug,
    description,
    parentCategory: parentCategory || null,
    isActive: isActive ?? true,
  });

  sendResponse(res, 201, category, 'Category created successfully');
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!category) {
    throw new ApiError('Category not found', 404);
  }

  sendResponse(res, 200, category, 'Category updated successfully');
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new ApiError('Category not found', 404);
  }

  sendResponse(res, 200, null, 'Category deleted successfully');
});
