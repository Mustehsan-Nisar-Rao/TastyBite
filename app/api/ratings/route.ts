import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Rating from "@/models/Rating"
import Recipe from "@/models/Recipe"
import { authMiddleware } from "@/lib/auth"

// Rate a recipe
export async function POST(req: NextRequest) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const { recipeId, value } = await req.json()

    if (!recipeId) {
      return NextResponse.json({ success: false, message: "Recipe ID is required" }, { status: 400 })
    }

    if (!value || value < 1 || value > 5) {
      return NextResponse.json({ success: false, message: "Rating value must be between 1 and 5" }, { status: 400 })
    }

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 })
    }

    // Check if user already rated this recipe
    const existingRating = await Rating.findOne({ user: decoded.id, recipe: recipeId })

    if (existingRating) {
      // Update existing rating
      existingRating.value = value
      await existingRating.save()
    } else {
      // Create new rating
      await Rating.create({
        value,
        user: decoded.id,
        recipe: recipeId,
      })
    }

    // Update recipe rating
    const ratings = await Rating.find({ recipe: recipeId })
    const totalRating = ratings.reduce((sum, rating) => sum + rating.value, 0)
    const averageRating = totalRating / ratings.length

    recipe.rating = Number.parseFloat(averageRating.toFixed(1))
    await recipe.save()

    return NextResponse.json({
      success: true,
      message: "Recipe rated successfully",
      rating: recipe.rating,
    })
  } catch (error) {
    console.error("Rate recipe error:", error)
    return NextResponse.json({ success: false, message: "Failed to rate recipe" }, { status: 500 })
  }
}

// Get user's rating for a recipe
export async function GET(req: NextRequest) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const recipeId = searchParams.get("recipeId")

    if (!recipeId) {
      return NextResponse.json({ success: false, message: "Recipe ID is required" }, { status: 400 })
    }

    // Get user's rating
    const rating = await Rating.findOne({ user: decoded.id, recipe: recipeId })

    return NextResponse.json({
      success: true,
      rating: rating ? rating.value : 0,
    })
  } catch (error) {
    console.error("Get rating error:", error)
    return NextResponse.json({ success: false, message: "Failed to get rating" }, { status: 500 })
  }
}
