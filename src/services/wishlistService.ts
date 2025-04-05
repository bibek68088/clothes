import api from "./api"

export const getWishlist = async () => {
  try {
    const response = await api.get("/wishlist")
    return response.data.wishlistItems
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    throw error
  }
}

export const addToWishlist = async (productId: string) => {
  try {
    const response = await api.post("/wishlist", { productId })
    return response.data
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    throw error
  }
}

export const removeFromWishlist = async (wishlistItemId: string) => {
  try {
    const response = await api.delete(`/wishlist/${wishlistItemId}`)
    return response.data
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    throw error
  }
}

export const checkWishlistItem = async (productId: string) => {
  try {
    const response = await api.get(`/wishlist/check/${productId}`)
    return response.data
  } catch (error) {
    console.error("Error checking wishlist item:", error)
    throw error
  }
}

