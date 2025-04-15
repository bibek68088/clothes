// src/store/useAuth.js
import { create } from "zustand";
import axios from "axios";

// Configure API base URL
const API_URL = import.meta.env.VITE_AASHISH_API_URL || "http://localhost:5000/api";

export const useAuth = create<{
  user: any;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signup: (name: string, email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  verifyToken: () => Promise<void>;
}>((set, get) => ({
  // State
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem("token"),
  error: null,

  // Actions
  signup: async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
      });

      // Check if response contains user and token
      if (!response.data || !response.data.user || !response.data.token) {
        throw new Error("Invalid response from server");
      }

      // Save token to local storage
      localStorage.setItem("token", response.data.token);

      // Update state
      set({
        isLoading: false,
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
      });

      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: axios.isAxiosError(error) ? error.response?.data?.message || error.message : "An unexpected error occurred",
      });
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // Check if response contains user and token
      if (!response.data || !response.data.user || !response.data.token) {
        throw new Error("Invalid response from server");
      }

      // Save token to local storage
      localStorage.setItem("token", response.data.token);

      // Update state
      set({
        isLoading: false,
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
      });

      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: axios.isAxiosError(error) ? error.response?.data?.message || error.message : "An unexpected error occurred",
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  verifyToken: async () => {
    const token = get().token;

    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });

    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.user) {
        set({
          isLoading: false,
          isAuthenticated: true,
          user: response.data.user,
        });
      } else {
        // Invalid response, clear authentication
        localStorage.removeItem("token");
        set({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          token: null,
        });
      }
    } catch (error) {
      // Token verification failed, clear authentication
      localStorage.removeItem("token");
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: axios.isAxiosError(error) ? error.response?.data?.message || error.message : "An unexpected error occurred",
      });
    }
  },
}));
