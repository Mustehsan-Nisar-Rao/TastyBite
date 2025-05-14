"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Desserts",
  "Appetizers",
  "Soups",
  "Salads",
  "Snacks",
  "Drinks",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
]

const difficultyLevels = ["Easy", "Medium", "Hard"]

interface RecipeFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function RecipeForm({ initialData, isEditing = false }: RecipeFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    difficulty: "Medium",
    ingredients: [""],
    instructions: [""],
    tips: [""],
    tags: [""],
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
    },
    featured: false,
    published: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        ingredients: initialData.ingredients.length ? initialData.ingredients : [""],
        instructions: initialData.instructions.length ? initialData.instructions : [""],
        tips: initialData.tips.length ? initialData.tips : [""],
        tags: initialData.tags.length ? initialData.tags : [""],
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleNutritionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [name]: Number.parseFloat(value) || 0,
      },
    }))
  }

  const handleArrayChange = (type: string, index: number, value: string) => {
    setFormData((prev) => {
      const newArray = [...prev[type]]
      newArray[index] = value
      return {
        ...prev,
        [type]: newArray,
      }
    })
  }

  const addArrayItem = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], ""],
    }))
  }

  const removeArrayItem = (type: string, index: number) => {
    setFormData((prev) => {
      const newArray = [...prev[type]]
      newArray.splice(index, 1)
      return {
        ...prev,
        [type]: newArray.length ? newArray : [""],
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Filter out empty array items
      const cleanedFormData = {
        ...formData,
        ingredients: formData.ingredients.filter((item) => item.trim() !== ""),
        instructions: formData.instructions.filter((item) => item.trim() !== ""),
        tips: formData.tips.filter((item) => item.trim() !== ""),
        tags: formData.tags.filter((item) => item.trim() !== ""),
      }

      const url = isEditing ? `/api/recipes/${initialData._id}` : "/api/recipes"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedFormData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: isEditing ? "Recipe Updated" : "Recipe Created",
          description: data.message,
        })
        router.push(isEditing ? `/recipes/${data.recipe.slug}` : "/profile/my-recipes")
        router.refresh()
      } else {
        setError(data.message || "Something went wrong")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-amber-900 mb-2">
              Recipe Title*
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-amber-900 mb-2">
              Description*
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full min-h-[100px] border-amber-300 focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-amber-900 mb-2">
              Image URL*
            </label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-amber-900 mb-2">
              Category*
            </label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)} required>
              <SelectTrigger className="w-full border-amber-300">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="prepTime" className="block text-amber-900 mb-2">
                Prep Time (min)*
              </label>
              <Input
                id="prepTime"
                name="prepTime"
                type="number"
                min="0"
                value={formData.prepTime}
                onChange={handleChange}
                className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label htmlFor="cookTime" className="block text-amber-900 mb-2">
                Cook Time (min)*
              </label>
              <Input
                id="cookTime"
                name="cookTime"
                type="number"
                min="0"
                value={formData.cookTime}
                onChange={handleChange}
                className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label htmlFor="servings" className="block text-amber-900 mb-2">
                Servings*
              </label>
              <Input
                id="servings"
                name="servings"
                type="number"
                min="1"
                value={formData.servings}
                onChange={handleChange}
                className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-amber-900 mb-2">
              Difficulty*
            </label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleSelectChange("difficulty", value)}
              required
            >
              <SelectTrigger className="w-full border-amber-300">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-amber-900 mb-2">Tags</label>
            {formData.tags.map((tag, index) => (
              <div key={`tag-${index}`} className="flex items-center mb-2">
                <Input
                  value={tag}
                  onChange={(e) => handleArrayChange("tags", index, e.target.value)}
                  className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  placeholder="e.g., Quick, Italian, Healthy"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem("tags", index)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("tags")} className="mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add Tag
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
            />
            <label htmlFor="featured" className="text-amber-900">
              Featured Recipe
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => handleCheckboxChange("published", checked as boolean)}
            />
            <label htmlFor="published" className="text-amber-900">
              Published
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-amber-900 mb-2">Ingredients*</label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={`ingredient-${index}`} className="flex items-center mb-2">
                <Input
                  value={ingredient}
                  onChange={(e) => handleArrayChange("ingredients", index, e.target.value)}
                  className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  placeholder="e.g., 2 cups flour"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem("ingredients", index)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("ingredients")}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Ingredient
            </Button>
          </div>

          <div>
            <label className="block text-amber-900 mb-2">Instructions*</label>
            {formData.instructions.map((instruction, index) => (
              <div key={`instruction-${index}`} className="flex items-center mb-2">
                <Textarea
                  value={instruction}
                  onChange={(e) => handleArrayChange("instructions", index, e.target.value)}
                  className="w-full min-h-[80px] border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  placeholder={`Step ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem("instructions", index)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("instructions")}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Instruction
            </Button>
          </div>

          <div>
            <label className="block text-amber-900 mb-2">Chef's Tips</label>
            {formData.tips.map((tip, index) => (
              <div key={`tip-${index}`} className="flex items-center mb-2">
                <Textarea
                  value={tip}
                  onChange={(e) => handleArrayChange("tips", index, e.target.value)}
                  className="w-full min-h-[80px] border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  placeholder="Add a helpful tip"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem("tips", index)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("tips")} className="mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add Tip
            </Button>
          </div>

          <div>
            <label className="block text-amber-900 mb-2">Nutrition Information</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="calories" className="block text-amber-900 mb-1 text-sm">
                  Calories
                </label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  min="0"
                  value={formData.nutrition.calories}
                  onChange={handleNutritionChange}
                  className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="protein" className="block text-amber-900 mb-1 text-sm">
                  Protein (g)
                </label>
                <Input
                  id="protein"
                  name="protein"
                  type="number"
                  min="0"
                  value={formData.nutrition.protein}
                  onChange={handleNutritionChange}
                  className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="carbs" className="block text-amber-900 mb-1 text-sm">
                  Carbs (g)
                </label>
                <Input
                  id="carbs"
                  name="carbs"
                  type="number"
                  min="0"
                  value={formData.nutrition.carbs}
                  onChange={handleNutritionChange}
                  className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="fat" className="block text-amber-900 mb-1 text-sm">
                  Fat (g)
                </label>
                <Input
                  id="fat"
                  name="fat"
                  type="number"
                  min="0"
                  value={formData.nutrition.fat}
                  onChange={handleNutritionChange}
                  className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="fiber" className="block text-amber-900 mb-1 text-sm">
                  Fiber (g)
                </label>
                <Input
                  id="fiber"
                  name="fiber"
                  type="number"
                  min="0"
                  value={formData.nutrition.fiber}
                  onChange={handleNutritionChange}
                  className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="sugar" className="block text-amber-900 mb-1 text-sm">
                  Sugar (g)
                </label>
                <Input
                  id="sugar"
                  name="sugar"
                  type="number"
                  min="0"
                  value={formData.nutrition.sugar}
                  onChange={handleNutritionChange}
                  className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-amber-300 text-amber-800"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Recipe" : "Create Recipe"}
        </Button>
      </div>
    </form>
  )
}
