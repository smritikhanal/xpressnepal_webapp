import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'order_placed' | 'order_confirmed' | 'order_shipped' | 'order_delivered' | 'order_cancelled' | 'order_status';
  isRead: boolean;
  link?: string;
  relatedId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error', 'order_placed', 'order_confirmed', 'order_shipped', 'order_delivered', 'order_cancelled', 'order_status'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    relatedId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
