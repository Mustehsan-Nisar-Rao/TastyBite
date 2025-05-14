import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Favorite from "@/models/Favorite"
import Recipe from "@/models/Recipe"
import { authMiddleware } from "@/lib/auth"

// Get user's favorites
export async function GET(req: NextRequest) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    // Count total documents
    const total = await Favorite.countDocuments({ user: decoded.id })

    // Get favorites
    const favorites = await Favorite.find({ user: decoded.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "recipe",
        select: "title slug image category time servings rating",
        populate: {
          path: "author",
          select: "name avatar",
        },
      })

    return NextResponse.json({
      success: true,
      favorites,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get favorites error:", error)
    return NextResponse.json({ success: false, message: "Failed to get favorites" }, { status: 500 })
  }
}

// Add a recipe to favorites
export async function POST(req: NextRequest) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const { recipeId } = await req.json()

    if (!recipeId) {
      return NextResponse.json({ success: false, message: "Recipe ID is required" }, { status: 400 })
    }

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 })
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ user: decoded.id, recipe: recipeId })
    if (existingFavorite) {
      return NextResponse.json({ success: false, message: "Recipe already in favorites" }, { status: 400 })
    }

    // Add to favorites
    await Favorite.create({
      user: decoded.id,
      recipe: recipeId,
    })

    // Increment favorites count
    recipe.favorites += 1
    await recipe.save()

    return NextResponse.json({
      success: true,
      message: "Recipe added to favorites",
    })
  } catch (error) {
    console.error("Add to favorites error:", error)
    return NextResponse.json({ success: false, message: "Failed to add to favorites" }, { status: 500 })
  }
}
