import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Table,
  Button,
  Group,
  TextInput,
  Modal,
  Select,
  Badge,
  Pagination,
  ActionIcon,
} from "@mantine/core";
import { Plus, Search, Edit, Trash } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import api from "../../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users", {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
      });

      // Check the structure of the response and handle it accordingly
      if (response.data) {
        // If users are directly in the response data
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        }
        // If users are in a nested structure
        else if (response.data.users) {
          setUsers(response.data.users);

          // Handle pagination data if it exists
          if (response.data.pagination) {
            setPagination(response.data.pagination);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const openCreateModal = () => {
    setCurrentUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "customer",
    });
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      phone: user.phone || "",
      role: user.role,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (currentUser) {
        // Update existing user
        const { password, ...updateData } = formData;
        await api.put(`/admin/users/${currentUser.id}`, updateData);
      } else {
        // Create new user
        await api.post("/admin/users", formData);
      }

      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <AdminLayout>
      <Container size="xl" className="py-6">
        <Group justify="space-between" className="mb-6">
          <Title order={2}>Users</Title>
          <Button leftSection={<Plus size={16} />} onClick={openCreateModal}>
            Add User
          </Button>
        </Group>

        <form onSubmit={handleSearch} className="mb-4">
          <TextInput
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            rightSection={<Search size={16} />}
          />
        </form>

        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || "-"}</td>
                <td>
                  <Badge color={user.role === "admin" ? "blue" : "gray"}>
                    {user.role}
                  </Badge>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <Group gap={8}>
                    <ActionIcon
                      color="blue"
                      onClick={() => openEditModal(user)}
                    >
                      <Edit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash size={16} />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  {loading ? "Loading..." : "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              total={pagination.totalPages}
              value={pagination.page}
              onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            />
          </div>
        )}

        <Modal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title={currentUser ? "Edit User" : "Add User"}
        >
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mb-3"
            />

            <TextInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mb-3"
            />

            {!currentUser && (
              <TextInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!currentUser}
                className="mb-3"
              />
            )}

            <TextInput
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mb-3"
            />

            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={(value) => handleSelectChange("role", value)}
              data={[
                { value: "customer", label: "Customer" },
                { value: "admin", label: "Admin" },
              ]}
              required
              className="mb-4"
            />

            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{currentUser ? "Update" : "Create"}</Button>
            </Group>
          </form>
        </Modal>
      </Container>
    </AdminLayout>
  );
}
