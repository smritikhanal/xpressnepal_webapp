import mongoose, { Document, Schema } from 'mongoose';

/**
 * Coupon Interface
 * Discount coupons for orders
 */
export interface ICoupon extends Document {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiresAt?: Date;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: [true, 'Discount type is required'],
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
    },
    minOrderAmount: {
      type: Number,
      min: [0, 'Minimum order amount cannot be negative'],
    },
    maxDiscountAmount: {
      type: Number,
      min: [0, 'Maximum discount amount cannot be negative'],
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      min: [1, 'Usage limit must be at least 1'],
    },
    usageCount: {
      type: Number,
      default: 0,
      min: [0, 'Usage count cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for coupon lookup (code index created by unique: true)
couponSchema.index({ isActive: 1 });

const Coupon = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', couponSchema);

export default Coupon;
