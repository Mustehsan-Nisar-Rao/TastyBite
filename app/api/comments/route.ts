import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Comment from "@/models/Comment"
import { authMiddleware } from "@/lib/auth"

// Create a new comment
export async function POST(req: NextRequest) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const { content, recipeId, blogPostId, parentId } = await req.json()

    if (!content) {
      return NextResponse.json({ success: false, message: "Comment content is required" }, { status: 400 })
    }

    if (!recipeId && !blogPostId) {
      return NextResponse.json({ success: false, message: "Recipe ID or Blog Post ID is required" }, { status: 400 })
    }

    // Create comment
    const comment = await Comment.create({
      content,
      user: decoded.id,
      recipe: recipeId || undefined,
      blogPost: blogPostId || undefined,
      parent: parentId || undefined,
    })

    // Populate user data
    await comment.populate("user", "name avatar")

    return NextResponse.json({
      success: true,
      message: "Comment created successfully",
      comment,
    })
  } catch (error) {
    console.error("Create comment error:", error)
    return NextResponse.json({ success: false, message: "Failed to create comment" }, { status: 500 })
  }
}
