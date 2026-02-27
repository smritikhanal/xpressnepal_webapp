import { Request, Response } from 'express';
import User from '../models/User.js';
import { asyncHandler, sendResponse, ApiError } from '../utils/apiHelpers.js';

/**
 * @desc    Upgrade customer account to seller
 * @route   POST /api/auth/become-seller
 * @access  Private (Customer only)
 */
export const becomeSeller = asyncHandler(async (req: Request, res: Response) => {
  const { shopName, businessDescription } = req.body;

  if (!shopName || shopName.trim().length < 3) {
    throw new ApiError('Shop name must be at least 3 characters', 400);
  }

  const user = await User.findById(req.user?.id);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  if (user.role === 'seller') {
    throw new ApiError('You are already a seller', 400);
  }

  if (user.role === 'superadmin') {
    throw new ApiError('Superadmin cannot become a seller', 400);
  }

  // Check if shop name is already taken
  const existingShop = await User.findOne({ shopName: shopName.trim() });
  if (existingShop) {
    throw new ApiError('Shop name is already taken', 400);
  }

  // Upgrade to seller
  user.role = 'seller';
  user.shopName = shopName.trim();
  user.businessDescription = businessDescription?.trim() || '';
  user.isSellerActive = true;

  await user.save();

  sendResponse(res, 200, {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    shopName: user.shopName,
    businessDescription: user.businessDescription,
    isSellerActive: user.isSellerActive,
  }, 'Successfully upgraded to seller account');
});
