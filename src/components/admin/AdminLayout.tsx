import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppShell,
  Burger,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  ThemeIcon,
  Avatar,
  Menu,
  Divider,
  Box,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  Search,
  ChevronDown,
  HelpCircle,
  BarChart2,
  Tag,
  Layers,
} from "lucide-react";
import { useAuth } from "../../store/useAuth";
import { motion } from "framer-motion";

const MotionBox = motion(Box as any);

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [opened, { toggle }] = useDisclosure();
  const [notifications, setNotifications] = useState(3); // Mock notification count

  // Redirect if not admin
  React.useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/admin",
      description: "Overview and statistics",
    },
    {
      icon: Users,
      label: "Users",
      path: "/admin/users",
      description: "Manage system users",
    },
    {
      icon: Package,
      label: "Products",
      path: "/admin/products",
      description: "Manage product catalog",
    },
    {
      icon: ShoppingCart,
      label: "Orders",
      path: "/admin/orders",
      description: "View and manage orders",
    },
    {
      icon: Tag,
      label: "Categories",
      path: "/admin/categories",
      description: "Manage product categories",
    },
    {
      icon: BarChart2,
      label: "Analytics",
      path: "/admin/analytics",
      description: "Sales and performance metrics",
    },
    {
      icon: Layers,
      label: "Inventory",
      path: "/admin/inventory",
      description: "Stock management",
    },
  ];

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header p="md" className="border-b border-gray-200 bg-white">
        <div className="flex items-center h-full justify-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

          <div className="flex-1 max-w-md ml-auto mr-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <Group gap="md">
            <Menu position="bottom-end" shadow="md" width={300}>
              <Menu.Target>
                <ActionIcon
                  size="lg"
                  radius="xl"
                  variant="light"
                  className="relative"
                >
                  <Bell size={20} className="text-gray-600" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label className="flex justify-between items-center">
                  <Text fw={600}>Notifications</Text>
                  <Text size="xs" c="blue" className="cursor-pointer">
                    Mark all as read
                  </Text>
                </Menu.Label>
                <Menu.Item>
                  <div>
                    <Group gap="sm">
                      <ThemeIcon
                        color="blue"
                        size="lg"
                        radius="xl"
                        variant="light"
                      >
                        <ShoppingCart size={16} />
                      </ThemeIcon>
                      <div>
                        <Text size="sm" fw={500}>
                          New order received
                        </Text>
                        <Text size="xs" c="dimmed">
                          Order #1234 from John Doe
                        </Text>
                        <Text size="xs" c="dimmed">
                          5 minutes ago
                        </Text>
                      </div>
                    </Group>
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div>
                    <Group gap="sm">
                      <ThemeIcon
                        color="red"
                        size="lg"
                        radius="xl"
                        variant="light"
                      >
                        <Package size={16} />
                      </ThemeIcon>
                      <div>
                        <Text size="sm" fw={500}>
                          Low stock alert
                        </Text>
                        <Text size="xs" c="dimmed">
                          Premium Leather Jacket is running low
                        </Text>
                        <Text size="xs" c="dimmed">
                          1 hour ago
                        </Text>
                      </div>
                    </Group>
                  </div>
                </Menu.Item>
                <Divider />
                <Menu.Item>
                  <Text ta="center" c="blue">
                    View all notifications
                  </Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Menu position="bottom-end" shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton className="flex items-center gap-2">
                  <Avatar color="blue" radius="xl" size="md">
                    {user?.name?.charAt(0) || "A"}
                  </Avatar>
                  <div className="hidden md:block">
                    <Text size="sm" fw={500}>
                      {user?.name || "Admin"}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {user?.email || "admin@example.com"}
                    </Text>
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item
                  leftSection={<Settings size={14} />}
                  component={Link}
                  to="/profile"
                >
                  Settings
                </Menu.Item>
                <Menu.Item leftSection={<HelpCircle size={14} />}>
                  Help
                </Menu.Item>
                <Divider />
                <Menu.Item
                  color="red"
                  leftSection={<LogOut size={14} />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="xs" className="bg-white border-r border-gray-200">
        <AppShell.Section p="md" className="border-b border-gray-200">
          <Group justify="flex-start">
            <ThemeIcon size={36} radius="xl" className="bg-blue-500">
              <ShoppingCart size={20} />
            </ThemeIcon>
            <div>
              <Link to="/" className="no-underline">
                <Text c="dark" fw={700} size="lg">
                  Aashish
                </Text>
                <Text size="xs" c="dimmed">
                  Admin Panel
                </Text>
              </Link>
            </div>
          </Group>
        </AppShell.Section>

        <AppShell.Section grow component={ScrollArea} p="md">
          <Text
            c="dimmed"
            size="xs"
            fw={700}
            className="mb-3 uppercase tracking-wider"
          >
            Main
          </Text>
          {menuItems.slice(0, 4).map((item, index) => (
            <Tooltip
              key={item.path}
              label={item.description}
              position="right"
              withArrow
              transitionProps={{ duration: 200 }}
            >
              <Link
                to={item.path}
                className="no-underline text-inherit block mb-2"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <UnstyledButton
                    className={`w-full p-3 rounded-md hover:bg-gray-100 transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    <Group gap="sm">
                      <ThemeIcon
                        variant="light"
                        size={36}
                        radius="md"
                        color={isActive(item.path) ? "blue" : "gray"}
                        className="bg-opacity-20"
                      >
                        <item.icon size={18} />
                      </ThemeIcon>
                      <div>
                        <Text size="sm" fw={500}>
                          {item.label}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {item.description}
                        </Text>
                      </div>
                      {isActive(item.path) && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </Group>
                  </UnstyledButton>
                </motion.div>
              </Link>
            </Tooltip>
          ))}

          <Text
            c="dimmed"
            size="xs"
            fw={700}
            className="mt-6 mb-3 uppercase tracking-wider"
          >
            Advanced
          </Text>
          {menuItems.slice(4).map((item, index) => (
            <Tooltip
              key={item.path}
              label={item.description}
              position="right"
              withArrow
              transitionProps={{ duration: 200 }}
            >
              <Link
                to={item.path}
                className="no-underline text-inherit block mb-2"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 4) * 0.05, duration: 0.3 }}
                >
                  <UnstyledButton
                    className={`w-full p-3 rounded-md hover:bg-gray-100 transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    <Group gap="sm">
                      <ThemeIcon
                        variant="light"
                        size={36}
                        radius="md"
                        color={isActive(item.path) ? "blue" : "gray"}
                        className="bg-opacity-20"
                      >
                        <item.icon size={18} />
                      </ThemeIcon>
                      <div>
                        <Text size="sm" fw={500}>
                          {item.label}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {item.description}
                        </Text>
                      </div>
                      {isActive(item.path) && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </Group>
                  </UnstyledButton>
                </motion.div>
              </Link>
            </Tooltip>
          ))}
        </AppShell.Section>

        <AppShell.Section p="md" className="border-t border-gray-200">
          <UnstyledButton
            className="w-full p-3 rounded-md hover:bg-gray-100 text-gray-700"
            onClick={handleLogout}
          >
            <Group gap="sm">
              <ThemeIcon variant="light" size={36} radius="md" color="red">
                <LogOut size={18} />
              </ThemeIcon>
              <div>
                <Text size="sm" fw={500}>
                  Logout
                </Text>
                <Text size="xs" c="dimmed">
                  Exit admin panel
                </Text>
              </div>
            </Group>
          </UnstyledButton>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="min-h-full"
        >
          {children}
        </MotionBox>
      </AppShell.Main>
    </AppShell>
  );
}
