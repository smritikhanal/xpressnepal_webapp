'use client';

import { useState, useEffect } from 'react';
import {
  type LucideIcon,
  Coins,
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

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

interface TopCustomer {
  name: string;
  orders: number;
  spent: number;
}

interface CategorySales {
  name: string;
  sales: number;
  percentage: number;
}

interface RevenuePoint {
  date: string;
  value: number;
}

interface ApiOrderItem {
  productId?: string | { _id?: string; title?: string };
  quantity?: number;
  price?: number;
}

interface ApiOrder {
  _id: string;
  userId?: string | { _id?: string; name?: string; email?: string };
  orderItems?: ApiOrderItem[];
  items?: ApiOrderItem[];
  totalAmount?: number;
  createdAt?: string;
}

interface ApiUser {
  _id: string;
  name?: string;
  createdAt?: string;
}

interface ApiProduct {
  _id: string;
  title?: string;
  categoryId?: string | { _id?: string; name?: string };
  createdAt?: string;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const calculateChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    revenue: { current: 0, previous: 0, change: 0 },
    orders: { current: 0, previous: 0, change: 0 },
    customers: { current: 0, previous: 0, change: 0 },
    products: { current: 0, previous: 0, change: 0 },
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [revenueSeries, setRevenueSeries] = useState<RevenuePoint[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication required to load analytics data.');
          return;
        }

        const [ordersRes, customersRes, productsRes] = await Promise.all([
          fetch('http://localhost:5000/api/orders/admin/all?limit=1000', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:5000/api/users?role=customer&limit=1000', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:5000/api/products?limit=1000', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const [ordersData, customersData, productsData] = await Promise.all([
          ordersRes.json(),
          customersRes.json(),
          productsRes.json(),
        ]);

        const orders: ApiOrder[] = Array.isArray(ordersData.data?.orders)
          ? ordersData.data.orders
          : [];
        const customers: ApiUser[] = Array.isArray(customersData.data?.users)
          ? customersData.data.users
          : [];
        const products: ApiProduct[] = Array.isArray(productsData.data?.products)
          ? productsData.data.products
          : [];

        const now = Date.now();
        const currentPeriodStart = now - THIRTY_DAYS_MS;
        const previousPeriodStart = now - (2 * THIRTY_DAYS_MS);

        const inCurrentPeriod = (dateValue?: string) => {
          if (!dateValue) return false;
          const timestamp = new Date(dateValue).getTime();
          return timestamp >= currentPeriodStart;
        };

        const inPreviousPeriod = (dateValue?: string) => {
          if (!dateValue) return false;
          const timestamp = new Date(dateValue).getTime();
          return timestamp >= previousPeriodStart && timestamp < currentPeriodStart;
        };

        const currentRevenue = orders
          .filter((order) => inCurrentPeriod(order.createdAt))
          .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const previousRevenue = orders
          .filter((order) => inPreviousPeriod(order.createdAt))
          .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const dailyRevenueMap = new Map<string, number>();

        orders.forEach((order) => {
          if (!inCurrentPeriod(order.createdAt)) return;

          const orderDate = new Date(order.createdAt as string);
          const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`;
          dailyRevenueMap.set(key, (dailyRevenueMap.get(key) || 0) + (order.totalAmount || 0));
        });

        const chartSeries: RevenuePoint[] = Array.from({ length: 30 }, (_, index) => {
          const date = new Date();
          date.setHours(0, 0, 0, 0);
          date.setDate(date.getDate() - (29 - index));

          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: dailyRevenueMap.get(key) || 0,
          };
        });

        setRevenueSeries(chartSeries);

        const totalOrders = Number(ordersData.data?.pagination?.total || orders.length);
        const ordersAddedCurrentPeriod = orders.filter((order) => inCurrentPeriod(order.createdAt)).length;
        const previousTotalOrders = Math.max(totalOrders - ordersAddedCurrentPeriod, 0);

        const totalCustomers = Number(customersData.data?.pagination?.total || customers.length);
        const customersAddedCurrentPeriod = customers.filter((customer) => inCurrentPeriod(customer.createdAt)).length;
        const previousTotalCustomers = Math.max(totalCustomers - customersAddedCurrentPeriod, 0);

        const totalProducts = Number(productsData.data?.pagination?.total || products.length);
        const productsAddedCurrentPeriod = products.filter((product) => inCurrentPeriod(product.createdAt)).length;
        const previousTotalProducts = Math.max(totalProducts - productsAddedCurrentPeriod, 0);

        setAnalytics({
          revenue: {
            current: currentRevenue,
            previous: previousRevenue,
            change: calculateChange(currentRevenue, previousRevenue),
          },
          orders: {
            current: totalOrders,
            previous: previousTotalOrders,
            change: calculateChange(totalOrders, previousTotalOrders),
          },
          customers: {
            current: totalCustomers,
            previous: previousTotalCustomers,
            change: calculateChange(totalCustomers, previousTotalCustomers),
          },
          products: {
            current: totalProducts,
            previous: previousTotalProducts,
            change: calculateChange(totalProducts, previousTotalProducts),
          },
        });

        const productNameMap = new Map<string, string>();
        const productCategoryMap = new Map<string, string>();

        products.forEach((product) => {
          productNameMap.set(product._id, product.title || 'Unknown Product');
          const categoryName = typeof product.categoryId === 'string'
            ? 'Uncategorized'
            : (product.categoryId?.name || 'Uncategorized');
          productCategoryMap.set(product._id, categoryName);
        });

        const productStats = new Map<string, { sales: number; revenue: number }>();
        const customerStats = new Map<string, { name: string; orders: number; spent: number }>();
        const categoryStats = new Map<string, number>();

        orders.forEach((order) => {
          const orderAmount = order.totalAmount || 0;
          const customerId = typeof order.userId === 'string'
            ? order.userId
            : (order.userId?._id || 'guest');
          const customerName = typeof order.userId === 'string'
            ? 'Guest'
            : (order.userId?.name || 'Guest');

          const existingCustomer = customerStats.get(customerId) || {
            name: customerName,
            orders: 0,
            spent: 0,
          };

          existingCustomer.orders += 1;
          existingCustomer.spent += orderAmount;
          customerStats.set(customerId, existingCustomer);

          const orderItems = Array.isArray(order.orderItems)
            ? order.orderItems
            : (Array.isArray(order.items) ? order.items : []);

          orderItems.forEach((item) => {
            const quantity = item.quantity || 0;
            const lineRevenue = (item.price || 0) * quantity;
            const productId = typeof item.productId === 'string'
              ? item.productId
              : (item.productId?._id || 'unknown-product');

            const productEntry = productStats.get(productId) || { sales: 0, revenue: 0 };
            productEntry.sales += quantity;
            productEntry.revenue += lineRevenue;
            productStats.set(productId, productEntry);

            const categoryName = productCategoryMap.get(productId) || 'Uncategorized';
            categoryStats.set(categoryName, (categoryStats.get(categoryName) || 0) + lineRevenue);
          });
        });

        const computedTopProducts = Array.from(productStats.entries())
          .map(([productId, stats]) => ({
            name: productNameMap.get(productId) || 'Unknown Product',
            sales: stats.sales,
            revenue: stats.revenue,
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        const computedTopCustomers = Array.from(customerStats.values())
          .sort((a, b) => b.spent - a.spent)
          .slice(0, 5);

        const totalCategoryRevenue = Array.from(categoryStats.values()).reduce((sum, value) => sum + value, 0);

        const computedCategorySales = Array.from(categoryStats.entries())
          .map(([name, sales]) => ({
            name,
            sales,
            percentage: totalCategoryRevenue > 0
              ? Math.round((sales / totalCategoryRevenue) * 100)
              : 0,
          }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 6);

        setTopProducts(computedTopProducts);
        setTopCustomers(computedTopCustomers);
        setCategorySales(computedCategorySales);
      } catch (fetchError) {
        console.error('Error fetching analytics:', fetchError);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
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
    icon: LucideIcon;
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

  const maxRevenueValue = Math.max(...revenueSeries.map((point) => point.value), 1);
  const svgWidth = 900;
  const svgHeight = 230;
  const chartMargin = { top: 18, right: 20, bottom: 34, left: 34 };
  const chartWidth = svgWidth - chartMargin.left - chartMargin.right;
  const chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

  const points = revenueSeries.map((point, index) => {
    const x = chartMargin.left + (index * chartWidth) / Math.max(revenueSeries.length - 1, 1);
    const y = chartMargin.top + (1 - point.value / maxRevenueValue) * chartHeight;
    return { ...point, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - chartMargin.bottom} L ${points[0].x} ${svgHeight - chartMargin.bottom} Z`
    : '';

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">Track your store performance and insights</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          {error}
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
          current={`NPR ${analytics.revenue.current.toLocaleString()}`}
          previous={`NPR ${analytics.revenue.previous.toLocaleString()}`}
          change={analytics.revenue.change}
          icon={Coins}
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
        <div className="h-72">
          {revenueSeries.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>No revenue data available for the last 30 days.</p>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">
                  Daily revenue trend (last 30 days)
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  Total: NPR {analytics.revenue.current.toLocaleString()}
                </p>
              </div>

              <div className="flex-1 rounded-lg border border-gray-100 bg-linear-to-b from-blue-50/50 to-white p-2 overflow-hidden">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-full block"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <line x1={chartMargin.left} y1={chartMargin.top} x2={chartMargin.left} y2={svgHeight - chartMargin.bottom} stroke="#e5e7eb" strokeWidth="1" />
                  <line x1={chartMargin.left} y1={svgHeight - chartMargin.bottom} x2={svgWidth - chartMargin.right} y2={svgHeight - chartMargin.bottom} stroke="#e5e7eb" strokeWidth="1" />

                  <line x1={chartMargin.left} y1={chartMargin.top + chartHeight * 0.25} x2={svgWidth - chartMargin.right} y2={chartMargin.top + chartHeight * 0.25} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1={chartMargin.left} y1={chartMargin.top + chartHeight * 0.5} x2={svgWidth - chartMargin.right} y2={chartMargin.top + chartHeight * 0.5} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1={chartMargin.left} y1={chartMargin.top + chartHeight * 0.75} x2={svgWidth - chartMargin.right} y2={chartMargin.top + chartHeight * 0.75} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />

                  {areaPath && <path d={areaPath} fill="rgba(37, 99, 235, 0.12)" />}
                  {linePath && <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

                  {points.filter((_, index) => index % 7 === 0 || index === points.length - 1).map((point, index) => (
                    <g key={`${point.date}-${index}`}>
                      <circle cx={point.x} cy={point.y} r="3" fill="#1d4ed8" />
                      <text x={point.x} y={svgHeight - 10} textAnchor="middle" fontSize="11" fill="#6b7280">
                        {point.date}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          )}
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
            {topProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No product sales data available yet.</p>
            ) : topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} sales</p>
                </div>
                <p className="font-semibold text-gray-900">NPR {product.revenue.toLocaleString()}</p>
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
            {topCustomers.length === 0 ? (
              <p className="text-sm text-gray-500">No customer order data available yet.</p>
            ) : topCustomers.map((customer, index) => (
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
                <p className="font-semibold text-gray-900">NPR {customer.spent.toLocaleString()}</p>
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
          {categorySales.length === 0 ? (
            <p className="text-sm text-gray-500">No category sales data available yet.</p>
          ) : categorySales.map((category, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {category.name}
                </span>
                <span className="text-sm text-gray-600">NPR {category.sales.toLocaleString()}</span>
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
