import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import { createToken, setTokenCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const { email, password } = await req.json()

    // Find user by email
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = createToken(user)

    // Set token in cookie
    await setTokenCookie(token)

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Login failed" }, { status: 500 })
  }
}
