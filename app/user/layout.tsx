'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !user) {
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
                localStorage.clear();
                window.location.replace('/auth/login');
            }
        }
    }, [user, mounted]);

    if (!mounted || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Simple Header for User Dashboard */}
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold text-primary">XpressNepal</Link>
                    <nav className="space-x-4">
                        <Link href="/" className="text-gray-600 hover:text-primary">Home</Link>
                        <Link href="/user/profile" className="text-gray-600 hover:text-primary font-semibold">Profile</Link>
                        <Link href="/orders" className="text-gray-600 hover:text-primary">Orders</Link>
                    </nav>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
    );
}
