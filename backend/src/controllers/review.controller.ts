import { Request, Response } from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { asyncHandler, sendResponse, getPagination, ApiError } from '../utils/apiHelpers.js';

/**
 * @desc    Get reviews for a product
 * @route   GET /api/reviews?productId=:id
 * @access  Public
 */
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query);
  const productId = req.query.productId as string;

  if (!productId) {
    throw new ApiError('Product ID is required', 400);
  }

  const [reviews, total] = await Promise.all([
    Review.find({ productId })
      .populate('userId', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Review.countDocuments({ productId }),
  ]);

  sendResponse(res, 200, {
    reviews,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

/**
 * @desc    Create review
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { productId, rating, comment } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    userId: req.user?.id,
    productId,
  });

  if (existingReview) {
    throw new ApiError('You have already reviewed this product', 400);
  }

  const review = await Review.create({
    userId: req.user?.id,
    productId,
    rating,
    comment,
  });

  // Update product rating averages
  const allReviews = await Review.find({ productId });
  const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

  await Product.findByIdAndUpdate(productId, {
    ratingAvg: Math.round(avgRating * 10) / 10,
    ratingCount: allReviews.length,
  });

  sendResponse(res, 201, review, 'Review submitted successfully');
});

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findOne({ 
    _id: req.params.id, 
    userId: req.user?.id 
  });

  if (!review) {
    throw new ApiError('Review not found', 404);
  }

  const productId = review.productId;
  await review.deleteOne();

  // Recalculate product ratings
  const allReviews = await Review.find({ productId });
  const avgRating = allReviews.length > 0 
    ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length 
    : 0;

  await Product.findByIdAndUpdate(productId, {
    ratingAvg: Math.round(avgRating * 10) / 10,
    ratingCount: allReviews.length,
  });

  sendResponse(res, 200, null, 'Review deleted successfully');
});
