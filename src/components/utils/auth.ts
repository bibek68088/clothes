// utils/auth.js - Authentication utilities for managing JWT tokens

/**
 * Get the JWT token from localStorage or your auth store
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };
  
  /**
   * Get authorization headers with JWT token for API requests
   * @returns {Object} Headers object with Authorization if token exists
   */
  export const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  
  /**
   * Store a new JWT token
   * @param {string} token - The JWT token to store
   */
  export const storeAuthToken = (token: string) => {
    if (token) {
      localStorage.setItem("authToken", token);
    }
  };
  
  /**
   * Clear the stored JWT token (for logout)
   */
  export const clearAuthToken = () => {
    localStorage.removeItem("authToken");
  };