"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchProps {
  placeholder?: string
  className?: string
}

export function Search({ placeholder = "Search recipes...", className }: SearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const clearSearch = () => {
    setQuery("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="md:hidden">
        {!isOpen ? (
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} aria-label="Open search">
            <SearchIcon className="h-5 w-5" />
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="absolute right-0 top-0 z-10 flex w-screen max-w-sm items-center">
            <Input
              ref={inputRef}
              type="search"
              placeholder={placeholder}
              className="flex-1 rounded-r-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-12 top-0 h-10"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button type="submit" className="rounded-l-none">
              <SearchIcon className="h-4 w-4" />
            </Button>
          </form>
        )}
      </div>
      <form onSubmit={handleSubmit} className="relative hidden md:flex md:items-center">
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          className="w-full md:w-[200px] lg:w-[300px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <Button type="button" variant="ghost" size="icon" className="absolute right-12 h-10" onClick={clearSearch}>
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button type="submit" className="absolute right-0 rounded-l-none">
          <SearchIcon className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
