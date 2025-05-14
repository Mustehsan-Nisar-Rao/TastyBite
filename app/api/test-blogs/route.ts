import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://f223281:Emperor%403281@web.qolhn26.mongodb.net/tastybites?retryWrites=true&w=majority"

// Define Blog Schema for testing
const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  summary: String,
  coverImage: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  category: String,
  status: String,
  featured: Boolean,
  views: Number,
  readTime: Number
}, { timestamps: true })

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema)

export async function GET() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')
    
    // Get database information
    const collections = await mongoose.connection.db.listCollections().toArray()
    const hasBlogsCollection = collections.some(col => col.name === 'blogs')
    
    // Get blogs count and sample
    const totalBlogs = await Blog.countDocuments()
    const sampleBlogs = await Blog.find()
      .limit(5)
      .select('title slug status featured createdAt')
      .lean()

    // Get collection stats if it exists
    let collectionStats = null
    if (hasBlogsCollection) {
      collectionStats = await mongoose.connection.db.collection('blogs').stats()
    }

    return NextResponse.json({ 
      message: 'Database check completed',
      status: 'success',
      databaseInfo: {
        databaseName: mongoose.connection.db.databaseName,
        collections: collections.map(col => col.name),
        hasBlogsCollection,
        collectionStats
      },
      blogsData: {
        total: totalBlogs,
        sample: sampleBlogs
      }
    });
  } catch (error: any) {
    console.error('Database Check Error:', error);
    return NextResponse.json({ 
      message: 'Failed to check database',
      error: error?.message || 'Unknown error occurred'
    }, { status: 500 });
  } finally {
    // Close the connection
    await mongoose.connection.close()
  }
} 