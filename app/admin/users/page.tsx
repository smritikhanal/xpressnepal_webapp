'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await apiClient.adminUsers.getAll({ page, limit });
                console.log('Users response:', response.data);
                if (response.data.success) {
                    setUsers(Array.isArray(response.data.data) ? response.data.data : []);
                    setTotalPages(response.data.pages || 1);
                    setTotalUsers(response.data.total || 0);
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [page, limit]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await apiClient.adminUsers.delete(id);
            setUsers(users.filter(u => u._id !== id));
        } catch (error) {
            toast.error('Failed to delete user');
        }
    }

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };
    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <Link href="/admin/users/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg bg-white shadow-xs">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">No users found.</TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/users/${user._id}`)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/users/${user._id}/edit`)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(user._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center p-4">
                    <span>Page {page} of {totalPages} | Total Users: {totalUsers}</span>
                    <div className="space-x-2">
                        <Button variant="outline" onClick={handlePrev} disabled={page === 1}>&lt;</Button>
                        <Button variant="outline" onClick={handleNext} disabled={page === totalPages}>&gt;</Button>
                    </div>
                </div>
            </div>
           </div> 
    );
}
