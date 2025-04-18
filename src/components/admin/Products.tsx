import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
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
  Image,
  Tooltip,
  NumberInput,
  Textarea,
  MultiSelect,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  Plus,
  Search,
  Edit,
  Trash,
  Eye,
  Tag,
  Check,
  RefreshCw,
  Filter,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { AdminLayout } from "./AdminLayout";
import { productService } from "../../services/productService";

// Define the Product interface separately
interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  colors: string[];
  sizes: string[];
  stock_quantity: number;
  category_id: string;
  average_rating?: number;
  review_count?: number;
}

interface FormData {
  name: string;
  price: number;
  description: string;
  image_url: string;
  colors: string[];
  sizes: string[];
  stock_quantity: number;
  category_id: string;
}

interface Category {
  value: string;
  label: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// This avoids the "any" type for the motion component
const MotionPaper = motion(Paper as any);

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showFilters, { toggle: toggleFilters }] = useDisclosure(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: 0,
    description: "",
    image_url: "",
    colors: [],
    sizes: [],
    stock_quantity: 0,
    category_id: "",
  });
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [priceFilter, setPriceFilter] = useState<[number, number] | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Available colors and sizes for the form
  const availableColors = [
    { value: "Black", label: "Black" },
    { value: "White", label: "White" },
    { value: "Gray", label: "Gray" },
    { value: "Blue", label: "Blue" },
    { value: "Red", label: "Red" },
    { value: "Green", label: "Green" },
    { value: "Yellow", label: "Yellow" },
    { value: "Brown", label: "Brown" },
    { value: "Pink", label: "Pink" },
    { value: "Purple", label: "Purple" },
  ];

  const availableSizes = [
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
  ];

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
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [pagination.page, searchQuery, priceFilter, colorFilter, sizeFilter]);

  const fetchCategories = async () => {
    try {
      const apiUrl = import.meta.env.VITE_AASHISH_API_URL;
      if (!apiUrl) {
        console.error("API URL environment variable is not set");
        return;
      }

      const response = await fetch(`${apiUrl}/categories`);

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();

      if (data.categories && Array.isArray(data.categories)) {
        setCategories(
          data.categories.map((cat: any) => ({
            value: cat.id,
            label: cat.name,
          }))
        );
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Build filter parameters
      const params: Record<string, any> = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (priceFilter) {
        params.minPrice = priceFilter[0];
        params.maxPrice = priceFilter[1];
      }

      if (colorFilter) {
        params.color = colorFilter;
      }

      if (sizeFilter) {
        params.size = sizeFilter;
      }

      const response = await productService.getProducts(params);

      if (response && response.products && Array.isArray(response.products)) {
        setProducts(
          response.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description || "",
            image_url: product.image_url || "",
            colors: product.colors || [],
            sizes: product.sizes || [],
            stock_quantity: product.stock_quantity || 0,
            category_id: product.category_id,
            average_rating: product.average_rating || 0,
            review_count: product.review_count || 0,
          }))
        );
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load products",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
    notifications.show({
      title: "Success",
      message: "Product data refreshed successfully",
      color: "green",
      icon: <Check size={16} />,
    });
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  const openCreateModal = () => {
    setCurrentProduct(null);
    setFormData({
      name: "",
      price: 0,
      description: "",
      image_url: "",
      colors: [],
      sizes: [],
      stock_quantity: 0,
      category_id: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || "",
      image_url: product.image_url || "",
      colors: product.colors || [],
      sizes: product.sizes || [],
      stock_quantity: product.stock_quantity || 0,
      category_id: product.category_id,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: string, value: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    if (value) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (currentProduct) {
        // Update existing product
        await productService.updateProduct(currentProduct.id, formData);
        notifications.show({
          title: "Success",
          message: `Product ${formData.name} updated successfully`,
          color: "green",
          icon: <Check size={16} />,
        });
      } else {
        // Create new product
        await productService.createProduct(formData);
        notifications.show({
          title: "Success",
          message: `Product ${formData.name} created successfully`,
          color: "green",
          icon: <Check size={16} />,
        });
      }

      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      notifications.show({
        title: "Error",
        message: `Failed to ${currentProduct ? "update" : "create"} product`,
        color: "red",
      });
    }
  };

  const handleDeleteProduct = async (
    productId: string,
    productName: string
  ) => {
    if (!window.confirm(`Are you sure you want to delete ${productName}?`)) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      fetchProducts();
      notifications.show({
        title: "Success",
        message: `Product ${productName} deleted successfully`,
        color: "green",
        icon: <Check size={16} />,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      notifications.show({
        title: "Error",
        message: `Failed to delete product ${productName}`,
        color: "red",
      });
    }
  };

  const renderTableView = () => (
    <Paper shadow="sm" radius="md" p="md" withBorder>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Stock</Table.Th>
            <Table.Th>Rating</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {products.length === 0 && !loading ? (
            <Table.Tr>
              <Table.Td colSpan={5}>
                <Text ta="center" py="lg" c="dimmed">
                  No products found. Try adjusting your search criteria.
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            products.map((product, index) => (
              <motion.tr
                key={product.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={listItemVariants}
              >
                <Table.Td>
                  <Group gap="sm">
                    <Image
                      src={
                        product.image_url ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      width={40}
                      height={40}
                      radius="md"
                      alt={product.name}
                    />
                    <div>
                      <Text fw={500}>{product.name}</Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {product.description || "No description available"}
                      </Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>${product.price.toFixed(2)}</Table.Td>
                <Table.Td>
                  <Badge
                    color={product.stock_quantity > 10 ? "green" : "yellow"}
                    variant="light"
                  >
                    {product.stock_quantity} in stock
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {product.average_rating ? (
                    <Group gap={4}>
                      <Text>{product.average_rating.toFixed(1)}</Text>
                      <Text size="xs" c="dimmed">
                        ({product.review_count || 0} reviews)
                      </Text>
                    </Group>
                  ) : (
                    "No ratings"
                  )}
                </Table.Td>
                <Table.Td>
                  <Group gap={8}>
                    <Tooltip label="View Details">
                      <ActionIcon variant="light" color="blue" radius="md">
                        <Eye size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Edit Product">
                      <ActionIcon
                        variant="light"
                        color="green"
                        onClick={() => openEditModal(product)}
                        radius="md"
                      >
                        <Edit size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete Product">
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() =>
                          handleDeleteProduct(product.id, product.name)
                        }
                        radius="md"
                      >
                        <Trash size={16} />
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
  );

  const renderGridView = () => (
    <Box>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <MotionPaper
            key={product.id}
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
            <div className="relative">
              <Image
                src={
                  product.image_url || "/placeholder.svg?height=160&width=100%"
                }
                height={160}
                radius="md"
                className="mb-3 w-full object-cover"
                alt={product.name}
              />
              <Badge
                className="absolute top-2 right-2"
                color="blue"
                variant="filled"
              >
                ${product.price.toFixed(2)}
              </Badge>
            </div>

            <Text fw={700} size="lg" lineClamp={1}>
              {product.name}
            </Text>

            <Text size="sm" c="dimmed" className="mb-2" lineClamp={2}>
              {product.description || "No description available"}
            </Text>

            <Group justify="space-between" className="mb-2">
              <Badge
                color={product.stock_quantity > 10 ? "green" : "yellow"}
                variant="light"
              >
                {product.stock_quantity} in stock
              </Badge>

              {product.average_rating ? (
                <Badge color="gray" variant="outline">
                  {product.average_rating.toFixed(1)} ★ (
                  {product.review_count || 0})
                </Badge>
              ) : (
                <Badge color="gray" variant="outline">
                  No ratings
                </Badge>
              )}
            </Group>

            {product.colors && product.colors.length > 0 && (
              <Group gap={4} className="mb-2">
                {product.colors.slice(0, 3).map((color) => (
                  <Badge key={color} color="gray" variant="outline" size="xs">
                    {color}
                  </Badge>
                ))}
                {product.colors.length > 3 && (
                  <Badge color="gray" variant="outline" size="xs">
                    +{product.colors.length - 3} more
                  </Badge>
                )}
              </Group>
            )}

            <Divider my="sm" />

            <Group gap={8} className="mt-auto">
              <Tooltip label="View Details">
                <ActionIcon variant="light" color="blue" radius="md">
                  <Eye size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Edit Product">
                <ActionIcon
                  variant="light"
                  color="green"
                  onClick={() => openEditModal(product)}
                  radius="md"
                >
                  <Edit size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete Product">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                  radius="md"
                >
                  <Trash size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </MotionPaper>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <Paper shadow="sm" radius="md" p="xl" withBorder>
          <Text ta="center" py="lg" c="dimmed">
            No products found. Try adjusting your search criteria.
          </Text>
        </Paper>
      )}
    </Box>
  );

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
                <Tag className="text-blue-500" />
                Product Management
              </Title>
              <Text c="dimmed" size="sm">
                Manage your product catalog
              </Text>
            </div>
            <Group>
              <Button
                variant="outline"
                leftSection={
                  <RefreshCw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                }
                onClick={refreshData}
                disabled={loading || refreshing}
              >
                Refresh
              </Button>
              <Button
                color="blue"
                leftSection={<Plus size={16} />}
                onClick={openCreateModal}
              >
                Add Product
              </Button>
            </Group>
          </Group>

          <Paper shadow="xs" radius="md" p="md" withBorder>
            <Group justify="space-between" mb="md">
              <form onSubmit={handleSearch} className="flex-grow">
                <TextInput
                  placeholder="Search products by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  leftSection={<Search size={16} />}
                  radius="md"
                />
              </form>

              <Group>
                <Button
                  variant="subtle"
                  leftSection={<Filter size={16} />}
                  rightSection={<ChevronDown size={16} />}
                  onClick={toggleFilters}
                >
                  Filters
                </Button>
              </Group>
            </Group>

            <Transition
              mounted={showFilters}
              transition="slide-down"
              duration={200}
              timingFunction="ease"
            >
              {(styles) => (
                <Box style={styles} mb="md">
                  <Paper p="md" radius="md" bg="gray.0">
                    <Group>
                      <Select
                        label="Filter by color"
                        placeholder="All colors"
                        clearable
                        data={availableColors}
                        value={colorFilter}
                        onChange={setColorFilter}
                        w={200}
                      />
                      <Select
                        label="Filter by size"
                        placeholder="All sizes"
                        clearable
                        data={availableSizes}
                        value={sizeFilter}
                        onChange={setSizeFilter}
                        w={200}
                      />
                      <Select
                        label="Sort by"
                        placeholder="Price"
                        data={[
                          { value: "price_asc", label: "Price: Low to High" },
                          { value: "price_desc", label: "Price: High to Low" },
                          { value: "name_asc", label: "Name: A to Z" },
                          { value: "rating_desc", label: "Highest Rated" },
                        ]}
                        defaultValue="price_asc"
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
                  onChange={(page) =>
                    setPagination((prev) => ({ ...prev, page }))
                  }
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
              {currentProduct ? (
                <span className="flex items-center gap-2">
                  <Edit size={20} className="text-blue-500" />
                  Edit Product
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Plus size={20} className="text-green-500" />
                  Add New Product
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
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                radius="md"
                placeholder="Classic T-Shirt"
              />
            </Box>

            <Group grow mb="md">
              <NumberInput
                label="Price ($)"
                name="price"
                value={formData.price}
                onChange={(value) =>
                  handleNumberInputChange("price", Number(value) || 0)
                }
                required
                min={0}
                step={0.01}
                radius="md"
                placeholder="19.99"
              />

              <NumberInput
                label="Stock Quantity"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={(value) =>
                  handleNumberInputChange("stock_quantity", Number(value) || 0)
                }
                required
                min={0}
                radius="md"
                placeholder="100"
              />
            </Group>

            <Box mb="md">
              <Select
                label="Category"
                name="category_id"
                value={formData.category_id}
                onChange={(value) => handleSelectChange("category_id", value)}
                data={categories}
                required
                radius="md"
                placeholder="Select a category"
              />
            </Box>

            <Box mb="md">
              <TextInput
                label="Image URL"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                radius="md"
                placeholder="https://example.com/image.jpg"
              />
            </Box>

            <Box mb="md">
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleTextAreaChange}
                radius="md"
                minRows={3}
                placeholder="A comfortable and stylish product..."
              />
            </Box>

            <Group grow mb="md">
              <MultiSelect
                label="Available Colors"
                name="colors"
                data={availableColors}
                value={formData.colors}
                onChange={(value) => handleMultiSelectChange("colors", value)}
                placeholder="Select colors"
                radius="md"
                searchable
                clearable
              />

              <MultiSelect
                label="Available Sizes"
                name="sizes"
                data={availableSizes}
                value={formData.sizes}
                onChange={(value) => handleMultiSelectChange("sizes", value)}
                placeholder="Select sizes"
                radius="md"
                searchable
                clearable
              />
            </Group>

            <Divider my="lg" />

            <Group justify="flex-end">
              <Button
                variant="light"
                color="gray"
                onClick={() => setModalOpen(false)}
                radius="md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                radius="md"
                color={currentProduct ? "blue" : "green"}
              >
                {currentProduct ? "Update Product" : "Create Product"}
              </Button>
            </Group>
          </form>
        </Modal>
      </Container>
    </AdminLayout>
  );
}
