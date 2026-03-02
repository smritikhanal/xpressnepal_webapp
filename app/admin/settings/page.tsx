'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Save, Bell, Lock, Globe, User, Camera } from 'lucide-react';
import { normalizeImageUrl } from '@/lib/utils';

interface StoreSettingsData {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: string;
  timezone: string;
}

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);

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
  const [storeData, setStoreData] = useState<StoreSettingsData>({
    storeName: 'XpressNepal',
    storeEmail: 'support@xpressnepal.com',
    storePhone: '+977-1234567890',
    currency: 'NPR',
    timezone: 'Asia/Kathmandu',
  });

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user?.id) return;

      const response = await fetch(`http://localhost:5000/api/auth/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setUser(result.data);
        setProfileData({
          name: result.data.name || '',
          email: result.data.email || '',
          phone: result.data.phone || '',
        });
        setProfileImagePreview(result.data.image ? normalizeImageUrl(result.data.image) : '');
        setHasLoadedProfile(true);
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
    }
  };

  const fetchStoreSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/admin/store-settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setStoreData({
          storeName: result.data.storeName || 'XpressNepal',
          storeEmail: result.data.storeEmail || 'support@xpressnepal.com',
          storePhone: result.data.storePhone || '+977-1234567890',
          currency: result.data.currency || 'NPR',
          timezone: result.data.timezone || 'Asia/Kathmandu',
        });
      }
    } catch (err) {
      console.error('Failed to load store settings:', err);
    }
  };

  // Fetch user profile when user ID becomes available
  useEffect(() => {
    if (user?.id && !hasLoadedProfile) {
      fetchUserProfile();
    }
  }, [user?.id, hasLoadedProfile]);

  // Fetch store settings on mount
  useEffect(() => {
    fetchStoreSettings();
  }, []);

  // Update form when user changes (from store or after fetch)
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      if (user.image) {
        setProfileImagePreview(normalizeImageUrl(user.image));
      }
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate phone number
    if (profileData.phone && profileData.phone.trim()) {
      const phoneRegex = /^(\+977)?[9][0-9]{9}$/;
      if (!phoneRegex.test(profileData.phone.replace(/\s+/g, ''))) {
        setError('Invalid phone number. Must be 10 digits starting with 9 (e.g., 9841234567)');
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      if (!token || !user?.id) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);
      formData.append('phone', profileData.phone);

      if (profileImageFile) {
        formData.append('image', profileImageFile);
      }

      const response = await fetch(`http://localhost:5000/api/auth/${user.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update profile');
      }

      if (result.data) {
        setUser(result.data);
      }

      setProfileImageFile(null);
      setSuccess(result.message || 'Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate image size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setProfileImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);
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
    } catch {
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:5000/api/admin/store-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(storeData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update store settings');
      }

      if (result.data) {
        setStoreData({
          storeName: result.data.storeName || storeData.storeName,
          storeEmail: result.data.storeEmail || storeData.storeEmail,
          storePhone: result.data.storePhone || storeData.storePhone,
          currency: result.data.currency || storeData.currency,
          timezone: result.data.timezone || storeData.timezone,
        });
      }

      setSuccess(result.message || 'Store settings updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update store settings');
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
    } catch {
      setError('Failed to update notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account and store preferences
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Profile Settings
          </h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-3">
          <div>
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="relative">
                <label
                  htmlFor="profile-image-upload"
                  className="block w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg cursor-pointer"
                  title={profileImagePreview ? 'Change Photo' : 'Upload Photo'}
                >
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
              </div>
              <label
                htmlFor="profile-image-upload"
                className="mt-3 flex items-center gap-2 text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Change Photo
              </label>
              <p className="text-xs text-gray-500 mt-1">Max size: 5MB. JPG, PNG, WEBP</p>
            </div>
          </div>

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
              placeholder="9841234567"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Enter 10-digit number starting with 9</p>
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Security Settings
          </h2>
        </div>

        <form onSubmit={handleSecuritySubmit} className="space-y-3">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Store Settings
          </h2>
        </div>

        <form onSubmit={handleStoreSubmit} className="space-y-3">
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
                <option value="NPR">NPR - Nepali Rupee</option>
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
