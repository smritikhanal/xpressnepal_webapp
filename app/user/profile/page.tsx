'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { User, Mail, Phone, MapPin, ShoppingBag, Heart, Lock, LogOut, Store, Upload, Loader2, FileText, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiClient from '@/lib/api-client';
import Image from 'next/image';

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().optional(),
    shopName: z.string().optional(),
    businessDescription: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function UserProfilePage() {
    const router = useRouter();
    const { user, setUser, setAuth, clearAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const [showSellerModal, setShowSellerModal] = useState(false);

    // Image upload state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [sellerData, setSellerData] = useState({
        shopName: '',
        businessDescription: '',
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    // Initialize form with user data
    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        setValue('name', user.name);
        setValue('phone', user.phone || '');
        if (user.role === 'seller') {
            setValue('shopName', user.shopName || '');
            setValue('businessDescription', user.businessDescription || '');
        }
        if (user.image) {
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const imgUrl = user.image.startsWith('http') ? user.image : `${backendUrl}/${user.image}`;
            setImagePreview(imgUrl);
        }
    }, [user, router, setValue]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onProfileSubmit = async (data: ProfileFormData) => {
        if (!user) return;
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            if (data.phone) formData.append('phone', data.phone);
            if (data.shopName) formData.append('shopName', data.shopName);
            if (data.businessDescription) formData.append('businessDescription', data.businessDescription);
            if (imageFile) formData.append('image', imageFile);

            const response = await apiClient.user.updateProfile(user._id, formData);

            if (response.data.success) {
                const currentToken = useAuthStore.getState().token;
                if (currentToken && response.data.data) {
                    setAuth(response.data.data, currentToken);
                }
                setSuccess('Profile updated successfully!');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleBecomeSeller = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/become-seller', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(sellerData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowSellerModal(false);
                setSuccess('Successfully upgraded to seller account! Redirecting...');

                setUser({
                    ...user!,
                    role: 'seller',
                });

                setTimeout(() => {
                    router.push('/seller/dashboard');
                }, 1500);
            } else {
                setError(data.message || 'Failed to upgrade to seller');
                setLoading(false);
            }
        } catch (err) {
            console.error('Become seller error:', err);
            setError('An error occurred while upgrading to seller');
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearAuth();
        setTimeout(() => {
            window.location.replace('/auth/login');
        }, 100);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                    <p className="mt-2 text-gray-600">Manage your profile and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Profile" width={80} height={80} className="w-full h-full object-cover" unoptimized />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                            <User className="w-10 h-10 text-white" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                                    {user.role}
                                </span>

                                {/* Become Seller Button */}
                                {user.role === 'customer' && (
                                    <button
                                        onClick={() => setShowSellerModal(true)}
                                        className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
                                    >
                                        🚀 Become a Seller
                                    </button>
                                )}
                            </div>

                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <User className="w-5 h-5 mr-3" />
                                    Profile
                                </button>

                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'orders'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <ShoppingBag className="w-5 h-5 mr-3" />
                                    My Orders
                                </button>

                                <button
                                    onClick={() => setActiveTab('wishlist')}
                                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'wishlist'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Heart className="w-5 h-5 mr-3" />
                                    Wishlist
                                </button>

                                <button
                                    onClick={() => setActiveTab('addresses')}
                                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'addresses'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <MapPin className="w-5 h-5 mr-3" />
                                    Addresses
                                </button>

                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Lock className="w-5 h-5 mr-3" />
                                    Security
                                </button>

                                {user?.role === 'seller' && (
                                    <Link
                                        href="/seller/dashboard"
                                        className="w-full flex items-center px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    >
                                        <Store className="w-5 h-5 mr-3" />
                                        Seller Dashboard
                                    </Link>
                                )}

                                {(user?.role === 'admin' || user?.role === 'superadmin') && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="w-full flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        <LayoutDashboard className="w-5 h-5 mr-3" />
                                        Admin Dashboard
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Success/Error Messages */}
                        {success && (
                            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-green-600">{success}</p>
                            </div>
                        )}
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    Profile Information
                                </h2>

                                <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
                                    {/* Image Upload */}
                                    <div className="flex flex-col items-center space-y-4 mb-6">
                                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-100 flex items-center justify-center">
                                            {imagePreview ? (
                                                <Image src={imagePreview} alt="Profile" fill className="object-cover" unoptimized />
                                            ) : (
                                                <User className="w-12 h-12 text-gray-400" />
                                            )}
                                        </div>
                                        <Label htmlFor="image-upload" className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
                                            <Upload className="w-4 h-4" /> Change Photo
                                        </Label>
                                        <Input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input id="name" {...register('name')} className="pl-10" />
                                            </div>
                                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input value={user.email} disabled className="pl-10 bg-gray-50" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input id="phone" {...register('phone')} className="pl-10" />
                                            </div>
                                        </div>
                                    </div>

                                    {user.role === 'seller' && (
                                        <div className="space-y-6 pt-4 border-t border-gray-100">
                                            <h3 className="font-medium text-gray-900">Seller Information</h3>
                                            <div className="space-y-2">
                                                <Label htmlFor="shopName">Shop Name</Label>
                                                <div className="relative">
                                                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input id="shopName" {...register('shopName')} className="pl-10" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="businessDescription">Business Description</Label>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <textarea
                                                        id="businessDescription"
                                                        {...register('businessDescription')}
                                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <Button type="submit" disabled={loading} className="w-full md:w-auto px-8 bg-blue-600 hover:bg-blue-700">
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...
                                                </>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    My Orders
                                </h2>
                                <div className="text-center py-12">
                                    <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">View and manage your orders on the dedicated orders page.</p>
                                    <Link
                                        href="/orders"
                                        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        View All Orders
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    My Wishlist
                                </h2>
                                <div className="text-center py-12">
                                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">Your wishlist is empty</p>
                                    <Link
                                        href="/"
                                        className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Browse Products
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    Saved Addresses
                                </h2>
                                <div className="text-center py-12">
                                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No saved addresses</p>
                                    <button className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Add Address
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    Security Settings
                                </h2>
                                <p className="text-gray-600 mb-4">Change your password and manage security preferences.</p>
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <Lock className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Feature currently unavailable</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Become Seller Modal */}
            {showSellerModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Become a Seller
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start selling your products on XpressNepal. Fill in your shop details to get started.
                        </p>

                        <form onSubmit={handleBecomeSeller} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Shop Name *
                                </label>
                                <input
                                    type="text"
                                    value={sellerData.shopName}
                                    onChange={(e) =>
                                        setSellerData({ ...sellerData, shopName: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter your shop name"
                                    required
                                    minLength={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Description
                                </label>
                                <textarea
                                    value={sellerData.businessDescription}
                                    onChange={(e) =>
                                        setSellerData({
                                            ...sellerData,
                                            businessDescription: e.target.value,
                                        })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Describe your business (optional)"
                                    maxLength={500}
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowSellerModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Continue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
