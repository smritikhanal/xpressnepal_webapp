'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Save, Bell, Lock, Globe, Mail, User } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    newCustomers: true,
    lowStock: true,
    weeklyReports: false,
    promotions: true,
  });

  // Security Settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Store Settings
  const [storeData, setStoreData] = useState({
    storeName: 'XpressNepal',
    storeEmail: 'support@xpressnepal.com',
    storePhone: '+977-1234567890',
    currency: 'USD',
    timezone: 'UTC',
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (securityData.newPassword !== securityData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // TODO: API call to update password
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('Password updated successfully');
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: API call to update store settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('Store settings updated successfully');
    } catch (err) {
      setError('Failed to update store settings');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: API call to update notifications
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('Notification preferences updated');
    } catch (err) {
      setError('Failed to update notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account and store preferences
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Profile Settings
          </h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData({ ...profileData, phone: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Security Settings
          </h2>
        </div>

        <form onSubmit={handleSecuritySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={securityData.currentPassword}
              onChange={(e) =>
                setSecurityData({
                  ...securityData,
                  currentPassword: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={securityData.newPassword}
              onChange={(e) =>
                setSecurityData({
                  ...securityData,
                  newPassword: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={securityData.confirmPassword}
              onChange={(e) =>
                setSecurityData({
                  ...securityData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Update Password
          </button>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Bell className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Notification Preferences
          </h2>
        </div>

        <div className="space-y-4">
          {[
            { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about new orders' },
            { key: 'newCustomers', label: 'New Customers', desc: 'Get notified when new customers register' },
            { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Get notified when products are running low' },
            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly performance reports' },
            { key: 'promotions', label: 'Promotions', desc: 'Get notified about promotions and offers' },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key as keyof typeof notifications]}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    [item.key]: e.target.checked,
                  })
                }
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleNotificationsSave}
          disabled={loading}
          className="mt-6 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </button>
      </div>

      {/* Store Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Store Settings
          </h2>
        </div>

        <form onSubmit={handleStoreSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={storeData.storeName}
              onChange={(e) =>
                setStoreData({ ...storeData, storeName: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Email
              </label>
              <input
                type="email"
                value={storeData.storeEmail}
                onChange={(e) =>
                  setStoreData({ ...storeData, storeEmail: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Phone
              </label>
              <input
                type="tel"
                value={storeData.storePhone}
                onChange={(e) =>
                  setStoreData({ ...storeData, storePhone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={storeData.currency}
                onChange={(e) =>
                  setStoreData({ ...storeData, currency: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="NPR">NPR - Nepali Rupee</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                value={storeData.timezone}
                onChange={(e) =>
                  setStoreData({ ...storeData, timezone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UTC">UTC</option>
                <option value="Asia/Kathmandu">Asia/Kathmandu</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Store Settings
          </button>
        </form>
      </div>
    </div>
  );
}
