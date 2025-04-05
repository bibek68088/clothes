"use client"

import type React from "react"
import { useState } from "react"
import { TextInput, ActionIcon } from "@mantine/core"
import { Search, X } from "lucide-react"

interface ProductSearchProps {
  initialValue?: string
  onSearch: (query: string) => void
}

export function ProductSearch({ initialValue = "", onSearch }: ProductSearchProps) {
  const [query, setQuery] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <TextInput
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          rightSection={
            query ? (
              <ActionIcon onClick={clearSearch}>
                <X size={16} />
              </ActionIcon>
            ) : (
              <ActionIcon type="submit">
                <Search size={16} />
              </ActionIcon>
            )
          }
          className="w-full"
        />
      </div>
    </form>
  )
}

