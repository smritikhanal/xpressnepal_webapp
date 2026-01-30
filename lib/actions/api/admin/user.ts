import axiosInstance from "../axios";
import { API_ENDPOINTS } from "../endpoints";

export const createUser = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.USERS.CREATE, data, {
             headers: {
                'Content-Type': 'multipart/form-data', // Important for FormData
            },
        });
        return {
            success: true,
            data: response.data,
            message: "User created successfully"
        };
    } catch (error: any) {
        // Axios interceptor might have already formatted this, but safety net:
        return {
            success: false,
            message: error.message || "Failed to create user",
            errors: error.errors 
        };
    }
};
