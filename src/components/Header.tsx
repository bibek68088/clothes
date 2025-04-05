import {
  Search,
  ShoppingBag,
  User,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/useCart";
import { useAuth } from "../store/useAuth";
import { useState } from "react";
import { Heart } from "lucide-react";

export function Header() {
  const cartItems = useCart((state) => state.items);
  const { isAuthenticated, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsDropdownOpen(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">
            Aashish
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/new" className="text-gray-600 hover:text-black">
              New
            </Link>
            <Link to="/shop" className="text-gray-600 hover:text-black">
              Shop
            </Link>
            <Link to="/featured" className="text-gray-600 hover:text-black">
              Featured
            </Link>
            <Link
              to="/wishlist"
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <Heart className="w-5 h-5" />
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5" />
            </button>

            {/* User Icon with Dropdown */}
            <div className="relative" onBlur={handleBlur} tabIndex={0}>
              <button
                onClick={toggleDropdown}
                className="p-2 hover:bg-gray-100 rounded-full focus:outline-none"
              >
                <User className="w-5 h-5" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                  {isAuthenticated ? (
                    <>
                      {/* User info section */}
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="font-medium text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      {/* User menu options */}
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Signup
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/cart"
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
