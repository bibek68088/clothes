import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Group,
  Burger,
  Drawer,
  UnstyledButton,
  Avatar,
  Text,
  Menu,
  Divider,
  Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  ShoppingBag,
  Search,
  Heart,
  User,
  LogOut,
  ShoppingCart,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { useAuth } from "../store/useAuth";
import { useCart } from "../store/useCart";

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const cartItemCount = items?.length || 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAdmin = user?.role === "admin";
  const dashboardPath = isAdmin ? "/admin" : "/user/dashboard";

  return (
    <header className="border-b border-gray-200 bg-white">
      <Container size="xl" className="py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <ShoppingBag size={28} className="text-blue-600" />
            <Text component="span" size="xl" fw={700} className="text-gray-900">
              Aashish
            </Text>
          </Link>

          {/* Desktop Navigation */}
          <Group gap={30} className="hidden md:flex">
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 no-underline"
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="text-gray-700 hover:text-blue-600 no-underline"
            >
              Categories
            </Link>
            <Link
              to="/sale"
              className="text-gray-700 hover:text-blue-600 no-underline"
            >
              Sale
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 no-underline"
            >
              About
            </Link>
          </Group>

          {/* Actions */}
          <Group gap={10}>
            <UnstyledButton className="hidden md:flex p-2 hover:bg-gray-100 rounded-full">
              <Search size={20} />
            </UnstyledButton>

            <Link
              to="/wishlist"
              className="p-2 hover:bg-gray-100 rounded-full relative no-underline"
            >
              <Heart size={20} className="text-gray-700" />
            </Link>

            <Link
              to="/cart"
              className="p-2 hover:bg-gray-100 rounded-full relative no-underline"
            >
              <ShoppingCart size={20} className="text-gray-700" />
              {cartItemCount > 0 && (
                <Badge
                  color="blue"
                  size="xs"
                  radius="xl"
                  className="absolute -top-1 -right-1"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>

            {isAuthenticated ? (
              <Menu position="bottom-end" shadow="md" width={200}>
                <Menu.Target>
                  <UnstyledButton className="p-2 hover:bg-gray-100 rounded-full">
                    <Avatar size="sm" color="blue" radius="xl">
                      {user?.name?.charAt(0) || "U"}
                    </Avatar>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>
                    <Text fw={500}>{user?.name}</Text>
                    <Text size="xs" c="dimmed">
                      {user?.email}
                    </Text>
                  </Menu.Label>

                  <Menu.Divider />

                  <Menu.Item
                    leftSection={<LayoutDashboard size={16} />}
                    component={Link}
                    to={dashboardPath}
                  >
                    Dashboard
                  </Menu.Item>

                  <Menu.Item
                    leftSection={<Settings size={16} />}
                    component={Link}
                    to="/profile"
                  >
                    Settings
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item
                    leftSection={<LogOut size={16} />}
                    onClick={handleLogout}
                    color="red"
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Link
                to="/login"
                className="p-2 hover:bg-gray-100 rounded-full no-underline"
              >
                <User size={20} className="text-gray-700" />
              </Link>
            )}

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              className="md:hidden"
            />
          </Group>
        </div>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} className="text-blue-600" />
            <Text fw={700}>Aashish</Text>
          </div>
        }
        zIndex={1000}
      >
        <div className="flex flex-col gap-4">
          <Link
            to="/products"
            className="text-gray-700 hover:text-blue-600 no-underline py-2"
            onClick={closeDrawer}
          >
            Products
          </Link>
          <Link
            to="/categories"
            className="text-gray-700 hover:text-blue-600 no-underline py-2"
            onClick={closeDrawer}
          >
            Categories
          </Link>
          <Link
            to="/sale"
            className="text-gray-700 hover:text-blue-600 no-underline py-2"
            onClick={closeDrawer}
          >
            Sale
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-600 no-underline py-2"
            onClick={closeDrawer}
          >
            About
          </Link>

          <Divider my="sm" />

          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className="text-gray-700 hover:text-blue-600 no-underline py-2"
                onClick={closeDrawer}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-blue-600 no-underline py-2"
                onClick={closeDrawer}
              >
                Settings
              </Link>
              <UnstyledButton
                className="text-red-600 hover:text-red-700 py-2"
                onClick={() => {
                  handleLogout();
                  closeDrawer();
                }}
              >
                Logout
              </UnstyledButton>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 no-underline py-2"
                onClick={closeDrawer}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 hover:text-blue-600 no-underline py-2"
                onClick={closeDrawer}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </Drawer>
    </header>
  );
}
