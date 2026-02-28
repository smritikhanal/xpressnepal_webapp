import { z } from 'zod';

/**
 * Product Validation Schemas
 */

// AttributeOption schema - supports {value, priceModifier} objects
const attributeOptionSchema = z.object({
  _id: z.string().optional(),
  value: z.string(),
  priceModifier: z.number().default(0),
});

// Image path/URL - accepts full URLs or relative paths like /uploads/xxx.png
const imageUrlOrPath = z.string().refine(
  (val) =>
    val.startsWith('http://') ||
    val.startsWith('https://') ||
    val.startsWith('/uploads/') ||
    val.startsWith('uploads/'),
  'Image must be a valid URL or uploaded file path (/uploads/...)'
);

// Attributes: each key maps to an array of options
const productAttributesSchema = z.record(
  z.string(),
  z.union([z.array(attributeOptionSchema), z.string()])
).optional();

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Product title must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be a positive number'),
    discountPrice: z.number().positive('Discount price must be a positive number').optional(),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
    brand: z.string().optional(),
    images: z.array(imageUrlOrPath).min(1, 'At least one image is required'),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
    attributes: productAttributesSchema,
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
    images: z.array(imageUrlOrPath).optional(),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer').optional(),
    attributes: productAttributesSchema,
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
    categoryId: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).optional(),
    sellerId: z.string().optional(),
  }),
});
