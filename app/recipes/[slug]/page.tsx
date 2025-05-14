import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock, Users, ChefHat, Star } from "lucide-react"
import RecipeModel, { IRecipe } from "@/models/Recipe"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FavoriteButton } from "@/components/favorite-button"
import { ShareButton } from "@/components/share-button"
import { PrintButton } from "@/components/print-button"
import { Comments } from "@/components/comments"
import { RecipeRating } from "@/components/recipe-rating"
import connectToDatabase from "@/lib/mongodb"
import Recipe from "@/models/Recipe"

interface RecipeWithStringDates extends Omit<IRecipe, 'createdAt' | 'updatedAt' | '_id' | 'author'> {
  _id: string
  author: {
    _id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

async function getRecipe(slug: string): Promise<RecipeWithStringDates | null> {
  await connectToDatabase()
  
  const recipe = await Recipe.findOne({ slug })
    .populate("author", "name")
    .lean()

  if (!recipe) {
    return null
  }

  return {
    ...recipe,
    _id: recipe._id.toString(),
    author: recipe.author ? {
      ...recipe.author,
      _id: recipe.author._id.toString()
    } : null
  }
}

// Add metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const recipe = await getRecipe(params.slug)

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found.',
    }
  }

  return {
    title: `${recipe.title} - TastyBites`,
    description: recipe.description,
    openGraph: {
      title: `${recipe.title} - TastyBites`,
      description: recipe.description,
      images: recipe.images[0] ? [recipe.images[0]] : undefined,
    },
  }
}

interface PageProps {
  params: { slug: string }
}

export default async function RecipePage({ params }: PageProps) {
  const recipe = await getRecipe(params.slug)

  if (!recipe) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-amber-50 pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Hero Image Section */}
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
          <Image
            src={recipe.images[0] || "/placeholder.svg"}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Recipe Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-amber-900 mb-3">{recipe.title}</h1>
              <p className="text-lg text-amber-700 mb-4">{recipe.description}</p>
              <div className="flex items-center text-amber-600">
                <span className="mr-4">By {recipe.author?.name || "Anonymous"}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(recipe.rating?.average || 0)
                          ? "fill-amber-500 text-amber-500"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="ml-2">{recipe.rating?.average?.toFixed(1) || "No ratings"}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <Clock className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <div className="text-sm text-amber-700">Prep Time</div>
                <div className="font-semibold">{recipe.prepTime} min</div>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <div className="text-sm text-amber-700">Cook Time</div>
                <div className="font-semibold">{recipe.cookTime} min</div>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <div className="text-sm text-amber-700">Servings</div>
                <div className="font-semibold">{recipe.servings}</div>
              </div>
            </div>
          </div>

          {/* Categories and Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.category.map((cat, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
              >
                {cat}
              </span>
            ))}
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
              {recipe.cuisine}
            </span>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
              {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center text-amber-800">
                    <span className="w-16 font-semibold">{ingredient.quantity} {ingredient.unit}</span>
                    <span>{ingredient.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">Instructions</h2>
              <ol className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-amber-500 text-white rounded-full mr-4">
                      {index + 1}
                    </span>
                    <p className="text-amber-800">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
