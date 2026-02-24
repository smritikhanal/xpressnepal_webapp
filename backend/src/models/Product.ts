import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Attribute Option Interface
 */
interface IAttributeOption {
  value: string;
  priceModifier: number;
}

/**
 * Product Attributes Interface
 */
interface IProductAttributes {
  color?: IAttributeOption[];
  size?: IAttributeOption[];
  weight?: IAttributeOption[];
}

/**
 * Product Interface
 * Core entity of the E-commerce system
 */
export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: Types.ObjectId;
  sellerId: Types.ObjectId; // Reference to the seller who owns this product
  brand?: string;
  images: string[];
  stock: number;
  attributes: IProductAttributes;
  ratingAvg: number;
  ratingCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required'],
    },
    brand: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    attributes: {
      color: [{
        value: { type: String, required: true },
        priceModifier: { type: Number, default: 0 },
      }],
      size: [{
        value: { type: String, required: true },
        priceModifier: { type: Number, default: 0 },
      }],
      weight: [{
        value: { type: String, required: true },
        priceModifier: { type: Number, default: 0 },
      }],
    },
    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries (slug index created by unique:true)
productSchema.index({ categoryId: 1 });
productSchema.index({ sellerId: 1 }); // For seller dashboard
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ title: 'text', description: 'text' }); // Text search

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
