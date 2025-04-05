"use client"

import { useState, useEffect } from "react"
import { Container, Title, Table, Group, Select, Badge, Pagination, ActionIcon, Modal, Button } from "@mantine/core"
import { Eye } from "lucide-react"
import { AdminLayout } from "./AdminLayout"
import api from "../../services/api"

interface Order {
  id: string
  user_id: string
  status: string
  total_amount: number
  created_at: string
  customer_name: string
  customer_email: string
}

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  selected_options: {
    color?: string
    size?: string
  }
  product: {
    name: string
    image: string
  }
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [pagination.page, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get("/admin/orders", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          status: statusFilter || undefined,
        },
      })

      setOrders(response.data.orders)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return response.data.order
    } catch (error) {
      console.error("Error fetching order details:", error)
      return null
    }
  }

  const handleViewOrder = async (order: Order) => {
    setCurrentOrder(order)

    try {
      const orderDetails = await fetchOrderDetails(order.id)
      if (orderDetails) {
        setOrderItems(orderDetails.items)
      }
    } catch (error) {
      console.error("Error fetching order items:", error)
      setOrderItems([])
    }

    setDetailModalOpen(true)
  }

  const openStatusModal = (order: Order) => {
    setCurrentOrder(order)
    setNewStatus(order.status)
    setStatusModalOpen(true)
  }

  const handleStatusChange = async () => {
    if (!currentOrder) return

    try {
      await api.put(`/admin/orders/${currentOrder.id}/status`, {
        status: newStatus,
      })

      setStatusModalOpen(false)
      fetchOrders()
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow"
      case "processing":
        return "blue"
      case "shipped":
        return "indigo"
      case "delivered":
        return "green"
      case "cancelled":
        return "red"
      default:
        return "gray"
    }
  }

  return (
    <AdminLayout>
      <Container size="xl" className="py-6">
        <Group justify="space-between" className="mb-6">
          <Title order={2}>Orders</Title>
          <Select
            placeholder="Filter by status"
            clearable
            value={statusFilter}
            onChange={setStatusFilter}
            data={[
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            style={{ width: 200 }}
          />
        </Group>

        <Table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id.substring(0, 8)}...</td>
                <td>
                  <div>{order.customer_name}</div>
                  <div className="text-xs text-gray-500">{order.customer_email}</div>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <Badge
                    color={getStatusColor(order.status)}
                    className="cursor-pointer"
                    onClick={() => openStatusModal(order)}
                  >
                    {order.status}
                  </Badge>
                </td>
                <td>${order.total_amount.toFixed(2)}</td>
                <td>
                  <ActionIcon color="blue" onClick={() => handleViewOrder(order)}>
                    <Eye size={16} />
                  </ActionIcon>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  {loading ? "Loading..." : "No orders found"}
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

        {/* Order Details Modal */}
        <Modal opened={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Order Details" size="lg">
          {currentOrder && (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-semibold">Order Information</h3>
                  <p>ID: {currentOrder.id}</p>
                  <p>Date: {new Date(currentOrder.created_at).toLocaleString()}</p>
                  <p>
                    Status: <Badge color={getStatusColor(currentOrder.status)}>{currentOrder.status}</Badge>
                  </p>
                  <p>Total: ${currentOrder.total_amount.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Customer Information</h3>
                  <p>Name: {currentOrder.customer_name}</p>
                  <p>Email: {currentOrder.customer_email}</p>
                </div>
              </div>

              <h3 className="text-sm font-semibold mb-2">Order Items</h3>
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Options</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="flex items-center gap-2">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span>{item.product.name}</span>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>
                        {item.selected_options?.color && <span>Color: {item.selected_options.color}</span>}
                        {item.selected_options?.color && item.selected_options?.size && <span> | </span>}
                        {item.selected_options?.size && <span>Size: {item.selected_options.size}</span>}
                      </td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal>

        {/* Update Status Modal */}
        <Modal opened={statusModalOpen} onClose={() => setStatusModalOpen(false)} title="Update Order Status">
          <Select
            label="Status"
            value={newStatus}
            onChange={(value) => setNewStatus(value || "")}
            data={[
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            className="mb-4"
          />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange}>Update Status</Button>
          </Group>
        </Modal>
      </Container>
    </AdminLayout>
  )
}

