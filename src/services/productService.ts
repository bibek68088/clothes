import api from "./api"

export interface Product {
  id: string
  name: string
  price: number
  image_url?: string
  description?: string
  colors: string[]
  sizes: string[]
  average_rating: number | null
  review_count: number
}


export interface ProductsResponse {
  products: Product[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const productService = {
  // Get all products with pagination and filters
  getProducts: async (params: Record<string, any> = {}): Promise<ProductsResponse> => {
    const response = await api.get("/admin/products", { params })
    return response.data
  },

  // Get a single product by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/admin/products/${id}`)
    return response.data.product
  },

  // Create a new product
  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const response = await api.post("/admin/products", productData)
    return response.data.product
  },

  // Update an existing product
  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/admin/products/${id}`, productData)
    return response.data.product
  },

  // Delete a product
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/admin/products/${id}`)
  },
}
