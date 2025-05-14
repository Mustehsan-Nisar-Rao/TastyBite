import { NextResponse } from "next/server"
import { removeTokenCookie } from "@/lib/auth"

export async function POST() {
  try {
    // Remove token cookie
    await removeTokenCookie()

    return NextResponse.json({
      success: true,
      message: "Logout successful",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "Logout failed" }, { status: 500 })
  }
}
