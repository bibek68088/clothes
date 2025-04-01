import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import LoginPage from "./pages/user/Login";
import SignupPage from "./pages/user/Signup";
import ProfilePage from "./pages/user/Profile";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { AuthGuard } from "./components/auth/auth-guard";

function App() {
  return (
    <MantineProvider
      theme={{
        primaryColor: "blue",
      }}
    >
      <Router>
        <div className="min-h-screen bg-white flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route
                path="/profile"
                element={
                  <AuthGuard>
                    <ProfilePage />
                  </AuthGuard>
                }
              />
              <Route
                path="/checkout"
                element={
                  <AuthGuard>
                    <CheckoutPage />
                  </AuthGuard>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </MantineProvider>
  );
}

export default App;
