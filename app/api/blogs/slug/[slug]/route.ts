import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Blog from "@/models/Blog"

// Get a blog by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('Fetching blog by slug:', params.slug)
    await connectToDatabase()
    console.log('Connected to database')

    const blog = await Blog.findOne({ 
      slug: params.slug,
      status: "published" 
    }).populate("author", "name avatar")

    console.log('Blog query result:', {
      found: !!blog,
      title: blog?.title,
      authorPresent: !!blog?.author
    })

    if (!blog) {
      console.log('Blog not found in database')
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      )
    }

    // Increment views
    blog.views += 1
    await blog.save()

    // Convert the blog to a plain object and handle ObjectId conversion
    const blogObj = {
      ...blog.toObject(),
      _id: blog._id.toString(),
      author: blog.author ? {
        ...blog.author.toObject(),
        _id: blog.author._id.toString()
      } : null
    }

    console.log('Successfully found blog:', blog.title)

    return NextResponse.json({
      success: true,
      blog: blogObj
    })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch blog", 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    )
  }
} 