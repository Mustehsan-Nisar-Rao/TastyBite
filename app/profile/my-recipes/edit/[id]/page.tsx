"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import RecipeForm from "@/components/recipe-form"

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [recipe, setRecipe] = useState(null)
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${params.id}`)
        const data = await response.json()

        if (response.ok) {
          setRecipe(data.recipe)
        } else {
          setError(data.message || "Failed to load recipe")
        }
      } catch (error) {
        setError("An error occurred. Please try again.")
      } finally {
        setIsLoadingRecipe(false)
      }
    }

    if (params.id) {
      fetchRecipe()
    }
  }, [params.id])

  if (isLoading || isLoadingRecipe) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-amber-100 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-amber-900 mb-4">Error</h1>
                <p className="text-amber-800 mb-6">{error}</p>
                <Link href="/profile/my-recipes" className="text-amber-600 hover:text-amber-700">
                  Back to My Recipes
                </Link>
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
          <Link
            href="/profile/my-recipes"
            className="inline-flex items-center text-amber-900 hover:text-amber-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Recipes
          </Link>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-amber-500 p-6">
              <h1 className="text-2xl font-bold text-amber-900">Edit Recipe</h1>
            </div>

            <div className="p-8">
              <RecipeForm initialData={recipe} isEditing={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
