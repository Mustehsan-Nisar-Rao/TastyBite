import mongoose from "mongoose"

export interface IRating extends mongoose.Document {
  value: number
  user: mongoose.Types.ObjectId
  recipe: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const RatingSchema = new mongoose.Schema<IRating>(
  {
    value: {
      type: Number,
      required: [true, "Please provide a rating value"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure a user can only rate a recipe once
RatingSchema.index({ user: 1, recipe: 1 }, { unique: true })

export default mongoose.models.Rating || mongoose.model<IRating>("Rating", RatingSchema)
