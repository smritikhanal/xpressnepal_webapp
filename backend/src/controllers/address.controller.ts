import { Request, Response } from 'express';
import Address from '../models/Address.js';
import { asyncHandler, sendResponse, ApiError } from '../utils/apiHelpers.js';

/**
 * @desc    Get user's addresses
 * @route   GET /api/addresses
 * @access  Private
 */
export const getAddresses = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await Address.find({ userId: req.user?.id }).sort({ isDefault: -1 });
  sendResponse(res, 200, addresses);
});

/**
 * @desc    Add new address
 * @route   POST /api/addresses
 * @access  Private
 */
export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, phone, country, state, city, street, postalCode, isDefault } = req.body;

  // If this is default, unset other defaults
  if (isDefault) {
    await Address.updateMany({ userId: req.user?.id }, { isDefault: false });
  }

  const address = await Address.create({
    userId: req.user?.id,
    fullName,
    phone,
    country: country || 'Nepal',
    state,
    city,
    street,
    postalCode,
    isDefault: isDefault || false,
  });

  sendResponse(res, 201, address, 'Address added successfully');
});

/**
 * @desc    Update address
 * @route   PUT /api/addresses/:id
 * @access  Private
 */
export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const address = await Address.findOne({ _id: req.params.id, userId: req.user?.id });

  if (!address) {
    throw new ApiError('Address not found', 404);
  }

  // If setting as default, unset others
  if (req.body.isDefault) {
    await Address.updateMany({ userId: req.user?.id }, { isDefault: false });
  }

  Object.assign(address, req.body);
  await address.save();

  sendResponse(res, 200, address, 'Address updated successfully');
});

/**
 * @desc    Delete address
 * @route   DELETE /api/addresses/:id
 * @access  Private
 */
export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const address = await Address.findOneAndDelete({ 
    _id: req.params.id, 
    userId: req.user?.id 
  });

  if (!address) {
    throw new ApiError('Address not found', 404);
  }

  sendResponse(res, 200, null, 'Address deleted successfully');
});
