import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (
    product: Product,
    options?: { color?: string; size?: string }
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, options = {}) => {
        set((state) => {
          // Create a unique ID based on product ID and selected options
          const uniqueId = `${product.id}-${options.color || ""}-${
            options.size || ""
          }`;

          // Check if this item (with same color and size) already exists in cart
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === uniqueId
          );

          if (existingItemIndex !== -1) {
            // If item exists, increase quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += 1;
            return { items: updatedItems };
          } else {
            // If item doesn't exist, add new item
            return {
              items: [
                ...state.items,
                {
                  ...product,
                  id: uniqueId,
                  quantity: 1,
                  selectedColor: options.color,
                  selectedSize: options.size,
                },
              ],
            };
          }
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
