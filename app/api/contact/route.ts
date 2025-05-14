import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { authMiddleware } from "@/lib/auth"

// Create a transporter using Gmail SMTP with the same configuration as OTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: 'mustehsannisarrao@gmail.com',
    pass: 'psze puph jhkr ypla'
  },
  tls: {
    rejectUnauthorized: true
  }
})

// Verify the connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to take our messages");
  }
});

export async function POST(req: NextRequest) {
  try {
    // Get user info if logged in
    const user = await authMiddleware(req)
    
    // Get form data
    const data = await req.json()
    const { name, email, subject, message } = data

    // Use logged in user's email if available
    const senderEmail = user?.email || email

    if (!senderEmail || !name || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Email content with simpler from field
    const mailOptions = {
      from: '"TastyBites Contact Form" <mustehsannisarrao@gmail.com>',
      to: "mustehsannisarrao@gmail.com",
      subject: `TastyBites Contact Form: ${subject}`,
      text: `
Name: ${name}
Email: ${senderEmail}
Subject: ${subject}
Message: ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${senderEmail})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("Message sent: %s", info.messageId);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId
    })
  } catch (err) {
    const error = err as Error
    console.error("Error sending email:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to send email",
        error: error.message 
      },
      { status: 500 }
    )
  }
} 