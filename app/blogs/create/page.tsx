"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// Categories for the blog
const categories = [
  "Cooking Tips",
  "Ingredients",
  "Baking",
  "Special Diets",
  "Entertaining",
  "Global Cuisine",
  "Kitchen Gadgets",
  "Nutrition",
]

export default function CreateBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {}
    
    const title = formData.get("title")?.toString().trim()
    const content = formData.get("content")?.toString().trim()
    const summary = formData.get("summary")?.toString().trim()
    const category = formData.get("category")?.toString()
    const tags = formData.get("tags")?.toString().trim()
    
    if (!title) errors.title = "Title is required"
    else if (title.length > 100) errors.title = "Title cannot be more than 100 characters"
    
    if (!content) errors.content = "Content is required"
    
    if (!summary) errors.summary = "Summary is required"
    else if (summary.length > 500) errors.summary = "Summary cannot be more than 500 characters"
    
    if (!category) errors.category = "Category is required"
    
    if (!tags) errors.tags = "At least one tag is required"
    
    if (!imageFile && !imagePreview) errors.image = "Cover image is required"
    
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

      // Upload image first if exists
      let coverImage = ""
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append("file", imageFile)
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
          credentials: "include", // Include cookies for authentication
        })
        
        if (!uploadRes.ok) {
          const error = await uploadRes.json()
          if (uploadRes.status === 401) {
            router.push("/login?redirect=/blogs/create") // Redirect to login if not authenticated
            return
          }
          throw new Error(error.message || "Failed to upload image")
        }
        const { url } = await uploadRes.json()
        coverImage = url
      }

      // Generate slug from title
      const title = formData.get("title") as string
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

      // Get form fields
      const content = formData.get("content")?.toString() || ""
      const summary = formData.get("summary")?.toString() || ""
      const category = formData.get("category")?.toString() || ""
      const tags = formData.get("tags")?.toString().split(",").map(tag => tag.trim()).filter(Boolean) || []

      // Prepare blog data
      const blogData = {
        title,
        slug,
        content,
        summary,
        coverImage,
        category,
        tags,
        status: "published",
        featured: false,
        views: 0,
        readTime: Math.ceil(content.split(/\s+/).length / 200) || 1
      }

      console.log("Sending blog data:", blogData)

      // Create blog post
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
        credentials: "include", // Include cookies for authentication
      })

      if (!res.ok) {
        const error = await res.json()
        if (res.status === 401) {
          router.push("/login?redirect=/blogs/create") // Redirect to login if not authenticated
          return
        }
        console.error("Server error response:", error)
        throw new Error(error.message || "Failed to create blog")
      }

      const result = await res.json()
      console.log("Server success response:", result)

      toast.success("Blog post created successfully!")
      router.push("/blogs")
    } catch (error) {
      console.error("Error creating blog:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create blog. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-10 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-amber-900 mb-6">Create New Blog Post</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Enter your blog title"
                maxLength={100}
                className={`border-amber-200 focus:border-amber-500 ${formErrors.title ? 'border-red-500' : ''}`}
              />
              {formErrors.title && (
                <p className="text-sm text-red-500">{formErrors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                name="summary"
                required
                placeholder="Brief summary of your blog"
                className={`h-20 border-amber-200 focus:border-amber-500 ${formErrors.summary ? 'border-red-500' : ''}`}
              />
              {formErrors.summary && (
                <p className="text-sm text-red-500">{formErrors.summary}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                required
                placeholder="Write your blog content here..."
                className={`h-64 border-amber-200 focus:border-amber-500 ${formErrors.content ? 'border-red-500' : ''}`}
              />
              {formErrors.content && (
                <p className="text-sm text-red-500">{formErrors.content}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger className={`border-amber-200 focus:border-amber-500 ${formErrors.category ? 'border-red-500' : ''}`}>
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
              {formErrors.category && (
                <p className="text-sm text-red-500">{formErrors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                required
                placeholder="Enter tags separated by commas (e.g., cooking, baking, tips)"
                className={`border-amber-200 focus:border-amber-500 ${formErrors.tags ? 'border-red-500' : ''}`}
              />
              {formErrors.tags && (
                <p className="text-sm text-red-500">{formErrors.tags}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Cover Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                required
                onChange={handleImageChange}
                className={`border-amber-200 focus:border-amber-500 ${formErrors.image ? 'border-red-500' : ''}`}
              />
              {formErrors.image && (
                <p className="text-sm text-red-500">{formErrors.image}</p>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Cover image preview"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {loading ? "Creating..." : "Create Blog Post"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
} 