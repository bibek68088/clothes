import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Container, Title, Text, Grid, Card, Image, Group, Button, Loader, Badge } from "@mantine/core"
import { ShoppingCart } from "lucide-react"
import { getWishlist, removeFromWishlist } from "../services/wishlistService"
import { useCart } from "../store/useCart"
import { AuthGuard } from "../components/auth/auth-guard"

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    image: string
    description: string
    averageRating: number | null
    reviewCount: number
  }
}

export function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const items = await getWishlist()
      setWishlistItems(items)
      setError(null)
    } catch (err) {
      setError("Failed to load wishlist")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const handleRemoveFromWishlist = async (wishlistItemId: string) => {
    try {
      await removeFromWishlist(wishlistItemId)
      setWishlistItems(wishlistItems.filter((item) => item.id !== wishlistItemId))
    } catch (err) {
      setError("Failed to remove item from wishlist")
      console.error(err)
    }
  }

  const handleAddToCart = async (product: WishlistItem["product"]) => {
    try {
      await addItem(product)
      // Optionally remove from wishlist after adding to cart
      // await handleRemoveFromWishlist(wishlistItemId);
    } catch (err) {
      console.error("Failed to add item to cart:", err)
    }
  }

  return (
    <AuthGuard>
      <Container size="xl" className="py-8">
        <Title order={1} className="mb-6">
          My Wishlist
        </Title>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : error ? (
          <Text color="red">{error}</Text>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-8">
            <Text size="lg" color="dimmed" className="mb-4">
              Your wishlist is empty
            </Text>
            <Button component={Link} to="/" variant="filled">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <Grid>
            {wishlistItems.map((item) => (
              <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    <Link to={`/product/${item.product.id}`}>
                      <Image src={item.product.image || "/placeholder.svg"} height={160} alt={item.product.name} />
                    </Link>
                  </Card.Section>

                  <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500} component={Link} to={`/product/${item.product.id}`}>
                      {item.product.name}
                    </Text>
                    {item.product.averageRating && (
                      <Badge color="blue">
                        {item.product.averageRating.toFixed(1)} ★ ({item.product.reviewCount})
                      </Badge>
                    )}
                  </Group>

                  <Text size="sm" color="dimmed" lineClamp={2}>
                    {item.product.description}
                  </Text>

                  <Text fw={700} size="lg" mt="md">
                    ${item.product.price.toFixed(2)}
                  </Text>

                  <Group justify="space-between" mt="md">
                    <Button variant="light" color="red" onClick={() => handleRemoveFromWishlist(item.id)}>
                      Remove
                    </Button>
                    <Button leftSection={<ShoppingCart size={16} />} onClick={() => handleAddToCart(item.product)}>
                      Add to Cart
                    </Button>
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>
    </AuthGuard>
  )
}

