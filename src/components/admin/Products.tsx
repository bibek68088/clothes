import type React from "react";
import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Table,
  Button,
  Group,
  TextInput,
  Modal,
  NumberInput,
  Textarea,
  MultiSelect,
  Image,
  ActionIcon,
  Pagination,
} from "@mantine/core";
import { Plus, Search, Edit, Trash } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import api from "../../services/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  category_id: string;
  colors: string[];
  sizes: string[];
  created_at: string;
}

interface Category {
  id: string;
  name: string;
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    image_url: "",
    category_id: "",
    colors: [] as string[],
    sizes: [] as string[],
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [pagination.page, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchQuery || undefined,
        },
      });

      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/products/categories/all");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  const openCreateModal = () => {
    setCurrentProduct(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      image_url: "",
      category_id: "",
      colors: [],
      sizes: [],
    });
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock_quantity: product.stock_quantity,
      image_url: product.image_url || "",
      category_id: product.category_id || "",
      colors: product.colors || [],
      sizes: product.sizes || [],
    });
    setModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: string, value: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (currentProduct) {
        // Update existing product
        await api.put(`/admin/products/${currentProduct.id}`, formData);
      } else {
        // Create new product
        await api.post("/admin/products", formData);
      }

      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.delete(`/admin/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <AdminLayout>
      <Container size="xl" className="py-6">
        <Group justify="space-between" className="mb-6">
          <Title order={2}>Products</Title>
          <Button leftSection={<Plus size={16} />} onClick={openCreateModal}>
            Add Product
          </Button>
        </Group>

        <form onSubmit={handleSearch} className="mb-4">
          <TextInput
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            rightSection={<Search size={16} />}
          />
        </form>

        <Table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    width={50}
                    height={50}
                  />
                </td>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock_quantity}</td>
                <td>
                  <Group fw={8}>
                    <ActionIcon
                      color="blue"
                      onClick={() => openEditModal(product)}
                    >
                      <Edit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash size={16} />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  {loading ? "Loading..." : "No products found"}
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
          title={currentProduct ? "Edit Product" : "Add Product"}
          size="lg"
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

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mb-3"
            />

            <Group grow className="mb-3">
              <NumberInput
                label="Price"
                value={formData.price}
                onChange={(value) =>
                  handleNumberChange(
                    "price",
                    typeof value === "number" ? value : 0
                  )
                }
                precision={2}
                min={0}
                required
              />

              <NumberInput
                label="Stock Quantity"
                value={formData.stock_quantity}
                onChange={(value) =>
                  handleNumberChange(
                    "stock_quantity",
                    typeof value === "number" ? value : 0
                  )
                }
                min={0}
                required
              />
            </Group>

            <TextInput
              label="Image URL"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="mb-3"
            />

            <MultiSelect
              label="Colors"
              data={[
                { value: "Black", label: "Black" },
                { value: "White", label: "White" },
                { value: "Red", label: "Red" },
                { value: "Blue", label: "Blue" },
                { value: "Green", label: "Green" },
                { value: "Yellow", label: "Yellow" },
                { value: "Brown", label: "Brown" },
                { value: "Gray", label: "Gray" },
              ]}
              value={formData.colors}
              onChange={(value) => handleMultiSelectChange("colors", value)}
              searchable
              creatable
              getCreateLabel={(query) => `+ Add ${query}`}
              className="mb-3"
            />

            <MultiSelect
              label="Sizes"
              data={[
                { value: "XS", label: "XS" },
                { value: "S", label: "S" },
                { value: "M", label: "M" },
                { value: "L", label: "L" },
                { value: "XL", label: "XL" },
                { value: "XXL", label: "XXL" },
                { value: "30", label: "30" },
                { value: "32", label: "32" },
                { value: "34", label: "34" },
                { value: "36", label: "36" },
                { value: "38", label: "38" },
                { value: "40", label: "40" },
              ]}
              value={formData.sizes}
              onChange={(value) => handleMultiSelectChange("sizes", value)}
              searchable
              creatable
              getCreateLabel={(query) => `+ Add ${query}`}
              className="mb-4"
            />

            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {currentProduct ? "Update" : "Create"}
              </Button>
            </Group>
          </form>
        </Modal>
      </Container>
    </AdminLayout>
  );
}
