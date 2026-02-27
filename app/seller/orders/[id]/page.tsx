'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { ArrowLeft, Package, MapPin, Phone, Mail, User, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

interface DeliveryPersonnel {
  name: string;
  phone: string;
  vehicleNumber: string;
}

interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    street: string;
    postalCode: string;
  };
  deliveryDate?: string;
  deliveryTimeSlot?: 'morning' | 'afternoon' | 'evening';
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  deliveryPersonnel?: DeliveryPersonnel;
  createdAt: string;
  updatedAt: string;
}

export default function SellerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('An error occurred while fetching order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/seller/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error || 'Order not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/seller/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order._id.slice(-8)}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus?.toUpperCase()}
          </span>
          <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
            {order.paymentStatus?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
        </div>
        <div className="space-y-4">
          {order.orderItems?.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0">
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">
                NPR {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4 border-t-2">
            <p className="text-lg font-semibold text-gray-900">Total Amount</p>
            <p className="text-xl font-bold text-green-600">
              NPR {order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4" />
              <span>{order.userId?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4" />
              <span>{order.userId?.email || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-medium text-gray-900">
                {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' :
                 order.paymentMethod === 'esewa' ? 'eSewa' :
                 order.paymentMethod === 'khalti' ? 'Khalti' :
                 order.paymentMethod === 'card' ? 'Credit/Debit Card' :
                 'Cash on Delivery'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
          </div>
          <div className="space-y-2 text-gray-700">
            <p className="font-medium">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.street}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state}
            </p>
            <p>{order.shippingAddress?.postalCode}</p>
            <p>{order.shippingAddress?.country}</p>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <Phone className="w-4 h-4" />
              <span>{order.shippingAddress?.phone}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Delivery Information</h2>
          </div>
          <div className="space-y-3">
            {order.deliveryDate ? (
              <div>
                <p className="text-sm text-gray-600">Scheduled Delivery</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No delivery date scheduled</p>
            )}
            
            {order.deliveryTimeSlot && (
              <div>
                <p className="text-sm text-gray-600">Time Slot</p>
                <p className="font-medium text-gray-900">
                  {order.deliveryTimeSlot === 'morning' && '🌅 Morning (9AM-12PM)'}
                  {order.deliveryTimeSlot === 'afternoon' && '☀️ Afternoon (12PM-4PM)'}
                  {order.deliveryTimeSlot === 'evening' && '🌆 Evening (4PM-8PM)'}
                </p>
              </div>
            )}

            {order.deliveryPersonnel && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Delivery Personnel</p>
                <div className="space-y-1 text-gray-700">
                  <p className="font-medium">{order.deliveryPersonnel.name}</p>
                  <p className="text-sm">{order.deliveryPersonnel.phone}</p>
                  {order.deliveryPersonnel.vehicleNumber && (
                    <p className="text-sm">Vehicle: {order.deliveryPersonnel.vehicleNumber}</p>
                  )}
                </div>
              </div>
            )}

            {order.currentLocation && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Current Location</p>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>Latitude: {order.currentLocation.latitude}</p>
                  <p>Longitude: {order.currentLocation.longitude}</p>
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(order.currentLocation.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Timeline</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">Order Placed</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          {order.updatedAt !== order.createdAt && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Last Updated</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
