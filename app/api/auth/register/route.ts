import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import OTP from "@/models/OTP"
import { createToken, setTokenCookie } from "@/lib/auth"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const { name, email, password } = await req.json()
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    console.log('Registration attempt:', {
      name,
      email: normalizedEmail
    })

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 })
    }

    // Check for verified OTP
    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      verified: true,
      expiresAt: { $gt: new Date() }
    })

    console.log('Found OTP record:', otpRecord ? {
      id: otpRecord._id,
      email: otpRecord.email,
      verified: otpRecord.verified,
      expiresAt: otpRecord.expiresAt
    } : 'No verified OTP found')

    if (!otpRecord) {
      return NextResponse.json({ success: false, message: "Please verify your email with OTP first" }, { status: 400 })
    }

    // Create new user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      emailVerified: true // Since OTP is verified
    })

    console.log('Created new user:', {
      id: user._id,
      name: user.name,
      email: user.email
    })

    // Delete all OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail })

    // Generate JWT token
    const token = createToken(user)

    // Set token in cookie
    await setTokenCookie(token)

    // Send welcome email
    try {
      await sendWelcomeEmail(name, normalizedEmail)
      console.log('Welcome email sent successfully')
    } catch (error) {
      console.error('Failed to send welcome email:', error)
      // Continue even if welcome email fails
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Registration failed", error: String(error) }, { status: 500 })
  }
}
