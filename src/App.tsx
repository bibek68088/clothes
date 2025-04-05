"use client";

import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

// Components
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AuthGuard } from "./components/auth/auth-guard";

// Pages that don't need lazy loading (frequently accessed)
import { HomePage } from "./pages/HomePage";
import LoginPage from "./components/auth/Login";
import SignupPage from "./pages/user/Signup";

// Lazy loaded pages for better performance
const ProductPage = lazy(() =>
  import("./pages/ProductPage").then((module) => ({
    default: module.ProductPage,
  }))
);
const CartPage = lazy(() =>
  import("./pages/CartPage").then((module) => ({ default: module.CartPage }))
);
const ProfilePage = lazy(() =>
  import("./pages/user/Profile").then((module) => ({ default: module.default }))
);
const CheckoutPage = lazy(() =>
  import("./pages/checkout/CheckoutPage").then((module) => ({
    default: module.CheckoutPage,
  }))
);
const WishlistPage = lazy(() =>
  import("./pages/WishlistPage").then((module) => ({
    default: module.WishlistPage,
  }))
);

// Add this import
const UserDashboard = lazy(() =>
  import("./pages/user/Dashboard").then((module) => ({
    default: module.default,
  }))
);

// Admin Pages - lazy loaded
const AdminDashboard = lazy(() =>
  import("./components/admin/Dashboard").then((module) => ({
    default: module.AdminDashboard,
  }))
);
const AdminUsers = lazy(() =>
  import("./components/admin/Users").then((module) => ({
    default: module.AdminUsers,
  }))
);
const AdminProducts = lazy(() =>
  import("./components/admin/Products").then((module) => ({
    default: module.AdminProducts,
  }))
);
const AdminOrders = lazy(() =>
  import("./components/admin/Orders").then((module) => ({
    default: module.AdminOrders,
  }))
);

// Hooks\
import { useAuth } from "./store/useAuth";
import { useCart } from "./store/useCart";

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Admin routes configuration
const adminRoutes = [
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/admin/users", element: <AdminUsers /> },
  { path: "/admin/products", element: <AdminProducts /> },
  { path: "/admin/orders", element: <AdminOrders /> },
];

// Update the protectedRoutes array to include the user dashboard
const protectedRoutes = [
  { path: "/profile", element: <ProfilePage /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/wishlist", element: <WishlistPage /> },
  { path: "/user/dashboard", element: <UserDashboard /> }, // Add this line
];

// Public routes configuration
const publicRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/product/:id", element: <ProductPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "*", element: <Navigate to="/" replace /> },
];

function App() {
  const { isAuthenticated } = useAuth();
  const { fetchCart } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  return (
    <MantineProvider theme={{ primaryColor: "blue" }}>
      <BrowserRouter>
        <div className="min-h-screen bg-white flex flex-col">
          <Header />
          <main className="flex-grow">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Admin Routes - require admin role */}
                {adminRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={<AuthGuard adminRequired>{element}</AuthGuard>}
                  />
                ))}

                {/* Protected Routes - require authentication */}
                {protectedRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={<AuthGuard>{element}</AuthGuard>}
                  />
                ))}

                {/* Public Routes */}
                {publicRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
