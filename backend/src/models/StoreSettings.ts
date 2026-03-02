import mongoose, { Document, Schema } from 'mongoose';

export interface IStoreSettings extends Document {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: 'NPR' | 'USD' | 'EUR' | 'GBP';
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

const storeSettingsSchema = new Schema<IStoreSettings>(
  {
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
      default: 'XpressNepal',
    },
    storeEmail: {
      type: String,
      required: [true, 'Store email is required'],
      trim: true,
      lowercase: true,
      default: 'support@xpressnepal.com',
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    storePhone: {
      type: String,
      trim: true,
      default: '+977-1234567890',
    },
    currency: {
      type: String,
      enum: ['NPR', 'USD', 'EUR', 'GBP'],
      default: 'NPR',
      required: true,
    },
    timezone: {
      type: String,
      required: true,
      default: 'Asia/Kathmandu',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const StoreSettings = mongoose.model<IStoreSettings>('StoreSettings', storeSettingsSchema);

export default StoreSettings;
