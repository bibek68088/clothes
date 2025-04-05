import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Group,
  Loader,
  Table,
  Badge,
  Card,
  RingProgress,
  ActionIcon,
  ThemeIcon,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { AdminLayout } from "../../components/admin/AdminLayout";
import {
  ArrowUp,
  ArrowDown,
  DollarSign,
  Users,
  ShoppingBag,
  Package,
  Eye,
  RefreshCw,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  userGrowth: number;
  revenueGrowth: number;
  orderGrowth: number;
}

interface RecentOrder {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  customer_name: string;
}

interface TopProduct {
  id: string;
  name: string;
  image_url: string;
  order_count: number;
  total_quantity: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // In a real app, this would be an API call
      // For now, we'll use mock data
      setTimeout(() => {
        setStats({
          totalUsers: 1254,
          totalProducts: 86,
          totalOrders: 324,
          totalRevenue: 28456.78,
          userGrowth: 12.5,
          revenueGrowth: 18.2,
          orderGrowth: 8.7,
        });

        setRecentOrders([
          {
            id: "ORD-1234",
            created_at: "2023-11-15T10:30:00Z",
            status: "delivered",
            total_amount: 129.99,
            customer_name: "John Doe",
          },
          {
            id: "ORD-1235",
            created_at: "2023-11-14T14:20:00Z",
            status: "shipped",
            total_amount: 79.5,
            customer_name: "Jane Smith",
          },
          {
            id: "ORD-1236",
            created_at: "2023-11-14T09:15:00Z",
            status: "processing",
            total_amount: 199.99,
            customer_name: "Robert Johnson",
          },
          {
            id: "ORD-1237",
            created_at: "2023-11-13T16:45:00Z",
            status: "pending",
            total_amount: 49.99,
            customer_name: "Emily Davis",
          },
          {
            id: "ORD-1238",
            created_at: "2023-11-12T11:30:00Z",
            status: "delivered",
            total_amount: 159.95,
            customer_name: "Michael Wilson",
          },
        ]);

        setTopProducts([
          {
            id: "1",
            name: "Premium Leather Jacket",
            image_url: "/images/jacket.jpg",
            order_count: 28,
            total_quantity: 32,
          },
          {
            id: "2",
            name: "Designer Jeans",
            image_url: "/images/jeans.jpg",
            order_count: 24,
            total_quantity: 26,
          },
          {
            id: "3",
            name: "Classic Tee",
            image_url: "/images/tee.jpg",
            order_count: 20,
            total_quantity: 45,
          },
        ]);

        setError(null);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "processing":
        return "blue";
      case "shipped":
        return "indigo";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-4">
          <Text color="red">{error}</Text>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container size="xl" className="py-6">
        <Group justify="space-between" className="mb-6">
          <div>
            <Title order={2} className="mb-1">
              Dashboard
            </Title>
            <Text color="dimmed">
              Welcome back, {user?.name}. Here's what's happening with your
              store today.
            </Text>
          </div>
          <ActionIcon
            size="lg"
            variant="light"
            color="blue"
            onClick={fetchDashboardData}
            title="Refresh data"
          >
            <RefreshCw size={18} />
          </ActionIcon>
        </Group>

        {/* Stats Cards */}
        <Grid className="mb-8">
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" p="lg" radius="md" withBorder className="h-full">
              <Group justify="space-between">
                <div>
                  <Text
                    size="xs"
                    color="dimmed"
                    className="uppercase font-semibold"
                  >
                    Total Users
                  </Text>
                  <Title order={3}>{stats?.totalUsers.toLocaleString()}</Title>
                </div>
                <ThemeIcon
                  size={48}
                  radius="md"
                  className="bg-blue-100 text-blue-600"
                >
                  <Users size={24} />
                </ThemeIcon>
              </Group>
              <Group justify="space-between" className="mt-3">
                <Text
                  size="sm"
                  color={
                    stats?.userGrowth && stats.userGrowth > 0 ? "green" : "red"
                  }
                >
                  <span className="inline-flex items-center">
                    {stats?.userGrowth && stats.userGrowth > 0 ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )}
                    {Math.abs(stats?.userGrowth || 0)}%
                  </span>
                </Text>
                <Text size="xs" color="dimmed">
                  vs last month
                </Text>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" p="lg" radius="md" withBorder className="h-full">
              <Group justify="space-between">
                <div>
                  <Text
                    size="xs"
                    color="dimmed"
                    className="uppercase font-semibold"
                  >
                    Total Products
                  </Text>
                  <Title order={3}>
                    {stats?.totalProducts.toLocaleString()}
                  </Title>
                </div>
                <ThemeIcon
                  size={48}
                  radius="md"
                  className="bg-green-100 text-green-600"
                >
                  <Package size={24} />
                </ThemeIcon>
              </Group>
              <Group justify="space-between" className="mt-3">
                <Text size="sm" color="dimmed">
                  <span className="inline-flex items-center">
                    <ShoppingBag size={16} className="mr-1" />
                    {topProducts.length} top sellers
                  </span>
                </Text>
                <Text size="xs" color="dimmed">
                  this month
                </Text>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" p="lg" radius="md" withBorder className="h-full">
              <Group justify="space-between">
                <div>
                  <Text
                    size="xs"
                    color="dimmed"
                    className="uppercase font-semibold"
                  >
                    Total Orders
                  </Text>
                  <Title order={3}>{stats?.totalOrders.toLocaleString()}</Title>
                </div>
                <ThemeIcon
                  size={48}
                  radius="md"
                  className="bg-purple-100 text-purple-600"
                >
                  <ShoppingBag size={24} />
                </ThemeIcon>
              </Group>
              <Group justify="space-between" className="mt-3">
                <Text
                  size="sm"
                  color={
                    stats?.orderGrowth && stats.orderGrowth > 0
                      ? "green"
                      : "red"
                  }
                >
                  <span className="inline-flex items-center">
                    {stats?.orderGrowth && stats.orderGrowth > 0 ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )}
                    {Math.abs(stats?.orderGrowth || 0)}%
                  </span>
                </Text>
                <Text size="xs" color="dimmed">
                  vs last month
                </Text>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" p="lg" radius="md" withBorder className="h-full">
              <Group justify="space-between">
                <div>
                  <Text
                    size="xs"
                    color="dimmed"
                    className="uppercase font-semibold"
                  >
                    Total Revenue
                  </Text>
                  <Title order={3}>
                    $
                    {stats?.totalRevenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Title>
                </div>
                <ThemeIcon
                  size={48}
                  radius="md"
                  className="bg-yellow-100 text-yellow-600"
                >
                  <DollarSign size={24} />
                </ThemeIcon>
              </Group>
              <Group justify="space-between" className="mt-3">
                <Text
                  size="sm"
                  color={
                    stats?.revenueGrowth && stats.revenueGrowth > 0
                      ? "green"
                      : "red"
                  }
                >
                  <span className="inline-flex items-center">
                    {stats?.revenueGrowth && stats.revenueGrowth > 0 ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )}
                    {Math.abs(stats?.revenueGrowth || 0)}%
                  </span>
                </Text>
                <Text size="xs" color="dimmed">
                  vs last month
                </Text>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        <Grid gutter={24}>
          {/* Sales Overview */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper shadow="sm" p="md" withBorder className="mb-6">
              <Group justify="space-between" className="mb-4">
                <Title order={4}>Sales Overview</Title>
                <Badge color="blue">Last 30 Days</Badge>
              </Group>

              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                <Text color="dimmed">Sales chart would go here</Text>
              </div>

              <Grid className="mt-4">
                <Grid.Col span={4}>
                  <div className="text-center">
                    <Text size="sm" color="dimmed">
                      Total Sales
                    </Text>
                    <Text size="xl" fw={700}>
                      $
                      {(stats?.totalRevenue || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </div>
                </Grid.Col>
                <Grid.Col span={4}>
                  <div className="text-center">
                    <Text size="sm" color="dimmed">
                      Average Order Value
                    </Text>
                    <Text size="xl" fw={700}>
                      $
                      {stats && stats.totalOrders > 0
                        ? (
                            stats.totalRevenue / stats.totalOrders
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "0.00"}
                    </Text>
                  </div>
                </Grid.Col>
                <Grid.Col span={4}>
                  <div className="text-center">
                    <Text size="sm" color="dimmed">
                      Conversion Rate
                    </Text>
                    <Text size="xl" fw={700}>
                      3.2%
                    </Text>
                  </div>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Recent Orders */}
            <Paper shadow="sm" p="md" withBorder>
              <Group justify="space-between" className="mb-4">
                <Title order={4}>Recent Orders</Title>
                <Badge color="blue">Today</Badge>
              </Group>

              <Table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer_name}</td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>
                        <Badge color={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td>${order.total_amount.toFixed(2)}</td>
                      <td>
                        <ActionIcon color="blue" title="View Order">
                          <Eye size={16} />
                        </ActionIcon>
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No recent orders
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Paper>
          </Grid.Col>

          {/* Right Column */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            {/* Top Products */}
            <Paper shadow="sm" p="md" withBorder className="mb-6">
              <Group justify="space-between" className="mb-4">
                <Title order={4}>Top Selling Products</Title>
              </Group>

              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50"
                  >
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <Text fw={500} className="truncate">
                        {product.name}
                      </Text>
                      <Text size="xs" color="dimmed">
                        {product.order_count} orders
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text fw={700}>{product.total_quantity}</Text>
                      <Text size="xs" color="dimmed">
                        units sold
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </Paper>

            {/* Sales Distribution */}
            <Paper shadow="sm" p="md" withBorder className="mb-6">
              <Title order={4} className="mb-4">
                Sales Distribution
              </Title>

              <div className="flex justify-center mb-4">
                <RingProgress
                  size={180}
                  thickness={20}
                  sections={[
                    { value: 40, color: "blue" },
                    { value: 25, color: "orange" },
                    { value: 15, color: "green" },
                    { value: 20, color: "gray" },
                  ]}
                  label={
                    <div className="text-center">
                      <Text size="xs" color="dimmed">
                        Total
                      </Text>
                      <Text fw={700} size="xl">
                        {stats?.totalOrders || 0}
                      </Text>
                    </div>
                  }
                />
              </div>

              <div className="space-y-2">
                <Group justify="space-between">
                  <Group>
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <Text size="sm">Clothing</Text>
                  </Group>
                  <Text size="sm" fw={500}>
                    40%
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Group>
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <Text size="sm">Accessories</Text>
                  </Group>
                  <Text size="sm" fw={500}>
                    25%
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Group>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <Text size="sm">Footwear</Text>
                  </Group>
                  <Text size="sm" fw={500}>
                    15%
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Group>
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <Text size="sm">Others</Text>
                  </Group>
                  <Text size="sm" fw={500}>
                    20%
                  </Text>
                </Group>
              </div>
            </Paper>

            {/* Quick Stats */}
            <Paper shadow="sm" p="md" withBorder>
              <Title order={4} className="mb-4">
                Quick Stats
              </Title>

              <div className="space-y-4">
                <Group justify="space-between">
                  <Text size="sm">Pending Orders</Text>
                  <Badge color="yellow">12</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Low Stock Items</Text>
                  <Badge color="red">8</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">New Customers (Today)</Text>
                  <Badge color="green">5</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Support Tickets</Text>
                  <Badge color="blue">3</Badge>
                </Group>
              </div>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </AdminLayout>
  );
}
