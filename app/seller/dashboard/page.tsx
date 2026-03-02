'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  BarChart3,
  Star,
  MessageSquare,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SellerStats {
  totalRevenue: number;
  revenueChange: number;
  totalProducts: number;
  productsChange: number;
  totalOrders: number;
  ordersChange: number;
  pendingOrders: number;
}

interface AnalyticsData {
  date: string;
  revenue: number;
  orders: number;
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
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }
      
      // Fetch seller's products
      const productsRes = await fetch(`http://localhost:5000/api/products?sellerId=${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!productsRes.ok) {
        throw new Error(`Products fetch failed: ${productsRes.status}`);
      }
      
      const productsData = await productsRes.json();
      
      // Fetch seller's orders
      const ordersRes = await fetch(`http://localhost:5000/api/orders/seller/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!ordersRes.ok) {
        throw new Error(`Orders fetch failed: ${ordersRes.status}`);
      }
      
      const ordersData = await ordersRes.json();
      
      // Calculate stats
      const products = productsData.success ? productsData.data.products : [];
      const orders = ordersData.success && ordersData.data?.orders 
        ? ordersData.data.orders 
        : [];
      
      console.log('📦 Products count:', products.length);
      console.log('🛒 Orders count:', orders.length);
      
      // Calculate current month stats
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      // Current month data
      const currentMonthOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      });
      
      const currentMonthRevenue = currentMonthOrders.reduce((sum: number, order: any) => 
        sum + (order.totalAmount || 0), 0);
      
      // Last month data
      const lastMonthOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
      });
      
      const lastMonthRevenue = lastMonthOrders.reduce((sum: number, order: any) => 
        sum + (order.totalAmount || 0), 0);
      
      // Calculate percentage changes
      const revenueChange = lastMonthRevenue > 0 
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) 
        : currentMonthRevenue > 0 ? 100 : 0;
      
      const ordersChange = lastMonthOrders.length > 0
        ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length * 100)
        : currentMonthOrders.length > 0 ? 100 : 0;
      
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = orders.filter((order: any) => 
        order.orderStatus === 'pending' || order.orderStatus === 'placed' || order.orderStatus === 'confirmed'
      ).length;
      
      setStats({
        totalRevenue,
        revenueChange: parseFloat(revenueChange.toFixed(1)),
        totalProducts: products.length,
        productsChange: 0, // Products don't have timestamps
        totalOrders: orders.length,
        ordersChange: parseFloat(ordersChange.toFixed(1)),
        pendingOrders,
      });

      // Generate analytics data for the last 14 days
      const analyticsMap = new Map<string, { revenue: number; orders: number }>();
      
      // Initialize last 14 days
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        analyticsMap.set(dateKey, { revenue: 0, orders: 0 });
      }
      
      // Populate with actual order data
      orders.forEach((order: any) => {
        const orderDate = new Date(order.createdAt);
        const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff >= 0 && daysDiff < 14) {
          const dateKey = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const existing = analyticsMap.get(dateKey);
          if (existing) {
            existing.revenue += order.totalAmount || 0;
            existing.orders += 1;
          }
        }
      });
      
      // Convert to array for chart
      const analyticsArray: AnalyticsData[] = Array.from(analyticsMap.entries()).map(
        ([date, data]) => ({
          date,
          revenue: Math.round(data.revenue),
          orders: data.orders,
        })
      );
      
      setAnalyticsData(analyticsArray);

      // Fetch reviews for seller's products
      if (products.length > 0) {
        const productIds = products.map((p: any) => p._id);
        const reviewsPromises = productIds.slice(0, 10).map((id: string) =>
          fetch(`http://localhost:5000/api/reviews?productId=${id}`)
            .then(res => res.json())
            .then(data => data.data?.reviews || [])
            .catch(error => {
              console.error('Error fetching reviews for product:', error);
              return [];
            })
        );
        
        const allReviewsArrays = await Promise.all(reviewsPromises);
        const allReviews = allReviewsArrays.flat();
        
        // Sort by date and take latest 2
        const sortedReviews = allReviews
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 2);
        
        setRecentReviews(sortedReviews);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small delay to allow for auth store hydration
    const timer = setTimeout(() => {
      if (user?.id) {
        fetchDashboardData();
      } else {
        setLoading(false);
        setError('User not authenticated');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user?.id]);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `NPR ${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: Coins,
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
      title: 'Pending Orders',
      value: stats.pendingOrders.toLocaleString(),
      change: 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
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

      {/* Sales Analytics Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Sales Analytics (Last 14 Days)
            </h2>
          </div>
        </div>
        <div className="p-6">
          {analyticsData.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No sales data yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Sales analytics will appear here once you receive orders
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Revenue Chart */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [`NPR ${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Orders Chart */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Orders Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [value, 'Orders']}
                    />
                    <Bar 
                      dataKey="orders" 
                      fill="#8b5cf6" 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
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
            onClick={() => window.location.href = '/seller/reviews'}
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
