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

const navLinks = [
  { label: "Products", to: "/products" },
  { label: "Categories", to: "/categories" },
  { label: "Sale", to: "/sale" },
  { label: "About", to: "/about" },
];

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const cartItemCount = items?.length || 0;
  const isAdmin = user?.role === "admin";
  const dashboardPath = isAdmin ? "/admin" : "/user/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
    closeDrawer();
  };

  const renderLinks = (onClick?: () => void) =>
    navLinks.map(({ label, to }) => (
      <Link
        key={to}
        to={to}
        onClick={onClick}
        className="text-gray-700 hover:text-blue-600 no-underline py-2"
      >
        {label}
      </Link>
    ));

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
            {renderLinks()}
          </Group>

          {/* Actions */}
          <Group gap={10}>
            <UnstyledButton className="hidden md:flex p-2 hover:bg-gray-100 rounded-full">
              <Search size={20} />
            </UnstyledButton>

            <Link
              to="/wishlist"
              className="p-2 hover:bg-gray-100 rounded-full no-underline"
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

            <Menu position="bottom-end" shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton className="p-2 hover:bg-gray-100 rounded-full">
                  {isAuthenticated ? (
                    <Avatar size="sm" color="blue" radius="xl">
                      {user?.name?.charAt(0) || "U"}
                    </Avatar>
                  ) : (
                    <User size={20} className="text-gray-700" />
                  )}
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                {isAuthenticated ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <Menu.Item component={Link} to="/login">
                      Login
                    </Menu.Item>
                    <Menu.Item component={Link} to="/signup">
                      Sign Up
                    </Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              className="md:hidden"
            />
          </Group>
        </div>
      </Container>

      {/* Mobile Drawer */}
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
          {renderLinks(closeDrawer)}
          <Divider my="sm" />
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                onClick={closeDrawer}
                className="text-gray-700 hover:text-blue-600 no-underline py-2"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={closeDrawer}
                className="text-gray-700 hover:text-blue-600 no-underline py-2"
              >
                Settings
              </Link>
              <UnstyledButton
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 py-2"
              >
                Logout
              </UnstyledButton>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeDrawer}
                className="text-gray-700 hover:text-blue-600 no-underline py-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeDrawer}
                className="text-gray-700 hover:text-blue-600 no-underline py-2"
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
