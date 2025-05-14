import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const { email } = await req.json()

    // Check if user exists
    const user = await User.findOne({ email })

    if (!user) {
      // Don't reveal that the user doesn't exist
      return NextResponse.json({
        success: true,
        message: "If your email is registered, you will receive a password reset link",
      })
    }

    // Get origin for reset URL
    const origin = req.headers.get("origin") || "http://localhost:3000"

    // Send password reset email
    await sendPasswordResetEmail(email, origin)

    return NextResponse.json({
      success: true,
      message: "If your email is registered, you will receive a password reset link",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ success: false, message: "Failed to process request" }, { status: 500 })
  }
}
