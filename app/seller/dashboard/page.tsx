'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Star,
  MessageSquare,
} from 'lucide-react';

interface SellerStats {
  totalRevenue: number;
  revenueChange: number;
  totalProducts: number;
  productsChange: number;
  totalOrders: number;
  ordersChange: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  date: string;
}

interface Review {
  _id: string;
  userId: {
    name: string;
  };
  productId: {
    _id: string;
    title: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function SellerDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<SellerStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalProducts: 0,
    productsChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch seller's products
      const productsRes = await fetch(`http://localhost:5000/api/products?sellerId=${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const productsData = await productsRes.json();
      
      // Fetch seller's orders
      const ordersRes = await fetch(`http://localhost:5000/api/orders/seller/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await ordersRes.json();
      
      // Calculate stats
      const products = productsData.success ? productsData.data.products : [];
      const orders = ordersData.success && Array.isArray(ordersData.data) ? ordersData.data : [];
      
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = orders.filter((order: any) => order.status === 'pending' || order.status === 'processing').length;
      
      setStats({
        totalRevenue,
        revenueChange: 12.5,
        totalProducts: products.length,
        productsChange: 8.3,
        totalOrders: orders.length,
        ordersChange: 15.2,
        pendingOrders,
      });

      // Set recent orders (last 5)
      const recent = orders.slice(0, 5).map((order: any) => ({
        id: order._id,
        customer: order.userId?.name || 'Guest',
        product: order.items?.[0]?.productId?.title || 'Multiple items',
        amount: order.totalAmount,
        status: order.status,
        date: new Date(order.createdAt).toLocaleDateString(),
      }));
      
      setRecentOrders(recent);

      // Fetch reviews for seller's products
      if (products.length > 0) {
        const productIds = products.map((p: any) => p._id);
        const reviewsPromises = productIds.slice(0, 10).map((id: string) =>
          fetch(`http://localhost:5000/api/reviews?productId=${id}`)
            .then(res => res.json())
            .then(data => data.data?.reviews || [])
            .catch(() => [])
        );
        
        const allReviewsArrays = await Promise.all(reviewsPromises);
        const allReviews = allReviewsArrays.flat();
        
        // Sort by date and take latest 5
        const sortedReviews = allReviews
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        
        setRecentReviews(sortedReviews);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `NPR ${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'My Products',
      value: stats.totalProducts.toLocaleString(),
      change: stats.productsChange,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
    {
      title: 'Customer Reviews',
      value: recentReviews.length.toLocaleString(),
      change: 0,
      icon: Star,
      color: 'bg-orange-500',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.shopName || user?.name}! Here's your store
          overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  {stat.change !== 0 && (
                    <div className="flex items-center mt-2">
                      {isPositive ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`ml-1 text-sm font-medium ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {Math.abs(stat.change)}%
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        vs last month
                      </span>
                    </div>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Orders
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Customer Reviews
            </h2>
          </div>
          <button 
            onClick={() => window.location.href = '/seller/products'}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        </div>
        <div className="p-6">
          {recentReviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No reviews yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Reviews will appear here once customers review your products
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">
                          {review.userId?.name || 'Anonymous'}
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 font-medium mb-2">
                        {review.productId?.title || 'Product'}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {review.comment}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <button
          onClick={() => (window.location.href = '/seller/products')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:scale-105"
        >
          <Package className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Manage Products
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Add, edit, or remove your products
          </p>
        </button>

        <button
          onClick={() => (window.location.href = '/seller/orders')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:scale-105"
        >
          <ShoppingCart className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">View Orders</h3>
          <p className="mt-1 text-sm text-gray-600">
            Process and track your orders
          </p>
        </button>

        <button
          onClick={() => (window.location.href = '/')}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:scale-105"
        >
          <Eye className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">View Store</h3>
          <p className="mt-1 text-sm text-gray-600">
            Browse products as a customer
          </p>
        </button>
      </div>
    </div>
  );
}
