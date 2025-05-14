import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import { authMiddleware } from "@/lib/auth"

// Get a user by ID (admin only)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

    const id = params.id

    // Get user
    const user = await User.findById(id).select("-password -resetPasswordToken -resetPasswordExpires")

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ success: false, message: "Failed to get user" }, { status: 500 })
  }
}

// Update a user (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const id = params.id
    const { name, email, role } = await req.json()

    // Get user
    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Update user
    if (name) user.name = name
    if (email) user.email = email
    if (role) user.role = role

    await user.save()

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 })
  }
}

// Delete a user (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    const id = params.id

    // Prevent deleting self
    if (id === decoded.id) {
      return NextResponse.json({ success: false, message: "Cannot delete your own account" }, { status: 400 })
    }

    // Delete user
    const result = await User.findByIdAndDelete(id)

    if (!result) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 })
  }
}
