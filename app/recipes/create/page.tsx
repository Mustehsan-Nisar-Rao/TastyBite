"use client"

import RecipeForm from "@/components/RecipeForm"

export default function CreateRecipePage() {
  return (
    <div className="min-h-screen pt-20 pb-10 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-amber-900 mb-6">Create New Recipe</h1>
          <RecipeForm />
        </div>
      </div>
    </div>
  )
} 