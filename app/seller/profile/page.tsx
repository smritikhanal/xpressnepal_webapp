'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import toast from 'react-hot-toast';
import { Store, Package, DollarSign, Calendar } from 'lucide-react';

interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function SellerProfilePage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    shopName: user?.shopName || '',
    businessDescription: user?.businessDescription || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        shopName: user.shopName || '',
        businessDescription: user.businessDescription || '',
      });
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch products
      const productsRes = await fetch(
        `http://localhost:5000/api/products?sellerId=${user?.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const productsData = await productsRes.json();

      // Fetch orders
      const ordersRes = await fetch('http://localhost:5000/api/orders/seller/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await ordersRes.json();

      const products = Array.isArray(productsData.data?.products)
        ? productsData.data.products
        : [];
      const orders = Array.isArray(ordersData.data?.orders) 
        ? ordersData.data.orders 
        : [];

      const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        toast.success('Profile updated successfully!');
        // Refresh form data with updated values
        setFormData({
          name: data.data.name || '',
          email: data.data.email || '',
          shopName: data.data.shopName || '',
          businessDescription: data.data.businessDescription || '',
        });
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Seller Profile</h1>
        <p className="mt-2 text-gray-600">Manage your shop information and view statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalProducts}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Info Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Store className="w-5 h-5 mr-2 text-green-600" />
              Shop Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={formData.shopName}
                  onChange={(e) =>
                    setFormData({ ...formData, shopName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seller Since
                </label>
                <div className="flex items-center px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                  <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description
                </label>
                <textarea
                  value={formData.businessDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, businessDescription: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                  maxLength={500}
                  placeholder="Tell customers about your business..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.businessDescription.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Personal Info Section */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
