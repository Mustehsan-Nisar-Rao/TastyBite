import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Comment from "@/models/Comment"

// Get comments for a blog post
export async function GET(req: NextRequest, { params }: { params: { blogPostId: string } }) {
  try {
    await connectToDatabase()

    const blogPostId = params.blogPostId
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    // Count total documents
    const total = await Comment.countDocuments({ blogPost: blogPostId, parent: { $exists: false } })

    // Get top-level comments
    const comments = await Comment.find({ blogPost: blogPostId, parent: { $exists: false } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name avatar")

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parent: comment._id })
          .sort({ createdAt: 1 })
          .populate("user", "name avatar")

        return {
          ...comment.toObject(),
          replies,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      comments: commentsWithReplies,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json({ success: false, message: "Failed to get comments" }, { status: 500 })
  }
}
