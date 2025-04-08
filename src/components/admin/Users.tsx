"use client"

import React from "react"

import { useState, useEffect } from "react"
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
  Box,
  Paper,
  Text,
  Loader,
  Transition,
  Divider,
  Avatar,
  Tooltip,
  useMantineTheme,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { Plus, Search, Edit, Trash, Eye, User, Shield, Check, X, RefreshCw, Filter, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { AdminLayout } from "../../components/admin/AdminLayout"
import api from "../../services/api"

interface UserInterface {
  id: string
  name: string
  email: string
  phone: string
  role: string
  created_at: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface FormData {
  name: string
  email: string
  password: string
  phone: string
  role: string
}

const MotionPaper = motion(Paper as any)

export function AdminUsers() {
  const theme = useMantineTheme()
  const [users, setUsers] = useState<UserInterface[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserInterface | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [showFilters, { toggle: toggleFilters }] = useDisclosure(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  })
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [roleFilter, setRoleFilter] = useState<string | null>(null)

  // Animation variants for list items
  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  }

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, searchQuery, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/users", {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        role: roleFilter || undefined,
      })

      if (response.data) {
        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users)
        } else if (response.data.users) {
          setUsers(response.data.users)

          if (response.data.pagination) {
            setPagination(response.data.pagination)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      notifications.show({
        title: "Error",
        message: "Failed to fetch users. Please try again.",
        color: "red",
        icon: React.createElement(X),
      })
      // Set empty users array to avoid showing stale data
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchUsers()
    setRefreshing(false)
    notifications.show({
      title: "Success",
      message: "User data refreshed successfully",
      color: "green",
      icon: React.createElement(Check),
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchUsers()
  }

  const openCreateModal = () => {
    setCurrentUser(null)
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "customer",
    })
    setModalOpen(true)
  }

  const openEditModal = (user: UserInterface) => {
    setCurrentUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      phone: user.phone || "",
      role: user.role,
    })
    setModalOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string | null) => {
    if (value) {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (currentUser) {
        // Update existing user
        const { password, ...updateData } = formData
        const response = await api.put(`/admin/users/${currentUser.id}`, updateData)
        notifications.show({
          title: "Success",
          message: `User ${formData.name} updated successfully`,
          color: "green",
          icon: React.createElement(Check),
        })
      } else {
        // Create new user
        const response = await api.post("/admin/users", formData)
        notifications.show({
          title: "Success",
          message: `User ${formData.name} created successfully`,
          color: "green",
          icon: React.createElement(Check),
        })
      }

      setModalOpen(false)
      fetchUsers()
    } catch (error) {
      console.error("Error saving user:", error)
      notifications.show({
        title: "Error",
        message: "Failed to save user. Please try again.",
        color: "red",
        icon: React.createElement(X),
      })
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return
    }

    try {
      await api.delete(`/admin/users/${userId}`)
      fetchUsers()
      notifications.show({
        title: "Success",
        message: `User ${userName} deleted successfully`,
        color: "green",
        icon: React.createElement(Check),
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      notifications.show({
        title: "Error",
        message: "Failed to delete user. Please try again.",
        color: "red",
        icon: React.createElement(X),
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "blue"
      case "manager":
        return "green"
      case "support":
        return "yellow"
      default:
        return "gray"
    }
  }

  const renderTableView = () => (
    <Paper shadow="sm" radius="md" p="md" withBorder>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.length === 0 && !loading ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text ta="center" py="lg" c="dimmed">
                  No users found. Try adjusting your search criteria.
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            users.map((user, index) => (
              <motion.tr key={user.id} custom={index} initial="hidden" animate="visible" variants={listItemVariants}>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar color={theme.primaryColor} radius="xl">
                      {getInitials(user.name)}
                    </Avatar>
                    <Text fw={500}>{user.name}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{user.phone || "—"}</Table.Td>
                <Table.Td>
                  <Badge
                    color={getRoleColor(user.role)}
                    variant="light"
                    size="md"
                    radius="sm"
                    leftSection={
                      user.role === "admin"
                        ? React.createElement(Shield, { size: 12 })
                        : React.createElement(User, { size: 12 })
                    }
                  >
                    {user.role}
                  </Badge>
                </Table.Td>
                <Table.Td>{new Date(user.created_at).toLocaleDateString()}</Table.Td>
                <Table.Td>
                  <Group gap={8}>
                    <Tooltip label="View Details">
                      <ActionIcon variant="light" color="blue" radius="md">
                        {React.createElement(Eye, { size: 16 })}
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Edit User">
                      <ActionIcon variant="light" color="green" onClick={() => openEditModal(user)} radius="md">
                        {React.createElement(Edit, { size: 16 })}
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete User">
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        radius="md"
                      >
                        {React.createElement(Trash, { size: 16 })}
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </motion.tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </Paper>
  )

  const renderGridView = () => (
    <Box>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users.map((user, index) => (
          <MotionPaper
            key={user.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={listItemVariants}
            shadow="sm"
            radius="md"
            p="md"
            withBorder
            className="flex flex-col"
          >
            <Group justify="space-between" mb="xs">
              <Group gap="sm">
                <Avatar size="lg" color={theme.colors[theme.primaryColor][6]} radius="xl">
                  {getInitials(user.name)}
                </Avatar>
                <div>
                  <Text fw={700} size="lg">
                    {user.name}
                  </Text>
                  <Text c="dimmed" size="sm">
                    {user.email}
                  </Text>
                </div>
              </Group>
              <Badge
                color={getRoleColor(user.role)}
                variant="light"
                size="lg"
                radius="sm"
                leftSection={
                  user.role === "admin"
                    ? React.createElement(Shield, { size: 12 })
                    : React.createElement(User, { size: 12 })
                }
              >
                {user.role}
              </Badge>
            </Group>

            <Divider my="sm" />

            <div className="flex-grow">
              <Group gap={8}>
                <Text size="sm" fw={500}>
                  Phone:
                </Text>
                <Text size="sm">{user.phone || "—"}</Text>
              </Group>
              <Group gap={8} mt="xs">
                <Text size="sm" fw={500}>
                  Joined:
                </Text>
                <Text size="sm">{new Date(user.created_at).toLocaleDateString()}</Text>
              </Group>
            </div>

            <Divider my="sm" />

            <Group gap={8} justify="flex-end">
              <Tooltip label="View Details">
                <ActionIcon variant="light" color="blue" radius="md">
                  {React.createElement(Eye, { size: 16 })}
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Edit User">
                <ActionIcon variant="light" color="green" onClick={() => openEditModal(user)} radius="md">
                  {React.createElement(Edit, { size: 16 })}
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete User">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => handleDeleteUser(user.id, user.name)}
                  radius="md"
                >
                  {React.createElement(Trash, { size: 16 })}
                </ActionIcon>
              </Tooltip>
            </Group>
          </MotionPaper>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <Paper shadow="sm" radius="md" p="xl" withBorder>
          <Text ta="center" py="lg" c="dimmed">
            No users found. Try adjusting your search criteria.
          </Text>
        </Paper>
      )}
    </Box>
  )

  return (
    <AdminLayout>
      <Container size="xl" py="md">
        <MotionPaper
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          shadow="sm"
          radius="md"
          p="md"
          mb={24}
          withBorder
        >
          <Group justify="space-between" mb="md">
            <div>
              <Title order={2} className="flex items-center gap-2">
                {React.createElement(User, { className: "text-blue-500" })}
                User Management
              </Title>
              <Text c="dimmed" size="sm">
                Manage your system users and their permissions
              </Text>
            </div>
            <Group>
              <Button
                variant="outline"
                leftSection={React.createElement(RefreshCw, { size: 16, className: refreshing ? "animate-spin" : "" })}
                onClick={refreshData}
                disabled={loading || refreshing}
              >
                Refresh
              </Button>
              <Button color="blue" leftSection={React.createElement(Plus, { size: 16 })} onClick={openCreateModal}>
                Add User
              </Button>
            </Group>
          </Group>

          <Paper shadow="xs" radius="md" p="md" withBorder>
            <Group justify="space-between" mb="md">
              <form onSubmit={handleSearch} className="flex-grow">
                <TextInput
                  placeholder="Search by name, email or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  leftSection={React.createElement(Search, { size: 16 })}
                  radius="md"
                />
              </form>

              <Group>
                <Button
                  variant="subtle"
                  leftSection={React.createElement(Filter, { size: 16 })}
                  rightSection={React.createElement(ChevronDown, { size: 16 })}
                  onClick={toggleFilters}
                >
                  Filters
                </Button>
              </Group>
            </Group>

            <Transition mounted={showFilters} transition="slide-down" duration={200} timingFunction="ease">
              {(styles) => (
                <Box style={styles} mb="md">
                  <Paper p="md" radius="md" bg="gray.0">
                    <Group>
                      <Select
                        label="Filter by role"
                        placeholder="All roles"
                        clearable
                        data={[
                          { value: "admin", label: "Admin" },
                          { value: "customer", label: "Customer" },
                        ]}
                        value={roleFilter}
                        onChange={setRoleFilter}
                        w={200}
                      />
                      <Select
                        label="Sort by"
                        placeholder="Created date"
                        data={[
                          { value: "name", label: "Name" },
                          { value: "email", label: "Email" },
                          { value: "created_at", label: "Created date" },
                        ]}
                        defaultValue="created_at"
                        w={200}
                      />
                    </Group>
                  </Paper>
                </Box>
              )}
            </Transition>

            <Group justify="flex-end" mb="md">
              <div className="flex gap-2 border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "table" ? "filled" : "subtle"}
                  size="xs"
                  onClick={() => setViewMode("table")}
                >
                  Table
                </Button>
                <Button
                  variant={viewMode === "grid" ? "filled" : "subtle"}
                  size="xs"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
              </div>
            </Group>

            {loading ? (
              <div className="flex justify-center items-center p-12">
                <Loader size="lg" type="dots" />
              </div>
            ) : viewMode === "table" ? (
              renderTableView()
            ) : (
              renderGridView()
            )}

            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  total={pagination.totalPages}
                  value={pagination.page}
                  onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                  radius="md"
                  withEdges
                />
              </div>
            )}
          </Paper>
        </MotionPaper>

        <Modal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title={
            <Title order={3}>
              {currentUser ? (
                <span className="flex items-center gap-2">
                  {React.createElement(Edit, { size: 20, className: "text-blue-500" })}
                  Edit User
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {React.createElement(Plus, { size: 20, className: "text-green-500" })}
                  Add New User
                </span>
              )}
            </Title>
          }
          centered
          size="lg"
          radius="md"
          overlayProps={{
            blur: 3,
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box mb="md">
              <TextInput
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                radius="md"
                placeholder="John Doe"
                leftSection={React.createElement(User, { size: 16 })}
              />
            </Box>

            <Box mb="md">
              <TextInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                radius="md"
                placeholder="email@example.com"
              />
            </Box>

            {!currentUser && (
              <Box mb="md">
                <TextInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!currentUser}
                  radius="md"
                  placeholder="••••••••"
                />
              </Box>
            )}

            <Box mb="md">
              <TextInput
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                radius="md"
                placeholder="+1 (555) 123-4567"
              />
            </Box>

            <Box mb="md">
              <Select
                label="User Role"
                name="role"
                value={formData.role}
                onChange={(value) => handleSelectChange("role", value)}
                data={[
                  { value: "customer", label: "Customer" },
                  { value: "admin", label: "Admin" },
                  { value: "manager", label: "Manager" },
                  { value: "support", label: "Support" },
                ]}
                required
                radius="md"
              />
            </Box>

            <Divider my="lg" />

            <Group justify="flex-end">
              <Button variant="light" color="gray" onClick={() => setModalOpen(false)} radius="md">
                Cancel
              </Button>
              <Button type="submit" radius="md" color={currentUser ? "blue" : "green"}>
                {currentUser ? "Update User" : "Create User"}
              </Button>
            </Group>
          </form>
        </Modal>
      </Container>
    </AdminLayout>
  )
}

export default AdminUsers

