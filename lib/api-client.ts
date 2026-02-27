import axiosInstance from './axios';
import { AxiosResponse } from 'axios';
import { User } from '../types';

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
    [key: string]: T[] | any; // Allow other properties like pagination
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
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

  // User endpoints
  users: {
    getAll: (params?: { page?: number; limit?: number; role?: string; search?: string }) =>
      axiosInstance.get<PaginatedResponse<User>>('/api/users', { params }),
  },

  user: {
    updateProfile: (id: string, data: any) =>
      axiosInstance.put<ApiResponse>(`/api/users/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),

    getById: (id: string) =>
      axiosInstance.get<ApiResponse>(`/api/users/${id}`),
  },

  // Admin User Management
  adminUsers: {
    getAll: (params?: { page?: number; limit?: number }) =>
      axiosInstance.get<ApiResponse>('/api/admin/users', { params }),

    getById: (id: string) =>
      axiosInstance.get<ApiResponse>(`/api/admin/users/${id}`),

    create: (data: any) =>
      axiosInstance.post<ApiResponse>('/api/admin/users', data),

    update: (id: string, data: any) =>
      axiosInstance.put<ApiResponse>(`/api/admin/users/${id}`, data),

    delete: (id: string) =>
      axiosInstance.delete<ApiResponse>(`/api/admin/users/${id}`),
  },
};

export default apiClient;
