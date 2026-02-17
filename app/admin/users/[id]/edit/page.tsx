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

const editUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().optional(), // Password optional on edit
    role: z.enum(['customer', 'seller', 'superadmin']),
    phone: z.string().optional(),
    shopName: z.string().optional(),
    businessDescription: z.string().optional(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

export default function EditUserPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);

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
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setInitialLoading(false);
            }
        };

        if (id) fetchUser();
    }, [id, setValue]);

    const onSubmit = async (data: EditUserFormData) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            if (data.password) formData.append('password', data.password);
            formData.append('role', data.role);
            if (data.phone) formData.append('phone', data.phone);
            if (data.shopName) formData.append('shopName', data.shopName);
            if (data.businessDescription) formData.append('businessDescription', data.businessDescription);
            if (imageFile) formData.append('image', imageFile);

            await apiClient.adminUsers.update(id, formData);
            router.push('/admin/users');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div>Loading...</div>;

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
                                <Label htmlFor="password">Password (Leave blank to keep current)</Label>
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
                            Update User
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
