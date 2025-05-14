"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

interface FavoriteButtonProps {
  recipeId: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function FavoriteButton({ recipeId, variant = "outline", size = "default" }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      checkIfFavorite()
    } else {
      setIsLoading(false)
    }
  }, [recipeId, user])

  const checkIfFavorite = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/favorites?recipeId=${recipeId}`)
      if (!response.ok) throw new Error("Failed to check favorite status")

      const data = await response.json()
      setIsFavorite(data.isFavorite)
    } catch (error) {
      console.error("Error checking favorite status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      router.push("/auth")
      return
    }

    try {
      setIsSubmitting(true)
      const method = isFavorite ? "DELETE" : "POST"
      const url = isFavorite ? `/api/favorites/${recipeId}` : "/api/favorites"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        ...(method === "POST" && {
          body: JSON.stringify({ recipeId }),
        }),
      })

      if (!response.ok) throw new Error("Failed to update favorite status")

      setIsFavorite(!isFavorite)
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite ? "Recipe removed from your favorites" : "Recipe added to your favorites",
      })

      // Refresh the page if we're on the favorites page
      if (window.location.pathname === "/profile/favorites" && isFavorite) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating favorite status:", error)
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Button variant={variant} size={size} disabled>
        <Heart className="h-[1.2em] w-[1.2em]" />
        {size !== "icon" && <span className="ml-2">Save</span>}
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleFavorite}
      disabled={isSubmitting}
      className={isFavorite ? "text-red-500 hover:text-red-600" : ""}
    >
      <Heart className={`h-[1.2em] w-[1.2em] ${isFavorite ? "fill-current" : ""}`} />
      {size !== "icon" && <span className="ml-2">{isFavorite ? "Saved" : "Save"}</span>}
    </Button>
  )
}
