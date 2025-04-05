"use client"

import { useState, useEffect } from "react"
import { Text, Paper, Group, Avatar, Rating, Button, Loader } from "@mantine/core"
import { useAuth } from "../../store/useAuth"
import api from "../../services/api"
import { ReviewForm } from "./ReviewForm"

interface Review {
  id: string
  rating: number
  review_text: string
  created_at: string
  user_id: string
  user_name: string
}

interface ReviewListProps {
  productId: string
}

export function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { isAuthenticated, user } = useAuth()

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/reviews/product/${productId}`)
      setReviews(response.data.reviews)
      setError(null)
    } catch (err) {
      setError("Failed to load reviews")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const handleAddReview = async (rating: number, reviewText: string) => {
    try {
      await api.post(`/reviews/product/${productId}`, { rating, reviewText })
      fetchReviews()
      setShowForm(false)
    } catch (err) {
      setError("Failed to add review")
      console.error(err)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await api.delete(`/reviews/${reviewId}`)
      fetchReviews()
    } catch (err) {
      setError("Failed to delete review")
      console.error(err)
    }
  }

  const userHasReviewed = reviews.some((review) => user && review.user_id === user.id)

  if (loading) return <Loader size="sm" className="mx-auto my-4" />

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <Text size="xl" weight={600}>
          Customer Reviews
        </Text>
        {isAuthenticated && !userHasReviewed && !showForm && (
          <Button onClick={() => setShowForm(true)}>Write a Review</Button>
        )}
      </div>

      {error && <Text color="red">{error}</Text>}

      {showForm && (
        <Paper shadow="xs" p="md" className="mb-4">
          <ReviewForm onSubmit={handleAddReview} onCancel={() => setShowForm(false)} />
        </Paper>
      )}

      {reviews.length === 0 ? (
        <Text color="dimmed">No reviews yet. Be the first to review this product!</Text>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Paper key={review.id} shadow="xs" p="md">
              <Group position="apart">
                <Group>
                  <Avatar color="blue" radius="xl">
                    {review.user_name.charAt(0)}
                  </Avatar>
                  <div>
                    <Text size="sm" weight={500}>
                      {review.user_name}
                    </Text>
                    <Text size="xs" color="dimmed">
                      {new Date(review.created_at).toLocaleDateString()}
                    </Text>
                  </div>
                </Group>
                {user && review.user_id === user.id && (
                  <Button variant="subtle" color="red" compact onClick={() => handleDeleteReview(review.id)}>
                    Delete
                  </Button>
                )}
              </Group>
              <Rating value={review.rating} readOnly className="mt-2" />
              {review.review_text && <Text className="mt-2">{review.review_text}</Text>}
            </Paper>
          ))}
        </div>
      )}
    </div>
  )
}

