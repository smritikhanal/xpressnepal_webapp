
import axiosInstance from "../axios";

export const handleLogin = async (data: any) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", data);
    return {
      success: true,
      message: "Login successful",
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Login failed",
    };
  }
};

export const handleRegister = async (data: any) => {
  try {
    const response = await axiosInstance.post("/api/auth/register", data);
    return {
      success: true,
      message: "Registration successful",
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Registration failed",
    };
  }
};
