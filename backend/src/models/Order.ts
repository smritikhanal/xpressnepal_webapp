import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Order Item Interface
 */
interface IOrderItem {
  productId: Types.ObjectId;
  title: string;
  quantity: number;
  price: number;
}

/**
 * Shipping Address Interface (embedded)
 */
interface IShippingAddress {
  fullName: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  postalCode?: string;
}

/**
 * Delivery Personnel Interface
 */
interface IDeliveryPersonnel {
  name: string;
  phone: string;
  vehicleNumber?: string;
}

/**
 * GPS Location Interface
 */
interface IGPSLocation {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

/**
 * Order Interface
 * Handles order lifecycle and history
 */
export interface IOrder extends Document {
  userId: Types.ObjectId;
  orderItems: IOrderItem[];
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: IShippingAddress;
  paymentId?: Types.ObjectId;
  deliveryPersonnel?: IDeliveryPersonnel;
  currentLocation?: IGPSLocation;
  deliveryDate?: Date;
  deliveryTimeSlot?: 'morning' | 'afternoon' | 'evening';
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: String,
  },
  { _id: false }
);

const deliveryPersonnelSchema = new Schema<IDeliveryPersonnel>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleNumber: String,
  },
  { _id: false }
);

const gpsLocationSchema = new Schema<IGPSLocation>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    orderItems: {
      type: [orderItemSchema],
      required: [true, 'Order must have at least one item'],
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: 'Order must have at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'esewa', 'khalti', 'card'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, 'Shipping address is required'],
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    deliveryPersonnel: {
      type: deliveryPersonnelSchema,
    },
    currentLocation: {
      type: gpsLocationSchema,
    },
    deliveryDate: {
      type: Date,
    },
    deliveryTimeSlot: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for order queries
orderSchema.index({ userId: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
