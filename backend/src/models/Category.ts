import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Category Interface
 * Organizes products into SEO-friendly hierarchical categories
 */
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parentCategory?: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
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
      trim: true,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
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

// Index for parent category queries (slug index created by unique:true)
categorySchema.index({ parentCategory: 1 });

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
