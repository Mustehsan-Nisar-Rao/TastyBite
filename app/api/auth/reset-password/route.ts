import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const { token, password } = await req.json()

    // Hash token
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

    // Find user with token and check if token is expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 })
    }

    // Update password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ success: false, message: "Failed to reset password" }, { status: 500 })
  }
}
