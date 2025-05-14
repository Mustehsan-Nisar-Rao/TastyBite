"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, Edit, Trash2, Eye, Star } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function MyRecipesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [recipes, setRecipes] = useState([])
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true)
  const [error, setError] = useState("")
  const [recipeToDelete, setRecipeToDelete] = useState(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes/user")
        const data = await response.json()

        if (response.ok) {
          setRecipes(data.recipes)
        } else {
          setError(data.message || "Failed to load recipes")
        }
      } catch (error) {
        setError("An error occurred. Please try again.")
      } finally {
        setIsLoadingRecipes(false)
      }
    }

    if (user) {
      fetchRecipes()
    }
  }, [user])

  const handleDeleteRecipe = async () => {
    if (!recipeToDelete) return

    try {
      const response = await fetch(`/api/recipes/${recipeToDelete}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Recipe Deleted",
          description: data.message,
        })
        setRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeToDelete))
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete recipe",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRecipeToDelete(null)
    }
  }

  if (isLoading || isLoadingRecipes) {
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
            <div className="bg-amber-500 p-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-amber-900">My Recipes</h1>
              <Link href="/profile/my-recipes/create">
                <Button className="bg-amber-700 hover:bg-amber-800 text-white">
                  <Plus className="h-4 w-4 mr-2" /> Create Recipe
                </Button>
              </Link>
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
              ) : recipes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-amber-800 mb-4">You haven't created any recipes yet.</p>
                  <Link href="/profile/my-recipes/create">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                      <Plus className="h-4 w-4 mr-2" /> Create Your First Recipe
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recipes.map((recipe) => (
                    <Card key={recipe._id} className="overflow-hidden border-amber-300">
                      <div className="relative">
                        <Image
                          src={recipe.image || "/placeholder.svg"}
                          alt={recipe.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                        {recipe.featured && (
                          <Badge className="absolute top-2 left-2 bg-amber-500 text-white">Featured</Badge>
                        )}
                        {!recipe.published && (
                          <Badge className="absolute top-2 right-2 bg-gray-500 text-white">Draft</Badge>
                        )}
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="text-xl font-bold text-amber-900 mb-2">{recipe.title}</h3>
                        <p className="text-amber-800 mb-4 line-clamp-2">{recipe.description}</p>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="inline-block mr-2">⏱️</span>
                            <span>{recipe.prepTime + recipe.cookTime} min</span>
                          </div>
                          <div className="flex items-center">
                            <span className="inline-block mr-2">👥</span>
                            <span>{recipe.servings} servings</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(recipe.rating)
                                  ? "fill-amber-500 text-amber-500"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-amber-800">{recipe.rating}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex space-x-2">
                          <Link href={`/recipes/${recipe.slug}`}>
                            <Button variant="outline" size="sm" className="border-amber-300 text-amber-800">
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </Link>
                          <Link href={`/profile/my-recipes/edit/${recipe._id}`}>
                            <Button variant="outline" size="sm" className="border-amber-300 text-amber-800">
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                          </Link>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              onClick={() => setRecipeToDelete(recipe._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your recipe.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setRecipeToDelete(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteRecipe}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
