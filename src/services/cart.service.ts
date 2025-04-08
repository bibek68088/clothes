import api from "./api"
import type { Product } from "./productService"
import { notifications } from "@mantine/notifications"
import { Check, X } from "lucide-react"
import React from "react"

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  price: number
  product: Product
  color?: string
  size?: string
}

export interface Cart {
  id: string
  user_id?: string
  items: CartItem[]
  total: number
  item_count: number
}

// Get cart
export const getCart = async (): Promise<Cart> => {
  try {
    const response = await api.get("/cart")
    return response.data.cart
  } catch (error) {
    console.error("Error fetching cart:", error)
    throw error
  }
}

// Add item to cart
export const addToCart = async (
  productId: string,
  quantity = 1,
  options: { color?: string; size?: string } = {},
): Promise<Cart> => {
  try {
    const response = await api.post("/cart/items", {
      product_id: productId,
      quantity,
      ...options,
    })

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Added to Cart",
      message: "Item added to your cart successfully",
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return response.data.cart
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Error",
      message: error.response?.data?.message || "Could not add item to cart",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Update cart item quantity
export const updateCartItem = async (itemId: string, quantity: number): Promise<Cart> => {
  try {
    const response = await api.put(`/cart/items/${itemId}`, { quantity })
    return response.data.cart
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Error",
      message: error.response?.data?.message || "Could not update cart",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Remove item from cart
export const removeFromCart = async (itemId: string): Promise<Cart> => {
  try {
    const response = await api.delete(`/cart/items/${itemId}`)

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Removed from Cart",
      message: "Item removed from your cart",
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return response.data.cart
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Error",
      message: error.response?.data?.message || "Could not remove item from cart",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Clear cart
export const clearCart = async (): Promise<Cart> => {
  try {
    const response = await api.delete("/cart")

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Cart Cleared",
      message: "Your cart has been cleared",
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return response.data.cart
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Error",
      message: error.response?.data?.message || "Could not clear cart",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Apply coupon to cart
export const applyCoupon = async (code: string): Promise<Cart> => {
  try {
    const response = await api.post("/cart/coupon", { code })

    // Show success notification
    const CheckIcon = Check
    notifications.show({
      title: "Coupon Applied",
      message: "Coupon has been applied to your cart",
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return response.data.cart
  } catch (error) {
    // Show error notification
    const XIcon = X
    notifications.show({
      title: "Error",
      message: error.response?.data?.message || "Invalid coupon code",
      color: "red",
      icon: React.createElement(XIcon),
    })
    throw error
  }
}

// Remove coupon from cart
export const removeCoupon = async (): Promise<Cart> => {
  try {
    const response = await api.delete("/cart/coupon")
    return response.data.cart
  } catch (error) {
    console.error("Error removing coupon:", error)
    throw error
  }
}

// Sync guest cart with user cart after login
export const syncCart = async (
  items: { product_id: string; quantity: number; color?: string; size?: string }[],
): Promise<Cart> => {
  try {
    const response = await api.post("/cart/sync", { items })
    return response.data.cart
  } catch (error) {
    console.error("Error syncing cart:", error)
    throw error
  }
}

// Export default object for components that prefer it
const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  syncCart,
}

export default cartService

