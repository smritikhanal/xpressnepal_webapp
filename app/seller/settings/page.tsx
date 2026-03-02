'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import { Bell, Lock, User, Store } from 'lucide-react';

export default function SellerSettingsPage() {
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);

  // Account Settings
  const [accountData, setAccountData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Validation errors
  const [accountErrors, setAccountErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [securityErrors, setSecurityErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [shopErrors, setShopErrors] = useState({
    shopName: '',
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setAccountData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setShopData({
        ...shopData,
        shopName: user.shopName || '',
      });
    }
  }, [user]);

  // Security Settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    newMessages: true,
    productReviews: true,
    lowStock: true,
    weeklyReports: false,
  });

  // Shop Settings
  const [shopData, setShopData] = useState({
    shopName: '',
    businessType: 'individual',
    country: 'NP',
    currency: 'NPR',
    timezone: 'Asia/Kathmandu',
  });

  // Validation functions
  const validateAccountData = () => {
    const errors = {
      name: '',
      email: '',
      phone: '',
    };

    let isValid = true;

    // Name validation
    if (!accountData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    } else if (accountData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Email validation
    if (!accountData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation (10 digits for Nepal)
    if (!accountData.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(accountData.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
      isValid = false;
    }

    setAccountErrors(errors);
    return isValid;
  };

  const validateSecurityData = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    let isValid = true;

    // Current password validation
    if (!securityData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }

    // New password validation
    if (!securityData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (securityData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(securityData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
      isValid = false;
    }

    // Confirm password validation
    if (!securityData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (securityData.newPassword !== securityData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setSecurityErrors(errors);
    return isValid;
  };

  const validateShopData = () => {
    const errors = {
      shopName: '',
    };

    let isValid = true;

    // Shop name validation
    if (!shopData.shopName.trim()) {
      errors.shopName = 'Shop name is required';
      isValid = false;
    } else if (shopData.shopName.trim().length < 3) {
      errors.shopName = 'Shop name must be at least 3 characters';
      isValid = false;
    }

    setShopErrors(errors);
    return isValid;
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAccountData()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(accountData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        toast({
          title: 'Success',
          description: 'Account settings updated successfully!',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to update account',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSecurityData()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    // TODO: API call to update password
    setTimeout(() => {
      setLoading(false);
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({
        title: 'Success',
        description: 'Password changed successfully!',
        variant: 'default',
      });
    }, 1000);
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: API call to update notification preferences
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Success',
        description: 'Notification preferences saved!',
        variant: 'default',
      });
    }, 1000);
  };

  const handleShopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateShopData()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shopName: shopData.shopName }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        toast({
          title: 'Success',
          description: 'Shop settings updated successfully!',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to update shop settings',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating shop settings:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating shop settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'shop', label: 'Shop Settings', icon: Store },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account and shop preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <form onSubmit={handleAccountSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={accountData.name}
                      onChange={(e) => {
                        setAccountData({ ...accountData, name: e.target.value });
                        setAccountErrors({ ...accountErrors, name: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        accountErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {accountErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{accountErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={accountData.email}
                      onChange={(e) => {
                        setAccountData({ ...accountData, email: e.target.value });
                        setAccountErrors({ ...accountErrors, email: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        accountErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {accountErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{accountErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={accountData.phone}
                      onChange={(e) => {
                        setAccountData({ ...accountData, phone: e.target.value });
                        setAccountErrors({ ...accountErrors, phone: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        accountErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="9800000000"
                    />
                    {accountErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{accountErrors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handleSecuritySubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Change Password
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={securityData.currentPassword}
                      onChange={(e) => {
                        setSecurityData({
                          ...securityData,
                          currentPassword: e.target.value,
                        });
                        setSecurityErrors({ ...securityErrors, currentPassword: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        securityErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter current password"
                    />
                    {securityErrors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{securityErrors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) => {
                        setSecurityData({ ...securityData, newPassword: e.target.value });
                        setSecurityErrors({ ...securityErrors, newPassword: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        securityErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter new password"
                    />
                    {securityErrors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{securityErrors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => {
                        setSecurityData({
                          ...securityData,
                          confirmPassword: e.target.value,
                        });
                        setSecurityErrors({ ...securityErrors, confirmPassword: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        securityErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm new password"
                    />
                    {securityErrors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{securityErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setNotifications({ ...notifications, [key]: !value })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </form>
          )}

          {/* Shop Settings Tab */}
          {activeTab === 'shop' && (
            <form onSubmit={handleShopSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Shop Configuration
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shop Name
                    </label>
                    <input
                      type="text"
                      value={shopData.shopName}
                      onChange={(e) => {
                        setShopData({ ...shopData, shopName: e.target.value });
                        setShopErrors({ ...shopErrors, shopName: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        shopErrors.shopName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="My Awesome Shop"
                    />
                    {shopErrors.shopName && (
                      <p className="text-red-500 text-sm mt-1">{shopErrors.shopName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type
                    </label>
                    <select
                      value={shopData.businessType}
                      onChange={(e) =>
                        setShopData({ ...shopData, businessType: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="individual">Individual</option>
                      <option value="company">Company</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={shopData.country}
                      onChange={(e) =>
                        setShopData({ ...shopData, country: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="NP">Nepal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={shopData.currency}
                      onChange={(e) =>
                        setShopData({ ...shopData, currency: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="NPR">NPR - Nepali Rupee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={shopData.timezone}
                      onChange={(e) =>
                        setShopData({ ...shopData, timezone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Asia/Kathmandu">Asia/Kathmandu (NPT)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
