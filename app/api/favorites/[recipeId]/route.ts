import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Favorite from "@/models/Favorite"
import Recipe from "@/models/Recipe"
import { authMiddleware } from "@/lib/auth"

// Remove a recipe from favorites
export async function DELETE(req: NextRequest, { params }: { params: { recipeId: string } }) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const recipeId = params.recipeId

    // Check if favorite exists
    const favorite = await Favorite.findOne({ user: decoded.id, recipe: recipeId })
    if (!favorite) {
      return NextResponse.json({ success: false, message: "Recipe not in favorites" }, { status: 404 })
    }

    // Remove from favorites
    await Favorite.findByIdAndDelete(favorite._id)

    // Decrement favorites count
    const recipe = await Recipe.findById(recipeId)
    if (recipe) {
      recipe.favorites = Math.max(0, recipe.favorites - 1)
      await recipe.save()
    }

    return NextResponse.json({
      success: true,
      message: "Recipe removed from favorites",
    })
  } catch (error) {
    console.error("Remove from favorites error:", error)
    return NextResponse.json({ success: false, message: "Failed to remove from favorites" }, { status: 500 })
  }
}

// Check if a recipe is in favorites
export async function GET(req: NextRequest, { params }: { params: { recipeId: string } }) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const recipeId = params.recipeId

    // Check if favorite exists
    const favorite = await Favorite.findOne({ user: decoded.id, recipe: recipeId })

    return NextResponse.json({
      success: true,
      isFavorite: !!favorite,
    })
  } catch (error) {
    console.error("Check favorite error:", error)
    return NextResponse.json({ success: false, message: "Failed to check favorite status" }, { status: 500 })
  }
}
