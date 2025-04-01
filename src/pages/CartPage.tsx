import { useCart } from "../store/useCart";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, Truck } from "lucide-react";

export function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 100 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">
        Your Shopping Cart
      </h1>
      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
          <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="mb-6 text-lg text-gray-600">
            Your cart is looking a bit empty
          </p>
          <Link
            to="/"
            className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 shadow-md"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center border-b py-6 hover:bg-gray-50 px-4 rounded-lg transition-colors"
              >
                <div className="relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm hover:shadow-md transition-all"
                  />
                </div>

                <div className="flex-grow ml-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold text-lg">{item.name}</h2>
                      <p className="text-gray-700 font-medium">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="bg-red-100 text-red-500 p-2 rounded hover:bg-red-200 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Display selected color and size */}
                  {(item.selectedColor || item.selectedSize) && (
                    <div className="text-sm text-gray-600 mt-1 flex items-center flex-wrap gap-2">
                      {item.selectedColor && (
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-1"
                            style={{
                              backgroundColor: item.selectedColor.toLowerCase(),
                            }}
                          ></div>
                          <span>{item.selectedColor}</span>
                        </div>
                      )}
                      {item.selectedColor && item.selectedSize && (
                        <span className="text-gray-300">|</span>
                      )}
                      {item.selectedSize && (
                        <span className="px-2 py-1 bg-gray-100 text-xs rounded-md">
                          {item.selectedSize}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center mt-3">
                    {/* Custom quantity selector */}
                    <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                      <button
                        onClick={() =>
                          item.quantity > 1 &&
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-1 font-medium bg-white min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="font-bold text-lg">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm h-fit sticky top-8">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b">
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Truck size={18} className="mr-2" /> Shipping
                </span>
                <span
                  className={
                    shipping === 0
                      ? "text-green-600 font-medium"
                      : "font-medium"
                  }
                >
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {subtotal < 100 && (
                <div className="text-green-600 bg-green-50 p-3 rounded-md text-sm">
                  Add ${(100 - subtotal).toFixed(2)} more to unlock free
                  shipping!
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="w-full bg-black text-white py-3 rounded-lg mt-6 hover:bg-gray-800 transform transition-transform hover:scale-[1.02] font-medium shadow-sm"
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center text-sm text-gray-500">
              <Link to="/" className="hover:underline text-gray-700">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
