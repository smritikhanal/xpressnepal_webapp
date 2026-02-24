import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Address Interface
 * Stores multiple shipping addresses per user
 */
export interface IAddress extends Document {
  userId: Types.ObjectId;
  fullName: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'Nepal',
    },
    state: {
      type: String,
      required: [true, 'State/Province is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    street: {
      type: String,
      required: [true, 'Street address is required'],
    },
    postalCode: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster user address lookups
addressSchema.index({ userId: 1 });

const Address = mongoose.models.Address || mongoose.model<IAddress>('Address', addressSchema);

export default Address;
