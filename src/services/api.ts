import axios from "axios";

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Simple cache implementation
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Create a cached version of get requests
const cachedGet = async (url: string, params = {}, forceRefresh = false) => {
  const cacheKey = url + JSON.stringify(params);

  // Check if we have a valid cached response
  if (!forceRefresh && cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return { data };
    }
  }

  // If no cache or expired, make the request
  const response = await axiosInstance.get(url, { params });

  // Cache the response
  cache.set(cacheKey, {
    data: response.data,
    timestamp: Date.now(),
  });

  return response;
};

// Create a properly typed API object with all methods
const api = {
  get: cachedGet,
  post: (url: string, data?: any, config?: any) =>
    axiosInstance.post(url, data, config),
  put: (url: string, data?: any, config?: any) =>
    axiosInstance.put(url, data, config),
  delete: (url: string, config?: any) => axiosInstance.delete(url, config),
  patch: (url: string, data?: any, config?: any) =>
    axiosInstance.patch(url, data, config),
  clearCache: () => cache.clear(),
};

export default api;
