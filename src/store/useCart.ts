// src/store/useCart.tsx
import { create } from "zustand";
import { persist } from "zustand/middleware";
import cartService from "../services/cart.service";
import { useAuth } from "./useAuth";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
  color?: string;
  size?: string;
}

interface Cart {
  items: CartItem[];
  item_count: number;
  total: number;
  coupon?: {
    code: string;
    discount: number;
  };
}

interface CartState {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (
    productId: string,
    quantity?: number,
    options?: { color?: string; size?: string }
  ) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  syncCartAfterLogin: () => Promise<void>;
}

// Define initialCart
const initialCart: Cart = {
  items: [],
  item_count: 0,
  total: 0,
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cart: initialCart,
      isLoading: false,
      error: null,

      fetchCart: async () => {
        const { isAuthenticated } = useAuth.getState();

        // Only fetch from API if user is authenticated
        if (!isAuthenticated) return;

        set({ isLoading: true, error: null });
        try {
          const cart = await cartService.getCart();
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to fetch cart",
          });
        }
      },

      addToCart: async (productId: string, quantity = 1, options = {}) => {
        const { isAuthenticated } = useAuth.getState();
        set({ isLoading: true, error: null });

        try {
          if (isAuthenticated) {
            // Add to server cart if authenticated
            const cart = await cartService.addToCart(
              productId,
              quantity,
              options
            );
            set({ cart, isLoading: false });
          } else {
            // Add to local cart if not authenticated
            const currentCart = get().cart || { ...initialCart };

            // Check if item already exists
            const existingItemIndex = currentCart.items.findIndex(
              (item) =>
                item.product_id === productId &&
                item.color === options.color &&
                item.size === options.size
            );

            if (existingItemIndex > -1) {
              // Update existing item
              const updatedItems = [...currentCart.items];
              updatedItems[existingItemIndex].quantity += quantity;

              const updatedCart = {
                ...currentCart,
                items: updatedItems,
                item_count: updatedItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                ),
                total: updatedItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                ),
              };

              set({ cart: updatedCart, isLoading: false });
            } else {
              // Add new item (in a real app, you'd fetch product details here)
              // This is simplified for the example
              const newItem: CartItem = {
                id: `local-${Date.now()}`,
                product_id: productId,
                quantity,
                price: 0, // This would be fetched from product details
                product: {
                  id: productId,
                  name: "Product",
                  price: 0,
                  image: "",
                }, // Placeholder
                ...options,
              };

              const updatedCart = {
                ...currentCart,
                items: [...currentCart.items, newItem],
                item_count: currentCart.item_count + quantity,
                total: currentCart.total + newItem.price * quantity,
              };

              set({ cart: updatedCart, isLoading: false });
            }
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message || "Failed to add item to cart",
          });
        }
      },

      updateCartItem: async (itemId: string, quantity: number) => {
        const { isAuthenticated } = useAuth.getState();
        set({ isLoading: true, error: null });

        try {
          if (isAuthenticated) {
            // Update server cart if authenticated
            const cart = await cartService.updateCartItem(itemId, quantity);
            set({ cart, isLoading: false });
          } else {
            // Update local cart if not authenticated
            const currentCart = get().cart;
            if (!currentCart) return;

            const itemIndex = currentCart.items.findIndex(
              (item) => item.id === itemId
            );
            if (itemIndex === -1) return;

            const updatedItems = [...currentCart.items];
            updatedItems[itemIndex].quantity = quantity;

            const updatedCart = {
              ...currentCart,
              items: updatedItems,
              item_count: updatedItems.reduce(
                (sum, item) => sum + item.quantity,
                0
              ),
              total: updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ),
            };

            set({ cart: updatedCart, isLoading: false });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message || "Failed to update cart item",
          });
        }
      },

      removeFromCart: async (itemId: string) => {
        const { isAuthenticated } = useAuth.getState();
        set({ isLoading: true, error: null });

        try {
          if (isAuthenticated) {
            // Remove from server cart if authenticated
            const cart = await cartService.removeFromCart(itemId);
            set({ cart, isLoading: false });
          } else {
            // Remove from local cart if not authenticated
            const currentCart = get().cart;
            if (!currentCart) return;

            const itemIndex = currentCart.items.findIndex(
              (item) => item.id === itemId
            );
            if (itemIndex === -1) return;

            const updatedItems = currentCart.items.filter(
              (item) => item.id !== itemId
            );

            const updatedCart = {
              ...currentCart,
              items: updatedItems,
              item_count: updatedItems.reduce(
                (sum, item) => sum + item.quantity,
                0
              ),
              total: updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ),
            };

            set({ cart: updatedCart, isLoading: false });
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              "Failed to remove item from cart",
          });
        }
      },

      clearCart: async () => {
        const { isAuthenticated } = useAuth.getState();
        set({ isLoading: true, error: null });

        try {
          if (isAuthenticated) {
            // Clear server cart if authenticated
            await cartService.clearCart();
          }

          // Always clear local cart state
          set({
            cart: { ...initialCart },
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to clear cart",
          });
        }
      },

      applyCoupon: async (code: string) => {
        const { isAuthenticated } = useAuth.getState();

        if (!isAuthenticated) {
          set({ error: "You must be logged in to apply a coupon" });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const cart = await cartService.applyCoupon(code);
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to apply coupon",
          });
        }
      },

      removeCoupon: async () => {
        const { isAuthenticated } = useAuth.getState();

        if (!isAuthenticated) return;

        set({ isLoading: true, error: null });
        try {
          const cart = await cartService.removeCoupon();
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to remove coupon",
          });
        }
      },

      syncCartAfterLogin: async () => {
        const currentCart = get().cart;
        if (!currentCart || currentCart.items.length === 0) return;

        set({ isLoading: true, error: null });
        try {
          // Format local cart items for syncing
          const items = currentCart.items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
          }));

          // Sync with server cart
          const cart = await cartService.syncCart(items);
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to sync cart",
          });
        }
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

// Listen for auth changes to sync cart
useAuth.subscribe((state, prevState) => {
  if (!prevState.isAuthenticated && state.isAuthenticated) {
    // User just logged in, sync cart
    useCart.getState().syncCartAfterLogin();
  }
});
