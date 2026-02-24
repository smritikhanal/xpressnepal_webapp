import { z } from 'zod';

/**
 * Wishlist Validation Schemas
 */

export const addToWishlistSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
});

export const removeFromWishlistSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
});
