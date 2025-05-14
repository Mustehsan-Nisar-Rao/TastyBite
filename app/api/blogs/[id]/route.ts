import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Blog from "@/models/Blog"
import { authMiddleware } from "@/lib/auth"
import mongoose from "mongoose"

// Get a blog by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const id = params.id

    // Check if ID is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID" },
        { status: 400 }
      )
    }

    // Get blog
    const blog = await Blog.findById(id).populate("author", "name avatar")

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      )
    }

    // Increment views
    blog.views += 1
    await blog.save()

    return NextResponse.json({
      success: true,
      blog,
    })
  } catch (error) {
    console.error("Get blog error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to get blog" },
      { status: 500 }
    )
  }
}

// Update a blog
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const id = params.id
    const data = await req.json()

    // Check if ID is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID" },
        { status: 400 }
      )
    }

    // Get blog
    const blog = await Blog.findById(id)

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      )
    }

    // Check if user is author
    if (blog.author.toString() !== decoded.id) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      )
    }

    // Calculate read time if content changed
    if (data.content) {
      const wordCount = data.content.split(/\s+/).length
      data.readTime = Math.ceil(wordCount / 200)
    }

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    ).populate("author", "name avatar")

    return NextResponse.json({
      success: true,
      blog: updatedBlog,
    })
  } catch (error) {
    console.error("Update blog error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update blog" },
      { status: 500 }
    )
  }
}

// Delete a blog
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const id = params.id

    // Check if ID is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID" },
        { status: 400 }
      )
    }

    // Get blog
    const blog = await Blog.findById(id)

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      )
    }

    // Check if user is author
    if (blog.author.toString() !== decoded.id) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      )
    }

    // Delete blog
    await blog.deleteOne()

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    })
  } catch (error) {
    console.error("Delete blog error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete blog" },
      { status: 500 }
    )
  }
} 