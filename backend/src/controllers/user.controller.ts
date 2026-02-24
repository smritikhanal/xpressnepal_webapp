import { Request, Response } from 'express';
import User from '../models/User.js';
import { ApiError, sendResponse } from '../utils/apiHelpers.js';

/**
 * Get all users (admin only)
 * Can filter by role
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build query based on filters
    const query: any = {};
    if (role && ['customer', 'seller', 'superadmin'].includes(role as string)) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    sendResponse(res, 200, {
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    }, 'Users fetched successfully');
  } catch (error: any) {
    throw new ApiError(error.message, 500);
  }
};

/**
 * Get user by ID (admin only)
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-passwordHash');

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    sendResponse(res, 200, user, 'User fetched successfully');
  } catch (error: any) {
    throw new ApiError(error.message, 500);
  }
};

/**
 * Update user (admin only)
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow updating password through this endpoint
    delete updates.passwordHash;

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select('-passwordHash');

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    sendResponse(res, 200, user, 'User updated successfully');
  } catch (error: any) {
    throw new ApiError(error.message, 500);
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    sendResponse(res, 200, null, 'User deleted successfully');
  } catch (error: any) {
    throw new ApiError(error.message, 500);
  }
};

/**
 * Toggle seller active status (admin only)
 */
export const toggleSellerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    if (user.role !== 'seller') {
      throw new ApiError('User is not a seller', 400);
    }

    user.isSellerActive = !user.isSellerActive;
    await user.save();

    const userObject = user.toObject();
    delete userObject.passwordHash;

    sendResponse(res, 200, userObject, 'Seller status updated successfully');
  } catch (error: any) {
    throw new ApiError(error.message, 500);
  }
};
