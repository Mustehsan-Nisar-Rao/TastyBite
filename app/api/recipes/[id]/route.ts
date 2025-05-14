import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Recipe from "@/models/Recipe"
import { authMiddleware } from "@/lib/auth"
import slugify from "slugify"
import mongoose from "mongoose"

// Get a recipe by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const id = params.id

    // Check if ID is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid recipe ID" }, { status: 400 })
    }

    // Get recipe
    const recipe = await Recipe.findById(id).populate("author", "name avatar")

    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 })
    }

    // Increment views
    recipe.views += 1
    await recipe.save()

    return NextResponse.json({
      success: true,
      recipe,
    })
  } catch (error) {
    console.error("Get recipe error:", error)
    return NextResponse.json({ success: false, message: "Failed to get recipe" }, { status: 500 })
  }
}

// Update a recipe
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const id = params.id
    const recipeData = await req.json()

    // Check if ID is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid recipe ID" }, { status: 400 })
    }

    // Get recipe
    const recipe = await Recipe.findById(id)

    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 })
    }

    // Check if user is the author or an admin
    if (recipe.author.toString() !== decoded.id && decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Not authorized to update this recipe" }, { status: 403 })
    }

    // If title is changed, update slug
    if (recipeData.title && recipeData.title !== recipe.title) {
      recipeData.slug = slugify(recipeData.title, { lower: true, strict: true })

      // Check if new slug already exists
      const existingRecipe = await Recipe.findOne({ slug: recipeData.slug, _id: { $ne: id } })
      if (existingRecipe) {
        return NextResponse.json({ success: false, message: "Recipe with this title already exists" }, { status: 400 })
      }
    }

    // Update recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, recipeData, { new: true, runValidators: true })

    return NextResponse.json({
      success: true,
      message: "Recipe updated successfully",
      recipe: updatedRecipe,
    })
  } catch (error) {
    console.error("Update recipe error:", error)
    return NextResponse.json({ success: false, message: "Failed to update recipe" }, { status: 500 })
  }
}

// Delete a recipe
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const id = params.id

    // Check if ID is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid recipe ID" }, { status: 400 })
    }

    // Get recipe
    const recipe = await Recipe.findById(id)

    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 })
    }

    // Check if user is the author or an admin
    if (recipe.author.toString() !== decoded.id && decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Not authorized to delete this recipe" }, { status: 403 })
    }

    // Delete recipe
    await Recipe.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: "Recipe deleted successfully",
    })
  } catch (error) {
    console.error("Delete recipe error:", error)
    return NextResponse.json({ success: false, message: "Failed to delete recipe" }, { status: 500 })
  }
}
