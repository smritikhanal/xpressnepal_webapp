export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        UPDATE_PROFILE: (id: string) => `/auth/${id}`,
    },
    ADMIN: {
        USERS: {
            CREATE: '/admin/users',
            LIST: '/admin/users',
            UPDATE: (id: string) => `/admin/users/${id}`,
            DELETE: (id: string) => `/admin/users/${id}`,
        }
    }
};
