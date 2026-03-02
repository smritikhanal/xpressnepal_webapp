'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import toast from 'react-hot-toast';
import { Search, Package, MapPin, X, Eye } from 'lucide-react';
import Link from 'next/link';

interface Order {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  orderItems: Array<{
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod?: string;
  deliveryDate?: string;
  deliveryTimeSlot?: 'morning' | 'afternoon' | 'evening';
  createdAt: string;
}

export default function SellerOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [mounted, setMounted] = useState(false);
  
  // Tracking modal state
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [trackingData, setTrackingData] = useState({
    latitude: '',
    longitude: '',
    deliveryPersonnel: {
      name: '',
      phone: '',
      vehicleNumber: ''
    }
  });

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching seller orders...', { user, token: token?.substring(0, 20) });
      const response = await fetch('http://localhost:5000/api/orders/seller/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log('Seller orders response:', data);

      if (data.success) {
        setOrders(data.data.orders || []);
      } else {
        console.error('Failed to fetch orders:', data.message);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Wait for component to mount (for Zustand hydration)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    console.log('User state changed:', user);
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, mounted]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating order status');
    }
  };

  const handlePaymentStatusUpdate = async (orderId: string, newPaymentStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
          )
        );
        toast.success('Payment status updated successfully!');
      } else {
        toast.error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Error updating payment status');
    }
  };

  const openTrackingModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowTrackingModal(true);
  };

  const handleUpdateTracking = async () => {
    if (!trackingData.latitude || !trackingData.longitude || !trackingData.deliveryPersonnel.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${selectedOrderId}/tracking`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: parseFloat(trackingData.latitude),
          longitude: parseFloat(trackingData.longitude),
          deliveryPersonnel: trackingData.deliveryPersonnel
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Tracking information updated successfully!');
        setShowTrackingModal(false);
        setTrackingData({
          latitude: '',
          longitude: '',
          deliveryPersonnel: { name: '', phone: '', vehicleNumber: '' }
        });
        fetchOrders(); // Refresh orders
      } else {
        toast.error('Failed to update tracking: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating tracking:', error);
      toast.error('Error updating tracking information');
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      (order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userId?.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === 'all' || order.orderStatus === statusFilter)
  );

  const getOrderCountByStatus = (status: string) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.orderStatus === status).length;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">Manage your customer orders</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({getOrderCountByStatus('all')})
          </button>
          <button
            onClick={() => setStatusFilter('placed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'placed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Placed ({getOrderCountByStatus('placed')})
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'confirmed'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Confirmed ({getOrderCountByStatus('confirmed')})
          </button>
          <button
            onClick={() => setStatusFilter('shipped')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'shipped'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Shipped ({getOrderCountByStatus('shipped')})
          </button>
          <button
            onClick={() => setStatusFilter('delivered')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'delivered'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Delivered ({getOrderCountByStatus('delivered')})
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'cancelled'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancelled ({getOrderCountByStatus('cancelled')})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Order Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/seller/orders/${order._id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                  <button
                    onClick={() => openTrackingModal(order._id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Track
                  </button>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Customer</p>
                  <p className="text-sm font-semibold text-gray-900">{order.userId?.name || 'Guest'}</p>
                  <p className="text-xs text-gray-600">{order.userId?.email}</p>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Items</p>
                  <p className="text-sm text-gray-900">{order.orderItems?.length || 0} item(s)</p>
                  <p className="text-xs text-gray-600">
                    {order.orderItems?.[0]?.title}
                    {order.orderItems?.length > 1 && ` +${order.orderItems.length - 1} more`}
                  </p>
                </div>

                {/* Total Amount */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">NPR {order.totalAmount.toFixed(2)}</p>
                </div>

                {/* Payment */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Payment Method</p>
                  <p className="text-sm text-gray-900 mb-2">
                    {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 
                     order.paymentMethod === 'esewa' ? 'eSewa' :
                     order.paymentMethod === 'khalti' ? 'Khalti' :
                     order.paymentMethod === 'card' ? 'Card' :
                     'Cash on Delivery'}
                  </p>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentStatusUpdate(order._id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-blue-500 ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {/* Order Status */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Order Status</p>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(
                      order.orderStatus
                    )} border-none focus:ring-2 focus:ring-green-500`}
                  >
                    <option value="placed">Placed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Delivery Schedule */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Delivery Schedule</p>
                  {order.deliveryDate ? (
                    <div className="text-sm">
                      <p className="text-gray-900 font-medium">
                        {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      {order.deliveryTimeSlot && (
                        <p className="text-xs text-gray-600 mt-1">
                          {order.deliveryTimeSlot === 'morning' && '🌅 Morning (9AM-12PM)'}
                          {order.deliveryTimeSlot === 'afternoon' && '☀️ Afternoon (12PM-4PM)'}
                          {order.deliveryTimeSlot === 'evening' && '🌆 Evening (4PM-8PM)'}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Not specified</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tracking Update Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Update Delivery Tracking</h2>
              </div>
              <button
                onClick={() => setShowTrackingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* GPS Coordinates */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">GPS Location</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g., 27.7172"
                      value={trackingData.latitude}
                      onChange={(e) => setTrackingData({...trackingData, latitude: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g., 85.3240"
                      value={trackingData.longitude}
                      onChange={(e) => setTrackingData({...trackingData, longitude: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    💡 Tip: Use Google Maps to get coordinates - right-click on the map and select the coordinates.
                  </p>
                </div>
              </div>

              {/* Delivery Personnel */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Delivery Personnel</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Driver Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Ram Sharma"
                      value={trackingData.deliveryPersonnel.name}
                      onChange={(e) => setTrackingData({
                        ...trackingData,
                        deliveryPersonnel: {...trackingData.deliveryPersonnel, name: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g., 9841234567"
                      value={trackingData.deliveryPersonnel.phone}
                      onChange={(e) => setTrackingData({
                        ...trackingData,
                        deliveryPersonnel: {...trackingData.deliveryPersonnel, phone: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., BA 1 PA 1234"
                      value={trackingData.deliveryPersonnel.vehicleNumber}
                      onChange={(e) => setTrackingData({
                        ...trackingData,
                        deliveryPersonnel: {...trackingData.deliveryPersonnel, vehicleNumber: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowTrackingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTracking}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Update Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
