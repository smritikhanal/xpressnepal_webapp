import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Wishlist Interface
 * Stores user's saved products for later
 */
export interface IWishlist extends Document {
  userId: Types.ObjectId;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true, // One wishlist per user
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', wishlistSchema);

export default Wishlist;
