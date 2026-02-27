'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import DeliveryTracking from '@/components/DeliveryTracking';
import { useSocket } from '@/hooks/use-socket';
import toast from 'react-hot-toast';

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
}

interface DeliveryPersonnel {
  name: string;
  phone: string;
  vehicleNumber?: string;
}

interface GPSLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface Order {
  _id: string;
  userId: string;
  orderItems: OrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  deliveryPersonnel?: DeliveryPersonnel;
  currentLocation?: GPSLocation;
  deliveryDate?: string;
  deliveryTimeSlot?: 'morning' | 'afternoon' | 'evening';
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { isConnected, on, off, trackOrder, untrackOrder } = useSocket();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Listen for real-time order updates
  useEffect(() => {
    if (!orderId) return;

    // Join the order tracking room
    trackOrder(orderId);
    console.log('🔔 Joined order room:', orderId);

    // Listen for order status updates
    const handleOrderStatusUpdate = (data: any) => {
      console.log('📦 Received order:status-updated event:', data);
      if (data.orderId === orderId) {
        const newStatus = data.orderStatus || data.status;
        setOrder((prev) => prev ? { ...prev, orderStatus: newStatus } : null);
        
        // Status-specific messages and emojis
        const statusConfig: Record<string, { emoji: string; message: string }> = {
          confirmed: { 
            emoji: '✅', 
            message: 'Your order has been confirmed and is being processed!' 
          },
          shipped: { 
            emoji: '🚚', 
            message: 'Your order has been shipped and is on the way!' 
          },
          delivered: { 
            emoji: '🎉', 
            message: 'Your order has been delivered! Enjoy your purchase!' 
          },
          cancelled: { 
            emoji: '❌', 
            message: 'Your order has been cancelled.' 
          },
          placed: { 
            emoji: '📦', 
            message: 'Your order has been placed successfully!' 
          }
        };
        
        const config = statusConfig[newStatus] || { 
          emoji: '📢', 
          message: `Order status updated to ${newStatus}` 
        };
        
        console.log('🔔 Showing toast notification:', config);
        toast.success(`${config.emoji} ${config.message}`, {
          duration: 5000,
          position: 'top-right',
        });
      }
    };

    // Listen for general order updates
    const handleOrderUpdate = (data: any) => {
      console.log('📦 Received order:updated event:', data);
      if (data.orderId === orderId) {
        // Merge the update with existing order data to preserve all fields
        setOrder((prev) => {
          if (!prev) return null;
          const updateData = data.orderData || {};
          return {
            ...prev,
            orderStatus: updateData.orderStatus || prev.orderStatus,
            paymentStatus: updateData.paymentStatus || prev.paymentStatus,
            updatedAt: updateData.updatedAt || prev.updatedAt,
          };
        });
      }
    };

    on('order:status-updated', handleOrderStatusUpdate);
    on('order:updated', handleOrderUpdate);

    return () => {
      off('order:status-updated', handleOrderStatusUpdate);
      off('order:updated', handleOrderUpdate);
      untrackOrder(orderId);
      console.log('👋 Left order room:', orderId);
    };
  }, [orderId, on, off, trackOrder, untrackOrder]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

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
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('An error occurred while fetching order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
    switch (status) {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <Link
            href="/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h1>
              <p className="text-gray-600 mt-1">
                Order ID: <span className="font-mono text-sm">{order._id}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>

          {/* Real-time Delivery Tracking */}
          <DeliveryTracking
            orderId={order._id}
            orderStatus={order.orderStatus}
            currentLocation={order.currentLocation}
            deliveryPersonnel={order.deliveryPersonnel}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>
            {order.shippingAddress ? (
              <div className="text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                {order.shippingAddress.postalCode && <p>{order.shippingAddress.postalCode}</p>}
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-gray-500">Address not available</p>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
            </div>
            <div className="text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-medium text-gray-900">Cash on Delivery</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Total Amount:</span>
                <span className="font-bold text-gray-900">NPR {order.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Time Slot Info */}
        {order.deliveryDate && order.deliveryTimeSlot && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Package className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Scheduled Delivery</h3>
                <p className="text-gray-700">
                  {new Date(order.deliveryDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Time Slot: <span className="font-medium capitalize">{order.deliveryTimeSlot}</span>
                  {order.deliveryTimeSlot === 'morning' && ' (8:00 AM - 12:00 PM)'}
                  {order.deliveryTimeSlot === 'afternoon' && ' (12:00 PM - 5:00 PM)'}
                  {order.deliveryTimeSlot === 'evening' && ' (5:00 PM - 9:00 PM)'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.orderItems && order.orderItems.length > 0 ? (
              order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b last:border-b-0">
                  <div className="flex items-center flex-1">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4 flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">NPR {item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">each</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items found</p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>NPR {order.totalAmount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <Link
            href="/orders"
            className="flex-1 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
          >
            View All Orders
          </Link>
          <Link
            href="/products"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
