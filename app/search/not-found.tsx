import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SearchNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">No Results Found</h1>
      <p className="text-gray-600 max-w-md mb-8">
        We couldn't find any recipes or blog posts matching your search criteria.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/recipes">Browse All Recipes</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/blog">Read Our Blog</Link>
        </Button>
      </div>
    </div>
  )
}
