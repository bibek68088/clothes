// src/services/api.ts
import axios, { type AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import React from "react";

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_AASHISH_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors - logout user
    if (error.response?.status === 401) {
      // Only dispatch logout if it's not a login/register request
      const url = error.config?.url || "";
      if (!url.includes("login") && !url.includes("register")) {
        // We need to import the logout function to avoid circular dependencies
        // This will be triggered by the application's auth state
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-user");

        // Redirect can be handled by the app router
        window.location.href = "/login?session=expired";
      }
    }

    // Show error notification
    const errorMessage =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "An error occurred";

    notifications.show({
      title: "Error",
      message: errorMessage,
      color: "red",
      icon: React.createElement(X, { size: 16 }),
    });

    return Promise.reject(error);
  }
);

export default api;
