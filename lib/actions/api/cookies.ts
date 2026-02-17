import { cookies } from 'next/headers';

export async function getCookie(name: string): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
}

export async function setCookie(name: string, value: string, options: any = {}) {
    const cookieStore = await cookies();
    cookieStore.set(name, value, options);
}

export async function deleteCookie(name: string) {
    const cookieStore = await cookies();
    cookieStore.delete(name);
}
