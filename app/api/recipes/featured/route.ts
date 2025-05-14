import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Recipe from "@/models/Recipe"

export async function GET() {
  try {
    await connectToDatabase()

    // Get top rated recipes
    const recipes = await Recipe.find()
      .populate("author", "name")
      .sort({ "rating.average": -1 }) // Sort by rating in descending order
      .limit(4) // Get top 4 recipes
      .select("title description images prepTime cookTime difficulty rating author category slug")
      .lean()

    const formattedRecipes = recipes.map(recipe => ({
      _id: recipe._id.toString(),
      title: recipe.title || "",
      images: Array.isArray(recipe.images) ? recipe.images : [],
      category: Array.isArray(recipe.category) ? recipe.category : ["Uncategorized"],
      prepTime: typeof recipe.prepTime === 'number' ? recipe.prepTime : 0,
      cookTime: typeof recipe.cookTime === 'number' ? recipe.cookTime : 0,
      slug: recipe.slug || "",
      difficulty: recipe.difficulty || "Medium"
    }))

    return NextResponse.json({
      success: true,
      recipes: formattedRecipes
    })
  } catch (error) {
    console.error("Error fetching top rated recipes:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch recipes" },
      { status: 500 }
    )
  }
} 