'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'; // zod
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiClient from '@/lib/api-client';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const editUserSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    email: z.string()
        .email('Invalid email address')
        .max(100, 'Email must not exceed 100 characters'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must not exceed 100 characters')
        .optional()
        .or(z.literal('')), // Allow empty string for no password change
    role: z.enum(['customer', 'seller', 'superadmin'], {
        errorMap: () => ({ message: 'Please select a valid role' })
    }),
    phone: z.string()
        .regex(/^(\+977)?[9][0-9]{9}$/, 'Invalid phone number (must be 10 digits starting with 9)')
        .optional()
        .or(z.literal('')),
    shopName: z.string()
        .min(2, 'Shop name must be at least 2 characters')
        .max(100, 'Shop name must not exceed 100 characters')
        .optional()
        .or(z.literal('')),
    businessDescription: z.string()
        .min(10, 'Business description must be at least 10 characters')
        .max(500, 'Business description must not exceed 500 characters')
        .optional()
        .or(z.literal('')),
}).refine((data) => {
    // If role is seller, require shop name
    if (data.role === 'seller' && !data.shopName?.trim()) {
        return false;
    }
    return true;
}, {
    message: 'Shop name is required for sellers',
    path: ['shopName'],
});

type EditUserFormData = z.infer<typeof editUserSchema>;

export default function EditUserPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<EditUserFormData>({
        resolver: zodResolver(editUserSchema),
    });

    const role = watch('role');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.adminUsers.getById(id);
                if (response.data.success) {
                    const u = response.data.data;
                    setValue('name', u.name);
                    setValue('email', u.email);
                    setValue('role', u.role);
                    setValue('phone', u.phone || '');
                    if (u.role === 'seller') {
                        setValue('shopName', u.shopName || '');
                        setValue('businessDescription', u.businessDescription || '');
                    }
                } else {
                    toast.error('Failed to load user data');
                    router.push('/admin/users');
                }
            } catch (error: any) {
                console.error('Failed to fetch user:', error);
                toast.error('Failed to load user. Redirecting...');
                setTimeout(() => {
                    router.push('/admin/users');
                }, 1500);
            } finally {
                setInitialLoading(false);
            }
        };

        if (id) fetchUser();
    }, [id, setValue, router]);

    const onSubmit = async (data: EditUserFormData) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', data.name.trim());
            formData.append('email', data.email.trim().toLowerCase());
            
            // Only include password if it's provided and not empty
            if (data.password && data.password.trim()) {
                formData.append('password', data.password);
            }
            
            formData.append('role', data.role);
            
            if (data.phone && data.phone.trim()) {
                formData.append('phone', data.phone.trim());
            }
            
            // Add seller-specific fields
            if (data.role === 'seller') {
                if (data.shopName && data.shopName.trim()) {
                    formData.append('shopName', data.shopName.trim());
                }
                if (data.businessDescription && data.businessDescription.trim()) {
                    formData.append('businessDescription', data.businessDescription.trim());
                }
            }
            
            if (imageFile) {
                // Validate image file size (max 5MB)
                if (imageFile.size > 5 * 1024 * 1024) {
                    toast.error('Image size must be less than 5MB');
                    setLoading(false);
                    return;
                }
                
                // Validate image file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (!allowedTypes.includes(imageFile.type)) {
                    toast.error('Only JPG, PNG, and WEBP images are allowed');
                    setLoading(false);
                    return;
                }
                
                formData.append('image', imageFile);
            }

            const response = await apiClient.adminUsers.update(id, formData);
            
            if (response.data.success) {
                toast.success('User updated successfully!');
                // Redirect after a short delay to allow user to see the success message
                setTimeout(() => {
                    router.push('/admin/users');
                }, 1000);
            } else {
                toast.error(response.data.message || 'Failed to update user');
            }
        } catch (error: any) {
            console.error('Update user error:', error);
            
            // Handle specific error cases
            if (error.response?.status === 409) {
                toast.error('Email already exists. Please use a different email.');
            } else if (error.response?.status === 400) {
                toast.error(error.response?.data?.message || 'Invalid data provided');
            } else if (error.response?.status === 404) {
                toast.error('User not found');
            } else if (error.response?.status === 403) {
                toast.error('You do not have permission to update this user');
            } else {
                toast.error(error.response?.data?.message || 'Failed to update user. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Link href="/admin/users" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
            </Link>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit User</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div className="space-y-2">
                            <Label>Profile Image</Label>
                            <Input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setImageFile(file);
                                    
                                    // Create preview
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setImagePreview(reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                    } else {
                                        setImagePreview(null);
                                    }
                                }}
                            />
                            <p className="text-xs text-gray-500">Max size: 5MB. Formats: JPG, PNG, WEBP</p>
                            {imagePreview && (
                                <div className="mt-2">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="w-32 h-32 object-cover rounded-lg border border-gray-200" 
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" {...register('name')} />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" {...register('email')} />
                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password (Leave blank to keep current)</Label>
                                <Input id="password" type="password" {...register('password')} placeholder="Enter new password" />
                                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" {...register('phone')} placeholder="+977 9XXXXXXXXX" />
                                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select onValueChange={(val: any) => setValue('role', val)} defaultValue={role}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="customer">Customer</SelectItem>
                                    <SelectItem value="seller">Seller</SelectItem>
                                    <SelectItem value="superadmin">Super Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {role === 'seller' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="shopName">Shop Name <span className="text-red-500">*</span></Label>
                                    <Input id="shopName" {...register('shopName')} placeholder="Enter shop name" />
                                    {errors.shopName && <p className="text-sm text-red-500">{errors.shopName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="businessDescription">Business Description</Label>
                                    <textarea
                                        id="businessDescription"
                                        {...register('businessDescription')}
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Describe your business (optional)"
                                    />
                                    {errors.businessDescription && <p className="text-sm text-red-500">{errors.businessDescription.message}</p>}
                                </div>
                            </>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Update User
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
