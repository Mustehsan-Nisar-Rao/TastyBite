import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import Recipe from "@/models/Recipe"
import BlogPost from "@/models/BlogPost"
import Comment from "@/models/Comment"
import { authMiddleware } from "@/lib/auth"

// Get admin dashboard statistics
export async function GET(req: NextRequest) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    // Check if user is admin
    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 })
    }

    await connectToDatabase()

    // Get counts
    const totalUsers = await User.countDocuments()
    const totalRecipes = await Recipe.countDocuments()
    const totalBlogPosts = await BlogPost.countDocuments()
    const totalComments = await Comment.countDocuments()

    // Get recent users
    const recentUsers = await User.find().select("name email createdAt").sort({ createdAt: -1 }).limit(5)

    // Get popular recipes
    const popularRecipes = await Recipe.find().select("title slug views favorites rating").sort({ views: -1 }).limit(5)

    // Get recent comments
    const recentComments = await Comment.find()
      .populate("user", "name avatar")
      .populate("recipe", "title slug")
      .populate("blogPost", "title slug")
      .sort({ createdAt: -1 })
      .limit(5)

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalRecipes,
        totalBlogPosts,
        totalComments,
        recentUsers,
        popularRecipes,
        recentComments,
      },
    })
  } catch (error) {
    console.error("Get admin stats error:", error)
    return NextResponse.json({ success: false, message: "Failed to get admin stats" }, { status: 500 })
  }
}
