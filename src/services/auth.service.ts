// src/services/authService.ts
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

// Token management
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

// Login function
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", credentials);

    // Store token and user in localStorage
    setToken(response.data.token);
    setUser(response.data.user);

    // Show success notification
    notifications.show({
      title: "Login Successful",
      message: `Welcome back, ${response.data.user.name}!`,
      color: "green",
      icon: React.createElement(Check, { size: 16 }),
    });

    return response.data;
  } catch (error) {
    // Error notification is handled by api interceptor
    throw error;
  }
};

// Register function
export const register = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/register", userData);

    // Store token and user in localStorage
    setToken(response.data.token);
    setUser(response.data.user);

    // Show success notification
    notifications.show({
      title: "Registration Successful",
      message: `Welcome, ${response.data.user.name}!`,
      color: "green",
      icon: React.createElement(Check, { size: 16 }),
    });

    return response.data;
  } catch (error) {
    // Error notification is handled by api interceptor
    throw error;
  }
};

// Logout function
export const logout = (): void => {
  clearAuth();

  // Show success notification
  notifications.show({
    title: "Logout Successful",
    message: "You have been logged out",
    color: "green",
    icon: React.createElement(Check, { size: 16 }),
  });
};

// Get current user function
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

// Get user profile from API
export const fetchUserProfile = async (): Promise<User> => {
  try {
    const response = await api.get("/auth/profile");

    // Update stored user
    setUser(response.data.user);

    return response.data.user;
  } catch (error) {
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === "admin";
};

// Update user profile
export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put("/auth/profile", userData);

    // Update stored user
    setUser(response.data.user);

    // Show success notification
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

// Update address
export const updateAddress = async (
  addressId: string,
  addressData: Partial<Address>
): Promise<User> => {
  try {
    const response = await api.put(`/auth/address/${addressId}`, addressData);

    // Update stored user with new address information
    setUser(response.data.user);

    // Show success notification
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

// Delete address
export const deleteAddress = async (addressId: string): Promise<User> => {
  try {
    const response = await api.delete(`/auth/address/${addressId}`);

    // Update stored user without the deleted address
    setUser(response.data.user);

    // Show success notification
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

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.post("/auth/change-password", { currentPassword, newPassword });

    // Show success notification
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

// Request password reset
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await api.post("/auth/forgot-password", { email });

    // Show success notification
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

// Reset password with token
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.post("/auth/reset-password", { token, newPassword });

    // Show success notification
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

// Verify email with token
export const verifyEmail = async (token: string): Promise<void> => {
  try {
    await api.post("/auth/verify-email", { token });

    // Show success notification
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

// Export default object
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
