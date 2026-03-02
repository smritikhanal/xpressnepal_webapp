'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  Store,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface Stats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalProducts: number;
  productsChange: number;
  totalCustomers: number;
  customersChange: number;
  totalSellers: number;
  sellersChange: number;
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

interface OrderItem {
  productId?: {
    title?: string;
  };
}

interface DashboardOrder {
  _id: string;
  userId?: {
    name?: string;
  };
  items?: OrderItem[];
  orderItems?: OrderItem[];
  totalAmount: number;
  orderStatus?: string;
  status?: string;
  paymentStatus?: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalProducts: 0,
    productsChange: 0,
    totalCustomers: 0,
    customersChange: 0,
    totalSellers: 0,
    sellersChange: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [olderOrdersHiddenCount, setOlderOrdersHiddenCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch all data in parallel
      const [productsRes, ordersRes, customersRes, sellersRes] = await Promise.all([
        fetch('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/orders/admin/all?limit=100', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/users?role=customer&limit=1', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/users?role=seller&limit=1', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const customersData = await customersRes.json();
      const sellersData = await sellersRes.json();

      // Extract data safely
      const products = Array.isArray(productsData.data?.products) ? productsData.data.products : [];
      const orders: DashboardOrder[] = Array.isArray(ordersData.data?.orders)
        ? ordersData.data.orders
        : [];
      const customersTotal = customersData.data?.pagination?.total
        ?? (Array.isArray(customersData.data?.users) ? customersData.data.users.length : 0);
      const sellersTotal = sellersData.data?.pagination?.total
        ?? (Array.isArray(sellersData.data?.users) ? sellersData.data.users.length : 0);

      // Calculate total revenue
      const totalRevenue = orders.reduce((sum: number, order) => sum + order.totalAmount, 0);

      // Count pending orders
      const pendingOrders = orders.filter(
        (order) => {
          const currentStatus = (order.orderStatus || order.status || '').toLowerCase();

          return (
            currentStatus === 'placed'
            || currentStatus === 'confirmed'
            || currentStatus === 'pending'
            || currentStatus === 'processing'
          );
        }
      ).length;

      setStats({
        totalRevenue,
        revenueChange: 12.5, // TODO: Calculate from previous period
        totalOrders: ordersData.data?.pagination?.total || orders.length,
        ordersChange: 8.3, // TODO: Calculate from previous period
        totalProducts: products.length,
        productsChange: 5.2, // TODO: Calculate from previous period
        totalCustomers: customersTotal,
        customersChange: 15.8, // TODO: Calculate from previous period
        totalSellers: sellersTotal,
        sellersChange: 3.2, // TODO: Calculate from previous period
        pendingOrders,
      });

      // Map orders from last 24 hours only
      const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
      const ordersForDisplay = orders
        .filter((order) => new Date(order.createdAt).getTime() >= twentyFourHoursAgo)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setOlderOrdersHiddenCount(Math.max(orders.length - ordersForDisplay.length, 0));

      const mappedOrders: RecentOrder[] = ordersForDisplay.map((order) => ({
        id: order._id,
        customer: order.userId?.name || 'Guest',
        product: order.orderItems?.[0]?.productId?.title || order.items?.[0]?.productId?.title || 'Product',
        amount: order.totalAmount,
        status: order.orderStatus || order.status || 'N/A',
        date: new Date(order.createdAt).toLocaleDateString(),
      }));

      setRecentOrders(mappedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `NPR ${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: Coins,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      change: stats.productsChange,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      change: stats.customersChange,
      icon: Users,
      color: 'bg-orange-500',
    },
    {
      title: 'Total Sellers',
      value: stats.totalSellers.toLocaleString(),
      change: stats.sellersChange,
      icon: Store,
      color: 'bg-indigo-500',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders.toLocaleString(),
      change: 0,
      icon: TrendingUp,
      color: 'bg-red-500',
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.name}! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <p className="text-xs text-gray-500 mt-1">
            Showing only orders from the last 24 hours.
            {olderOrdersHiddenCount > 0 ? ` ${olderOrdersHiddenCount} older order(s) hidden.` : ''}
          </p>
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
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    No orders in the last 24 hours.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
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
                      NPR {order.amount.toFixed(2)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/products"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:scale-105 block"
        >
          <Package className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Manage Products
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Add, edit, or remove products
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:scale-105 block"
        >
          <ShoppingCart className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">View Orders</h3>
          <p className="mt-1 text-sm text-gray-600">
            Process and track orders
          </p>
        </Link>

        <Link
          href="/admin/sellers"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:scale-105 block"
        >
          <Store className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Manage Sellers
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Review and manage sellers
          </p>
        </Link>

        <Link
          href="/admin/customers"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:scale-105 block"
        >
          <Users className="w-8 h-8 text-orange-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            View Customers
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Manage customer accounts
          </p>
        </Link>
      </div>
    </div>
  );
}
