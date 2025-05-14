import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Recipe from "@/models/Recipe"

// Get a recipe by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('Fetching recipe by slug:', params.slug)
    await connectToDatabase()
    console.log('Connected to database')

    // Validate slug
    if (!params.slug) {
      console.log('No slug provided')
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 }
      )
    }

    // Log the query we're about to make
    console.log('Querying database with:', { slug: params.slug })

    const recipe = await Recipe.findOne({ slug: params.slug })
      .populate('author', 'name email')

    console.log('Recipe query result:', {
      found: !!recipe,
      title: recipe?.title,
      authorPresent: !!recipe?.author
    })

    if (!recipe) {
      console.log('Recipe not found in database')
      return NextResponse.json(
        { success: false, message: "Recipe not found" },
        { status: 404 }
      )
    }

    // Validate required fields
    if (!recipe.title || !recipe.description || !recipe.ingredients || !recipe.instructions) {
      console.error('Recipe missing required fields:', {
        hasTitle: !!recipe.title,
        hasDescription: !!recipe.description,
        hasIngredients: !!recipe.ingredients,
        hasInstructions: !!recipe.instructions
      })
      return NextResponse.json(
        { success: false, message: "Recipe data is incomplete" },
        { status: 500 }
      )
    }

    // Convert the recipe to a plain object and handle ObjectId conversion
    const recipeObj = {
      ...recipe.toObject(),
      _id: recipe._id.toString(),
      author: recipe.author ? {
        ...recipe.author.toObject(),
        _id: recipe.author._id.toString()
      } : null
    }

    console.log('Successfully found recipe:', recipe.title)

    return NextResponse.json({
      success: true,
      recipe: recipeObj
    })
  } catch (error) {
    console.error("Error fetching recipe:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch recipe", 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    )
  }
}
