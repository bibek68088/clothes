"use client"
import { Select } from "@mantine/core"

interface ProductSortProps {
  value: string
  onChange: (value: string) => void
}

export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <Select
      label="Sort by"
      value={value}
      onChange={(val) => onChange(val || "created_at:desc")}
      data={[
        { value: "created_at:desc", label: "Newest" },
        { value: "price:asc", label: "Price: Low to High" },
        { value: "price:desc", label: "Price: High to Low" },
        { value: "name:asc", label: "Name: A to Z" },
        { value: "name:desc", label: "Name: Z to A" },
        { value: "average_rating:desc", label: "Highest Rated" },
      ]}
    />
  )
}

