"use client"

import { useEffect, useState } from "react"
import { RecipeCard } from "./recipe-card"
import { Skeleton } from "./ui/skeleton"

interface Recipe {
  _id: string
  title: string
  images: string[]
  category: string[]
  prepTime: number
  cookTime: number
  slug: string
  difficulty: "Easy" | "Medium" | "Hard"
}

export default function FeaturedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        const response = await fetch("/api/recipes/featured")
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error || "Failed to fetch recipes")
        
        setRecipes(data.recipes)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedRecipes()
  }, [])

  if (error) {
    return (
      <section className="bg-amber-50 py-12">
        <div className="container mx-auto px-6">
          <div className="text-red-500 text-center">Error: {error}</div>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="bg-amber-50 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-amber-900 mb-8">Top Rated Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[300px]" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!recipes.length) {
    return (
      <section className="bg-amber-50 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-amber-900 mb-8">Top Rated Recipes</h2>
          <p className="text-center text-amber-800">No recipes found</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-amber-50 py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-amber-900 mb-8">Top Rated Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              id={recipe._id}
              title={recipe.title}
              image={recipe.images[0] || "/placeholder.svg"}
              category={recipe.category[0] || "Uncategorized"}
              prepTime={recipe.prepTime.toString()}
              cookTime={recipe.cookTime.toString()}
              slug={recipe.slug}
              difficulty={recipe.difficulty as "Easy" | "Medium" | "Hard"}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
