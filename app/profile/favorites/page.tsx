"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Star, Heart } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function FavoritesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [favorites, setFavorites] = useState([])
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/favorites")
        const data = await response.json()

        if (response.ok) {
          setFavorites(data.favorites)
        } else {
          setError(data.message || "Failed to load favorites")
        }
      } catch (error) {
        setError("An error occurred. Please try again.")
      } finally {
        setIsLoadingFavorites(false)
      }
    }

    if (user) {
      fetchFavorites()
    }
  }, [user])

  const handleRemoveFavorite = async (recipeId) => {
    try {
      const response = await fetch(`/api/favorites/${recipeId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Recipe Removed",
          description: data.message,
        })
        setFavorites((prev) => prev.filter((fav) => fav.recipe._id !== recipeId))
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to remove recipe",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading || isLoadingFavorites) {
    return (
      <div className="min-h-screen bg-amber-100 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-amber-200 rounded w-1/3"></div>
                <div className="h-4 bg-amber-200 rounded w-1/2"></div>
                <div className="h-64 bg-amber-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-100 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/profile" className="inline-flex items-center text-amber-900 hover:text-amber-700 mb-8">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Profile
          </Link>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-amber-500 p-6">
              <h1 className="text-2xl font-bold text-amber-900">My Favorite Recipes</h1>
            </div>

            <div className="p-8">
              {error ? (
                <div className="text-center py-8">
                  <p className="text-amber-800 mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    Try Again
                  </Button>
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-amber-800 mb-4">You haven't saved any recipes to your favorites yet.</p>
                  <Link href="/recipes">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">Browse Recipes</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favorites.map((favorite) => (
                    <Card key={favorite._id} className="overflow-hidden border-amber-300">
                      <div className="relative">
                        <Image
                          src={favorite.recipe.image || "/placeholder.svg"}
                          alt={favorite.recipe.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                        {favorite.recipe.category && (
                          <Badge className="absolute top-2 right-2 bg-amber-500 text-white">
                            {favorite.recipe.category}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="text-xl font-bold text-amber-900 mb-2">{favorite.recipe.title}</h3>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="inline-block mr-2">⏱️</span>
                            <span>{favorite.recipe.time}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="inline-block mr-2">👥</span>
                            <span>{favorite.recipe.servings} servings</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(favorite.recipe.rating)
                                  ? "fill-amber-500 text-amber-500"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-amber-800">{favorite.recipe.rating}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Link href={`/recipes/${favorite.recipe.slug}`}>
                          <Button className="bg-amber-500 hover:bg-amber-600 text-white">View Recipe</Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveFavorite(favorite.recipe._id)}
                        >
                          <Heart className="h-4 w-4 mr-1 fill-red-600" /> Remove
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
