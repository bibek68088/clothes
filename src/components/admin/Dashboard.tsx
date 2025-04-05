"use client"

import { useState, useEffect } from "react"
import { Container, Grid, Paper, Title, Text, Group, Loader, Table, Badge } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../store/useAuth"
import api from "../../services/api"
import { AdminLayout } from "./AdminLayout"

interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
}

interface RecentOrder {
  id: string
  created_at: string
  status: string
  total_amount: number
  customer_name: string
}

interface TopProduct {
  id: string
  name: string
  image_url: string
  order_count: number
  total_quantity: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== "admin") {
      navigate("/")
      return
    }

    fetchDashboardData()
  }, [user, navigate])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/dashboard")

      setStats(response.data.stats)
      setRecentOrders(response.data.recentOrders)
      setTopProducts(response.data.topProducts)
      setError(null)
    } catch (err) {
      setError("Failed to load dashboard data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-4">
          <Text color="red">{error}</Text>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Container size="xl" className="py-6">
        <Title order={2} className="mb-6">
          Dashboard
        </Title>

        {/* Stats Cards */}
        <Grid className="mb-8">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper shadow="xs" p="md" withBorder>
              <Text size="lg" fw={500} color="dimmed">
                Total Users
              </Text>
              <Title order={3}>{stats?.totalUsers}</Title>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper shadow="xs" p="md" withBorder>
              <Text size="lg" fw={500} color="dimmed">
                Total Products
              </Text>
              <Title order={3}>{stats?.totalProducts}</Title>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper shadow="xs" p="md" withBorder>
              <Text size="lg" fw={500} color="dimmed">
                Total Orders
              </Text>
              <Title order={3}>{stats?.totalOrders}</Title>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper shadow="xs" p="md" withBorder>
              <Text size="lg" fw={500} color="dimmed">
                Total Revenue
              </Text>
              <Title order={3}>${stats?.totalRevenue.toFixed(2)}</Title>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Recent Orders */}
        <Paper shadow="xs" p="md" withBorder className="mb-8">
          <Group justify="space-between" className="mb-4">
            <Title order={4}>Recent Orders</Title>
          </Group>

          <Table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id.substring(0, 8)}...</td>
                  <td>{order.customer_name}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <Badge color={getStatusColor(order.status)}>{order.status}</Badge>
                  </td>
                  <td>${order.total_amount.toFixed(2)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Paper>

        {/* Top Products */}
        <Paper shadow="xs" p="md" withBorder>
          <Group justify="space-between" className="mb-4">
            <Title order={4}>Top Selling Products</Title>
          </Group>

          <Table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Orders</th>
                <th>Quantity Sold</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id}>
                  <td className="flex items-center gap-2">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span>{product.name}</span>
                  </td>
                  <td>{product.order_count}</td>
                  <td>{product.total_quantity}</td>
                </tr>
              ))}
              {topProducts.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No products sold yet
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Paper>
      </Container>
    </AdminLayout>
  )
}

