"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock } from "lucide-react"
import { format } from "date-fns"

interface Blog {
  _id: string
  title: string
  slug: string
  summary: string
  coverImage: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar?: string
  }
  createdAt: string
  readTime: number
  views: number
}

export default function BlogPage() {
  const [loading, setLoading] = useState(true)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fetch featured blogs
        const featuredRes = await fetch("/api/blogs/featured")
        const featuredData = await featuredRes.json()
        if (featuredData.success) {
          setFeaturedBlogs(featuredData.blogs)
        }

        // Fetch all blogs
        const blogsRes = await fetch("/api/blogs")
        const blogsData = await blogsRes.json()
        if (blogsData.success) {
          setBlogs(blogsData.blogs)
        }
      } catch (error) {
        console.error("Error fetching blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-amber-500 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">TastyBites Blog</h1>
          <p className="text-amber-900 text-lg mb-8 max-w-2xl mx-auto">
            Discover cooking tips, food trends, and culinary inspiration from our expert chefs.
          </p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 bg-amber-100 border-amber-300 text-amber-900 placeholder:text-amber-700"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="bg-amber-200 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-amber-900 mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              <div>Loading featured articles...</div>
            ) : featuredBlogs.length > 0 ? (
              featuredBlogs.map((blog) => (
                <div key={blog._id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="relative">
                    <Link href={`/blogs/${blog.slug}`}>
                      <Image
                        src={blog.coverImage || "/placeholder.svg"}
                        alt={blog.title}
                        width={600}
                        height={400}
                        className="w-full h-64 object-cover"
                      />
                    </Link>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-amber-100 text-amber-800">{blog.category}</Badge>
                      <div className="flex items-center text-amber-700 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {blog.readTime} min read
                      </div>
                    </div>
                    <Link href={`/blogs/${blog.slug}`}>
                      <h3 className="text-xl font-bold text-amber-900 mb-2 hover:text-amber-700">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="text-amber-800 mb-4">{blog.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                          <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-amber-900">{blog.author.name}</p>
                          <p className="text-sm text-amber-700">
                            {format(new Date(blog.createdAt), "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No featured articles found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Latest Articles and Sidebar */}
      <section className="bg-amber-100 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Latest Articles */}
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-bold text-amber-900 mb-8">Latest Articles</h2>
              {loading ? (
                <div>Loading articles...</div>
              ) : filteredBlogs.length > 0 ? (
                <div className="space-y-8">
                  {filteredBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col md:flex-row"
                    >
                      <div className="md:w-1/3">
                        <Link href={`/blogs/${blog.slug}`}>
                          <Image
                            src={blog.coverImage || "/placeholder.svg"}
                            alt={blog.title}
                            width={300}
                            height={200}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </Link>
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge className="bg-amber-100 text-amber-800">{blog.category}</Badge>
                          <div className="flex items-center text-amber-700 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            {blog.readTime} min read
                          </div>
                        </div>
                        <Link href={`/blogs/${blog.slug}`}>
                          <h3 className="text-xl font-bold text-amber-900 mb-2 hover:text-amber-700">
                            {blog.title}
                          </h3>
                        </Link>
                        <p className="text-amber-800 mb-4">{blog.summary}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                              <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-amber-900">{blog.author.name}</p>
                              <p className="text-sm text-amber-700">
                                {format(new Date(blog.createdAt), "MMMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No articles found.</div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-8">
              {/* Create Blog Button */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <Link href="/blogs/create">
                  <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
                    Create New Blog
                  </button>
                </Link>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Categories</h3>
                <ul className="space-y-2">
                  {Array.from(new Set(blogs.map(blog => blog.category))).map((category, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <Link
                        href={`/blogs/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-amber-800 hover:text-amber-600"
                      >
                        {category}
                      </Link>
                      <Badge className="bg-amber-200 text-amber-800 hover:bg-amber-300">
                        {blogs.filter(blog => blog.category === category).length}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(blogs.flatMap(blog => blog.tags))).map((tag, index) => (
                    <Link
                      key={index}
                      href={`/blogs/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                      className="inline-flex items-center"
                    >
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        {tag} ({blogs.filter(blog => blog.tags.includes(tag)).length})
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
