'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Truck, User, Mail, Phone, Package, CreditCard, Calendar } from 'lucide-react';
import DeliveryTracking from '@/components/DeliveryTracking';
import { Label } from '@/components/ui/label';
import { normalizeImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  quantity: number;
  price: number;
  _id: string;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  userId: Customer;
  orderItems: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  deliveryPersonnel?: {
    name: string;
    phone: string;
  };
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

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
        toast.error(data.message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      toast.error('An error occurred while fetching order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <Link href="/admin/orders" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-gray-600 mt-1">
                Order ID: <span className="font-mono text-sm">{order._id}</span>
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                order.orderStatus === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Name</Label>
                  <p className="font-medium text-gray-900">{order.userId?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Email</Label>
                  <p className="font-medium text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {order.userId?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Phone</Label>
                  <p className="font-medium text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {order.userId?.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Customer ID</Label>
                  <p className="font-medium text-gray-900 font-mono text-sm">{order.userId?._id || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </h2>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{order.shippingAddress?.fullName}</p>
                <p className="text-gray-700">{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && (
                  <p className="text-gray-700">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-gray-700">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                </p>
                <p className="text-gray-700">{order.shippingAddress?.country}</p>
                <p className="text-gray-700 flex items-center mt-2">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  {order.shippingAddress?.phone}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Items ({order.orderItems?.length || 0})
              </h2>
              <div className="space-y-4">
                {order.orderItems?.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    {item.productId?.images?.[0] && (
                      <img
                        src={normalizeImageUrl(item.productId.images[0])}
                        alt={item.productId?.name || 'Product'}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.productId?.name || 'Product N/A'}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: NPR {item.price?.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        NPR {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Total */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">
                    NPR {order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-600">Payment Method</Label>
                  <p className="font-medium text-gray-900 capitalize">
                    {order.paymentMethod || 'Cash on Delivery'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Payment Status</Label>
                  <p className={`font-medium inline-block px-3 py-1 rounded-full text-sm ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Total Paid</Label>
                  <p className="font-medium text-gray-900">
                    {order.paymentStatus === 'paid' ? `NPR ${order.totalAmount?.toFixed(2)}` : 'Pending'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Order Timeline
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Order Placed</span>
                  <span className="font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium text-gray-900">
                    {new Date(order.updatedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Current Status</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Admin Controls & Tracking */}
          <div className="space-y-6">
            {/* Order Status Display */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Current Order Status
              </h2>
              <div className="space-y-3">
                <div className={`px-6 py-4 rounded-lg text-center ${
                  order.orderStatus === 'delivered' ? 'bg-green-100' :
                  order.orderStatus === 'shipped' ? 'bg-blue-100' :
                  order.orderStatus === 'confirmed' ? 'bg-purple-100' :
                  order.orderStatus === 'cancelled' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  <p className={`text-2xl font-bold capitalize ${
                    order.orderStatus === 'delivered' ? 'text-green-800' :
                    order.orderStatus === 'shipped' ? 'text-blue-800' :
                    order.orderStatus === 'confirmed' ? 'text-purple-800' :
                    order.orderStatus === 'cancelled' ? 'text-red-800' :
                    'text-yellow-800'
                  }`}>
                    {order.orderStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Information Display */}
            {order.deliveryPersonnel && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Delivery Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-600">Delivery Person</Label>
                    <p className="font-medium text-gray-900">{order.deliveryPersonnel.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Contact Phone</Label>
                    <p className="font-medium text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      {order.deliveryPersonnel.phone}
                    </p>
                  </div>
                  {order.currentLocation && (
                    <div>
                      <Label className="text-gray-600">Current Location</Label>
                      <p className="font-medium text-gray-900 font-mono text-sm">
                        {order.currentLocation.latitude.toFixed(6)}, {order.currentLocation.longitude.toFixed(6)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Last updated: {new Date(order.currentLocation.timestamp).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Real-time Tracking Display */}
            <div>
              <DeliveryTracking
                orderId={order._id}
                orderStatus={order.orderStatus}
                currentLocation={order.currentLocation}
                deliveryPersonnel={order.deliveryPersonnel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
