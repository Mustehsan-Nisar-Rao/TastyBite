import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import OTP from "@/models/OTP"
import { sendOTPEmail } from "@/lib/emailService"

// For testing purposes only - remove in production
export async function GET(req: NextRequest) {
  const email = "test@example.com" // Test email
  return handleTest(email)
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    return handleTest(email)
  } catch (error) {
    console.error("Test error:", error)
    return NextResponse.json({ success: false, message: "Test failed", error: String(error) }, { status: 500 })
  }
}

async function handleTest(email: string) {
  try {
    await connectToDatabase()
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()
    
    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail })
    console.log('🗑️ Deleted existing OTPs')
    
    // Generate a 6-digit OTP
    const otp = '123456' // Fixed OTP for testing
    
    console.log('🔑 Generated test OTP:', { 
      email: normalizedEmail, 
      otp,
      timestamp: new Date().toISOString()
    })

    // Create new OTP record
    const otpRecord = new OTP({
      email: normalizedEmail,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    })

    await otpRecord.save()
    console.log('💾 Saved OTP record:', {
      id: otpRecord._id.toString(),
      email: otpRecord.email,
      otp: otpRecord.otp,
      expiresAt: otpRecord.expiresAt,
      createdAt: otpRecord.createdAt
    })

    // Send OTP email
    try {
      await sendOTPEmail(normalizedEmail, otp)
      console.log('📧 OTP email sent successfully')
    } catch (error) {
      console.error('❌ Failed to send OTP email:', error)
    }

    return NextResponse.json({
      success: true,
      message: "Test OTP generated",
      debug: {
        email: normalizedEmail,
        otp: otp // Only expose OTP in test environment
      }
    })
  } catch (error) {
    console.error("❌ Test error:", error)
    return NextResponse.json({ success: false, message: "Test failed", error: String(error) }, { status: 500 })
  }
} 