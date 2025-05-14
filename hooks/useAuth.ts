import { useState, useEffect } from 'react'

interface User {
  email: string | null
  // Add other user properties as needed
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Here you would typically check for an active session
    // For now, we'll just check localStorage
    const checkAuth = () => {
      const userEmail = localStorage.getItem('userEmail')
      if (userEmail) {
        setUser({ email: userEmail })
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  return {
    user,
    loading,
    // Add other auth methods as needed
  }
} 