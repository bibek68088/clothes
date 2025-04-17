import api from "./api"

export interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  selected_options: {
    color?: string
    size?: string
  }
  product: {
    name: string
    image: string
  }
}

export interface Order {
  id: string
  user_id: string
  status: string
  total_amount: number
  created_at: string
  customer_name: string
  customer_email: string
  items?: OrderItem[]
}

export interface OrdersResponse {
  orders: Order[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const orderService = {
  // Get all orders with pagination and filters
  getOrders: async (params: Record<string, any> = {}): Promise<OrdersResponse> => {
    const response = await api.get("/admin/orders", { params })
    return response.data
  },

  // Get a single order by ID
  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get(`/admin/orders/${id}`)
    return response.data.order
  },

  // Update order status
  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.put(`/admin/orders/${id}/status`, { status })
    return response.data.order
  },
}
