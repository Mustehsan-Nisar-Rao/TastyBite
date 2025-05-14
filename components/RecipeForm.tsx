import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { PlusCircle, MinusCircle } from "lucide-react"

const cuisines = [
  "Italian",
  "Chinese",
  "Japanese",
  "Indian",
  "Mexican",
  "Thai",
  "French",
  "Mediterranean",
  "American",
  "Other"
]

const categories = [
  "Appetizer",
  "Main Course",
  "Side Dish",
  "Soup",
  "Salad",
  "Dessert",
  "Beverage",
  "Snack"
]

const mealTypes = [
  "breakfast",
  "lunch",
  "dinner",
  "dessert",
  "snack",
  "other"
]

const difficultyLevels = [
  "easy",
  "medium",
  "hard"
]

export default function RecipeForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }])
  const [instructions, setInstructions] = useState([""])
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles(prev => [...prev, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setIngredients(newIngredients)
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }])
  }

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index)
    setIngredients(newIngredients)
  }

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions]
    newInstructions[index] = value
    setInstructions(newInstructions)
  }

  const addInstruction = () => {
    setInstructions([...instructions, ""])
  }

  const removeInstruction = (index: number) => {
    const newInstructions = instructions.filter((_, i) => i !== index)
    setInstructions(newInstructions)
  }

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {}
    
    const title = formData.get("title")?.toString().trim()
    const description = formData.get("description")?.toString().trim()
    const prepTime = formData.get("prepTime")?.toString()
    const cookTime = formData.get("cookTime")?.toString()
    const servings = formData.get("servings")?.toString()
    
    if (!title) errors.title = "Title is required"
    else if (title.length > 100) errors.title = "Title cannot be more than 100 characters"
    
    if (!description) errors.description = "Description is required"
    else if (description.length > 1000) errors.description = "Description cannot be more than 1000 characters"
    
    if (!prepTime) errors.prepTime = "Preparation time is required"
    if (!cookTime) errors.cookTime = "Cooking time is required"
    if (!servings) errors.servings = "Number of servings is required"
    
    if (ingredients.some(ing => !ing.name || !ing.quantity || !ing.unit)) {
      errors.ingredients = "All ingredient fields are required"
    }
    
    if (instructions.some(inst => !inst.trim())) {
      errors.instructions = "All instruction steps are required"
    }
    
    if (imageFiles.length === 0) {
      errors.images = "At least one image is required"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      // Validate form
      if (!validateForm(formData)) {
        setLoading(false)
        return
      }

      // Upload images first
      const imageUrls: string[] = []
      for (const imageFile of imageFiles) {
        const imageFormData = new FormData()
        imageFormData.append("file", imageFile)
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
          credentials: "include",
        })
        
        if (!uploadRes.ok) {
          const error = await uploadRes.json()
          if (uploadRes.status === 401) {
            router.push("/login?redirect=/recipes/create")
            return
          }
          throw new Error(error.message || "Failed to upload image")
        }
        const { url } = await uploadRes.json()
        imageUrls.push(url)
      }

      // Generate slug from title
      const title = formData.get("title") as string
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

      // Prepare recipe data
      const recipeData = {
        title,
        slug,
        description: formData.get("description"),
        ingredients,
        instructions,
        prepTime: parseInt(formData.get("prepTime") as string),
        cookTime: parseInt(formData.get("cookTime") as string),
        servings: parseInt(formData.get("servings") as string),
        difficulty: formData.get("difficulty"),
        cuisine: formData.get("cuisine"),
        category: (formData.get("category") as string).split(","),
        mealType: formData.get("mealType"),
        images: imageUrls,
        featured: false
      }

      // Create recipe
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
        credentials: "include",
      })

      if (!res.ok) {
        const error = await res.json()
        if (res.status === 401) {
          router.push("/login?redirect=/recipes/create")
          return
        }
        throw new Error(error.message || "Failed to create recipe")
      }

      toast.success("Recipe created successfully!")
      router.push("/recipes")
    } catch (error) {
      console.error("Error creating recipe:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create recipe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Enter recipe title"
          maxLength={100}
          className={formErrors.title ? "border-red-500" : ""}
        />
        {formErrors.title && (
          <p className="text-sm text-red-500">{formErrors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          placeholder="Describe your recipe"
          className={`h-24 ${formErrors.description ? "border-red-500" : ""}`}
        />
        {formErrors.description && (
          <p className="text-sm text-red-500">{formErrors.description}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label>Ingredients</Label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 items-start">
            <Input
              placeholder="Ingredient name"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Quantity"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
              className="w-24"
            />
            <Input
              placeholder="Unit"
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
              className="w-24"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeIngredient(index)}
              disabled={ingredients.length === 1}
            >
              <MinusCircle className="h-5 w-5" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addIngredient}
          className="w-full"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Ingredient
        </Button>
        {formErrors.ingredients && (
          <p className="text-sm text-red-500">{formErrors.ingredients}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label>Instructions</Label>
        {instructions.map((instruction, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              {index + 1}
            </div>
            <Textarea
              value={instruction}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeInstruction(index)}
              disabled={instructions.length === 1}
            >
              <MinusCircle className="h-5 w-5" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addInstruction}
          className="w-full"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Step
        </Button>
        {formErrors.instructions && (
          <p className="text-sm text-red-500">{formErrors.instructions}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prepTime">Preparation Time (minutes)</Label>
          <Input
            id="prepTime"
            name="prepTime"
            type="number"
            required
            min={0}
            className={formErrors.prepTime ? "border-red-500" : ""}
          />
          {formErrors.prepTime && (
            <p className="text-sm text-red-500">{formErrors.prepTime}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cookTime">Cooking Time (minutes)</Label>
          <Input
            id="cookTime"
            name="cookTime"
            type="number"
            required
            min={0}
            className={formErrors.cookTime ? "border-red-500" : ""}
          />
          {formErrors.cookTime && (
            <p className="text-sm text-red-500">{formErrors.cookTime}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="servings">Number of Servings</Label>
          <Input
            id="servings"
            name="servings"
            type="number"
            required
            min={1}
            className={formErrors.servings ? "border-red-500" : ""}
          />
          {formErrors.servings && (
            <p className="text-sm text-red-500">{formErrors.servings}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select name="difficulty" required>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficultyLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cuisine">Cuisine</Label>
          <Select name="cuisine" required>
            <SelectTrigger>
              <SelectValue placeholder="Select cuisine" />
            </SelectTrigger>
            <SelectContent>
              {cuisines.map((cuisine) => (
                <SelectItem key={cuisine} value={cuisine}>
                  {cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mealType">Meal Type</Label>
          <Select name="mealType" required>
            <SelectTrigger>
              <SelectValue placeholder="Select meal type" />
            </SelectTrigger>
            <SelectContent>
              {mealTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categories</Label>
        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="Select categories" />
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

      <div className="space-y-2">
        <Label htmlFor="images">Recipe Images</Label>
        <Input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className={`cursor-pointer ${formErrors.images ? "border-red-500" : ""}`}
        />
        {formErrors.images && (
          <p className="text-sm text-red-500">{formErrors.images}</p>
        )}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-video">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Recipe"}
      </Button>
    </form>
  )
} 