import jwt from "jsonwebtoken"
import { type NextRequest } from "next/server"
import { cookies } from "next/headers"
import type { IUser } from "@/models/User"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Create JWT token
export const createToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Set JWT token in cookies
export const setTokenCookie = async (token: string) => {
  const cookieStore = await cookies()
  cookieStore.set("token", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

// Get JWT token from cookies
export const getTokenCookie = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("token")?.value
}

// Remove JWT token from cookies
export const removeTokenCookie = async () => {
  const cookieStore = await cookies()
  cookieStore.delete("token")
}

// Auth middleware
export const authMiddleware = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value

    if (!token) {
      console.log("No token found in cookies")
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      console.log("Invalid or expired token")
      return null
    }

    return decoded
  } catch (error) {
    console.error("Auth middleware error:", error)
    return null
  }
}
