"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import {
  Package,
  Heart,
  CreditCard,
  Settings,
  Bell,
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
  MapPin,
  Eye,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Search,
  Filter,
  LayoutGrid,
  LayoutList,
} from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("grid");

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
            image: "/placeholder.svg?height=150&width=200",
            price: 199.99,
          },
          {
            id: "2",
            name: "Designer Jeans",
            image: "/placeholder.svg?height=150&width=200",
            price: 89.99,
            discount: 20,
          },
          {
            id: "3",
            name: "Casual Sneakers",
            image: "/placeholder.svg?height=150&width=200",
            price: 69.99,
          },
          {
            id: "4",
            name: "Wool Sweater",
            image: "/placeholder.svg?height=150&width=200",
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
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-cyan-100 text-cyan-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "processing":
        return <Tag className="w-3 h-3" />;
      case "shipped":
        return <Truck className="w-3 h-3" />;
      case "delivered":
        return <CheckCircle className="w-3 h-3" />;
      case "cancelled":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Package className="w-3 h-3" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="text-cyan-500" />;
      case "promo":
        return <Percent className="text-green-500" />;
      case "system":
        return <AlertCircle className="text-yellow-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -mt-10 -mr-10 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Package className="h-6 w-6 text-purple-500" />
                    </div>
                    <span className="flex items-center text-purple-700 text-sm font-medium">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {stats.orderGrowth}%
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">
                    {stats.totalOrders}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Total Orders</p>
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <p className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Last order on{" "}
                      {new Date(
                        recentOrders[0]?.date || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -mt-10 -mr-10 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Wallet className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="flex items-center text-red-500 text-sm font-medium">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      {Math.abs(stats.spendingGrowth)}%
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">
                    ${stats.totalSpent.toFixed(2)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Total Spent</p>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-xs text-gray-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Avg. ${(stats.totalSpent / stats.totalOrders).toFixed(
                        2
                      )}{" "}
                      per order
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-200 rounded-full -mt-10 -mr-10 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Sparkles className="h-6 w-6 text-cyan-500" />
                    </div>
                    <span className="px-2 py-1 rounded-full bg-white text-cyan-700 text-xs font-medium">
                      Gold Tier
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">
                    {stats.loyaltyPoints}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Loyalty Points</p>
                  <div className="mt-4">
                    <div className="w-full bg-white rounded-full h-1.5">
                      <div
                        className="bg-cyan-500 h-1.5 rounded-full"
                        style={{ width: "25%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      250 more points to Platinum
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-pink-200 rounded-full -mt-10 -mr-10 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <Heart className="h-6 w-6 text-pink-500" />
                    </div>
                    <span className="flex items-center bg-white px-2 py-1 rounded-full text-gray-700 text-xs font-medium">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      {stats.cartItems} in cart
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">
                    {stats.wishlistItems}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Saved Items</p>
                  <div className="mt-4 pt-4 border-t border-pink-200">
                    <p className="text-xs text-gray-500 flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      Items worth $
                      {wishlistItems
                        .reduce((sum, item) => sum + item.price, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Recent Orders
                </h2>
                <Link
                  to="/orders"
                  className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center"
                >
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex justify-between">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">
                                {order.status}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <Link
                                to={`/orders/${order.id}`}
                                className="text-purple-600 hover:text-purple-900"
                                aria-label="View order details"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>

                              {order.status === "delivered" && (
                                <button
                                  className="text-yellow-600 hover:text-yellow-900"
                                  aria-label="Write review"
                                >
                                  <Star className="h-4 w-4" />
                                </button>
                              )}

                              {order.status === "shipped" && (
                                <button
                                  className="text-cyan-600 hover:text-cyan-900"
                                  aria-label="Track package"
                                >
                                  <Truck className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Shopping Statistics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">
                  Shopping Statistics
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-6 text-center">
                  <div className="inline-block relative">
                    <svg className="w-24 h-24" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="2"
                      ></circle>
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="2"
                        strokeDasharray="100.53"
                        strokeDashoffset="35.18"
                        transform="rotate(-90 18 18)"
                      ></circle>
                      <text
                        x="18"
                        y="18"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#111827"
                        fontSize="8"
                        fontWeight="bold"
                      >
                        65%
                      </text>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mt-4">
                    Repeat Purchases
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    You often buy the same products
                  </p>
                </div>

                <div className="p-6 text-center">
                  <div className="inline-block relative">
                    <svg className="w-24 h-24" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="2"
                      ></circle>
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="100.53"
                        strokeDashoffset="58.31"
                        transform="rotate(-90 18 18)"
                      ></circle>
                      <text
                        x="18"
                        y="18"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#111827"
                        fontSize="8"
                        fontWeight="bold"
                      >
                        42%
                      </text>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mt-4">
                    Discount Savings
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Average savings on purchases
                  </p>
                </div>

                <div className="p-6 text-center">
                  <div className="inline-block relative">
                    <svg className="w-24 h-24" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="2"
                      ></circle>
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                        strokeDasharray="100.53"
                        strokeDashoffset="22.12"
                        transform="rotate(-90 18 18)"
                      ></circle>
                      <text
                        x="18"
                        y="18"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#111827"
                        fontSize="8"
                        fontWeight="bold"
                      >
                        78%
                      </text>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mt-4">
                    On-time Delivery
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Orders arrived on schedule
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case "wishlist":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md ${
                    viewMode === "grid"
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md ${
                    viewMode === "list"
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <LayoutList className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100">
                    <Filter className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div
                className={`grid ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                } gap-6`}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-48 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
                      >
                        <div className="relative">
                          {item.discount && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                              {item.discount}% OFF
                            </div>
                          )}
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex space-x-2">
                              <button className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-purple-600 transition-colors">
                                <Eye className="h-5 w-5" />
                              </button>
                              <button className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-purple-600 transition-colors">
                                <ShoppingCart className="h-5 w-5" />
                              </button>
                              <button className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-red-500 transition-colors">
                                <Heart className="h-5 w-5 fill-current" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 text-lg">
                            {item.name}
                          </h3>
                          <div className="mt-2 flex items-center">
                            {item.discount ? (
                              <>
                                <span className="text-sm text-gray-500 line-through mr-2">
                                  ${item.price.toFixed(2)}
                                </span>
                                <span className="font-bold text-red-500 text-lg">
                                  $
                                  {(
                                    item.price *
                                    (1 - item.discount / 100)
                                  ).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-gray-900 text-lg">
                                ${item.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {wishlistItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.discount ? (
                                <div>
                                  <div className="text-sm text-gray-500 line-through">
                                    ${item.price.toFixed(2)}
                                  </div>
                                  <div className="text-sm font-medium text-red-500">
                                    $
                                    {(
                                      item.price *
                                      (1 - item.discount / 100)
                                    ).toFixed(2)}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm font-medium text-gray-900">
                                  ${item.price.toFixed(2)}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.discount ? (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  On Sale
                                </span>
                              ) : (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  In Stock
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="text-purple-600 hover:text-purple-900">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900">
                                  <ShoppingCart className="h-4 w-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Notifications
              </h2>
              <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                Mark all as read
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="divide-y divide-gray-100">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 animate-pulse">
                      <div className="flex">
                        <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 ${
                        !notification.read ? "bg-purple-50" : ""
                      } hover:bg-gray-50 transition-colors`}
                    >
                      <div className="flex">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                            notification.type === "order"
                              ? "bg-cyan-100"
                              : notification.type === "promo"
                              ? "bg-green-100"
                              : "bg-yellow-100"
                          }`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No notifications
                  </h3>
                  <p className="text-gray-500">You're all caught up!</p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-white shadow-xl">
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="ml-2 font-medium text-gray-900">
                {user?.name || "User"}
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  activeTab === "overview"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Home
                  className={`mr-3 h-5 w-5 ${
                    activeTab === "overview"
                      ? "text-purple-500"
                      : "text-gray-400"
                  }`}
                />
                Overview
              </button>
              <button
                onClick={() => {
                  setActiveTab("orders");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  activeTab === "orders"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Package
                  className={`mr-3 h-5 w-5 ${
                    activeTab === "orders" ? "text-purple-500" : "text-gray-400"
                  }`}
                />
                My Orders
              </button>
              <button
                onClick={() => {
                  setActiveTab("wishlist");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  activeTab === "wishlist"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Heart
                  className={`mr-3 h-5 w-5 ${
                    activeTab === "wishlist"
                      ? "text-purple-500"
                      : "text-gray-400"
                  }`}
                />
                Wishlist
              </button>
              <button
                onClick={() => {
                  setActiveTab("notifications");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  activeTab === "notifications"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Bell
                  className={`mr-3 h-5 w-5 ${
                    activeTab === "notifications"
                      ? "text-purple-500"
                      : "text-gray-400"
                  }`}
                />
                Notifications
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="ml-auto bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab("payment");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  activeTab === "payment"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <CreditCard
                  className={`mr-3 h-5 w-5 ${
                    activeTab === "payment"
                      ? "text-purple-500"
                      : "text-gray-400"
                  }`}
                />
                Payment Methods
              </button>
              <button
                onClick={() => {
                  setActiveTab("addresses");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  activeTab === "addresses"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <MapPin
                  className={`mr-3 h-5 w-5 ${
                    activeTab === "addresses"
                      ? "text-purple-500"
                      : "text-gray-400"
                  }`}
                />
                Saved Addresses
              </button>
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  activeTab === "settings"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Settings
                  className={`mr-3 h-5 w-5 ${
                    activeTab === "settings"
                      ? "text-purple-500"
                      : "text-gray-400"
                  }`}
                />
                Account Settings
              </button>
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
              <LogOut className="mr-3 h-5 w-5 text-gray-400" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="ml-2 font-medium text-gray-900">
                  {user?.name || "User"}
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 p-4 space-y-1">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === "overview"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Home
                    className={`mr-3 h-5 w-5 ${
                      activeTab === "overview"
                        ? "text-purple-500"
                        : "text-gray-400"
                    }`}
                  />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === "orders"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Package
                    className={`mr-3 h-5 w-5 ${
                      activeTab === "orders"
                        ? "text-purple-500"
                        : "text-gray-400"
                    }`}
                  />
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === "wishlist"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Heart
                    className={`mr-3 h-5 w-5 ${
                      activeTab === "wishlist"
                        ? "text-purple-500"
                        : "text-gray-400"
                    }`}
                  />
                  Wishlist
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === "notifications"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Bell
                    className={`mr-3 h-5 w-5 ${
                      activeTab === "notifications"
                        ? "text-purple-500"
                        : "text-gray-400"
                    }`}
                  />
                  Notifications
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="ml-auto bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === "payment"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <CreditCard
                    className={`mr-3 h-5 w-5 ${
                      activeTab === "payment"
                        ? "text-purple-500"
                        : "text-gray-400"
                    }`}
                  />
                  Payment Methods
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === "addresses"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <MapPin
                    className={`mr-3 h-5 w-5 ${
                      activeTab === "addresses"
                        ? "text-purple-500"
                        : "text-gray-400"
                    }`}
                  />
                  Saved Addresses
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === "settings"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings
                    className={`mr-3 h-5 w-5 ${
                      activeTab === "settings"
                        ? "text-purple-500"
                        : "text-gray-400"
                    }`}
                  />
                  Account Settings
                </button>
              </nav>
              <div className="p-4 border-t border-gray-200">
                <button className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
                  <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
            <button
              onClick={() => setSidebarOpen(true)}
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex items-center">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center text-purple-600 hover:text-purple-900"
                >
                  <Home className="h-6 w-6" />
                  <span className="ml-2 font-semibold hidden sm:block">
                    ShopHub
                  </span>
                </button>
              </div>
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                  <Search className="h-6 w-6" />
                </button>
                <button className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                  <ShoppingCart className="h-6 w-6" />
                  {stats.cartItems > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-purple-500 ring-2 ring-white text-white text-xs flex items-center justify-center">
                      {stats.cartItems}
                    </span>
                  )}
                </button>
                <button className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                  <Bell className="h-6 w-6" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 ring-2 ring-white"></span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
