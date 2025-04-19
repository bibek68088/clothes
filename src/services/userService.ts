import api from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  created_at: string;
  updated_at?: string;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const userService = {
  getUsers: async (
    params: Record<string, any> = {}
  ): Promise<UsersResponse> => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },
  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.user;
  },
  createUser: async (
    userData: Partial<User> & { password: string }
  ): Promise<User> => {
    const response = await api.post("/admin/users", userData);
    return response.data.user;
  },
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data.user;
  },
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};
