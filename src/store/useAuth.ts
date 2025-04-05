import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCart } from "./useCart";

// Update the User interface to include the role property
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<void | User>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Update the mockLogin function to include the role
const mockLogin = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, this would be an API call to your backend
  if (email === "test@example.com" && password === "password123") {
    return {
      user: {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "admin", // Ensure the admin role is included
      },
      token: "mock-jwt-token",
    };
  }

  throw new Error("Invalid credentials");
};

const mockSignup = async (
  name: string,
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, this would be an API call to your backend
  return {
    user: {
      id: Date.now().toString(),
      email,
      name,
    },
    token: "mock-jwt-token",
  };
};

const mockUpdateProfile = async (
  userId: string,
  userData: Partial<User>
): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, this would be an API call to your backend
  return {
    id: userId,
    email: userData.email || "test@example.com",
    name: userData.name || "Test User",
    address: userData.address,
    phone: userData.phone,
  };
};

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
          const { user, token } = await mockLogin(email, password);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Load user's cart from server (in a real app)
          // For now, we'll keep the cart as is

          return user; // Return the user object so we can check the role
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Login failed",
          });
          throw error;
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });

        try {
          const { user, token } = await mockSignup(name, email, password);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Signup failed",
          });
          throw error;
        }
      },

      logout: () => {
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
          throw new Error("User not authenticated");
        }

        set({ isLoading: true, error: null });

        try {
          const updatedUser = await mockUpdateProfile(user.id, userData);
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : "Profile update failed",
          });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      // Only persist non-sensitive data
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
