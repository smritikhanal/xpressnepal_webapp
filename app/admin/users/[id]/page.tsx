'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Correct import for App Router
import apiClient from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Mail, Phone, Calendar, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Use React.use() or await searchParams if needed in future Next headers, 
// but for client components useParams is correct.

export default function UserDetailsPage() {
    const { id } = useParams() as { id: string };
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.adminUsers.getById(id);
                if (response.data.success) {
                    setUser(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUser();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const imageUrl = user.image ? (user.image.startsWith('http') ? user.image : `${backendUrl}/${user.image}`) : null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/admin/users" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
                </Link>
                <Link href={`/admin/users/${id}/edit`}>
                    <Button>
                        <Edit className="mr-2 h-4 w-4" /> Edit User
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>User Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center mb-6">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-100 flex items-center justify-center">
                                {imageUrl ? (
                                    <Image src={imageUrl} alt={user.name} fill className="object-cover" unoptimized />
                                ) : (
                                    <UserIcon className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] gap-4">
                            <div className="text-sm font-medium text-gray-500">Name</div>
                            <div className="text-sm font-semibold">{user.name}</div>

                            <div className="text-sm font-medium text-gray-500">Email</div>
                            <div className="text-sm">{user.email}</div>

                            <div className="text-sm font-medium text-gray-500">Role</div>
                            <div className="text-sm capitalize">{user.role}</div>

                            <div className="text-sm font-medium text-gray-500">Phone</div>
                            <div className="text-sm">{user.phone || 'N/A'}</div>

                            <div className="text-sm font-medium text-gray-500">Joined</div>
                            <div className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</div>
                        </div>
                    </CardContent>
                </Card>

                {user.role === 'seller' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Seller Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                <div className="text-sm font-medium text-gray-500">Shop Name</div>
                                <div className="text-sm font-semibold">{user.shopName || 'N/A'}</div>

                                <div className="text-sm font-medium text-gray-500">Description</div>
                                <div className="text-sm">{user.businessDescription || 'N/A'}</div>

                                <div className="text-sm font-medium text-gray-500">Status</div>
                                <div className="text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isSellerActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.isSellerActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
