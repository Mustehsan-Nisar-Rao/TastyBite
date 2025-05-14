import Link from "next/link"
import { ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RecipeNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <ChefHat className="h-20 w-20 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Recipe Not Found</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          We couldn't find the recipe you're looking for. It might have been removed or the link could be incorrect.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/recipes">
            <Button variant="default" className="bg-orange-500 hover:bg-orange-600">
              Browse Recipes
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 