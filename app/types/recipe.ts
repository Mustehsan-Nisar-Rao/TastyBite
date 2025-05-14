export interface Recipe {
  _id: string
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