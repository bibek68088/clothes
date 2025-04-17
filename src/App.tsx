import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import LoginPage from "./pages/user/LogIn";
import SignupPage from "./pages/user/Signup";
import UserDashboard from "./pages/user/Dashboard";
import { SettingsPage } from "./pages/user/Settings";
import { WishlistPage } from "./pages/WishlistPage";
import { AdminDashboard } from "./components/admin/Dashboard";
import { AdminUsers } from "./components/admin/Users";
import { AdminProducts } from "./components/admin/Products";
import { AdminOrders } from "./components/admin/Orders";
import { AuthGuard } from "./components/auth/auth-guard";

// Component to conditionally render the footer
function AppContent() {
  const location = useLocation();

  // Pages where footer should not be shown
  const noFooterPages = [
    "/login",
    "/signup",
    "/profile",
    "/user/dashboard",
    "/admin",
    "/admin/users",
    "/admin/products",
    "/admin/orders",
    "/orders",
  ];

  // Check if current path starts with any of the noFooterPages
  const shouldShowFooter = !noFooterPages.some(
    (page) =>
      location.pathname === page || location.pathname.startsWith(`${page}/`)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/wishlist"
            element={
              <AuthGuard>
                <WishlistPage />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <SettingsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <AuthGuard>
                <UserDashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/orders"
            element={
              <AuthGuard>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Order History</h2>
                  <p>Your order history will be displayed here.</p>
                </div>
              </AuthGuard>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <AuthGuard>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                  <p>Order details will be displayed here.</p>
                </div>
              </AuthGuard>
            }
          />
          <Route
            path="/addresses"
            element={
              <AuthGuard>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Saved Addresses</h2>
                  <p>Your saved addresses will be displayed here.</p>
                </div>
              </AuthGuard>
            }
          />
          <Route
            path="/payment-methods"
            element={
              <AuthGuard>
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
                  <p>Your payment methods will be displayed here.</p>
                </div>
              </AuthGuard>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AuthGuard adminRequired>
                <AdminDashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AuthGuard adminRequired>
                <AdminUsers />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AuthGuard adminRequired>
                <AdminProducts />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AuthGuard adminRequired>
                <AdminOrders />
              </AuthGuard>
            }
          />
        </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Router>
        <AppContent />
      </Router>
    </MantineProvider>
  );
}
