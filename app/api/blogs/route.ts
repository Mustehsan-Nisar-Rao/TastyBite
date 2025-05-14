import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Blog from "@/models/Blog"
import { authMiddleware } from "@/lib/auth"
import { MongoError } from "mongodb"
import mongoose from "mongoose"

// Get all blogs with pagination and filtering
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"

    const skip = (page - 1) * limit

    // Build query
    const query: any = { status: "published" }

    if (category) {
      query.category = category
    }

    if (tag) {
      query.tags = tag
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ]
    }

    if (featured === "true") {
      query.featured = true
    }

    // Count total documents
    const total = await Blog.countDocuments(query)

    // Get blogs
    const blogs = await Blog.find(query)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name avatar")
      .select("-content") // Exclude content for list view

    return NextResponse.json({
      success: true,
      blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get blogs error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to get blogs" },
      { status: 500 }
    )
  }
}

// Create a new blog
export async function POST(req: NextRequest) {
  try {
    console.log("Starting blog creation process...")
    
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
    console.log("Received blog data:", {
      ...data,
      content: data.content?.length > 100 ? data.content.substring(0, 100) + "..." : data.content
    })

    // Validate required fields
    const requiredFields = ["title", "slug", "content", "summary", "coverImage", "category", "tags"]
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

    // Validate field lengths
    if (data.title.length > 100) {
      return NextResponse.json(
        { success: false, message: "Title cannot be more than 100 characters" },
        { status: 400 }
      )
    }

    if (data.summary.length > 500) {
      return NextResponse.json(
        { success: false, message: "Summary cannot be more than 500 characters" },
        { status: 400 }
      )
    }

    // Create blog with all required fields
    const blogData = {
      ...data,
      author: decoded.id,
      status: data.status || "published",
      featured: data.featured || false,
      views: 0,
      readTime: Math.ceil((data.content?.split(/\s+/).length || 0) / 200) || 1
    }
    console.log("Prepared blog data:", {
      ...blogData,
      content: blogData.content.length > 100 ? blogData.content.substring(0, 100) + "..." : blogData.content
    })

    // Create the blog post
    const blog = await Blog.create(blogData)
    console.log("Blog created successfully:", {
      id: blog._id,
      title: blog.title,
      author: blog.author
    })

    // Populate author details
    await blog.populate("author", "name avatar")
    console.log("Author details populated")

    // Convert MongoDB document to plain object and handle ObjectId conversion
    const blogObject = blog.toObject()
    blogObject._id = blogObject._id.toString()
    blogObject.author._id = blogObject.author._id.toString()

    return NextResponse.json({
      success: true,
      message: "Blog created successfully",
      blog: blogObject
    })
  } catch (error: unknown) {
    console.error("Blog creation error:", error)
    
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
          message: "A blog with this slug already exists" 
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to create blog",
        error: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
} 