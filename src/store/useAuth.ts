// src/store/useAuth.tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { useCart } from './useCart';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, token } = response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Store token in localStorage for API interceptor
          localStorage.setItem('token', token);
          
          // Fetch user's cart from server
          // (Optional: Add logic to fetch and handle the user's cart here if needed)
          
          // Fetch user's cart from server
          try {
            await api.get('/cart');
          } catch (error) {
            console.error('Error fetching cart:', error);
          }
        } catch (error) {
          set({
            isLoading: false,
            error: (error as any).response?.data?.message || 'Login failed',
          });
          throw error;
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post('/auth/register', { name, email, password });
          const { user, token } = response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Store token in localStorage for API interceptor
          localStorage.setItem('token', token);
        } catch (error) {
          set({
            isLoading: false,
            error: (error as any).response?.data?.message || 'Signup failed',
          });
          throw error;
        }
      },

      logout: () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // Clear the cart when logging out
        const { clearCart } = useCart.getState();
        clearCart();
      },

      updateProfile: async (userData) => {
        const { user } = get();

        if (!user) {
          throw new Error('User not authenticated');
        }

        set({ isLoading: true, error: null });

        try {
          const response = await api.put('/auth/profile', userData);
          
          set({
            user: response.data.user,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: (error as any).response?.data?.message || 'Profile update failed',
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      // Only persist non-sensitive data
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);