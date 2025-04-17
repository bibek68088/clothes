import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Container, Title, Grid, Card, Image, Text, Badge, Group, Pagination, Loader } from "@mantine/core"
import { ProductFilters } from "../components/products/ProductFilters"
import { ProductSort } from "../components/products/ProductSort"
import { ProductSearch } from "../components/products/ProductSearch"
import { productService } from "../services/productService"
import { WishlistButton } from "../components/wishlist/WishlistButton"

interface Product {
  id: string
  name: string
  price: number
  image_url?: string
  description?: string
  colors: string[]
  sizes: string[]
  average_rating: number | null
  review_count: number
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface FilterValues {
  priceRange: { min: number; max: number }
  colors: string[]
  sizes: string[]
}

interface ActiveFilters {
  minPrice?: number
  maxPrice?: number
  colors: string[]
  sizes: string[]
  rating?: number
}

interface ProductResponse {
  products: Product[]
  pagination: Pagination
  filters: FilterValues
}

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  })
  const [filters, setFilters] = useState<FilterValues>({
    priceRange: { min: 0, max: 1000 },
    colors: [],
    sizes: [],
  })

  // Get current filter values from URL
  const currentPage = parseInt(searchParams.get("page") || "1", 10)
  const currentSort = searchParams.get("sort") || "created_at:desc"
  const currentSearch = searchParams.get("search") || ""
  const currentCategory = searchParams.get("category") || ""
  const currentMinPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice") || "0") : undefined
  const currentMaxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice") || "0") : undefined
  const currentColors = searchParams.get("colors") ? searchParams.get("colors")!.split(",") : []
  const currentSizes = searchParams.get("sizes") ? searchParams.get("sizes")!.split(",") : []
  const currentRating = searchParams.get("rating") ? parseInt(searchParams.get("rating") || "0", 10) : undefined

  const fetchProducts = async () => {
    try {
      setLoading(true)

      // Build query params
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: pagination.limit.toString(),
        sort: currentSort,
      }

      if (currentSearch) params.search = currentSearch
      if (currentCategory) params.category = currentCategory
      if (currentMinPrice !== undefined) params.minPrice = currentMinPrice.toString()
      if (currentMaxPrice !== undefined) params.maxPrice = currentMaxPrice.toString()
      if (currentColors.length > 0) params.colors = currentColors.join(",")
      if (currentSizes.length > 0) params.sizes = currentSizes.join(",")
      if (currentRating !== undefined) params.rating = currentRating.toString()

      const data = await productService.getProducts(params) as ProductResponse

      setProducts(data.products)
      setPagination(data.pagination)
      setFilters(data.filters)
      setError(null)
    } catch (err) {
      setError("Failed to load products")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("page", page.toString())
    setSearchParams(newParams)
  }

  const handleSortChange = (sort: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("sort", sort)
    newParams.set("page", "1") // Reset to first page
    setSearchParams(newParams)
  }

  const handleSearch = (query: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (query) {
      newParams.set("search", query)
    } else {
      newParams.delete("search")
    }
    newParams.set("page", "1") // Reset to first page
    setSearchParams(newParams)
  }

  interface FilterChangeParams {
    minPrice?: number
    maxPrice?: number
    colors?: string[]
    sizes?: string[]
    rating?: number
  }

  const handleFilterChange = (newFilters: FilterChangeParams) => {
    const newParams = new URLSearchParams(searchParams)

    // Update or remove filter params
    if (newFilters.minPrice !== undefined) {
      newParams.set("minPrice", newFilters.minPrice.toString())
    } else {
      newParams.delete("minPrice")
    }

    if (newFilters.maxPrice !== undefined) {
      newParams.set("maxPrice", newFilters.maxPrice.toString())
    } else {
      newParams.delete("maxPrice")
    }

    if (newFilters.colors && newFilters.colors.length > 0) {
      newParams.set("colors", newFilters.colors.join(","))
    } else {
      newParams.delete("colors")
    }

    if (newFilters.sizes && newFilters.sizes.length > 0) {
      newParams.set("sizes", newFilters.sizes.join(","))
    } else {
      newParams.delete("sizes")
    }

    if (newFilters.rating !== undefined) {
      newParams.set("rating", newFilters.rating.toString())
    } else {
      newParams.delete("rating")
    }

    newParams.set("page", "1") // Reset to first page
    setSearchParams(newParams)
  }

  const activeFilters: ActiveFilters = {
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
    colors: currentColors,
    sizes: currentSizes,
    rating: currentRating
  }

  return (
    <Container size="xl" className="py-8">
      <Title order={1} className="mb-6">
        Products
      </Title>

      <Grid>
        {/* Filters sidebar */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <ProductFilters
            filters={filters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </Grid.Col>

        {/* Product grid */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
            <ProductSearch initialValue={currentSearch} onSearch={handleSearch} />
            <ProductSort value={currentSort} onChange={handleSortChange} />
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : error ? (
            <Text color="red">{error}</Text>
          ) : products.length === 0 ? (
            <Text>No products found. Try adjusting your filters.</Text>
          ) : (
            <>
              <Grid>
                {products.map((product) => (
                  <Grid.Col key={product.id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Card.Section>
                        <div className="relative">
                          <Link to={`/product/${product.id}`}>
                            <Image src={product.image_url || "/placeholder.svg"} height={200} alt={product.name} />
                          </Link>
                          <div className="absolute top-2 right-2">
                            <WishlistButton productId={product.id} />
                          </div>
                        </div>
                      </Card.Section>

                      <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500} component={Link} to={`/product/${product.id}`}>
                          {product.name}
                        </Text>
                        {product.average_rating !== null && (
                          <Badge color="blue">
                            {product.average_rating.toFixed(1)} ★ ({product.review_count})
                          </Badge>
                        )}
                      </Group>

                      <Text size="sm" color="dimmed" lineClamp={2}>
                        {product.description || ""}
                      </Text>

                      <Text fw={700} size="lg" mt="md">
                        ${product.price.toFixed(2)}
                      </Text>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.colors.slice(0, 3).map((color) => (
                          <Badge key={color} color="gray" variant="outline" size="sm">
                            {color}
                          </Badge>
                        ))}
                        {product.colors.length > 3 && (
                          <Badge color="gray" variant="outline" size="sm">
                            +{product.colors.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination total={pagination.totalPages} value={pagination.page} onChange={handlePageChange} />
                </div>
              )}
            </>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  )
}