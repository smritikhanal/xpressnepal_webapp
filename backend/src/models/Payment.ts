import mongoose, { Document, Schema, Types } from 'mongoose';

/**
 * Payment Interface
 * Decouples payment logic from orders
 * Supports multiple payment gateways
 */
export interface IPayment extends Document {
  orderId: Types.ObjectId;
  provider: 'stripe' | 'paypal' | 'khalti' | 'esewa';
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
    },
    provider: {
      type: String,
      enum: ['stripe', 'paypal', 'khalti', 'esewa'],
      required: [true, 'Payment provider is required'],
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'NPR',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ transactionId: 1 });

const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
