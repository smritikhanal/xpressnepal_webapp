import { z } from 'zod';

/**
 * Category Validation Schemas
 */

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: z.string().optional(),
    parentCategory: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters').optional(),
    slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
    description: z.string().optional(),
    parentCategory: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
  }),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
  }),
});
