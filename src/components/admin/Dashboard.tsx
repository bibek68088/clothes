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
  Tooltip,
  Progress,
  Button,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
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
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper as any);
const MotionCard = motion(Card as any);

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
  const [refreshing, setRefreshing] = useState(false);

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

  const refreshData = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
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
          <Loader size="lg" type="dots" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-4">
          <Text c="red">{error}</Text>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container size="xl" py="md">
        <MotionPaper
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          shadow="sm"
          radius="md"
          p="md"
          mb={24}
          withBorder
        >
          <Group justify="space-between" mb="md">
            <div>
              <Title order={2} className="flex items-center gap-2">
                <TrendingUp className="text-blue-500" />
                Dashboard Overview
              </Title>
              <Text c="dimmed" size="sm">
                Welcome back, {user?.name}. Here's what's happening with your
                store today.
              </Text>
            </div>
            <Group>
              <Tooltip label="Last updated: Today at 10:30 AM">
                <Text size="sm" c="dimmed" className="flex items-center gap-1">
                  <Clock size={14} />
                  Last 30 Days
                </Text>
              </Tooltip>
              <ActionIcon
                size="lg"
                variant="light"
                color="blue"
                onClick={refreshData}
                disabled={refreshing}
                radius="md"
              >
                <RefreshCw
                  size={18}
                  className={refreshing ? "animate-spin" : ""}
                />
              </ActionIcon>
            </Group>
          </Group>

          {/* Stats Cards */}
          <Grid mb="lg">
            {[
              {
                title: "Total Users",
                value: stats?.totalUsers.toLocaleString() || "0",
                icon: Users,
                color: "blue",
                growth: stats?.userGrowth || 0,
                subtitle: "vs last month",
                custom: (
                  <Progress
                    value={65}
                    size="sm"
                    mt="xs"
                    color="blue"
                    radius="xl"
                  />
                ),
              },
              {
                title: "Total Products",
                value: stats?.totalProducts.toLocaleString() || "0",
                icon: Package,
                color: "green",
                subtitle: `${topProducts.length} top sellers`,
                custom: (
                  <Group gap="xs" mt="xs">
                    <Badge color="green" variant="light">
                      Active: 78
                    </Badge>
                    <Badge color="red" variant="light">
                      Out of Stock: 8
                    </Badge>
                  </Group>
                ),
              },
              {
                title: "Total Orders",
                value: stats?.totalOrders.toLocaleString() || "0",
                icon: ShoppingBag,
                color: "purple",
                growth: stats?.orderGrowth || 0,
                subtitle: "vs last month",
                custom: (
                  <Group gap="xs" mt="xs">
                    <Badge color="yellow" variant="light">
                      Pending: 12
                    </Badge>
                    <Badge color="green" variant="light">
                      Delivered: 289
                    </Badge>
                  </Group>
                ),
              },
              {
                title: "Total Revenue",
                value: `$${
                  stats?.totalRevenue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "0.00"
                }`,
                icon: DollarSign,
                color: "yellow",
                growth: stats?.revenueGrowth || 0,
                subtitle: "vs last month",
                custom: (
                  <Progress
                    value={85}
                    size="sm"
                    mt="xs"
                    color="yellow"
                    radius="xl"
                  />
                ),
              },
            ].map((stat, index) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={stat.title}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  shadow="sm"
                  p="lg"
                  radius="md"
                  withBorder
                  h="100%"
                >
                  <Group justify="space-between">
                    <div>
                      <Text
                        size="xs"
                        c="dimmed"
                        className="uppercase font-semibold"
                      >
                        {stat.title}
                      </Text>
                      <Title order={3}>{stat.value}</Title>
                    </div>
                    <ThemeIcon
                      size={48}
                      radius="md"
                      className={`bg-${stat.color}-100 text-${stat.color}-600`}
                    >
                      <stat.icon size={24} />
                    </ThemeIcon>
                  </Group>

                  {stat.growth !== undefined && (
                    <Group justify="space-between" mt="xs">
                      <Text size="sm" c={stat.growth > 0 ? "green" : "red"}>
                        <span className="inline-flex items-center">
                          {stat.growth > 0 ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )}
                          {Math.abs(stat.growth)}%
                        </span>
                      </Text>
                      <Text size="xs" c="dimmed">
                        {stat.subtitle}
                      </Text>
                    </Group>
                  )}

                  {stat.custom}
                </MotionCard>
              </Grid.Col>
            ))}
          </Grid>

          <Grid gutter={{ base: 16, md: 24 }}>
            {/* Sales Overview */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                shadow="sm"
                p="md"
                withBorder
                mb="md"
              >
                <Group justify="space-between" mb="md">
                  <Title order={4}>Sales Overview</Title>
                  <Badge color="blue">Last 30 Days</Badge>
                </Group>

                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                  <Text c="dimmed">Sales chart would go here</Text>
                </div>

                <Grid mt="md">
                  <Grid.Col span={{ base: 12, xs: 4 }}>
                    <div className="text-center">
                      <Text size="sm" c="dimmed">
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
                  <Grid.Col span={{ base: 12, xs: 4 }}>
                    <div className="text-center">
                      <Text size="sm" c="dimmed">
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
                  <Grid.Col span={{ base: 12, xs: 4 }}>
                    <div className="text-center">
                      <Text size="sm" c="dimmed">
                        Conversion Rate
                      </Text>
                      <Text size="xl" fw={700}>
                        3.2%
                      </Text>
                    </div>
                  </Grid.Col>
                </Grid>
              </MotionPaper>

              {/* Recent Orders */}
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                shadow="sm"
                p="md"
                withBorder
              >
                <Group justify="space-between" mb="md">
                  <Title order={4}>Recent Orders</Title>
                  <Group>
                    <Badge color="blue">Today</Badge>
                    <Button
                      variant="subtle"
                      rightSection={<ChevronRight size={16} />}
                      component={Link}
                      to="/admin/orders"
                    >
                      View All
                    </Button>
                  </Group>
                </Group>

                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Order ID</Table.Th>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {recentOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.4 + index * 0.05,
                          duration: 0.3,
                        }}
                      >
                        <Table.Td>{order.id}</Table.Td>
                        <Table.Td>{order.customer_name}</Table.Td>
                        <Table.Td>
                          {new Date(order.created_at).toLocaleDateString()}
                        </Table.Td>
                        <Table.Td>
                          <Badge color={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </Table.Td>
                        <Table.Td>${order.total_amount.toFixed(2)}</Table.Td>
                        <Table.Td>
                          <Tooltip label="View Order">
                            <ActionIcon
                              color="blue"
                              variant="light"
                              radius="md"
                            >
                              <Eye size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Table.Td>
                      </motion.tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <Table.Tr>
                        <Table.Td colSpan={6} className="text-center py-4">
                          No recent orders
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </MotionPaper>
            </Grid.Col>

            {/* Right Column */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              {/* Top Products */}
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                shadow="sm"
                p="md"
                withBorder
                mb="md"
              >
                <Group justify="space-between" mb="md">
                  <Title order={4}>Top Selling Products</Title>
                </Group>

                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
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
                        <Text size="xs" c="dimmed">
                          {product.order_count} orders
                        </Text>
                      </div>
                      <div className="text-right">
                        <Text fw={700}>{product.total_quantity}</Text>
                        <Text size="xs" c="dimmed">
                          units sold
                        </Text>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </MotionPaper>

              {/* Sales Distribution */}
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                shadow="sm"
                p="md"
                withBorder
                mb="md"
              >
                <Title order={4} mb="md">
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
                        <Text size="xs" c="dimmed">
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
                    <Group gap="xs">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <Text size="sm">Clothing</Text>
                    </Group>
                    <Text size="sm" fw={500}>
                      40%
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Group gap="xs">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <Text size="sm">Accessories</Text>
                    </Group>
                    <Text size="sm" fw={500}>
                      25%
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Group gap="xs">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <Text size="sm">Footwear</Text>
                    </Group>
                    <Text size="sm" fw={500}>
                      15%
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Group gap="xs">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <Text size="sm">Others</Text>
                    </Group>
                    <Text size="sm" fw={500}>
                      20%
                    </Text>
                  </Group>
                </div>
              </MotionPaper>

              {/* Quick Stats */}
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                shadow="sm"
                p="md"
                withBorder
              >
                <Title order={4} mb="md">
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
              </MotionPaper>
            </Grid.Col>
          </Grid>
        </MotionPaper>
      </Container>
    </AdminLayout>
  );
}
