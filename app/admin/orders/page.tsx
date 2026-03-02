'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Eye,
} from 'lucide-react';

interface Order {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  items?: Array<{
    productId: {
      title: string;
    };
    quantity: number;
    price: number;
  }>;
  orderItems?: Array<{
    productId: {
      title: string;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  orderStatus?: string;
  status?: string;
  paymentStatus?: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/orders/admin/all?limit=100', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success && data.data.orders && Array.isArray(data.data.orders)) {
        setOrders(data.data.orders);
      } else {
        setOrders([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, []);

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOrderItemsCount = (order: Order) => {
    if (Array.isArray(order.orderItems)) {
      return order.orderItems.length;
    }

    if (Array.isArray(order.items)) {
      return order.items.length;
    }

    return 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-2 text-gray-600">
            Manage all orders in the store
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
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
                <Link
                  href={`/admin/orders/${order._id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Customer Info */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Customer</p>
                  <p className="text-sm font-semibold text-gray-900">{order.userId?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-600">{order.userId?.email}</p>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Items</p>
                  <p className="text-sm font-semibold text-gray-900">{getOrderItemsCount(order)} items</p>
                </div>

                {/* Total Amount */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">NPR {order.totalAmount?.toFixed(2) || '0.00'}</p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Order Status</p>
                  <span
                    className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      order.orderStatus || order.status
                    )}`}
                  >
                    {order.orderStatus || order.status || 'N/A'}
                  </span>
                </div>

                {/* Payment Status */}
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Payment Status</p>
                  <span
                    className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.paymentStatus || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
