import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Recipe from "@/models/Recipe"
import { authMiddleware } from "@/lib/auth"

// Get user's recipes
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
    const total = await Recipe.countDocuments({ author: decoded.id })

    // Get recipes
    const recipes = await Recipe.find({ author: decoded.id }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    return NextResponse.json({
      success: true,
      recipes,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get user recipes error:", error)
    return NextResponse.json({ success: false, message: "Failed to get recipes" }, { status: 500 })
  }
}
