import React from "react"
import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios"
import { notifications } from "@mantine/notifications"
import { Check } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  created_at: string
  updated_at?: string
}

interface Product {
  id: string
  name: string
  price: number
  image_url?: string
  description?: string
  colors?: string[]
  sizes?: string[]
  stock_quantity?: number
  average_rating?: number
  review_count?: number
}

interface Order {
  id: string
  user_id: string
  status: string
  total_amount: number
  created_at: string
  customer_name?: string
  customer_email?: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface UsersResponse {
  users: User[]
  pagination: PaginationData
}

interface ProductsResponse {
  products: Product[]
  pagination: PaginationData
  filters?: {
    priceRange: { min: number; max: number }
    colors: string[]
    sizes: string[]
  }
}

interface OrdersResponse {
  orders: Order[]
  pagination: PaginationData
}

// Create axios instance with base URL
const instance = axios.create({
  baseURL: import.meta.env.VITE_AASHISH_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle common errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      // Redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Create a cached version of get requests
const cachedGet = async (
  url: string,
  params: Record<string, any> = {},
  forceRefresh = false,
): Promise<{ data: any }> => {
  const cacheKey = url + JSON.stringify(params)

  // Check if we have a valid cached response
  if (!forceRefresh && cache.has(cacheKey)) {
    const cachedItem = cache.get(cacheKey)
    if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
      return { data: cachedItem.data }
    }
  }

  try {
    // If no cache or expired, make the request
    const response = await instance.get(url, { params })

    // Cache the response
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    })

    return response
  } catch (error) {
    // Handle 404 errors in development with mock data
    if (import.meta.env.DEV && (error as AxiosError).response?.status === 404) {
      console.warn(`Using mock data for GET ${url}`)
      const mockData = getMockData(url, params)
      return { data: mockData }
    }
    throw error
  }
}

// Mock POST requests in development
const mockPost = async (url: string, data: any): Promise<{ data: any }> => {
  if (import.meta.env.DEV) {
    console.warn(`Using mock data for POST ${url}`)
    return { data: handleMockPost(url, data) }
  }
  return instance.post(url, data)
}

// Mock PUT requests in development
const mockPut = async (url: string, data: any): Promise<{ data: any }> => {
  if (import.meta.env.DEV) {
    console.warn(`Using mock data for PUT ${url}`)
    const userId = url.split("/").pop() || ""
    return { data: handleMockPut(url, userId, data) }
  }
  return instance.put(url, data)
}

// Mock DELETE requests in development
const mockDelete = async (url: string): Promise<{ data: any }> => {
  if (import.meta.env.DEV) {
    console.warn(`Using mock data for DELETE ${url}`)
    const userId = url.split("/").pop() || ""
    return { data: handleMockDelete(url, userId) }
  }
  return instance.delete(url)
}

