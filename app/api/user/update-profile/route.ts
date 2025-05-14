import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import { authMiddleware } from "@/lib/auth"

export async function PUT(req: NextRequest) {
  try {
    const decoded = await authMiddleware(req)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const { name } = await req.json()

    if (!name || name.trim() === "") {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 })
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(decoded.id, { name }, { new: true, runValidators: true })

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 })
  }
}
