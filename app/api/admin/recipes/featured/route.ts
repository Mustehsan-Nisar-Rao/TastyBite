import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Recipe from "@/models/Recipe"
import { authMiddleware } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const user = await authMiddleware(req)
    if (!user?.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    await connectToDatabase()

    const { recipeId, featured } = await req.json()

    if (!recipeId) {
      return NextResponse.json(
        { success: false, message: "Recipe ID is required" },
        { status: 400 }
      )
    }

    // Update recipe's featured status
    const recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { featured },
      { new: true } // Return updated document
    ).select("title featured")

    if (!recipe) {
      return NextResponse.json(
        { success: false, message: "Recipe not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Recipe ${featured ? "marked as" : "removed from"} featured`,
      recipe,
    })
  } catch (error) {
    console.error("Error updating featured status:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update featured status" },
      { status: 500 }
    )
  }
}

// Get all featured recipes for admin (includes more details)
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const user = await authMiddleware(req)
    if (!user?.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Get featured recipes with more details for admin
    const recipes = await Recipe.find({ featured: true })
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Recipe.countDocuments({ featured: true })

    return NextResponse.json({
      success: true,
      recipes,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: skip + recipes.length < total,
      },
    })
  } catch (error) {
    console.error("Error fetching featured recipes:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch featured recipes" },
      { status: 500 }
    )
  }
} 