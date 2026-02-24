import { Request, Response } from 'express';
import Wishlist from '../models/Wishlist.js';
import { asyncHandler, sendResponse, ApiError } from '../utils/apiHelpers.js';

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  let wishlist = await Wishlist.findOne({ userId: req.user?.id })
    .populate('products', 'title slug price discountPrice images');

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user?.id, products: [] });
  }

  sendResponse(res, 200, wishlist);
});

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist/add
 * @access  Private
 */
export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError('Product ID is required', 400);
  }

  let wishlist = await Wishlist.findOne({ userId: req.user?.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user?.id, products: [] });
  }

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  const populated = await Wishlist.findById(wishlist._id)
    .populate('products', 'title slug price discountPrice images');

  sendResponse(res, 200, populated, 'Added to wishlist');
});

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/remove/:productId
 * @access  Private
 */
export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await Wishlist.findOne({ userId: req.user?.id });

  if (!wishlist) {
    throw new ApiError('Wishlist not found', 404);
  }

  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== req.params.productId
  );
  await wishlist.save();

  const populated = await Wishlist.findById(wishlist._id)
    .populate('products', 'title slug price discountPrice images');

  sendResponse(res, 200, populated, 'Removed from wishlist');
});
