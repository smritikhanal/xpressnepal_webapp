import { Request, Response } from 'express';
import Product from '../models/Product.js';
import { asyncHandler, sendResponse, getPagination, ApiError } from '../utils/apiHelpers.js';

/**
 * @desc    Get all products with filtering & search
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query);
  const { category, brand, minPrice, maxPrice, search, sort, sellerId } = req.query;

  // Build filter object
  const filter: Record<string, unknown> = { isActive: true };

  // Filter by seller (for seller dashboard)
  if (sellerId) {
    filter.sellerId = sellerId;
  }

  if (category) {
    filter.categoryId = category;
  }

  if (brand) {
    filter.brand = brand;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
    if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
  }

  // Text search
  if (search) {
    filter.$text = { $search: search as string };
  }

  // Sort options
  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'rating') sortOption = { ratingAvg: -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('categoryId', 'name slug')
      .populate('sellerId', 'name shopName email')
      .skip(skip)
      .limit(limit)
      .sort(sortOption),
    Product.countDocuments(filter),
  ]);

  sendResponse(res, 200, {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get single product by slug
 * @route   GET /api/products/:slug
 * @access  Public
 */
export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findOne({ 
    slug: req.params.slug, 
    isActive: true 
  })
    .populate('categoryId', 'name slug')
    .populate('sellerId', 'name shopName email');

  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  sendResponse(res, 200, product);
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/id/:id
 * @access  Private/Seller/Superadmin
 */
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
    .populate('categoryId', 'name slug')
    .populate('sellerId', 'name shopName email');

  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  // Check ownership: sellers can only view their own products
  if (req.user?.role === 'seller' && product.sellerId._id.toString() !== req.user.id) {
    throw new ApiError('Not authorized to view this product', 403);
  }

  sendResponse(res, 200, product);
});

/**
 * @desc    Create product
 * @route   POST /api/products
 * @access  Private/Seller/Superadmin
 */
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    slug,
    description,
    price,
    discountPrice,
    categoryId,
    brand,
    images,
    stock,
    attributes,
  } = req.body;

  // Check for duplicate slug
  const existing = await Product.findOne({ slug });
  if (existing) {
    throw new ApiError('Product with this slug already exists', 400);
  }

  // Determine sellerId based on user role
  let sellerId = req.user?.id;
  
  // If superadmin is creating a product, they can optionally specify a sellerId
  if (req.user?.role === 'superadmin' && req.body.sellerId) {
    sellerId = req.body.sellerId;
  }

  const product = await Product.create({
    title,
    slug,
    description,
    price,
    discountPrice,
    categoryId,
    sellerId, // Auto-assign from authenticated user
    brand,
    images: images || [],
    stock: stock || 0,
    attributes: attributes || {},
    isActive: true,
  });

  await product.populate('sellerId', 'name shopName email');

  sendResponse(res, 201, product, 'Product created successfully');
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Seller/Superadmin
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  // Check ownership: sellers can only update their own products
  if (req.user?.role === 'seller' && product.sellerId.toString() !== req.user.id) {
    throw new ApiError('Not authorized to update this product', 403);
  }

  // Update product
  Object.assign(product, req.body);
  await product.save();

  await product.populate('sellerId', 'name shopName email');

  sendResponse(res, 200, product, 'Product updated successfully');
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Seller/Superadmin
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  // Check ownership: sellers can only delete their own products
  if (req.user?.role === 'seller' && product.sellerId.toString() !== req.user.id) {
    throw new ApiError('Not authorized to delete this product', 403);
  }

  await product.deleteOne();

  sendResponse(res, 200, null, 'Product deleted successfully');
});
