import { z } from 'zod';

/**
 * Review Validation Schemas
 */

export const createReviewSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    comment: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment must be at most 500 characters'),
  }),
});

export const getProductReviewsSchema = z.object({
  query: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const deleteReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid review ID'),
  }),
});
