"use server";
import { cookies } from 'next/headers';

export async function setAuthToken(token: string) {
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
}

export async function setUserData(data: any) {
    const cookieStore = await cookies();
    cookieStore.set('user', JSON.stringify(data), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
}

export async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value;
}

export async function getUserData() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user')?.value;
    return userCookie ? JSON.parse(userCookie) : null;
}

export async function clearAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    cookieStore.delete('user');
}
