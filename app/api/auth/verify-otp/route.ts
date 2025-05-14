import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import OTP from "@/models/OTP"
import mongoose from "mongoose"

interface IOTPDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  otp: string;
  verified: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const { email, otp } = await req.json()
    
    // Convert email to lowercase for consistency
    const normalizedEmail = email.toLowerCase().trim()
    const normalizedOTP = otp.trim()
    
    console.log('🔍 Starting OTP verification:', { 
      originalEmail: email,
      normalizedEmail,
      originalOTP: otp,
      normalizedOTP,
      currentTime: new Date().toISOString()
    })

    // Find ALL OTP records for this email (for debugging)
    const allOTPs = await OTP.find({ email: normalizedEmail })
    console.log('📝 All OTP records for this email:', allOTPs.map(otp => ({
      id: otp._id.toString(),
      otp: otp.otp,
      verified: otp.verified,
      expiresAt: otp.expiresAt,
      createdAt: otp.createdAt
    })))

    // Simple verification - just find the matching OTP
    const matchingOTP = await OTP.findOne({ 
      email: normalizedEmail,
      otp: normalizedOTP
    })

    if (!matchingOTP) {
      console.log('❌ No matching OTP found')
      return NextResponse.json({ 
        verified: false, 
        message: "Invalid OTP - no matching record found",
        debug: { email: normalizedEmail, otp: normalizedOTP }
      }, { status: 400 })
    }

    console.log('✅ Found matching OTP:', {
      id: matchingOTP._id.toString(),
      email: matchingOTP.email,
      otp: matchingOTP.otp,
      verified: matchingOTP.verified,
      expiresAt: matchingOTP.expiresAt,
      createdAt: matchingOTP.createdAt
    })

    // Check if already verified
    if (matchingOTP.verified) {
      console.log('⚠️ OTP already verified')
      return NextResponse.json({ verified: false, message: "OTP has already been used" }, { status: 400 })
    }

    // Check expiration
    const currentTime = new Date()
    if (matchingOTP.expiresAt && matchingOTP.expiresAt <= currentTime) {
      console.log('⌛ OTP has expired:', {
        expiresAt: matchingOTP.expiresAt,
        currentTime: currentTime,
        timeDifference: `${Math.round((currentTime.getTime() - matchingOTP.expiresAt.getTime()) / 1000)} seconds`
      })
      return NextResponse.json({ verified: false, message: "OTP has expired" }, { status: 400 })
    }

    // Mark as verified
    matchingOTP.verified = true
    await matchingOTP.save()

    console.log('🎉 OTP verified successfully')
    return NextResponse.json({ verified: true, message: "OTP verified successfully" })

  } catch (error) {
    console.error("❌ OTP verification error:", error)
    return NextResponse.json({ verified: false, message: "Verification failed", error: String(error) }, { status: 500 })
  }
} 