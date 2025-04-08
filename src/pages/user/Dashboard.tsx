import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Badge,
  Avatar,
  Card,
  Progress,
  RingProgress,
  Divider,
  Skeleton,
  ThemeIcon,
  SimpleGrid,
  Indicator,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import {
  ShoppingBag,
  Package,
  Heart,
  CreditCard,
  Settings,
  Bell,
  ChevronRight,
  Home,
  Calendar,
  TrendingUp,
  Tag,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Star,
  Wallet,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  User,
  MapPin,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper as any);
const MotionCard = motion(Card as any);

interface OrderSummary {
  id: string;
  date: string;
  status: string;
  total: number;
  items?: number;
}

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  discount?: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "order" | "promo" | "system";
  read: boolean;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    totalOrders: 12,
    totalSpent: 1249.85,
    loyaltyPoints: 250,
    savedAddresses: 2,
    wishlistItems: 4,
    cartItems: 2,
    orderGrowth: 15,
    spendingGrowth: -5,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, these would be actual API calls
        // For now, we'll use mock data

        // Mock recent orders
        setRecentOrders([
          {
            id: "ORD-1234",
            date: "2023-11-15",
            status: "delivered",
            total: 129.99,
            items: 3,
          },
          {
            id: "ORD-1235",
            date: "2023-11-10",
            status: "shipped",
            total: 79.5,
            items: 1,
          },
          {
            id: "ORD-1236",
            date: "2023-11-05",
            status: "processing",
            total: 199.99,
            items: 2,
          },
        ]);

        // Mock wishlist items
        setWishlistItems([
          {
            id: "1",
            name: "Premium Leather Jacket",
            image: "/images/jacket.jpg",
            price: 199.99,
          },
          {
            id: "2",
            name: "Designer Jeans",
            image: "/images/jeans.jpg",
            price: 89.99,
            discount: 20,
          },
          {
            id: "3",
            name: "Casual Sneakers",
            image: "/images/sneakers.jpg",
            price: 69.99,
          },
          {
            id: "4",
            name: "Wool Sweater",
            image: "/images/sweater.jpg",
            price: 59.99,
            discount: 15,
          },
        ]);

        // Mock notifications
        setNotifications([
          {
            id: "1",
            title: "Order Shipped",
            message: "Your order #ORD-1235 has been shipped and is on its way.",
            date: "2023-11-12",
            type: "order",
            read: false,
          },
          {
            id: "2",
            title: "Special Offer",
            message: "Get 20% off on all jackets this weekend!",
            date: "2023-11-10",
            type: "promo",
            read: true,
          },
          {
            id: "3",
            title: "Account Security",
            message:
              "We noticed a login from a new device. Please verify it was you.",
            date: "2023-11-08",
            type: "system",
            read: false,
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={14} />;
      case "processing":
        return <Tag size={14} />;
      case "shipped":
        return <Truck size={14} />;
      case "delivered":
        return <CheckCircle size={14} />;
      case "cancelled":
        return <AlertCircle size={14} />;
      default:
        return <Package size={14} />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="text-blue-500" />;
      case "promo":
        return <Percent className="text-green-500" />;
      case "system":
        return <AlertCircle className="text-orange-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Container size="xl">
        {/* Welcome Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-8"
        >
          <MotionPaper
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white overflow-hidden relative"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-32 -mr-32"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-20 -ml-20"></div>

            <Group align="flex-start" justify="space-between">
              <Group>
                <Avatar
                  size="xl"
                  radius="xl"
                  color="blue"
                  className="border-4 border-white/30 shadow-lg"
                >
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
                <div>
                  <Text size="sm" className="text-blue-100">
                    Welcome back,
                  </Text>
                  <Title order={2} className="mb-1 text-white">
                    {user?.name || "User"}
                  </Title>
                  <Text size="sm" className="text-blue-100">
                    {user?.email}
                  </Text>
                </div>
              </Group>

              <Button
                variant="white"
                leftSection={<Home size={14} />}
                onClick={() => navigate("/")}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
              >
                Back to Shop
              </Button>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} className="mt-8">
              <MotionPaper
                variants={itemVariants}
                className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
              >
                <Group justify="space-between" mb="xs">
                  <Text size="sm" className="text-blue-100">
                    Loyalty Points
                  </Text>
                  <ThemeIcon
                    radius="xl"
                    size="sm"
                    variant="filled"
                    color="blue"
                  >
                    <Sparkles size={12} />
                  </ThemeIcon>
                </Group>
                <Group justify="space-between" align="flex-end">
                  <Text size="xl" fw={700} className="text-white">
                    {stats.loyaltyPoints} pts
                  </Text>
                  <Badge color="blue.3" variant="light">
                    Gold Tier
                  </Badge>
                </Group>
                <Progress
                  value={25}
                  size="sm"
                  className="mt-2"
                  color="rgba(255,255,255,0.7)"
                  radius="xl"
                />
                <Text size="xs" className="text-blue-100 mt-1">
                  250 more points to Platinum
                </Text>
              </MotionPaper>

              <MotionPaper
                variants={itemVariants}
                className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
              >
                <Group justify="space-between" mb="xs">
                  <Text size="sm" className="text-blue-100">
                    Total Orders
                  </Text>
                  <ThemeIcon
                    radius="xl"
                    size="sm"
                    variant="filled"
                    color="teal"
                  >
                    <Package size={12} />
                  </ThemeIcon>
                </Group>
                <Group justify="space-between" align="flex-end">
                  <Text size="xl" fw={700} className="text-white">
                    {stats.totalOrders}
                  </Text>
                  <Group gap={4}>
                    <ArrowUpRight size={14} className="text-green-300" />
                    <Text size="xs" className="text-green-300">
                      {stats.orderGrowth}%
                    </Text>
                  </Group>
                </Group>
                <Text size="xs" className="text-blue-100 mt-3">
                  <Calendar size={12} className="inline mr-1" />
                  Last order on{" "}
                  {new Date(
                    recentOrders[0]?.date || Date.now()
                  ).toLocaleDateString()}
                </Text>
              </MotionPaper>

              <MotionPaper
                variants={itemVariants}
                className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
              >
                <Group justify="space-between" mb="xs">
                  <Text size="sm" className="text-blue-100">
                    Total Spent
                  </Text>
                  <ThemeIcon
                    radius="xl"
                    size="sm"
                    variant="filled"
                    color="yellow"
                  >
                    <Wallet size={12} />
                  </ThemeIcon>
                </Group>
                <Group justify="space-between" align="flex-end">
                  <Text size="xl" fw={700} className="text-white">
                    ${stats.totalSpent.toFixed(2)}
                  </Text>
                  <Group gap={4}>
                    <ArrowDownRight size={14} className="text-red-300" />
                    <Text size="xs" className="text-red-300">
                      {Math.abs(stats.spendingGrowth)}%
                    </Text>
                  </Group>
                </Group>
                <Text size="xs" className="text-blue-100 mt-3">
                  <TrendingUp size={12} className="inline mr-1" />
                  Avg. ${(stats.totalSpent / stats.totalOrders).toFixed(2)} per
                  order
                </Text>
              </MotionPaper>

              <MotionPaper
                variants={itemVariants}
                className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
              >
                <Group justify="space-between" mb="xs">
                  <Text size="sm" className="text-blue-100">
                    Saved Items
                  </Text>
                  <ThemeIcon
                    radius="xl"
                    size="sm"
                    variant="filled"
                    color="pink"
                  >
                    <Heart size={12} />
                  </ThemeIcon>
                </Group>
                <Group justify="space-between" align="flex-end">
                  <Text size="xl" fw={700} className="text-white">
                    {stats.wishlistItems}
                  </Text>
                  <Badge color="pink.3" variant="light">
                    <ShoppingCart size={10} className="mr-1" />
                    {stats.cartItems} in cart
                  </Badge>
                </Group>
                <Text size="xs" className="text-blue-100 mt-3">
                  <Tag size={12} className="inline mr-1" />
                  Items worth $
                  {wishlistItems
                    .reduce((sum, item) => sum + item.price, 0)
                    .toFixed(2)}
                </Text>
              </MotionPaper>
            </SimpleGrid>
          </MotionPaper>
        </motion.div>

        <Grid gutter={24}>
          {/* Left Column - Navigation & Notifications */}
          <Grid.Col span={{ base: 12, md: 4 }} order={{ md: 2 }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <MotionPaper
                variants={itemVariants}
                shadow="sm"
                radius="md"
                p="md"
                withBorder
                className="mb-6 bg-white"
              >
                <Title order={4} className="mb-4 flex items-center gap-2">
                  <User size={18} className="text-blue-500" />
                  Account Menu
                </Title>
                <div className="space-y-2">
                  <Link to="/user/dashboard" className="no-underline">
                    <Button
                      variant="light"
                      fullWidth
                      leftSection={<ShoppingBag size={18} />}
                      className="justify-start bg-blue-50 text-blue-600 font-medium"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/orders" className="no-underline">
                    <Button
                      variant="light"
                      fullWidth
                      leftSection={<Package size={18} />}
                      className="justify-start hover:bg-gray-100 font-medium"
                    >
                      My Orders
                    </Button>
                  </Link>
                  <Link to="/wishlist" className="no-underline">
                    <Button
                      variant="light"
                      fullWidth
                      leftSection={<Heart size={18} />}
                      className="justify-start hover:bg-gray-100 font-medium"
                    >
                      Wishlist
                    </Button>
                  </Link>
                  <Link to="/payment-methods" className="no-underline">
                    <Button
                      variant="light"
                      fullWidth
                      leftSection={<CreditCard size={18} />}
                      className="justify-start hover:bg-gray-100 font-medium"
                    >
                      Payment Methods
                    </Button>
                  </Link>
                  <Link to="/profile" className="no-underline">
                    <Button
                      variant="light"
                      fullWidth
                      leftSection={<Settings size={18} />}
                      className="justify-start hover:bg-gray-100 font-medium"
                    >
                      Account Settings
                    </Button>
                  </Link>
                  <Link to="/addresses" className="no-underline">
                    <Button
                      variant="light"
                      fullWidth
                      leftSection={<MapPin size={18} />}
                      className="justify-start hover:bg-gray-100 font-medium"
                    >
                      Saved Addresses
                    </Button>
                  </Link>
                </div>
              </MotionPaper>

              <MotionPaper
                variants={itemVariants}
                shadow="sm"
                radius="md"
                p="md"
                withBorder
                className="bg-white"
              >
                <Group justify="space-between">
                  <Title order={4} className="mb-4 flex items-center gap-2">
                    <Bell size={18} className="text-blue-500" />
                    Notifications
                  </Title>
                  <Indicator
                    inline
                    label={notifications.filter((n) => !n.read).length}
                    size={18}
                    color="red"
                    disabled={!notifications.filter((n) => !n.read).length}
                  >
                    <Button variant="subtle" size="compact-sm">
                      View All
                    </Button>
                  </Indicator>
                </Group>

                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <MotionPaper
                      key={notification.id}
                      variants={itemVariants}
                      className={`flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 border ${
                        notification.read
                          ? "border-gray-100"
                          : "border-blue-100 bg-blue-50"
                      }`}
                    >
                      <ThemeIcon
                        variant="light"
                        radius="xl"
                        size="lg"
                        color={
                          notification.type === "order"
                            ? "blue"
                            : notification.type === "promo"
                            ? "green"
                            : "orange"
                        }
                      >
                        {getNotificationIcon(notification.type)}
                      </ThemeIcon>
                      <div className="flex-1">
                        <Group justify="space-between">
                          <Text size="sm" fw={600}>
                            {notification.title}
                          </Text>
                          {!notification.read && (
                            <Badge
                              color="red"
                              size="xs"
                              variant="filled"
                              radius="xl"
                            >
                              New
                            </Badge>
                          )}
                        </Group>
                        <Text size="xs" c="dimmed">
                          {notification.message}
                        </Text>
                        <Text size="xs" c="dimmed" className="mt-1">
                          {new Date(notification.date).toLocaleDateString()}
                        </Text>
                      </div>
                    </MotionPaper>
                  ))}

                  {notifications.length === 0 && (
                    <Text c="dimmed" ta="center" py="md">
                      No notifications
                    </Text>
                  )}
                </div>
              </MotionPaper>
            </motion.div>
          </Grid.Col>

          {/* Right Column - Content */}
          <Grid.Col span={{ base: 12, md: 8 }} order={{ md: 1 }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {/* Recent Orders */}
              <MotionPaper
                variants={itemVariants}
                shadow="sm"
                radius="md"
                p="md"
                withBorder
                className="mb-6 bg-white"
              >
                <Group justify="space-between" className="mb-4">
                  <Title order={4} className="flex items-center gap-2">
                    <Package size={18} className="text-blue-500" />
                    Recent Orders
                  </Title>
                  <Button
                    variant="light"
                    rightSection={<ChevronRight size={16} />}
                    component={Link}
                    to="/orders"
                    size="compact-sm"
                  >
                    View All
                  </Button>
                </Group>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} height={80} radius="md" />
                    ))}
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <MotionPaper
                        key={order.id}
                        variants={itemVariants}
                        className="p-4 border border-gray-100 rounded-lg hover:border-blue-100 hover:bg-blue-50/30 transition-colors"
                      >
                        <Group justify="space-between">
                          <div>
                            <Group gap="xs">
                              <Text fw={600} size="sm">
                                {order.id}
                              </Text>
                              <Badge
                                color={getStatusColor(order.status)}
                                variant="light"
                                leftSection={getStatusIcon(order.status)}
                                size="sm"
                              >
                                {order.status}
                              </Badge>
                            </Group>
                            <Text size="xs" c="dimmed" mt={4}>
                              <Calendar size={12} className="inline mr-1" />
                              {new Date(order.date).toLocaleDateString()}
                            </Text>
                          </div>
                          <div className="text-right">
                            <Text fw={700} size="md" className="text-blue-600">
                              ${order.total.toFixed(2)}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {order.items}{" "}
                              {order.items === 1 ? "item" : "items"}
                            </Text>
                          </div>
                        </Group>
                        <Divider my="sm" />
                        <Group justify="space-between">
                          <Button
                            variant="subtle"
                            size="xs"
                            leftSection={<Eye size={14} />}
                            component={Link}
                            to={`/orders/${order.id}`}
                          >
                            View Details
                          </Button>
                          {order.status === "delivered" && (
                            <Button
                              variant="subtle"
                              size="xs"
                              leftSection={<Star size={14} />}
                            >
                              Write Review
                            </Button>
                          )}
                          {order.status === "shipped" && (
                            <Button
                              variant="subtle"
                              size="xs"
                              leftSection={<Truck size={14} />}
                            >
                              Track Package
                            </Button>
                          )}
                        </Group>
                      </MotionPaper>
                    ))}
                  </div>
                ) : (
                  <Text c="dimmed" ta="center" className="py-4">
                    No recent orders found
                  </Text>
                )}
              </MotionPaper>

              {/* Order Statistics */}
              <MotionPaper
                variants={itemVariants}
                shadow="sm"
                radius="md"
                p="md"
                withBorder
                className="mb-6 bg-white"
              >
                <Title order={4} className="mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-500" />
                  Shopping Statistics
                </Title>

                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                  <Card p="md" radius="md" withBorder>
                    <RingProgress
                      size={80}
                      roundCaps
                      thickness={8}
                      sections={[{ value: 65, color: "blue" }]}
                      label={
                        <Text fw={700} ta="center" size="lg">
                          65%
                        </Text>
                      }
                      className="mx-auto mb-2"
                    />
                    <Text ta="center" fw={500}>
                      Repeat Purchases
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                      You often buy the same products
                    </Text>
                  </Card>

                  <Card p="md" radius="md" withBorder>
                    <RingProgress
                      size={80}
                      roundCaps
                      thickness={8}
                      sections={[{ value: 42, color: "teal" }]}
                      label={
                        <Text fw={700} ta="center" size="lg">
                          42%
                        </Text>
                      }
                      className="mx-auto mb-2"
                    />
                    <Text ta="center" fw={500}>
                      Discount Savings
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                      Average savings on purchases
                    </Text>
                  </Card>

                  <Card p="md" radius="md" withBorder>
                    <RingProgress
                      size={80}
                      roundCaps
                      thickness={8}
                      sections={[{ value: 78, color: "violet" }]}
                      label={
                        <Text fw={700} ta="center" size="lg">
                          78%
                        </Text>
                      }
                      className="mx-auto mb-2"
                    />
                    <Text ta="center" fw={500}>
                      On-time Delivery
                    </Text>
                    <Text size="xs" c="dimmed" ta="center">
                      Orders arrived on schedule
                    </Text>
                  </Card>
                </SimpleGrid>
              </MotionPaper>

              {/* Wishlist Preview */}
              <MotionPaper
                variants={itemVariants}
                shadow="sm"
                radius="md"
                p="md"
                withBorder
                className="bg-white"
              >
                <Group justify="space-between" className="mb-4">
                  <Title order={4} className="flex items-center gap-2">
                    <Heart size={18} className="text-blue-500" />
                    Wishlist
                  </Title>
                  <Button
                    variant="light"
                    rightSection={<ChevronRight size={16} />}
                    component={Link}
                    to="/wishlist"
                    size="compact-sm"
                  >
                    View All
                  </Button>
                </Group>

                {loading ? (
                  <Grid>
                    {[1, 2, 3, 4].map((i) => (
                      <Grid.Col key={i} span={{ base: 6, xs: 3 }}>
                        <Skeleton height={200} radius="md" />
                      </Grid.Col>
                    ))}
                  </Grid>
                ) : (
                  <Grid>
                    {wishlistItems.map((item) => (
                      <Grid.Col key={item.id} span={{ base: 6, xs: 3 }}>
                        <MotionCard
                          variants={itemVariants}
                          shadow="sm"
                          p="md"
                          radius="md"
                          withBorder
                          className="h-full flex flex-col"
                        >
                          <Card.Section className="relative">
                            {item.discount && (
                              <Badge
                                color="red"
                                className="absolute top-2 right-2 z-10"
                              >
                                {item.discount}% OFF
                              </Badge>
                            )}
                            <img
                              src={
                                item.image ||
                                "/placeholder.svg?height=150&width=200"
                              }
                              alt={item.name}
                              className="w-full h-32 object-cover"
                            />
                          </Card.Section>

                          <Text fw={500} className="mt-2 line-clamp-1">
                            {item.name}
                          </Text>

                          <Group justify="space-between" className="mt-1">
                            <Text
                              fw={700}
                              className={
                                item.discount
                                  ? "line-through text-gray-400 text-sm"
                                  : ""
                              }
                            >
                              ${item.price.toFixed(2)}
                            </Text>
                            {item.discount && (
                              <Text fw={700} className="text-red-500">
                                $
                                {(
                                  item.price *
                                  (1 - item.discount / 100)
                                ).toFixed(2)}
                              </Text>
                            )}
                          </Group>

                          <Group
                            className="mt-auto pt-3"
                            justify="space-between"
                          >
                            <Button
                              variant="light"
                              size="xs"
                              component={Link}
                              to={`/product/${item.id}`}
                              leftSection={<Eye size={14} />}
                            >
                              View
                            </Button>
                            <Button
                              variant="light"
                              size="xs"
                              color="blue"
                              leftSection={<ShoppingCart size={14} />}
                            >
                              Add to Cart
                            </Button>
                          </Group>
                        </MotionCard>
                      </Grid.Col>
                    ))}

                    {wishlistItems.length === 0 && (
                      <Grid.Col span={12}>
                        <Text c="dimmed" ta="center" className="py-4">
                          Your wishlist is empty
                        </Text>
                      </Grid.Col>
                    )}
                  </Grid>
                )}
              </MotionPaper>
            </motion.div>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}
