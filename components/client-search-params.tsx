"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SearchParamsComponent() {
  const searchParams = useSearchParams()
  return <div>{/* Use searchParams here */}</div>
}

export function ClientSearchParams() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsComponent />
    </Suspense>
  )
}
