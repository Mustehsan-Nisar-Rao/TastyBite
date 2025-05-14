import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TastyBites Blog - Culinary Insights & Recipes",
  description: "Discover cooking tips, food trends, and culinary inspiration from our expert chefs.",
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
} 