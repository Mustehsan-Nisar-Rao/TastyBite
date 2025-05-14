import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Recipe from "@/models/Recipe"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    
    // Filtering parameters
    const category = searchParams.get("category")
    const mealType = searchParams.get("mealType")
    const cuisine = searchParams.get("cuisine")
    const difficulty = searchParams.get("difficulty")
    const featured = searchParams.get("featured") === "true"
    const search = searchParams.get("search")
    
    // Pagination parameters
    const limit = parseInt(searchParams.get("limit") || "9")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Sorting parameters
    const sortBy = searchParams.get("sortBy") || "rating" // rating, date, prepTime
    const order = searchParams.get("order") || "desc" // asc, desc

    // Build query based on parameters
    const query: any = {}
    
    // Basic filters
    if (category) query.category = category
    if (mealType) query.mealType = mealType
    if (cuisine) query.cuisine = cuisine
    if (difficulty) query.difficulty = difficulty
    if (featured) query.featured = true

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { cuisine: { $regex: search, $options: "i" } },
      ]
    }

    // Time range filter
    const maxTime = searchParams.get("maxTime")
    if (maxTime) {
      query.$expr = {
        $lte: [{ $add: ["$prepTime", "$cookTime"] }, parseInt(maxTime)],
      }
    }

    // Build sort object
    const sortObject: any = {}
    switch (sortBy) {
      case "date":
        sortObject.createdAt = order === "asc" ? 1 : -1
        break
      case "prepTime":
        sortObject.prepTime = order === "asc" ? 1 : -1
        break
      default: // rating
        sortObject["rating.average"] = order === "asc" ? 1 : -1
        break
    }

    // Get recipes
    const recipes = await Recipe.find(query)
      .populate("author", "name")
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .select("title description images prepTime cookTime difficulty rating author mealType category featured cuisine")

    // Get total count for pagination
    const total = await Recipe.countDocuments(query)

    // Get available filters for frontend
    const aggregateFilters = await Promise.all([
      Recipe.distinct("cuisine"),
      Recipe.distinct("category"),
      Recipe.distinct("mealType"),
    ])

    return NextResponse.json({
      success: true,
      recipes,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: skip + recipes.length < total,
      },
      filters: {
        cuisines: aggregateFilters[0],
        categories: aggregateFilters[1],
        mealTypes: aggregateFilters[2],
      },
    })
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch recipes" },
      { status: 500 }
    )
  }
} 