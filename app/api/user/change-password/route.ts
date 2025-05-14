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

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current password and new password are required" },
        { status: 400 },
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters" },
        { status: 400 },
      )
    }

    // Find user with password
    const user = await User.findById(decoded.id).select("+password")

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword)

    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 401 })
    }

    // Update password
    user.password = newPassword
    await user.save()

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ success: false, message: "Failed to change password" }, { status: 500 })
  }
}
