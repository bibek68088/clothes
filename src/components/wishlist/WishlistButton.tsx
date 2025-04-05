"use client"

import { useState, useEffect } from "react"
import { ActionIcon, Tooltip } from "@mantine/core"
import { Heart } from "lucide-react"
import { useAuth } from "../../store/useAuth"
import { addToWishlist, removeFromWishlist, checkWishlistItem } from "../../services/wishlistService"

interface WishlistButtonProps {
  productId: string
  className?: string
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && productId) {
      checkWishlistStatus()
    }
  }, [isAuthenticated, productId])

  const checkWishlistStatus = async () => {
    try {
      const { isInWishlist, wishlistItemId } = await checkWishlistItem(productId)
      setIsInWishlist(isInWishlist)
      setWishlistItemId(wishlistItemId)
    } catch (error) {
      console.error("Error checking wishlist status:", error)
    }
  }

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return
    }

    try {
      setLoading(true)

      if (isInWishlist && wishlistItemId) {
        await removeFromWishlist(wishlistItemId)
        setIsInWishlist(false)
        setWishlistItemId(null)
      } else {
        const response = await addToWishlist(productId)
        setIsInWishlist(true)
        setWishlistItemId(response.wishlistItem.id)
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tooltip label={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
      <ActionIcon
        variant="subtle"
        color={isInWishlist ? "red" : "gray"}
        onClick={toggleWishlist}
        loading={loading}
        disabled={!isAuthenticated}
        className={className}
      >
        <Heart className={isInWishlist ? "fill-current" : ""} />
      </ActionIcon>
    </Tooltip>
  )
}

