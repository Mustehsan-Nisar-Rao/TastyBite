import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Recipe from "@/models/Recipe"
import { authMiddleware } from "@/lib/auth"
import slugify from "slugify"
import mongoose from "mongoose"
import { MongoError } from "mongodb"

// Get all recipes with pagination and filtering
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const query: any = {}

    // Apply filters from query parameters
    if (searchParams.has("cuisine")) {
      query.cuisine = searchParams.get("cuisine")
    }
    if (searchParams.has("category")) {
      query.category = { $in: [searchParams.get("category")] }
    }
    if (searchParams.has("mealType")) {
      query.mealType = searchParams.get("mealType")
    }
    if (searchParams.has("difficulty")) {
      query.difficulty = searchParams.get("difficulty")
    }
    if (searchParams.has("featured")) {
      query.featured = searchParams.get("featured") === "true"
    }

    // Pagination
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Get recipes with pagination
    const recipes = await Recipe.find(query)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Recipe.countDocuments(query)

    // Convert ObjectIds to strings
    const formattedRecipes = recipes.map(recipe => ({
      ...recipe,
      _id: recipe._id.toString(),
      author: recipe.author ? {
        ...recipe.author,
        _id: recipe.author._id.toString()
      } : null
    }))

    return NextResponse.json({
      success: true,
      recipes: formattedRecipes,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch recipes" },
      { status: 500 }
    )
  }
}

// Create a new recipe
export async function POST(req: NextRequest) {
  try {
    console.log("Starting recipe creation process...")
    
    // Check authentication
    const decoded = await authMiddleware(req)
    console.log("Auth check completed:", decoded ? "authenticated" : "not authenticated")

    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    // Connect to database
    await connectToDatabase()
    console.log("Database connection established")

    // Parse request body
    const data = await req.json()
    console.log("Received recipe data:", {
      ...data,
      description: data.description?.length > 100 ? data.description.substring(0, 100) + "..." : data.description
    })

    // Validate required fields
    const requiredFields = [
      "title",
      "slug",
      "description",
      "ingredients",
      "instructions",
      "prepTime",
      "cookTime",
      "servings",
      "difficulty",
      "cuisine",
      "category",
      "mealType",
      "images"
    ]
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields)
      return NextResponse.json(
        { 
          success: false, 
          message: "Missing required fields", 
          fields: missingFields 
        },
        { status: 400 }
      )
    }

    // Validate field lengths and values
    if (data.title.length > 100) {
      return NextResponse.json(
        { success: false, message: "Title cannot be more than 100 characters" },
        { status: 400 }
      )
    }

    if (data.description.length > 1000) {
      return NextResponse.json(
        { success: false, message: "Description cannot be more than 1000 characters" },
        { status: 400 }
      )
    }

    if (!Array.isArray(data.ingredients) || data.ingredients.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one ingredient is required" },
        { status: 400 }
      )
    }

    if (!Array.isArray(data.instructions) || data.instructions.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one instruction step is required" },
        { status: 400 }
      )
    }

    if (!Array.isArray(data.images) || data.images.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one image is required" },
        { status: 400 }
      )
    }

    // Create recipe with all required fields
    const recipeData = {
      ...data,
      author: decoded.id,
      rating: {
        average: 0,
        count: 0
      }
    }
    console.log("Prepared recipe data:", {
      ...recipeData,
      description: recipeData.description.length > 100 ? recipeData.description.substring(0, 100) + "..." : recipeData.description
    })

    // Create the recipe
    const recipe = await Recipe.create(recipeData)
    console.log("Recipe created successfully:", {
      id: recipe._id,
      title: recipe.title,
      author: recipe.author
    })

    // Populate author details
    await recipe.populate("author", "name avatar")
    console.log("Author details populated")

    // Convert MongoDB document to plain object and handle ObjectId conversion
    const recipeObject = recipe.toObject()
    recipeObject._id = recipeObject._id.toString()
    recipeObject.author._id = recipeObject.author._id.toString()

    return NextResponse.json({
      success: true,
      message: "Recipe created successfully",
      recipe: recipeObject
    })
  } catch (error) {
    console.error("Recipe creation error:", error)
    
    // Handle MongoDB validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message
      }))
      
      return NextResponse.json(
        { 
          success: false, 
          message: "Validation error", 
          errors: validationErrors 
        },
        { status: 400 }
      )
    }
    
    // Handle duplicate key errors
    if (error instanceof MongoError && error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          message: "A recipe with this slug already exists" 
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to create recipe",
        error: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}
