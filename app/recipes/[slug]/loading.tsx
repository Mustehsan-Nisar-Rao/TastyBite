import { Skeleton } from "@/components/ui/skeleton"

export default function RecipeLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Recipe Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-4" />
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      {/* Recipe Image Skeleton */}
      <div className="mb-8 relative h-[400px] rounded-lg overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Recipe Info Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Ingredients Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-start">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chef's Notes Skeleton */}
      <div className="bg-orange-50 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  )
} 