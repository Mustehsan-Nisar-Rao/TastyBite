"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          // Force a complete page refresh to clear all states
          window.location.href = "/auth"
        } else {
          console.error("Logout failed")
          window.location.href = "/auth"
        }
      } catch (error) {
        console.error("Logout error:", error)
        window.location.href = "/auth"
      }
    }

    handleLogout()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-600 border-r-2 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  )
} 