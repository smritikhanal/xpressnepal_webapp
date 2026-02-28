'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiClient from '@/lib/api-client';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const createUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['customer', 'seller', 'superadmin']),
    phone: z.string().optional(),
    shopName: z.string().optional(),
    businessDescription: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function CreateUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            role: 'customer',
        },
    });

    const role = watch('role');

    const onSubmit = async (data: CreateUserFormData) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('role', data.role);
            if (data.phone) formData.append('phone', data.phone);
            if (data.shopName) formData.append('shopName', data.shopName);
            if (data.businessDescription) formData.append('businessDescription', data.businessDescription);
            if (imageFile) formData.append('image', imageFile);

            await apiClient.adminUsers.create(formData);
            router.push('/admin/users');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Link href="/admin/users" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
            </Link>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Create New User</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div className="space-y-2">
                            <Label>Profile Image</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            />
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
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" {...register('password')} />
                                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" {...register('phone')} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select onValueChange={(val: any) => setValue('role', val)} defaultValue="customer">
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
                                    <Label htmlFor="shopName">Shop Name</Label>
                                    <Input id="shopName" {...register('shopName')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="businessDescription">Business Description</Label>
                                    <textarea
                                        id="businessDescription"
                                        {...register('businessDescription')}
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            </>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Create User
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
