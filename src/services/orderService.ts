import api from "./api"
import { notifications } from "@mantine/notifications"
import { Check, X } from "lucide-react"
import React from "react"

export interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
  total: number
  color?: string
  size?: string
}

export interface ShippingAddress {
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
}

export interface Order {
  id: string
  user_id: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: OrderItem[]
  shipping_address: ShippingAddress
  payment_method: string
  payment_status: "pending" | "paid" | "failed"
  subtotal: number
  shipping_fee: number
  tax: number
  discount: number
  total: number
  tracking_number?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderSummary {
  id: string
  status: string
  total: number
  item_count: number
  created_at: string
}

export interface CheckoutData {
  shipping_address: ShippingAddress
  payment_method: string
  notes?: string
}

// Create a new order (checkout)
export const createOrder = async (checkoutData: CheckoutData): Promise<Order> => {
  try {
    const response = await api.post("/orders", checkoutData)

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Order Placed",
      message: "Your order has been placed successfully",
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return response.data.order
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Checkout Failed",
      message: error.response?.data?.message || "Could not place your order",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Get user's orders
export const getUserOrders = async (page = 1, limit = 10): Promise<{ orders: OrderSummary[]; pagination: any }> => {
  try {
    const response = await api.get("/orders", { page, limit })
    return response.data
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

// Get order details
export const getOrderDetails = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get(`/orders/${orderId}`)
    return response.data.order
  } catch (error) {
    console.error("Error fetching order details:", error)
    throw error
  }
}

// Cancel order
export const cancelOrder = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.post(`/orders/${orderId}/cancel`)

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Order Cancelled",
      message: "Your order has been cancelled",
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return response.data.order
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Error",
      message: error.response?.data?.message || "Could not cancel order",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Process payment
export const processPayment = async (orderId: string, paymentData: any): Promise<any> => {
  try {
    const response = await api.post(`/orders/${orderId}/payment`, paymentData)

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Payment Successful",
      message: "Your payment has been processed successfully",
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return response.data
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Payment Failed",
      message: error.response?.data?.message || "Could not process payment",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Admin: Get all orders
export const getAllOrders = async (
  page = 1,
  limit = 10,
  filters: { status?: string; from_date?: string; to_date?: string } = {},
): Promise<{ orders: Order[]; pagination: any }> => {
  try {
    const response = await api.get("/admin/orders", {
      page,
      limit,
      ...filters,
    })
    return response.data
  } catch (error) {
    console.error("Error fetching all orders:", error)
    throw error
  }
}

// Admin: Update order status
export const updateOrderStatus = async (orderId: string, status: string): Promise<Order> => {
  try {
    const response = await api.put(`/admin/orders/${orderId}`, { status })

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Order Updated",
      message: `Order status updated to ${status}`,
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return response.data.order
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Update Failed",
      message: error.response?.data?.message || "Could not update order status",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Export default object for components that prefer it
const orderService = {
  createOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
  processPayment,
  getAllOrders,
  updateOrderStatus,
}

export default orderService

