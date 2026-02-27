import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/actions/api/endpoints';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
}

export const register = async (data: RegisterData) => {
    const response = await axiosInstance.post<ApiResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
};

export const login = async (data: LoginData) => {
    const response = await axiosInstance.post<ApiResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
};

export const whoAmI = async () => {
    const response = await axiosInstance.get<ApiResponse>(API_ENDPOINTS.AUTH.ME);
    return response.data;
};



export const updateProfile = async (data: FormData) => {
    const response = await axiosInstance.put<ApiResponse>(API_ENDPOINTS.AUTH.ME, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const forgotPassword = async (email: string) => {
    const response = await axiosInstance.post<ApiResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
};

export const resetPassword = async (token: string, password: string) => {
    const response = await axiosInstance.post<ApiResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD(token), { password });
    return response.data;
};
