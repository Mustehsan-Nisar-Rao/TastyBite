import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Comment from "@/models/Comment"
import { authMiddleware } from "@/lib/auth"

// Update a comment
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const id = params.id
    const { content } = await req.json()

    if (!content) {
      return NextResponse.json({ success: false, message: "Comment content is required" }, { status: 400 })
    }

    // Get comment
    const comment = await Comment.findById(id)

    if (!comment) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 })
    }

    // Check if user is the author or an admin
    if (comment.user.toString() !== decoded.id && decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Not authorized to update this comment" }, { status: 403 })
    }

    // Update comment
    comment.content = content
    await comment.save()

    // Populate user data
    await comment.populate("user", "name avatar")

    return NextResponse.json({
      success: true,
      message: "Comment updated successfully",
      comment,
    })
  } catch (error) {
    console.error("Update comment error:", error)
    return NextResponse.json({ success: false, message: "Failed to update comment" }, { status: 500 })
  }
}

// Delete a comment
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const id = params.id

    // Get comment
    const comment = await Comment.findById(id)

    if (!comment) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 })
    }

    // Check if user is the author or an admin
    if (comment.user.toString() !== decoded.id && decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Not authorized to delete this comment" }, { status: 403 })
    }

    // Delete comment and all replies
    await Comment.deleteMany({ $or: [{ _id: id }, { parent: id }] })

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    })
  } catch (error) {
    console.error("Delete comment error:", error)
    return NextResponse.json({ success: false, message: "Failed to delete comment" }, { status: 500 })
  }
}
