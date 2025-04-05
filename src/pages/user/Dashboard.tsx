import { useState, useEffect } from "react"
import { Container, Grid, Paper, Title, Text, Group, Button, Badge, Avatar, Card, Progress } from "@mantine/core"
import { Link } from "react-router-dom"
import { useAuth } from "../../store/useAuth"
import { ShoppingBag, Package, Heart, CreditCard, Settings, Bell, ChevronRight } from "lucide-react"

interface OrderSummary {
  id: string
  date: string
  status: string
  total: number
}

interface WishlistItem {
  id: string
  name: string
  image: string
  price: number
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // In a real app, these would be actual API calls
        // For now, we'll use mock data

        // Mock recent orders
        setRecentOrders([
          { id: "ORD-1234", date: "2023-11-15", status: "delivered", total: 129.99 },
          { id: "ORD-1235", date: "2023-11-10", status: "shipped", total: 79.5 },
        ])

        // Mock wishlist items
        setWishlistItems([
          { id: "1", name: "Premium Leather Jacket", image: "/images/jacket.jpg", price: 199.99 },
          { id: "2", name: "Designer Jeans", image: "/images/jeans.jpg", price: 89.99 },
        ])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow"
      case "processing":
        return "blue"
      case "shipped":
        return "indigo"
      case "delivered":
        return "green"
      case "cancelled":
        return "red"
      default:
        return "gray"
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Container size="xl">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center gap-4">
            <Avatar size="xl" radius="xl" color="blue" className="border-4 border-white">
              {user?.name?.charAt(0) || "U"}
            </Avatar>
            <div>
              <Text size="sm">Welcome back,</Text>
              <Title order={2} className="mb-1">
                {user?.name || "User"}
              </Title>
              <Text size="sm" className="opacity-80">
                {user?.email}
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Paper className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <Text size="sm" className="text-white/70">
                Loyalty Points
              </Text>
              <Text size="xl" fw={700}>
                250 pts
              </Text>
              <Progress value={25} size="sm" className="mt-2" color="rgba(255,255,255,0.7)" />
            </Paper>
            <Paper className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <Text size="sm" className="text-white/70">
                Total Orders
              </Text>
              <Text size="xl" fw={700}>
                12
              </Text>
            </Paper>
            <Paper className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <Text size="sm" className="text-white/70">
                Wishlist Items
              </Text>
              <Text size="xl" fw={700}>
                {wishlistItems.length}
              </Text>
            </Paper>
            <Paper className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <Text size="sm" className="text-white/70">
                Saved Addresses
              </Text>
              <Text size="xl" fw={700}>
                2
              </Text>
            </Paper>
          </div>
        </div>

        <Grid gutter={24}>
          {/* Left Column - Navigation */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Paper shadow="sm" radius="md" p="md" withBorder className="mb-6">
              <Title order={4} className="mb-4">
                My Account
              </Title>
              <div className="space-y-2">
                <Link to="/user/dashboard" className="no-underline">
                  <Button
                    variant="subtle"
                    fullWidth
                    leftSection={<ShoppingBag size={18} />}
                    className="justify-start bg-blue-50 text-blue-600"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link to="/orders" className="no-underline">
                  <Button
                    variant="subtle"
                    fullWidth
                    leftSection={<Package size={18} />}
                    className="justify-start hover:bg-gray-100"
                  >
                    My Orders
                  </Button>
                </Link>
                <Link to="/wishlist" className="no-underline">
                  <Button
                    variant="subtle"
                    fullWidth
                    leftSection={<Heart size={18} />}
                    className="justify-start hover:bg-gray-100"
                  >
                    Wishlist
                  </Button>
                </Link>
                <Link to="/payment-methods" className="no-underline">
                  <Button
                    variant="subtle"
                    fullWidth
                    leftSection={<CreditCard size={18} />}
                    className="justify-start hover:bg-gray-100"
                  >
                    Payment Methods
                  </Button>
                </Link>
                <Link to="/profile" className="no-underline">
                  <Button
                    variant="subtle"
                    fullWidth
                    leftSection={<Settings size={18} />}
                    className="justify-start hover:bg-gray-100"
                  >
                    Account Settings
                  </Button>
                </Link>
              </div>
            </Paper>

            <Paper shadow="sm" radius="md" p="md" withBorder>
              <Title order={4} className="mb-4">
                Notifications
              </Title>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                  <Bell size={18} className="text-blue-500 mt-0.5" />
                  <div>
                    <Text size="sm" fw={500}>
                      Your order has been shipped
                    </Text>
                    <Text size="xs" color="dimmed">
                      Order #ORD-1235 has been shipped and is on its way.
                    </Text>
                    <Text size="xs" color="dimmed" className="mt-1">
                      2 days ago
                    </Text>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                  <Bell size={18} className="text-green-500 mt-0.5" />
                  <div>
                    <Text size="sm" fw={500}>
                      Special offer just for you
                    </Text>
                    <Text size="xs" color="dimmed">
                      Get 20% off on all jackets this weekend!
                    </Text>
                    <Text size="xs" color="dimmed" className="mt-1">
                      5 days ago
                    </Text>
                  </div>
                </div>
              </div>
            </Paper>
          </Grid.Col>

          {/* Right Column - Content */}
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Grid gutter={24}>
              {/* Recent Orders */}
              <Grid.Col span={12}>
                <Paper shadow="sm" radius="md" p="md" withBorder>
                  <Group justify="space-between" className="mb-4">
                    <Title order={4}>Recent Orders</Title>
                    <Button variant="subtle" rightSection={<ChevronRight size={16} />} component={Link} to="/orders">
                      View All
                    </Button>
                  </Group>

                  {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
                        >
                          <div>
                            <Text fw={500}>{order.id}</Text>
                            <Text size="sm" color="dimmed">
                              {new Date(order.date).toLocaleDateString()}
                            </Text>
                          </div>
                          <div className="text-right">
                            <Badge color={getStatusColor(order.status)} className="mb-1">
                              {order.status}
                            </Badge>
                            <Text fw={500}>${order.total.toFixed(2)}</Text>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Text color="dimmed" align="center" className="py-4">
                      No recent orders found
                    </Text>
                  )}
                </Paper>
              </Grid.Col>

              {/* Wishlist Preview */}
              <Grid.Col span={12}>
                <Paper shadow="sm" radius="md" p="md" withBorder>
                  <Group justify="space-between" className="mb-4">
                    <Title order={4}>Wishlist</Title>
                    <Button variant="subtle" rightSection={<ChevronRight size={16} />} component={Link} to="/wishlist">
                      View All
                    </Button>
                  </Group>

                  <Grid>
                    {wishlistItems.map((item) => (
                      <Grid.Col key={item.id} span={{ base: 6, md: 4 }}>
                        <Card shadow="sm" p="md" radius="md" withBorder>
                          <Card.Section>
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-32 object-cover"
                            />
                          </Card.Section>

                          <Text fw={500} className="mt-2 line-clamp-1">
                            {item.name}
                          </Text>
                          <Text fw={700} className="mt-1">
                            ${item.price.toFixed(2)}
                          </Text>

                          <Button
                            variant="light"
                            fullWidth
                            className="mt-2"
                            component={Link}
                            to={`/product/${item.id}`}
                          >
                            View Product
                          </Button>
                        </Card>
                      </Grid.Col>
                    ))}

                    {wishlistItems.length === 0 && (
                      <Grid.Col span={12}>
                        <Text color="dimmed" align="center" className="py-4">
                          Your wishlist is empty
                        </Text>
                      </Grid.Col>
                    )}
                  </Grid>
                </Paper>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  )
}

