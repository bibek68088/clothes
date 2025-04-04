// src/store/useCart.tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

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
  addItem: (product: Product, options?: { color?: string; size?: string }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>; // Add this method
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Add the fetchCart method
      fetchCart: async () => {
        try {
          const response = await api.get('/cart');
          set({ items: response.data.cartItems });
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      },

      addItem: async (product, options = {}) => {
        try {
          await api.post('/cart', {
            productId: product.id,
            quantity: 1,
            color: options.color,
            size: options.size
          });
          
          // Refresh cart after adding item
          await get().fetchCart();
        } catch (error) {
          console.error('Error adding item to cart:', error);
          throw error;
        }
      },

      removeItem: async (id) => {
        try {
          await api.delete(`/cart/${id}`);
          
          // Update local state
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          }));
        } catch (error) {
          console.error('Error removing item from cart:', error);
          throw error;
        }
      },

      updateQuantity: async (id, quantity) => {
        try {
          await api.put(`/cart/${id}`, { quantity });
          
          // Update local state
          set((state) => ({
            items: state.items.map((item) => 
              item.id === id ? { ...item, quantity } : item
            ),
          }));
        } catch (error) {
          console.error('Error updating cart quantity:', error);
          throw error;
        }
      },

      clearCart: async () => {
        try {
          await api.delete('/cart');
          set({ items: [] });
        } catch (error) {
          console.error('Error clearing cart:', error);
        }
      },
    }),
    {
      name: 'shopping-cart',
    }
  )
);