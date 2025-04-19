import axios, { type AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import React from "react";

const api = axios.create({
  baseURL: import.meta.env.VITE_AASHISH_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
   if (error.response?.status === 401) {
      const url = error.config?.url || "";
      if (!url.includes("login") && !url.includes("register")) {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-user");
        window.location.href = "/login?session=expired";
      }
    }

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
