import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as authService from "../services/auth.service"
import type { User, LoginCredentials, RegisterData } from "../services/auth.service"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
  checkAuth: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.login(credentials)
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: (error as any)?.response?.data?.message || "Login failed",
          })
          throw error
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.register(userData)
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: (error as any)?.response?.data?.message || "Registration failed",
          })
          throw error
        }
      },

      logout: () => {
        authService.logout()
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      updateProfile: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const updatedUser = await authService.updateProfile(userData)
          set({
            user: updatedUser,
            isLoading: false,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: (error as any)?.response?.data?.message || "Profile update failed",
          })
          throw error
        }
      },

      checkAuth: () => {
        const user = authService.getCurrentUser()
        const isAuthenticated = authService.isAuthenticated()
        set({ user, isAuthenticated })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)

