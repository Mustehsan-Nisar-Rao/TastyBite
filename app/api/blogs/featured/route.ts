import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Blog from "@/models/Blog"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "6")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // Get featured blogs
    const blogs = await Blog.find({ 
      featured: true,
      status: "published"
    })
      .populate("author", "name avatar")
      .sort({ views: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title summary coverImage author views readTime createdAt")

    // Get total count for pagination
    const total = await Blog.countDocuments({ 
      featured: true,
      status: "published"
    })

    return NextResponse.json({
      success: true,
      blogs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: skip + blogs.length < total,
      },
    })
  } catch (error) {
    console.error("Error fetching featured blogs:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch featured blogs" },
      { status: 500 }
    )
  }
} 