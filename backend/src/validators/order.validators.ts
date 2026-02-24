import { z } from 'zod';

/**
 * Order Validation Schemas
 */

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddressId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid address ID'),
    paymentMethod: z.enum(['cash_on_delivery', 'esewa', 'khalti', 'card']),
    notes: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    orderStatus: z.enum(['placed', 'confirmed', 'shipped', 'delivered', 'cancelled']).optional(),
    paymentStatus: z.enum(['pending', 'paid', 'failed']).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID'),
  }),
});

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID'),
  }),
});
