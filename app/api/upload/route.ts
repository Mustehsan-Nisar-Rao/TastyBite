import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { authMiddleware } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const decoded = await authMiddleware(req)
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    const data = await req.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only JPEG, PNG and WebP are allowed." },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
    const path = join(process.cwd(), "public", "uploads", filename)

    // Save file
    await writeFile(path, buffer)

    // Return the URL
    const url = `/uploads/${filename}`

    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to upload file" },
      { status: 500 }
    )
  }
} 