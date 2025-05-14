import mongoose from "mongoose"

export interface IBlog extends mongoose.Document {
  title: string
  slug: string
  content: string
  summary: string
  coverImage: string
  author: mongoose.Types.ObjectId
  tags: string[]
  category: string
  status: string
  featured: boolean
  views: number
  readTime: number
  createdAt: Date
  updatedAt: Date
}

const BlogSchema = new mongoose.Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a slug"],
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    summary: {
      type: String,
      required: [true, "Please provide a summary"],
      maxlength: [500, "Summary cannot be more than 500 characters"],
    },
    coverImage: {
      type: String,
      required: [true, "Please provide a cover image"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an author"],
    },
    tags: {
      type: [String],
      required: [true, "Please provide at least one tag"],
      validate: {
        validator: function(v: string[]) {
          return v.length > 0;
        },
        message: "At least one tag is required"
      }
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number,
      required: [true, "Please provide read time"],
      min: [1, "Read time must be at least 1 minute"],
    },
  },
  {
    timestamps: true,
  }
)

// Add indexes for common queries
BlogSchema.index({ slug: 1 }, { unique: true })
BlogSchema.index({ category: 1 })
BlogSchema.index({ tags: 1 })
BlogSchema.index({ status: 1 })
BlogSchema.index({ featured: 1 })

const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema)
export default Blog 