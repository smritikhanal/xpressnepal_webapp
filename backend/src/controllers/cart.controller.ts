import { Request, Response } from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { asyncHandler, sendResponse, ApiError } from '../utils/apiHelpers.js';

/**
 * @desc    Get current user's cart
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  let cart = await Cart.findOne({ userId: req.user?.id })
    .populate('items.productId', 'title slug price discountPrice images stock');

  if (!cart) {
    // Create empty cart if doesn't exist
    cart = await Cart.create({ userId: req.user?.id, items: [] });
  }

  sendResponse(res, 200, cart);
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/add
 * @access  Private
 */
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    throw new ApiError('Product ID is required', 400);
  }

  // Check if product exists and is in stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  if (!product.isActive) {
    throw new ApiError('Product is not available', 400);
  }

  if (product.stock < quantity) {
    throw new ApiError('Insufficient stock', 400);
  }

  // Find or create cart
  let cart = await Cart.findOne({ userId: req.user?.id });
  
  if (!cart) {
    cart = await Cart.create({
      userId: req.user?.id,
      items: [],
    });
  }

  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update quantity
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item with current price snapshot
    cart.items.push({
      productId,
      quantity,
      priceAtTime: product.discountPrice || product.price,
    });
  }

  await cart.save();

  // Return populated cart
  const populatedCart = await Cart.findById(cart._id)
    .populate('items.productId', 'title slug price discountPrice images stock');

  sendResponse(res, 200, populatedCart, 'Item added to cart');
});

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/update
 * @access  Private
 */
export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    throw new ApiError('Product ID and quantity are required', 400);
  }

  const cart = await Cart.findOne({ userId: req.user?.id });
  
  if (!cart) {
    throw new ApiError('Cart not found', 404);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError('Item not in cart', 404);
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    cart.items.splice(itemIndex, 1);
  } else {
    // Check stock
    const product = await Product.findById(productId);
    if (product && product.stock < quantity) {
      throw new ApiError('Insufficient stock', 400);
    }
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id)
    .populate('items.productId', 'title slug price discountPrice images stock');

  sendResponse(res, 200, populatedCart, 'Cart updated');
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove/:productId
 * @access  Private
 */
export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId: req.user?.id });
  
  if (!cart) {
    throw new ApiError('Cart not found', 404);
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();

  const populatedCart = await Cart.findById(cart._id)
    .populate('items.productId', 'title slug price discountPrice images stock');

  sendResponse(res, 200, populatedCart, 'Item removed from cart');
});

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await Cart.findOne({ userId: req.user?.id });
  
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  sendResponse(res, 200, null, 'Cart cleared');
});
