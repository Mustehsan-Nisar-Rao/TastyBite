import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { sendOTPEmail } from '@/lib/emailService';
import OTP from '@/models/OTP';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ 
        message: 'Email is required' 
      }, { status: 400 });
    }

    await connectToDatabase();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to database
    await OTP.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { 
        email: email.toLowerCase().trim(), 
        otp,
        expiresAt,
        verified: false
      },
      { upsert: true, new: true }
    );

    // Send OTP email
    await sendOTPEmail(email, otp);

    return NextResponse.json({ 
      message: 'OTP sent successfully' 
    });

  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ 
      message: 'Failed to send OTP',
      error: error.message 
    }, { status: 500 });
  }
} 