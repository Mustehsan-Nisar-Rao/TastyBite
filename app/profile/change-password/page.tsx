"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function ChangePasswordPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters")
      return
    }

    setError("")
    setSuccess("")
    setIsUpdating(true)

    try {
      const response = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Password changed successfully")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setError(data.message || "Failed to change password")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-100 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-amber-200 rounded w-1/2"></div>
                <div className="h-4 bg-amber-200 rounded w-2/3"></div>
                <div className="h-12 bg-amber-200 rounded"></div>
                <div className="h-12 bg-amber-200 rounded"></div>
                <div className="h-12 bg-amber-200 rounded"></div>
                <div className="h-12 bg-amber-200 rounded w-1/3"></div>
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
        <div className="max-w-md mx-auto">
          <Link href="/profile" className="inline-flex items-center text-amber-900 hover:text-amber-700 mb-8">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Profile
          </Link>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-amber-500 p-6">
              <h1 className="text-2xl font-bold text-amber-900">Change Password</h1>
            </div>

            <div className="p-8">
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label htmlFor="current-password" className="block text-amber-900 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-amber-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-amber-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-amber-900 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-amber-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-amber-500" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">Password must be at least 6 characters</p>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-amber-900 mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Changing Password..." : "Change Password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
