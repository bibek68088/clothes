export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const storeAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem("authToken", token);
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem("authToken");
};
