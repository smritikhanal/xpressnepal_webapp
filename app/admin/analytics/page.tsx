'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  orders: {
    current: number;
    previous: number;
    change: number;
  };
  customers: {
    current: number;
    previous: number;
    change: number;
  };
  products: {
    current: number;
    previous: number;
    change: number;
  };
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    revenue: { current: 45230.5, previous: 38920.3, change: 16.2 },
    orders: { current: 234, previous: 198, change: 18.2 },
    customers: { current: 1842, previous: 1623, change: 13.5 },
    products: { current: 156, previous: 142, change: 9.9 },
  });

  useEffect(() => {
    // TODO: Fetch analytics from API
    setTimeout(() => setLoading(false), 500);
  }, []);

  const StatCard = ({
    title,
    current,
    previous,
    change,
    icon: Icon,
    color,
  }: {
    title: string;
    current: string;
    previous: string;
    change: number;
    icon: any;
    color: string;
  }) => {
    const isPositive = change >= 0;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div
            className={`flex items-center space-x-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{current}</p>
          <p className="text-xs text-gray-500 mt-1">
            vs {previous} last period
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">
          Track your store performance and insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          current={`$${analytics.revenue.current.toLocaleString()}`}
          previous={`$${analytics.revenue.previous.toLocaleString()}`}
          change={analytics.revenue.change}
          icon={DollarSign}
          color="bg-green-500"
        />

        <StatCard
          title="Total Orders"
          current={analytics.orders.current.toLocaleString()}
          previous={analytics.orders.previous.toLocaleString()}
          change={analytics.orders.change}
          icon={ShoppingCart}
          color="bg-blue-500"
        />

        <StatCard
          title="Total Customers"
          current={analytics.customers.current.toLocaleString()}
          previous={analytics.customers.previous.toLocaleString()}
          change={analytics.customers.change}
          icon={Users}
          color="bg-purple-500"
        />

        <StatCard
          title="Total Products"
          current={analytics.products.current.toLocaleString()}
          previous={analytics.products.previous.toLocaleString()}
          change={analytics.products.change}
          icon={Package}
          color="bg-orange-500"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Revenue Overview
        </h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p>Chart visualization coming soon...</p>
        </div>
      </div>

      {/* Top Products & Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Products
          </h2>
          <div className="space-y-4">
            {[
              { name: 'Wireless Headphones', sales: 342, revenue: '$15,390' },
              { name: 'Smart Watch Pro', sales: 289, revenue: '$28,900' },
              { name: 'Gaming Mouse', sales: 256, revenue: '$7,680' },
              { name: 'Mechanical Keyboard', sales: 198, revenue: '$19,800' },
              { name: 'USB-C Hub', sales: 176, revenue: '$4,400' },
            ].map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} sales</p>
                </div>
                <p className="font-semibold text-gray-900">{product.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Customers
          </h2>
          <div className="space-y-4">
            {[
              { name: 'John Doe', orders: 24, spent: '$4,832' },
              { name: 'Jane Smith', orders: 19, spent: '$3,876' },
              { name: 'Bob Wilson', orders: 17, spent: '$3,215' },
              { name: 'Alice Johnson', orders: 15, spent: '$2,940' },
              { name: 'Charlie Brown', orders: 13, spent: '$2,587' },
            ].map((customer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-600">
                    {customer.orders} orders
                  </p>
                </div>
                <p className="font-semibold text-gray-900">{customer.spent}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales by Category */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Sales by Category
        </h2>
        <div className="space-y-4">
          {[
            { name: 'Electronics', sales: '$42,850', percentage: 45 },
            { name: 'Phones', sales: '$28,920', percentage: 30 },
            { name: 'Accessories', sales: '$15,280', percentage: 16 },
            { name: 'Others', sales: '$8,180', percentage: 9 },
          ].map((category, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {category.name}
                </span>
                <span className="text-sm text-gray-600">{category.sales}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
