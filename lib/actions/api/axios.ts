import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getCookie } from './cookies'; // Assuming this exists based on file list

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookies
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // You might want to retrieve token from cookies/session here if needed manually
        // const token = await getCookie('accessToken'); 
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response; // Return the full response so we can access status, data etc.
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Implement refresh token logic or redirect to login
            // For now, we propagate the error or handle it as per "rules" (which are missing)
        }

        // Format error for UI
        if (error.response?.data) {
             return Promise.reject(error.response.data);
        }

        return Promise.reject({
            message: error.message || 'An unexpected error occurred',
            statusCode: error.response?.status || 500
        });
    }
);

export default axiosInstance;
