import { z } from 'zod';

/**
 * Address Validation Schemas
 */

export const addAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    country: z.string().min(2, 'Country is required'),
    state: z.string().min(2, 'State is required'),
    city: z.string().min(2, 'City is required'),
    street: z.string().min(5, 'Street address is required'),
    postalCode: z.string().min(4, 'Postal code is required'),
    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
    phone: z.string().min(10, 'Phone number must be at least 10 characters').optional(),
    country: z.string().min(2, 'Country is required').optional(),
    state: z.string().min(2, 'State is required').optional(),
    city: z.string().min(2, 'City is required').optional(),
    street: z.string().min(5, 'Street address is required').optional(),
    postalCode: z.string().min(4, 'Postal code is required').optional(),
    isDefault: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid address ID'),
  }),
});

export const deleteAddressSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid address ID'),
  }),
});
