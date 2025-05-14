import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    // Get the email from query parameter
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ 
        success: false, 
        message: "Email parameter is required" 
      }, { status: 400 })
    }

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).select('-password') // Exclude password field

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "User not found" 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })

  } catch (error) {
    console.error("Test user error:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Failed to get user data",
      error: String(error) 
    }, { status: 500 })
  }
} 