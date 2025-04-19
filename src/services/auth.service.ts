import api from "./api";
import { notifications } from "@mantine/notifications";
import { Check, X } from "lucide-react";
import React from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  created_at: string;
  updated_at?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const TOKEN_KEY = "auth-token";
const USER_KEY = "auth-user";

const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const setUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", credentials);

    setToken(response.data.token);
    setUser(response.data.user);
    notifications.show({
      title: "Login Successful",
      message: `Welcome back, ${response.data.user.name}!`,
      color: "green",
      icon: React.createElement(Check, { size: 16 }),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/register", userData);
    setToken(response.data.token);
    setUser(response.data.user);

    notifications.show({
      title: "Registration Successful",
      message: `Welcome, ${response.data.user.name}!`,
      color: "green",
      icon: React.createElement(Check, { size: 16 }),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = (): void => {
  clearAuth();
  notifications.show({
    title: "Logout Successful",
    message: "You have been logged out",
    color: "green",
    icon: React.createElement(Check, { size: 16 }),
  });
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

export const fetchUserProfile = async (): Promise<User> => {
  try {
    const response = await api.get("/auth/profile");
    setUser(response.data.user);
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === "admin";
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put("/auth/profile", userData);
    setUser(response.data.user);
    notifications.show({
      title: "Profile Updated",
      message: "Your profile has been updated successfully",
      color: "green",
      icon: React.createElement(Check, { size: 16 }),
    });

    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const updateAddress = async (
  addressId: string,
  addressData: Partial<Address>
): Promise<User> => {
  try {
    const response = await api.put(`/auth/address/${addressId}`, addressData);
    setUser(response.data.user);
    notifications.show({
      title: "Address Updated",
      message: "Your address has been updated successfully",
      color: "green",
      icon: React.createElement(Check, { size: 16 }),
    });

    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const deleteAddress = async (addressId: string): Promise<User> => {
  try {
    const response = await api.delete(`/auth/address/${addressId}`);
    setUser(response.data.user);
    notifications.show({
      title: "Address Deleted",
      message: "Your address has been deleted successfully",
      color: "green",
      icon: React.createElement(Check, { size: 16 }),
    });

    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.post("/auth/change-password", { currentPassword, newPassword });
    notifications.show({
      title: "Password Changed",
      message: "Your password has been changed successfully",
      color: "green",
      icon: React.createElement(Check, { size: 16 }),
    });
  } catch (error) {
    throw error;
  }
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await api.post("/auth/forgot-password", { email });
    notifications.show({
      title: "Reset Email Sent",
      message: "Check your email for password reset instructions",
      color: "green",
      icon: React.createElement(Check, { size: 16 }),
    });
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.post("/auth/reset-password", { token, newPassword });
    notifications.show({
      title: "Password Reset",
      message: "Your password has been reset successfully",
      color: "green",
      icon: React.createElement(Check, { size: 16 }),
    });
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (token: string): Promise<void> => {
  try {
    await api.post("/auth/verify-email", { token });
    notifications.show({
      title: "Email Verified",
      message: "Your email has been verified successfully",
      color: "green",
      icon: React.createElement(Check, { size: 16 }),
    });
  } catch (error) {
    throw error;
  }
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  fetchUserProfile,
  isAuthenticated,
  isAdmin,
  updateProfile,
  updateAddress,
  deleteAddress,
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
};

export default authService;
