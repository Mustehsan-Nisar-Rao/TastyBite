"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

interface RecipeRatingProps {
  recipeId: string
}

export function RecipeRating({ recipeId }: RecipeRatingProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [totalRatings, setTotalRatings] = useState(0)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchRatings()
  }, [recipeId])

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/ratings?recipeId=${recipeId}`)
      if (!response.ok) throw new Error("Failed to fetch ratings")

      const data = await response.json()
      setAverageRating(data.averageRating)
      setTotalRatings(data.totalRatings)

      if (user && data.userRating) {
        setUserRating(data.userRating.rating)
        setRating(data.userRating.rating)
      }
    } catch (error) {
      console.error("Error fetching ratings:", error)
    }
  }

  const handleRatingSubmit = async () => {
    if (!user) {
      router.push("/auth")
      return
    }

    if (!rating) return

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId,
          rating,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit rating")

      setUserRating(rating)
      fetchRatings()
      toast({
        title: "Rating Submitted",
        description: "Thank you for rating this recipe!",
      })
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast({
        title: "Error",
        description: "Failed to submit your rating. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (count: number, filled = false, interactive = false) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-6 w-6 ${
            (filled && i < count) || (interactive && i < (hoveredRating || rating || 0))
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          } ${interactive ? "cursor-pointer transition-colors" : ""}`}
          onClick={interactive ? () => setRating(i + 1) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(i + 1) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(null) : undefined}
        />
      ))
  }

  return (
    <div className="space-y-4">
      {averageRating !== null && (
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(Math.round(averageRating), true)}</div>
          <span className="text-sm font-medium">
            {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
          </span>
        </div>
      )}

      {user ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">{userRating ? "Your rating:" : "Rate this recipe:"}</p>
          <div className="flex items-center gap-4">
            <div className="flex">{renderStars(0, false, true)}</div>
            <Button onClick={handleRatingSubmit} disabled={isSubmitting || !rating || rating === userRating} size="sm">
              {userRating ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-sm">
          <a href="/auth" className="text-primary hover:underline">
            Sign in to rate this recipe
          </a>
        </div>
      )}
    </div>
  )
}
