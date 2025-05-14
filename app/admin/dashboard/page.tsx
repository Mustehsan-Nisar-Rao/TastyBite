"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, FileText, MessageSquare, TrendingUp, Clock } from "lucide-react"

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    } else if (!isLoading && user && user.role !== "admin") {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        const data = await response.json()

        if (response.ok) {
          setStats(data.stats)
        } else {
          setError(data.message || "Failed to load dashboard stats")
        }
      } catch (error) {
        setError("An error occurred. Please try again.")
      } finally {
        setIsLoadingStats(false)
      }
    }

    if (user && user.role === "admin") {
      fetchStats()
    }
  }, [user])

  if (isLoading || isLoadingStats) {
    return (
      <div className="min-h-screen bg-amber-100 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-amber-200 rounded w-1/3"></div>
                <div className="h-4 bg-amber-200 rounded w-1/2"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="h-32 bg-amber-200 rounded"></div>
                  <div className="h-32 bg-amber-200 rounded"></div>
                  <div className="h-32 bg-amber-200 rounded"></div>
                  <div className="h-32 bg-amber-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-100 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-amber-500 p-6">
              <h1 className="text-2xl font-bold text-amber-900">Admin Dashboard</h1>
            </div>

            <div className="p-8">
              {error ? (
                <div className="text-center py-8">
                  <p className="text-amber-800 mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <>
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-amber-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
                        <BookOpen className="h-4 w-4 text-amber-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRecipes}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
                        <FileText className="h-4 w-4 text-amber-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.totalBlogPosts}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                        <MessageSquare className="h-4 w-4 text-amber-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.totalComments}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Popular Recipes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-amber-600" /> Popular Recipes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {stats.popularRecipes.map((recipe) => (
                            <div key={recipe._id} className="flex justify-between items-center">
                              <div>
                                <Link
                                  href={`/recipes/${recipe.slug}`}
                                  className="font-medium text-amber-900 hover:text-amber-600"
                                >
                                  {recipe.title}
                                </Link>
                                <div className="text-sm text-amber-700">
                                  {recipe.views} views • {recipe.favorites} favorites
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="text-amber-800 font-medium">{recipe.rating}</div>
                                <svg
                                  className="h-4 w-4 text-amber-500 fill-amber-500 ml-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Link href="/admin/recipes">
                            <Button variant="outline" className="border-amber-300 text-amber-800">
                              View All Recipes
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Users */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center">
                          <Users className="h-5 w-5 mr-2 text-amber-600" /> Recent Users
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {stats.recentUsers.map((user) => (
                            <div key={user._id} className="flex justify-between items-center">
                              <div>
                                <div className="font-medium text-amber-900">{user.name}</div>
                                <div className="text-sm text-amber-700">{user.email}</div>
                              </div>
                              <div className="text-sm text-amber-700 flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 text-center">
                          <Link href="/admin/users">
                            <Button variant="outline" className="border-amber-300 text-amber-800">
                              Manage Users
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Comments */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2 text-amber-600" /> Recent Comments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {stats.recentComments.map((comment) => (
                            <div key={comment._id} className="border-b border-amber-200 pb-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-medium text-amber-900">{comment.user.name}</div>
                                <div className="text-sm text-amber-700">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <p className="text-amber-800 mb-2">{comment.content}</p>
                              <div className="text-sm text-amber-700">
                                On:{" "}
                                {comment.recipe ? (
                                  <Link
                                    href={`/recipes/${comment.recipe.slug}`}
                                    className="text-amber-600 hover:text-amber-800"
                                  >
                                    {comment.recipe.title}
                                  </Link>
                                ) : comment.blogPost ? (
                                  <Link
                                    href={`/blog/${comment.blogPost.slug}`}
                                    className="text-amber-600 hover:text-amber-800"
                                  >
                                    {comment.blogPost.title}
                                  </Link>
                                ) : (
                                  "Unknown content"
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Admin Links */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/admin/users">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Manage Users</Button>
                    </Link>
                    <Link href="/admin/recipes">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Manage Recipes</Button>
                    </Link>
                    <Link href="/admin/blog">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Manage Blog Posts</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
