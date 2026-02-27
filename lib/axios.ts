import axios from 'axios';

/**
 * Axios instance with base configuration
 * Includes automatic token attachment and error handling
 */
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from localStorage (client-side) or cookies (server-side)
    let token: string | undefined;

    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || undefined;
    } else {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
