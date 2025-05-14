import mongoose from "mongoose"

export interface IFavorite extends mongoose.Document {
  user: mongoose.Types.ObjectId
  recipe: mongoose.Types.ObjectId
  createdAt: Date
}

const FavoriteSchema = new mongoose.Schema<IFavorite>(
  {
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

// Ensure a user can only favorite a recipe once
FavoriteSchema.index({ user: 1, recipe: 1 }, { unique: true })

export default mongoose.models.Favorite || mongoose.model<IFavorite>("Favorite", FavoriteSchema)