// Mock data handler for development - updated type to InternalAxiosRequestConfig
const handleMockResponse = (config: InternalAxiosRequestConfig): Promise<{ data: any }> => {
  const { url, method, data } = config

  if (!url) {
    return Promise.reject(new Error("URL is undefined"))
  }

  // Mock users data
  if (url.includes("/admin/users")) {
    if (method === "get") {
      return Promise.resolve({
        data: {
          users: [
            {
              id: "1",
              name: "Admin User",
              email: "admin@example.com",
              role: "admin",
              phone: "(123) 456-7890",
              created_at: new Date().toISOString(),
            },
            {
              id: "2",
              name: "John Doe",
              email: "john@example.com",
              role: "customer",
              phone: "(123) 456-7891",
              created_at: new Date().toISOString(),
            },
            {
              id: "3",
              name: "Jane Smith",
              email: "jane@example.com",
              role: "customer",
              phone: "(123) 456-7892",
              created_at: new Date().toISOString(),
            },
          ],
          pagination: {
            total: 3,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
      })
    }

    if (method === "post" && data) {
      const userData = typeof data === "string" ? JSON.parse(data) : data
      const CheckIcon = Check
      notifications.show({
        title: "Success",
        message: `User ${userData.name} created successfully (mock)`,
        color: "green",
        icon: React.createElement(CheckIcon),
      })

      return Promise.resolve({
        data: {
          message: "User created successfully",
          user: {
            id: Date.now().toString(),
            ...userData,
            created_at: new Date().toISOString(),
          },
        },
      })
    }

    if (method === "put" && data) {
      const userId = url.split("/").pop() || ""
      const userData = typeof data === "string" ? JSON.parse(data) : data
      const CheckIcon = Check
      notifications.show({
        title: "Success",
        message: `User ${userData.name} updated successfully (mock)`,
        color: "green",
        icon: React.createElement(CheckIcon),
      })

      return Promise.resolve({
        data: {
          message: "User updated successfully",
          user: {
            id: userId,
            ...userData,
            updated_at: new Date().toISOString(),
          },
        },
      })
    }

    if (method === "delete") {
      const userId = url.split("/").pop() || ""
      const CheckIcon = Check
      notifications.show({
        title: "Success",
        message: "User deleted successfully (mock)",
        color: "green",
        icon: React.createElement(CheckIcon),
      })

      return Promise.resolve({
        data: {
          message: "User deleted successfully",
          id: userId,
        },
      })
    }
  }

  // Mock products data
  if (url.includes("/products")) {
    return Promise.resolve({
      data: {
        products: [
          {
            id: "1",
            name: "Classic Tee",
            price: 19.99,
            image_url: "/images/tee.jpg",
            description: "A comfortable and stylish tee for everyday wear.",
            colors: ["Black", "White", "Gray"],
            sizes: ["S", "M", "L", "XL"],
            stock_quantity: 100,
            average_rating: 4.5,
            review_count: 28,
          },
          {
            id: "2",
            name: "Slim Fit Jeans",
            price: 59.99,
            image_url: "/images/jeans.jpg",
            description: "Modern slim fit jeans made from premium denim.",
            colors: ["Blue", "Black"],
            sizes: ["30", "32", "34", "36"],
            stock_quantity: 75,
            average_rating: 4.2,
            review_count: 16,
          },
          {
            id: "3",
            name: "Leather Jacket",
            price: 199.99,
            image_url: "/images/jacket.jpg",
            description: "A timeless leather jacket for a stylish look.",
            colors: ["Black", "Brown"],
            sizes: ["S", "M", "L", "XL"],
            stock_quantity: 30,
            average_rating: 4.8,
            review_count: 42,
          },
        ],
        pagination: {
          total: 3,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        filters: {
          priceRange: { min: 19.99, max: 199.99 },
          colors: ["Black", "White", "Gray", "Blue", "Brown"],
          sizes: ["S", "M", "L", "XL", "30", "32", "34", "36"],
        },
      },
    })
  }

  // Mock orders data
  if (url.includes("/orders")) {
    return Promise.resolve({
      data: {
        orders: [
          {
            id: "ORD-1234",
            user_id: "1",
            status: "delivered",
            total_amount: 129.99,
            created_at: "2023-11-15T10:30:00Z",
            customer_name: "John Doe",
            customer_email: "john@example.com",
          },
          {
            id: "ORD-1235",
            user_id: "1",
            status: "shipped",
            total_amount: 79.5,
            created_at: "2023-11-14T14:20:00Z",
            customer_name: "Jane Smith",
            customer_email: "jane@example.com",
          },
          {
            id: "ORD-1236",
            user_id: "2",
            status: "processing",
            total_amount: 199.99,
            created_at: "2023-11-14T09:15:00Z",
            customer_name: "Robert Johnson",
            customer_email: "robert@example.com",
          },
        ],
        pagination: {
          total: 3,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    })
  }

  // Default fallback for unhandled mock requests
  return Promise.reject(new Error(`No mock implementation for ${url}`))
}

// Handle mock data for different endpoints
const getMockData = (url: string, params: Record<string, any> = {}): any => {
  // Mock admin products data
  if (url.includes("/admin/products")) {
    return {
      products: [
        {
          id: "1",
          name: "Classic Tee",
          price: 19.99,
          image_url: "/placeholder.svg?height=100&width=100",
          description: "A comfortable and stylish tee for everyday wear.",
          colors: ["Black", "White", "Gray"],
          sizes: ["S", "M", "L", "XL"],
          stock_quantity: 100,
          average_rating: 4.5,
          review_count: 28,
        },
        {
          id: "2",
          name: "Slim Fit Jeans",
          price: 59.99,
          image_url: "/placeholder.svg?height=100&width=100",
          description: "Modern slim fit jeans made from premium denim.",
          colors: ["Blue", "Black"],
          sizes: ["30", "32", "34", "36"],
          stock_quantity: 75,
          average_rating: 4.2,
          review_count: 16,
        },
        {
          id: "3",
          name: "Leather Jacket",
          price: 199.99,
          image_url: "/placeholder.svg?height=100&width=100",
          description: "A timeless leather jacket for a stylish look.",
          colors: ["Black", "Brown"],
          sizes: ["S", "M", "L", "XL"],
          stock_quantity: 30,
          average_rating: 4.8,
          review_count: 42,
        },
      ],
      pagination: {
        total: 3,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 1,
      },
    }
  }

  // Mock users data
  if (url.includes("/admin/users")) {
    return {
      users: [
        {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          phone: "(123) 456-7890",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "John Doe",
          email: "john@example.com",
          role: "customer",
          phone: "(123) 456-7891",
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "customer",
          phone: "(123) 456-7892",
          created_at: new Date().toISOString(),
        },
      ],
      pagination: {
        total: 3,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 1,
      },
    }
  }

  // Mock products data
  if (url.includes("/products")) {
    return {
      products: [
        {
          id: "1",
          name: "Classic Tee",
          price: 19.99,
          image_url: "/placeholder.svg?height=100&width=100",
          description: "A comfortable and stylish tee for everyday wear.",
          colors: ["Black", "White", "Gray"],
          sizes: ["S", "M", "L", "XL"],
          stock_quantity: 100,
          average_rating: 4.5,
          review_count: 28,
        },
        {
          id: "2",
          name: "Slim Fit Jeans",
          price: 59.99,
          image_url: "/placeholder.svg?height=100&width=100",
          description: "Modern slim fit jeans made from premium denim.",
          colors: ["Blue", "Black"],
          sizes: ["30", "32", "34", "36"],
          stock_quantity: 75,
          average_rating: 4.2,
          review_count: 16,
        },
        {
          id: "3",
          name: "Leather Jacket",
          price: 199.99,
          image_url: "/placeholder.svg?height=100&width=100",
          description: "A timeless leather jacket for a stylish look.",
          colors: ["Black", "Brown"],
          sizes: ["S", "M", "L", "XL"],
          stock_quantity: 30,
          average_rating: 4.8,
          review_count: 42,
        },
      ],
      pagination: {
        total: 3,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 1,
      },
      filters: {
        priceRange: { min: 19.99, max: 199.99 },
        colors: ["Black", "White", "Gray", "Blue", "Brown"],
        sizes: ["S", "M", "L", "XL", "30", "32", "34", "36"],
      },
    }
  }

  // Mock orders data
  if (url.includes("/orders")) {
    return {
      orders: [
        {
          id: "ORD-1234",
          user_id: "1",
          status: "delivered",
          total_amount: 129.99,
          created_at: "2023-11-15T10:30:00Z",
          customer_name: "John Doe",
          customer_email: "john@example.com",
        },
        {
          id: "ORD-1235",
          user_id: "1",
          status: "shipped",
          total_amount: 79.5,
          created_at: "2023-11-14T14:20:00Z",
          customer_name: "Jane Smith",
          customer_email: "jane@example.com",
        },
        {
          id: "ORD-1236",
          user_id: "2",
          status: "processing",
          total_amount: 199.99,
          created_at: "2023-11-14T09:15:00Z",
          customer_name: "Robert Johnson",
          customer_email: "robert@example.com",
        },
      ],
      pagination: {
        total: 3,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 1,
      },
    }
  }

  // Default fallback for unhandled mock requests
  return { message: "Mock data not implemented for this endpoint" }
}

// Handle mock POST requests
const handleMockPost = (url: string, data: any): any => {
  // Mock product creation
  if (url.includes("/admin/products")) {
    const CheckIcon = Check
    notifications.show({
      title: "Success",
      message: `Product ${data.name} created successfully (mock)`,
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return {
      message: "Product created successfully",
      product: {
        id: Date.now().toString(),
        ...data,
        created_at: new Date().toISOString(),
      },
    }
  }

  // Mock user creation
  if (url.includes("/admin/users")) {
    const CheckIcon = Check
    notifications.show({
      title: "Success",
      message: `User ${data.name} created successfully (mock)`,
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return {
      message: "User created successfully",
      user: {
        id: Date.now().toString(),
        ...data,
        created_at: new Date().toISOString(),
      },
    }
  }

  // Default response for unhandled mock POST requests
  return {
    message: "Operation successful",
    data: data,
    id: Date.now().toString(),
  }
}

// Handle mock PUT requests
const handleMockPut = (url: string, id: string, data: any): any => {
  // Mock product update
  if (url.includes("/admin/products")) {
    const CheckIcon = Check
    notifications.show({
      title: "Success",
      message: `Product ${data.name} updated successfully (mock)`,
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return {
      message: "Product updated successfully",
      product: {
        id: id,
        ...data,
        updated_at: new Date().toISOString(),
      },
    }
  }

  // Mock user update
  if (url.includes("/admin/users")) {
    const CheckIcon = Check
    notifications.show({
      title: "Success",
      message: `User ${data.name} updated successfully (mock)`,
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return {
      message: "User updated successfully",
      user: {
        id: id,
        ...data,
        updated_at: new Date().toISOString(),
      },
    }
  }

  // Default response for unhandled mock PUT requests
  return {
    message: "Update successful",
    data: data,
    id: id,
  }
}

// Handle mock DELETE requests
const handleMockDelete = (url: string, id: string): any => {
  // Mock product deletion
  if (url.includes("/admin/products")) {
    const CheckIcon = Check
    notifications.show({
      title: "Success",
      message: "Product deleted successfully (mock)",
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return {
      message: "Product deleted successfully",
      id: id,
    }
  }

  // Mock user deletion
  if (url.includes("/admin/users")) {
    const CheckIcon = Check
    notifications.show({
      title: "Success",
      message: "User deleted successfully (mock)",
      color: "green",
      icon: React.createElement(CheckIcon),
    })

    return {
      message: "User deleted successfully",
      id: id,
    }
  }

  // Default response for unhandled mock DELETE requests
  return {
    message: "Delete successful",
    id: id,
  }
}

// Create a wrapper for api.patch
const mockPatch = async (url: string, data: any): Promise<{ data: any }> => {
  if (import.meta.env.DEV) {
    console.warn(`Using mock data for PATCH ${url}`)
    const resourceId = url.split("/").pop() || ""
    return { data: handleMockPut(url, resourceId, data) } // Reuse PUT handler for PATCH
  }
  return instance.patch(url, data)
}

// API helper methods
const api = {
  get: async (url: string, params = {}) => {
    try {
      return await instance.get(url, { params })
    } catch (error) {
      // If we're in development mode and get a 404, use mock data
      if (import.meta.env.DEV && (error as AxiosError).response?.status === 404) {
        console.warn(`Using mock data for GET ${url} (API endpoint not found)`)
        return { data: getMockData(url, params) }
      }
      throw error
    }
  },

  post: async (url: string, data = {}) => {
    try {
      return await instance.post(url, data)
    } catch (error) {
      // If we're in development mode and get a 404, use mock data
      if (import.meta.env.DEV && (error as AxiosError).response?.status === 404) {
        console.warn(`Using mock data for POST ${url} (API endpoint not found)`)
        return { data: handleMockPost(url, data) }
      }
      throw error
    }
  },

  put: async (url: string, data = {}) => {
    try {
      return await instance.put(url, data)
    } catch (error) {
      // If we're in development mode and get a 404, use mock data
      if (import.meta.env.DEV && (error as AxiosError).response?.status === 404) {
        console.warn(`Using mock data for PUT ${url} (API endpoint not found)`)
        const resourceId = url.split("/").pop() || ""
        return { data: handleMockPut(url, resourceId, data) }
      }
      throw error
    }
  },

  delete: async (url: string) => {
    try {
      return await instance.delete(url)
    } catch (error) {
      // If we're in development mode and get a 404, use mock data
      if (import.meta.env.DEV && (error as AxiosError).response?.status === 404) {
        console.warn(`Using mock data for DELETE ${url} (API endpoint not found)`)
        const resourceId = url.split("/").pop() || ""
        return { data: handleMockDelete(url, resourceId) }
      }
      throw error
    }
  },

  patch: async (url: string, data = {}) => {
    return mockPatch(url, data)
  },

  // For file uploads
  upload: async (url: string, formData: FormData) => {
    return instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
}

// Example usage of the API functions
const apiExamples = {
  // Example of fetching users
  fetchUsers: async (page = 1, limit = 10) => {
    const response = await api.get("/admin/users", { page, limit })
    return response.data as UsersResponse
  },

  // Example of fetching products with filters
  fetchProducts: async (filters: Record<string, any> = {}) => {
    const response = await api.get("/products", filters)
    return response.data as ProductsResponse
  },

  // Example of fetching orders
  fetchOrders: async (page = 1, limit = 10) => {
    const response = await api.get("/orders", { page, limit })
    return response.data as OrdersResponse
  },

  // Example of creating a user
  createUser: async (userData: Partial<User>) => {
    const response = await api.post("/admin/users", userData)
    return response.data
  },

  // Example of updating a user
  updateUser: async (userId: string, userData: Partial<User>) => {
    const response = await api.put(`/admin/users/${userId}`, userData)
    return response.data
  },

  // Example of deleting a user
  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  },

  // Example of clearing the cache
  clearCache: () => {
    cache.clear()
    console.log("API cache cleared")
  },
}

// Export the enhanced API with all HTTP methods and example usage
export default api

