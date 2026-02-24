import { z } from 'zod';

/**
 * Product Validation Schemas
 */

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Product title must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be a positive number'),
    discountPrice: z.number().positive('Discount price must be a positive number').optional(),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
    brand: z.string().optional(),
    images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
    attributes: z.record(z.string(), z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Product title must be at least 3 characters').optional(),
    slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    price: z.number().positive('Price must be a positive number').optional(),
    discountPrice: z.number().positive('Discount price must be a positive number').optional().nullable(),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID').optional(),
    brand: z.string().optional(),
    images: z.array(z.string().url('Invalid image URL')).optional(),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer').optional(),
    attributes: z.record(z.string(), z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
});

export const getProductsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).optional(),
  }),
});
