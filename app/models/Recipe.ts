import mongoose, { Schema, model, models, Document } from 'mongoose'

export interface RecipeDocument extends Document {
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string[]
  cuisine: string
  mealType: string[]
  images: string[]
  featured: boolean
  rating?: {
    average: number
    count: number
  }
  author?: {
    _id: string
    name: string
  }
  slug: string
  createdAt: string
  updatedAt: string
}

const recipeSchema = new Schema<RecipeDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: [{ type: String, required: true }],
  prepTime: { type: Number, required: true },
  cookTime: { type: Number, required: true },
  servings: { type: Number, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  category: [{ type: String, required: true }],
  cuisine: { type: String, required: true },
  mealType: [{ type: String, required: true }],
  images: [{ type: String, required: true }],
  featured: { type: Boolean, default: false },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  slug: { type: String, required: true, unique: true },
}, {
  timestamps: true
})

// Create indexes for search and filtering
recipeSchema.index({ title: 'text', description: 'text', category: 'text', cuisine: 'text' })
recipeSchema.index({ featured: 1 })
recipeSchema.index({ 'rating.average': -1 })
recipeSchema.index({ createdAt: -1 })
recipeSchema.index({ category: 1 })
recipeSchema.index({ cuisine: 1 })
recipeSchema.index({ mealType: 1 })

const Recipe = mongoose.models.Recipe || mongoose.model<RecipeDocument>('Recipe', recipeSchema)
export default Recipe 