import mongoose, { Document, Schema } from 'mongoose';

/**
 * User Interface
 * Defines the shape of a User document in MongoDB
 * 
 * Supports 3 roles:
 * - customer: Regular shoppers
 * - seller: Users who can sell products
 * - superadmin: Full system access
 */
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'seller' | 'superadmin';
  phone?: string;
  isVerified: boolean;
  authProvider: 'local' | 'google' | 'github';
  // Seller-specific fields
  shopName?: string;
  businessDescription?: string;
  isSellerActive?: boolean; // Admin can disable sellers
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Schema
 * 
 * WHY we design it this way:
 * 
 * 1. `email` is unique and indexed - fast lookups for authentication
 * 2. `passwordHash` - NEVER store plain passwords, always hash
 * 3. `role` - enables role-based access control (RBAC)
 * 4. `authProvider` - supports OAuth (Google, GitHub) alongside local auth
 * 5. `isVerified` - email verification status
 * 6. timestamps - automatic createdAt/updatedAt tracking
 */
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    passwordHash: {
      type: String,
      required: function (this: IUser) {
        // Password required only for local auth (not OAuth)
        return this.authProvider === 'local';
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include in queries by default
    },
    role: {
      type: String,
      enum: ['customer', 'seller', 'superadmin'],
      default: 'customer',
    },
    phone: {
      type: String,
      trim: true,
    },
    // Seller-specific fields
    shopName: {
      type: String,
      trim: true,
      minlength: [3, 'Shop name must be at least 3 characters'],
      required: function (this: IUser) {
        // Shop name required for sellers
        return this.role === 'seller';
      },
    },
    businessDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Business description cannot exceed 500 characters'],
    },
    isSellerActive: {
      type: Boolean,
      default: true,
      required: function (this: IUser) {
        return this.role === 'seller';
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

/**
 * Note on Indexes:
 * - `unique: true` on email automatically creates an index
 * - No need for explicit userSchema.index({ email: 1 })
 */

/**
 * Model Export
 * 
 * mongoose.model() creates a collection named 'users' (lowercase, plural)
 * The generic <IUser> provides TypeScript type safety
 */
const User = mongoose.model<IUser>('User', userSchema);

export default User;
