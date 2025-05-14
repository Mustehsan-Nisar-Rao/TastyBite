"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { ArrowLeft, Save } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading, checkAuth } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }

    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user, isLoading, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsUpdating(true)
    setUpdateSuccess(false)
    setUpdateError("")

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (response.ok) {
        setUpdateSuccess(true)
        checkAuth() // Refresh user data
      } else {
        setUpdateError(data.message || "Failed to update profile")
      }
    } catch (error) {
      setUpdateError("An error occurred. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-100 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-amber-200 rounded w-1/3"></div>
                <div className="h-4 bg-amber-200 rounded w-1/2"></div>
                <div className="h-12 bg-amber-200 rounded"></div>
                <div className="h-12 bg-amber-200 rounded"></div>
                <div className="h-12 bg-amber-200 rounded w-1/4"></div>
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
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center text-amber-900 hover:text-amber-700 mb-8">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
          </Link>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-amber-500 p-6">
              <h1 className="text-2xl font-bold text-amber-900">My Profile</h1>
            </div>

            <div className="p-8">
              {updateSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  Profile updated successfully!
                </div>
              )}

              {updateError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {updateError}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-amber-900 mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-amber-900 mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full border-amber-300 bg-amber-50"
                  />
                  <p className="text-sm text-amber-700 mt-1">Email cannot be changed</p>
                </div>

                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white" disabled={isUpdating}>
                  {isUpdating ? (
                    "Updating..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-amber-200">
                <h2 className="text-xl font-bold text-amber-900 mb-4">Account Management</h2>

                <div className="space-y-4">
                  <Link href="/profile/change-password">
                    <Button variant="outline" className="w-full border-amber-300 text-amber-800">
                      Change Password
                    </Button>
                  </Link>

                  <Link href="/profile/favorites">
                    <Button variant="outline" className="w-full border-amber-300 text-amber-800">
                      My Saved Recipes
                    </Button>
                  </Link>

                  <Link href="/profile/my-recipes">
                    <Button variant="outline" className="w-full border-amber-300 text-amber-800">
                      My Recipes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
