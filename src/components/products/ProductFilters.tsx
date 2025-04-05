import { useState } from "react"
import { Paper, Title, RangeSlider, Checkbox, Group, Button, Accordion, Text } from "@mantine/core"

interface FilterProps {
  filters: {
    priceRange: { min: number; max: number }
    colors: string[]
    sizes: string[]
  }
  activeFilters: {
    minPrice?: number
    maxPrice?: number
    colors?: string[]
    sizes?: string[]
    rating?: number
  }
  onFilterChange: (filters: any) => void
}

export function ProductFilters({ filters, activeFilters, onFilterChange }: FilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    activeFilters.minPrice || filters.priceRange.min,
    activeFilters.maxPrice || filters.priceRange.max,
  ])

  const [selectedColors, setSelectedColors] = useState<string[]>(activeFilters.colors || [])

  const [selectedSizes, setSelectedSizes] = useState<string[]>(activeFilters.sizes || [])

  const [selectedRating, setSelectedRating] = useState<number | null>(activeFilters.rating || null)

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value)
  }

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  const handleRatingChange = (rating: number) => {
    setSelectedRating((prev) => (prev === rating ? null : rating))
  }

  const applyFilters = () => {
    onFilterChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      colors: selectedColors.length > 0 ? selectedColors : undefined,
      sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
      rating: selectedRating,
    })
  }

  const resetFilters = () => {
    setPriceRange([filters.priceRange.min, filters.priceRange.max])
    setSelectedColors([])
    setSelectedSizes([])
    setSelectedRating(null)

    onFilterChange({})
  }

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Title order={4} className="mb-4">
        Filters
      </Title>

      <Accordion defaultValue="price">
        <Accordion.Item value="price">
          <Accordion.Control>Price Range</Accordion.Control>
          <Accordion.Panel>
            <div className="px-2 py-4">
              <RangeSlider
                min={filters.priceRange.min}
                max={filters.priceRange.max}
                step={5}
                value={priceRange}
                onChange={handlePriceChange}
                label={(value) => `$${value}`}
                className="mb-2"
              />
              <Group justify="space-between" className="text-sm">
                <Text>${priceRange[0]}</Text>
                <Text>${priceRange[1]}</Text>
              </Group>
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="colors">
          <Accordion.Control>Colors</Accordion.Control>
          <Accordion.Panel>
            <div className="flex flex-wrap gap-2 py-2">
              {filters.colors.map((color) => (
                <Checkbox
                  key={color}
                  label={color}
                  checked={selectedColors.includes(color)}
                  onChange={() => handleColorToggle(color)}
                  className="mb-2"
                />
              ))}
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="sizes">
          <Accordion.Control>Sizes</Accordion.Control>
          <Accordion.Panel>
            <div className="flex flex-wrap gap-2 py-2">
              {filters.sizes.map((size) => (
                <Checkbox
                  key={size}
                  label={size}
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeToggle(size)}
                  className="mb-2"
                />
              ))}
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="rating">
          <Accordion.Control>Rating</Accordion.Control>
          <Accordion.Panel>
            <div className="py-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center mb-2">
                  <Checkbox checked={selectedRating === rating} onChange={() => handleRatingChange(rating)} />
                  <div className="ml-2 flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-lg ${i < rating ? "text-yellow-400" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                    {rating === 1 ? " & up" : ""}
                  </div>
                </div>
              ))}
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Group justify="space-between" className="mt-4">
        <Button variant="subtle" onClick={resetFilters}>
          Reset
        </Button>
        <Button onClick={applyFilters}>Apply Filters</Button>
      </Group>
    </Paper>
  )
}

