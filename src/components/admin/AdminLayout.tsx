import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppShell,
  Text,
  UnstyledButton,
  Group,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../store/useAuth";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

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
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  ];

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 250,
        breakpoint: "sm",
      }}
      header={{
        height: 60,
      }}
    >
      <AppShell.Header p="xs">
        <div className="flex items-center h-full">
          <Title order={3} className="ml-2">
            Admin Dashboard
          </Title>
          <Link
            to="/"
            className="ml-auto text-sm text-blue-600 hover:underline"
          >
            Back to Store
          </Link>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="xs">
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            {menuItems.map((item) => (
              <Link
                to={item.path}
                key={item.path}
                className="no-underline text-inherit"
              >
                <UnstyledButton
                  className={`w-full p-2 rounded-md mb-2 hover:bg-gray-100 ${
                    isActive(item.path) ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  <Group>
                    <ThemeIcon
                      variant="light"
                      size={30}
                      color={isActive(item.path) ? "blue" : "gray"}
                    >
                      <item.icon size={18} />
                    </ThemeIcon>
                    <Text size="sm">{item.label}</Text>
                    {isActive(item.path) && (
                      <ChevronRight size={16} className="ml-auto" />
                    )}
                  </Group>
                </UnstyledButton>
              </Link>
            ))}
          </div>

          <div>
            <div className="my-2 border-t border-gray-200"></div>
            <UnstyledButton
              className="w-full p-2 rounded-md hover:bg-gray-100 text-red-600"
              onClick={handleLogout}
            >
              <Group>
                <ThemeIcon variant="light" size={30} color="red">
                  <LogOut size={18} />
                </ThemeIcon>
                <Text size="sm">Logout</Text>
              </Group>
            </UnstyledButton>
          </div>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
