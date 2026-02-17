import axiosInstance from './axios';
import { AxiosResponse } from 'axios';

/**
 * Generic API Response Type
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Pagination Response Type
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    [key: string]: any;
  };
}

/**
 * Admin Users Paginated Response Type
 */
export interface AdminUsersPaginatedResponse<T = any> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T;
}

/**
 * API Client Helper Functions
 */
export const apiClient = {
  // Auth endpoints
  auth: {
    register: (data: { name: string; email: string; password: string; phone?: string }) =>
      axiosInstance.post<ApiResponse>('/api/auth/register', data),

    login: (data: { email: string; password: string }) =>
      axiosInstance.post<ApiResponse>('/api/auth/login', data),

    getMe: () =>
      axiosInstance.get<ApiResponse>('/api/auth/me'),

    forgotPassword: (email: string) =>
      axiosInstance.post<ApiResponse>('/api/auth/forgot-password', { email }),

    resetPassword: (token: string, password: string) =>
      axiosInstance.post<ApiResponse>('/api/auth/reset-password', { token, password }),
  },

  // Product endpoints
  products: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      search?: string;
      sort?: string;
    }) =>
      axiosInstance.get<PaginatedResponse<any>>('/api/products', { params }),

    getBySlug: (slug: string) =>
      axiosInstance.get<ApiResponse>(`/api/products/${slug}`),

    create: (data: any) =>
      axiosInstance.post<ApiResponse>('/api/products', data),

    update: (id: string, data: any) =>
      axiosInstance.put<ApiResponse>(`/api/products/id/${id}`, data),

    delete: (id: string) =>
      axiosInstance.delete<ApiResponse>(`/api/products/id/${id}`),
  },

  // Category endpoints
  categories: {
    getAll: (params?: { page?: number; limit?: number }) =>
      axiosInstance.get<PaginatedResponse<any>>('/api/categories', { params }),

    getBySlug: (slug: string) =>
      axiosInstance.get<ApiResponse>(`/api/categories/${slug}`),

    create: (data: any) =>
      axiosInstance.post<ApiResponse>('/api/categories', data),

    update: (id: string, data: any) =>
      axiosInstance.put<ApiResponse>(`/api/categories/id/${id}`, data),

    delete: (id: string) =>
      axiosInstance.delete<ApiResponse>(`/api/categories/id/${id}`),
  },

  // Cart endpoints
  cart: {
    get: () =>
      axiosInstance.get<ApiResponse>('/api/cart'),

    add: (data: { productId: string; quantity: number }) =>
      axiosInstance.post<ApiResponse>('/api/cart/add', data),

    update: (data: { productId: string; quantity: number }) =>
      axiosInstance.put<ApiResponse>('/api/cart/update', data),

    remove: (productId: string) =>
      axiosInstance.delete<ApiResponse>(`/api/cart/remove/${productId}`),

    clear: () =>
      axiosInstance.delete<ApiResponse>('/api/cart/clear'),
  },

  // Order endpoints
  orders: {
    create: (data: { shippingAddressId: string; paymentMethod: string; notes?: string }) =>
      axiosInstance.post<ApiResponse>('/api/orders', data),

    getMyOrders: () =>
      axiosInstance.get<ApiResponse>('/api/orders'),

    getById: (id: string) =>
      axiosInstance.get<ApiResponse>(`/api/orders/${id}`),

    updateStatus: (id: string, status: string) =>
      axiosInstance.put<ApiResponse>(`/api/orders/${id}/status`, { status }),

    getAll: () =>
      axiosInstance.get<ApiResponse>('/api/orders/admin/all'),
  },

  // Address endpoints
  addresses: {
    getAll: () =>
      axiosInstance.get<ApiResponse>('/api/addresses'),

    add: (data: any) =>
      axiosInstance.post<ApiResponse>('/api/addresses', data),

    update: (id: string, data: any) =>
      axiosInstance.put<ApiResponse>(`/api/addresses/${id}`, data),

    delete: (id: string) =>
      axiosInstance.delete<ApiResponse>(`/api/addresses/${id}`),
  },

  // Review endpoints
  reviews: {
    getProductReviews: (productId: string) =>
      axiosInstance.get<ApiResponse>(`/api/reviews/${productId}`),

    create: (data: { productId: string; rating: number; comment: string }) =>
      axiosInstance.post<ApiResponse>('/api/reviews', data),

    delete: (id: string) =>
      axiosInstance.delete<ApiResponse>(`/api/reviews/${id}`),
  },

  // Wishlist endpoints
  wishlist: {
    get: () =>
      axiosInstance.get<ApiResponse>('/api/wishlist'),

    add: (productId: string) =>
      axiosInstance.post<ApiResponse>('/api/wishlist/add', { productId }),

    remove: (productId: string) =>
      axiosInstance.delete<ApiResponse>(`/api/wishlist/remove/${productId}`),
  },

  // Admin User endpoints
  adminUsers: {
    getAll: (params?: { page?: number; limit?: number }) =>
      axiosInstance.get<AdminUsersPaginatedResponse>('/api/admin/users', { params }),

    getById: (id: string) =>
      axiosInstance.get<ApiResponse>(`/api/admin/users/${id}`),

    create: (data: FormData) =>
      axiosInstance.post<ApiResponse>('/api/admin/users', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),

    update: (id: string, data: FormData) =>
      axiosInstance.put<ApiResponse>(`/api/admin/users/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),

    delete: (id: string) =>
      axiosInstance.delete<ApiResponse>(`/api/admin/users/${id}`),
  },

  // User Profile endpoints
  user: {
    updateProfile: (id: string, data: FormData) =>
      axiosInstance.put<ApiResponse>(`/api/auth/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
  },

  // Notification endpoints
  notifications: {
    getAll: (params?: { page?: number; limit?: number }) =>
      axiosInstance.get<ApiResponse>('/api/notifications', { params }),

    markAsRead: (id: string) =>
      axiosInstance.put<ApiResponse>(`/api/notifications/${id}/read`),

    markAllAsRead: () =>
      axiosInstance.put<ApiResponse>('/api/notifications/read-all'),

    delete: (id: string) =>
      axiosInstance.delete<ApiResponse>(`/api/notifications/${id}`),
  }
};

export default apiClient;
