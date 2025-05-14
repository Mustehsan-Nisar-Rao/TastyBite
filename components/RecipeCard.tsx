import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users } from 'lucide-react'

interface RecipeCardProps {
  recipe: {
    title: string
    description: string
    slug: string
    images: string[]
    prepTime: number
    cookTime: number
    servings: number
    difficulty: string
    cuisine: string
    mealType: string
  }
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.slug}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={recipe.images[0] || '/images/placeholder.jpg'}
            alt={recipe.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <span className="text-white text-sm font-medium px-2 py-1 rounded-full bg-orange-500">
              {recipe.mealType}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors">
            {recipe.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>

          {/* Recipe Info */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{recipe.prepTime + recipe.cookTime} mins</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
              {recipe.cuisine}
            </span>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
} 