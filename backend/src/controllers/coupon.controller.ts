import { Request, Response } from 'express';
import Coupon from '../models/Coupon.js';
import { asyncHandler, sendResponse, ApiError } from '../utils/apiHelpers.js';

/**
 * @desc    Validate and apply coupon
 * @route   POST /api/coupons/apply
 * @access  Private
 */
export const applyCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, orderAmount } = req.body;

  // Find coupon
  const coupon = await Coupon.findOne({ 
    code: code.toUpperCase(),
    isActive: true 
  });

  if (!coupon) {
    throw new ApiError('Invalid coupon code', 404);
  }

  // Check expiry
  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    throw new ApiError('Coupon has expired', 400);
  }

  // Check usage limit
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    throw new ApiError('Coupon usage limit reached', 400);
  }

  // Check minimum order amount
  if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
    throw new ApiError(`Minimum order amount of NPR ${coupon.minOrderAmount} required`, 400);
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  // Ensure discount doesn't exceed order amount
  if (discountAmount > orderAmount) {
    discountAmount = orderAmount;
  }

  sendResponse(res, 200, {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalAmount: Math.round((orderAmount - discountAmount) * 100) / 100,
  }, 'Coupon applied successfully');
});

/**
 * @desc    Get all coupons (Admin)
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
export const getAllCoupons = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  sendResponse(res, 200, coupons);
});

/**
 * @desc    Create coupon (Admin)
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.create(req.body);
  sendResponse(res, 201, coupon, 'Coupon created successfully');
});

/**
 * @desc    Update coupon (Admin)
 * @route   PUT /api/coupons/:id
 * @access  Private/Admin
 */
export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!coupon) {
    throw new ApiError('Coupon not found', 404);
  }

  sendResponse(res, 200, coupon, 'Coupon updated successfully');
});

/**
 * @desc    Delete coupon (Admin)
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  if (!coupon) {
    throw new ApiError('Coupon not found', 404);
  }

  sendResponse(res, 200, null, 'Coupon deleted successfully');
});
