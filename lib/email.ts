import nodemailer from "nodemailer"
import crypto from "crypto"
import User from "@/models/User"

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: process.env.NODE_ENV === "production",
  })
}

// Send password reset email
export const sendPasswordResetEmail = async (email: string, origin: string) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error("User not found")
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex")

  // Hash token and save to database
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  await user.save()

  // Create reset URL
  const resetUrl = `${origin}/auth/reset-password?token=${resetToken}`

  // Email content
  const message = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset. Please click the link below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">Reset Password</a>
    <p>This link will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `

  try {
    const transporter = createTransporter()

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    })

    return true
  } catch (error) {
    console.error("Error sending email:", error)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()
    throw new Error("Error sending email")
  }
}

// Send welcome email
export const sendWelcomeEmail = async (name: string, email: string) => {
  const message = `
    <h1>Welcome to TastyBites!</h1>
    <p>Hello ${name},</p>
    <p>Thank you for joining TastyBites. We're excited to have you as part of our culinary community!</p>
    <p>Start exploring recipes, saving your favorites, and sharing your cooking experiences with others.</p>
    <p>Happy cooking!</p>
    <p>The TastyBites Team</p>
  `

  try {
    const transporter = createTransporter()

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Welcome to TastyBites!",
      html: message,
    })

    return true
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return false
  }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification - TastyBites',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e67e22;">TastyBites Email Verification</h2>
        <p>Thank you for registering with TastyBites! Please use the following OTP to verify your email address:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <h1 style="color: #e67e22; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};
