import { create } from "zustand";
import authService, {
  type User,
  type RegisterData,
} from "../services/auth.service";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  register: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  fetchProfile: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  initAuth: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: authService.getCurrentUser(),
  isLoading: false,
  isAuthenticated: authService.isAuthenticated(),
  error: null,

  initAuth: () => {
    const user = authService.getCurrentUser();
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  register: async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    set({ isLoading: true, error: null });

    try {
      const registerData: RegisterData = { name, email, password };
      if (phone) registerData.phone = phone;

      const response = await authService.register(registerData);

      set({
        isLoading: false,
        isAuthenticated: true,
        user: response.user,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      });
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.login({ email, password });

      set({
        isLoading: false,
        isAuthenticated: true,
        user: response.user,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  fetchProfile: async () => {
    set({ isLoading: true, error: null });

    try {
      const user = await authService.fetchUserProfile();

      set({
        isLoading: false,
        user,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch profile",
      });
      throw error;
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    set({ isLoading: true, error: null });

    try {
      const updatedUser = await authService.updateProfile(userData);

      set({
        isLoading: false,
        user: updatedUser,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to update profile",
      });
      throw error;
    }
  },
}));

useAuth.getState().initAuth();

export default useAuth;
