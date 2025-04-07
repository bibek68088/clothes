import api from "./api"
import { notifications } from "@mantine/notifications"
import { Check, X } from "lucide-react"
import React from "react"

// User interface
export interface User {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  created_at: string
  updated_at?: string
}

// Product interface
export interface Product {
  id: string
  name: string
  price: number
  description?: string
  image_url?: string
  category?: string
  stock_quantity?: number
  colors?: string[]
  sizes?: string[]
  created_at?: string
  updated_at?: string
}

// Order interface
export interface Order {
  id: string
  user_id: string
  status: string
  total_amount: number
  items?: any[]
  shipping_address?: any
  payment_method?: string
  created_at: string
  updated_at?: string
}

// Pagination interface
export interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

// Response interfaces
export interface UsersResponse {
  users: User[]
  pagination: PaginationData
}

export interface ProductsResponse {
  products: Product[]
  pagination: PaginationData
}

export interface OrdersResponse {
  orders: Order[]
  pagination: PaginationData
}

// User management
export const getUsers = async (page = 1, limit = 10, search?: string, role?: string): Promise<UsersResponse> => {
  try {
    const params: Record<string, any> = { page, limit }
    if (search) params.search = search
    if (role) params.role = role

    const response = await api.get("/admin/users", params)
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export const createUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.post("/admin/users", userData)

    notifications.show({
      title: "Success",
      message: `User ${userData.name} created successfully`,
      color: "green",
      icon: React.createElement(Check),
    })

    return response.data.user
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to create user",
      color: "red",
      icon: React.createElement(X),
    })
    throw error
  }
}

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData)

    notifications.show({
      title: "Success",
      message: `User ${userData.name} updated successfully`,
      color: "green",
      icon: React.createElement(Check),
    })

    return response.data.user
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to update user",
      color: "red",
      icon: React.createElement(X),
    })
    throw error
  }
}

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await api.delete(`/admin/users/${userId}`)

    notifications.show({
      title: "Success",
      message: "User deleted successfully",
      color: "green",
      icon: React.createElement(Check),
    })
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to delete user",
      color: "red",
      icon: React.createElement(X),
    })
    throw error
  }
}

// Product management
export const getProducts = async (
  page = 1,
  limit = 10,
  search?: string,
  category?: string,
): Promise<ProductsResponse> => {
  try {
    const params: Record<string, any> = { page, limit }
    if (search) params.search = search
    if (category) params.category = category

    const response = await api.get("/admin/products", params)
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  try {
    const response = await api.post("/admin/products", productData)

    notifications.show({
      title: "Success",
      message: `Product ${productData.name} created successfully`,
      color: "green",
      icon: React.createElement(Check),
    })

    return response.data.product
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to create product",
      color: "red",
      icon: React.createElement(X),
    })
    throw error
  }
}

export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<Product> => {
  try {
    const response = await api.put(`/admin/products/${productId}`, productData)

    notifications.show({
      title: "Success",
      message: `Product ${productData.name} updated successfully`,
      color: "green",
      icon: React.createElement(Check),
    })

    return response.data.product
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to update product",
      color: "red",
      icon: React.createElement(X),
    })
    throw error
  }
}

export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    await api.delete(`/admin/products/${productId}`)

    notifications.show({
      title: "Success",
      message: "Product deleted successfully",
      color: "green",
      icon: React.createElement(Check),
    })
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to delete product",
      color: "red",
      icon: React.createElement(X),
    })
    throw error
  }
}

// Order management
export const getOrders = async (page = 1, limit = 10, status?: string): Promise<OrdersResponse> => {
  try {
    const params: Record<string, any> = { page, limit }
    if (status) params.status = status

    const response = await api.get("/admin/orders", params)
    return response.data
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

export const updateOrderStatus = async (orderId: string, status: string): Promise<Order> => {
  try {
    const response = await api.put(`/admin/orders/${orderId}`, { status })

    notifications.show({
      title: "Success",
      message: `Order status updated to ${status}`,
      color: "green",
      icon: React.createElement(Check),
    })

    return response.data.order
  } catch (error) {
    notifications.show({
      title: "Error",
      message: "Failed to update order status",
      color: "red",
      icon: React.createElement(X),
    })
    throw error
  }
}

// Dashboard statistics
export const getDashboardStats = async (): Promise<any> => {
  try {
    const response = await api.get("/admin/dashboard")
    return response.data
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw error
  }
}

// Export as default object for components that prefer it
const adminService = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getDashboardStats,
}

export default adminService

