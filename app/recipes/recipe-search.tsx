"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "./use-debounce"
import { Loader2 } from "lucide-react"

export default function RecipeSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [isLoading, setIsLoading] = useState(false)
  const debouncedSearch = useDebounce(searchTerm, 300)

  const handleSearch = useCallback((value: string) => {
    setIsLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    
    // Reset to first page when searching
    params.set("page", "1")
    
    router.push(`/recipes?${params.toString()}`)
    setIsLoading(false)
  }, [router, searchParams])

  useEffect(() => {
    handleSearch(debouncedSearch)
  }, [debouncedSearch, handleSearch])

  return (
    <div className="relative">
      <Input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search recipes, ingredients, or cuisines..."
        className="pl-10 bg-amber-100 border-amber-300 text-amber-900 placeholder:text-amber-700"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        {isLoading ? (
          <Loader2 className="h-5 w-5 text-amber-700 animate-spin" />
        ) : (
          <svg
            className="h-5 w-5 text-amber-700"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </div>
  )
} 