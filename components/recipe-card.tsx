import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface RecipeCardProps {
  id: string
  title: string
  image: string
  category: string
  prepTime: string
  cookTime: string
  slug: string
  difficulty?: "Easy" | "Medium" | "Hard"
}

export function RecipeCard({
  id,
  title,
  image,
  category,
  prepTime,
  cookTime,
  slug,
  difficulty = "Medium",
}: RecipeCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white shadow transition-all hover:shadow-lg">
      <Link href={`/recipes/${slug}`} className="block h-full w-full">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image || `/placeholder.svg?height=400&width=600`}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            width={600}
            height={400}
          />
          <div className="absolute right-2 top-2">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {difficulty}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-1">{title}</h3>
          <div className="mb-3 flex items-center">
            <Badge variant="outline" className="mr-2">
              {category}
            </Badge>
            <span className="text-sm text-gray-500">{prepTime + cookTime} min</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Prep: {prepTime} min</span>
            <span>Cook: {cookTime} min</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
