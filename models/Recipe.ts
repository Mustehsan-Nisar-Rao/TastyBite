import mongoose from "mongoose"
import User from "./User"
import type { IUser } from "./User"

export interface IRecipe extends mongoose.Document {
  title: string
  slug: string
  description: string
  ingredients: {
    name: string
    quantity: string
    unit: string
  }[]
  instructions: string[]
  prepTime: number // in minutes
  cookTime: number // in minutes
  servings: number
  difficulty: "easy" | "medium" | "hard"
  cuisine: string
  category: string[]
  mealType: "breakfast" | "lunch" | "dinner" | "dessert" | "snack" | "other"
  images: string[]
  featured: boolean
  rating: {
    average: number
    count: number
  }
  author: mongoose.Types.ObjectId | IUser
  createdAt: Date
  updatedAt: Date
}

// Helper function to generate slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim()
}

const RecipeSchema = new mongoose.Schema<IRecipe>(
  {
    title: {
      type: String,
      required: [true, "Please provide a recipe title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a recipe description"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    ingredients: [{
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: String,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    }],
    instructions: [{
      type: String,
      required: true,
    }],
    prepTime: {
      type: Number,
      required: [true, "Please provide preparation time"],
      min: [0, "Preparation time cannot be negative"],
    },
    cookTime: {
      type: Number,
      required: [true, "Please provide cooking time"],
      min: [0, "Cooking time cannot be negative"],
    },
    servings: {
      type: Number,
      required: [true, "Please provide number of servings"],
      min: [1, "Servings must be at least 1"],
    },
    difficulty: {
      type: String,
      required: [true, "Please specify difficulty level"],
      enum: ["easy", "medium", "hard"],
    },
    cuisine: {
      type: String,
      required: [true, "Please specify cuisine type"],
    },
    category: [{
      type: String,
      required: [true, "Please provide at least one category"],
    }],
    mealType: {
      type: String,
      required: [true, "Please specify meal type"],
      enum: ["breakfast", "lunch", "dinner", "dessert", "snack", "other"],
    },
    images: [{
      type: String,
      required: [true, "Please provide at least one image"],
    }],
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide recipe author"],
    },
  },
  {
    timestamps: true,
  }
)

// Pre-save middleware to generate slug
RecipeSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let baseSlug = generateSlug(this.title)
    let slug = baseSlug
    let counter = 1

    // Check for duplicate slugs
    while (await mongoose.models.Recipe?.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    this.slug = slug
  }
  next()
})

// Add indexes for better query performance
RecipeSchema.index({ featured: 1 })
RecipeSchema.index({ "rating.average": -1 })
RecipeSchema.index({ createdAt: -1 })
RecipeSchema.index({ category: 1 })
RecipeSchema.index({ cuisine: 1 })
RecipeSchema.index({ mealType: 1 })

export default mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", RecipeSchema)
