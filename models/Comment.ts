import mongoose from "mongoose"

export interface IComment extends mongoose.Document {
  content: string
  user: mongoose.Types.ObjectId
  recipe?: mongoose.Types.ObjectId
  blogPost?: mongoose.Types.ObjectId
  parent?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new mongoose.Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, "Please provide comment content"],
      maxlength: [1000, "Comment cannot be more than 1000 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
    blogPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  },
)

// Ensure a comment is associated with either a recipe or a blog post
CommentSchema.pre("validate", function (next) {
  if (!this.recipe && !this.blogPost) {
    next(new Error("Comment must be associated with either a recipe or a blog post"))
  } else {
    next()
  }
})

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema)
