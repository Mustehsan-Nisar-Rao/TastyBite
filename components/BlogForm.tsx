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

const categories = [
  "Baking",
  "Kitchen Essentials",
  "Seasonal Cooking",
  "Food Photography",
  "Cooking Tips",
  "Recipes",
  "Nutrition",
  "Restaurant Reviews"
]

export default function BlogForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Upload image first if exists
      let coverImage = ""
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append("file", imageFile)
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        })
        
        if (!uploadRes.ok) throw new Error("Failed to upload image")
        const { url } = await uploadRes.json()
        coverImage = url
      }

      // Prepare blog data
      const blogData = {
        title: formData.get("title"),
        content: formData.get("content"),
        summary: formData.get("summary"),
        category: formData.get("category"),
        tags: formData.get("tags")?.toString().split(",").map(tag => tag.trim()),
        coverImage,
        status: "published",
        featured: false
      }

      // Create blog post
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      })

      if (!res.ok) throw new Error("Failed to create blog")

      toast.success("Blog created successfully!")
      router.push("/blogs")
    } catch (error) {
      console.error("Error creating blog:", error)
      toast.error("Failed to create blog. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Enter your blog title"
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          name="summary"
          required
          placeholder="Brief summary of your blog"
          className="h-20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          required
          placeholder="Write your blog content here..."
          className="h-64"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category" required>
          <SelectTrigger>
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

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          placeholder="Enter tags separated by commas"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Cover Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="cursor-pointer"
        />
        {imagePreview && (
          <div className="mt-4 relative w-full aspect-video">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Blog"}
      </Button>
    </form>
  )
} 