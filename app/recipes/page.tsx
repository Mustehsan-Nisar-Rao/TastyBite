import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, PlusCircle } from "lucide-react"
import RecipePagination from "@/components/recipe-pagination"
import RecipeSearch from "./recipe-search"
import connectToDatabase from "@/lib/mongodb"
import Recipe from "@/models/Recipe"
import type { RecipeDocument } from "@/models/Recipe"

async function getRecipes(searchParams: { [key: string]: string | string[] | undefined }) {
  await connectToDatabase()
  
  const search = searchParams.search as string
  const page = parseInt(searchParams.page as string || "1")
  const limit = 6

  // Build query
  const query: any = { featured: false }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { cuisine: { $regex: search, $options: "i" } },
    ]
  }

  // Get recipes with pagination
  const recipes = await Recipe.find(query)
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  // Get total count for pagination
  const total = await Recipe.countDocuments(query)

  // Convert _id to string and ensure proper typing
  const formattedRecipes = recipes.map((recipe: any) => ({
    ...recipe,
    _id: recipe._id.toString(),
    author: recipe.author ? {
      ...recipe.author,
      _id: recipe.author._id.toString()
    } : undefined
  })) as Omit<RecipeDocument, keyof Document>[]

  return {
    recipes: formattedRecipes,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  }
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { recipes, pagination } = await getRecipes(searchParams)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-amber-500 py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">Explore Our Recipes</h1>
              <p className="text-amber-900 text-lg max-w-2xl">
                Discover delicious recipes for every occasion, skill level, and dietary preference.
              </p>
            </div>
            <Link href="/recipes/create">
              <Button className="bg-white text-amber-600 hover:bg-amber-50">
                <PlusCircle className="w-5 h-5 mr-2" />
                Create Recipe
              </Button>
            </Link>
          </div>
          <div className="max-w-md">
            <RecipeSearch />
          </div>
        </div>
      </section>

      {/* All Recipes */}
      <section className="bg-amber-200 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-amber-900 mb-8">
            {searchParams.search 
              ? `Search Results for "${searchParams.search}"`
              : "Latest Recipes"
            }
          </h2>
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <Card key={recipe._id} className="overflow-hidden border-amber-300">
                  <div className="relative">
                    <Image
                      src={recipe.images[0] || "/placeholder.svg"}
                      alt={recipe.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-sm">
                      {recipe.category[0]}
                    </span>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="text-xl font-bold text-amber-900 mb-2">{recipe.title}</h3>
                    <p className="text-amber-800 mb-4">{recipe.description}</p>
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
                            i < Math.floor(recipe.rating?.average || 0)
                              ? "fill-amber-500 text-amber-500"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-amber-800">{recipe.rating?.average?.toFixed(1) || "No ratings"}</span>
                    </div>
                    {recipe.author && (
                      <p className="text-sm text-amber-700 mt-2">By {recipe.author.name}</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link href={`/recipes/${recipe.slug}`} className="w-full">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">View Recipe</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-amber-900 text-lg mb-4">
                {searchParams.search 
                  ? `No recipes found for "${searchParams.search}"`
                  : "No recipes found"
                }
              </p>
              <Link href="/recipes/create">
                <Button className="bg-amber-600 text-white hover:bg-amber-700">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Create Your First Recipe
                </Button>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {recipes.length > 0 && pagination.pages > 1 && (
            <div className="mt-12 flex justify-center">
              <RecipePagination 
                currentPage={pagination.page} 
                totalPages={pagination.pages} 
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 