import type React from "react"
import { useState } from "react"
import { Text, Rating, Textarea, Button, Group } from "@mantine/core"

interface ReviewFormProps {
  onSubmit: (rating: number, reviewText: string) => void
  onCancel: () => void
}

export function ReviewForm({ onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    onSubmit(rating, reviewText)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Text fw={500} size="sm" className="mb-2">
        Your Rating
      </Text>
      <Rating value={rating} onChange={setRating} size="lg" className="mb-4" />

      <Text fw={500} size="sm" className="mb-2">
        Your Review (optional)
      </Text>
      <Textarea
        placeholder="Share your experience with this product..."
        value={reviewText}
        onChange={(e) => setReviewText(e.currentTarget.value)}
        minRows={3}
        className="mb-4"
      />

      {error && (
        <Text color="red" size="sm" className="mb-2">
          {error}
        </Text>
      )}

      <Group justify="right">
        <Button variant="subtle" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit Review</Button>
      </Group>
    </form>
  )
}

