import api from "./api"
import { notifications } from "@mantine/notifications"
import { Check, X } from "lucide-react"
import React from "react"

export interface User {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  created_at: string
  updated_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Login function
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", credentials)

    // Store token and user in localStorage
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Login Successful",
      message: `Welcome back, ${response.data.user.name}!`,
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return response.data
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Login Failed",
      message: error.response?.data?.message || "Invalid credentials",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Register function
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/register", userData)

    // Store token and user in localStorage
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Registration Successful",
      message: `Welcome, ${response.data.user.name}!`,
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return response.data
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Registration Failed",
      message: error.response?.data?.message || "Could not create account",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Logout function
export const logout = (): void => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")

  // Show success notification
  const CheckIcon = Check
  notifications.show({
    title: "Logout Successful",
    message: "You have been logged out",
    color: "green",
    icon: React.createElement(CheckIcon),
  })
}

// Get current user function
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (error) {
    console.error("Error parsing user from localStorage:", error)
    return null
  }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token")
}

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser()
  return user?.role === "admin"
}

// Update user profile
export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put("/auth/profile", userData)

    // Update user in localStorage
    const updatedUser = response.data.user
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Profile Updated",
      message: "Your profile has been updated successfully",
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return updatedUser
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Update Failed",
      message: error.response?.data?.message || "Could not update profile",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Change password
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    await api.post("/auth/change-password", { currentPassword, newPassword })

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Password Changed",
      message: "Your password has been changed successfully",
      color: "green",
      icon: React.createElement(CheckIcon),
    })
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Password Change Failed",
      message: error.response?.data?.message || "Could not change password",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Request password reset
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await api.post("/auth/forgot-password", { email })

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Reset Email Sent",
      message: "Check your email for password reset instructions",
      color: "green",
      icon: React.createElement(CheckIcon),
    })
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Request Failed",
      message: error.response?.data?.message || "Could not send reset email",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Reset password with token
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    await api.post("/auth/reset-password", { token, newPassword })

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Password Reset",
      message: "Your password has been reset successfully",
      color: "green",
      icon: React.createElement(CheckIcon),
    })
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Reset Failed",
      message: error.response?.data?.message || "Could not reset password",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Verify account with token
export const verifyAccount = async (token: string): Promise<void> => {
  try {
    await api.post("/auth/verify", { token })

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Account Verified",
      message: "Your account has been verified successfully",
      color: "green",
      icon: React.createElement(CheckIcon),
    })
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Verification Failed",
      message: error.response?.data?.message || "Could not verify account",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Export default object for components that prefer it
const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyAccount,
}

export default authService

