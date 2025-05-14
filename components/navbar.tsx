"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface User {
  id: string
  name: string
  email: string
  isAdmin?: boolean
}

// Wrap the component that uses useSearchParams in Suspense
function NavbarContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setIsLoggedIn(true)
          setUser(data.user)
        } else {
          setIsLoggedIn(false)
          setUser(null)
        }
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    } catch (error) {
      console.error("Error checking authentication:", error)
      setIsLoggedIn(false)
      setUser(null)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [pathname]) // Check auth status when pathname changes

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname, searchParams])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Recipes", href: "/recipes" },
    { name: "Blog", href: "/blogs" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-amber-600">
            TastyBites
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`hover:text-amber-600 transition-colors ${
                  pathname === link.href ? "text-amber-600 font-medium" : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/search" className="text-gray-700 hover:text-amber-600">
              <Search className="h-5 w-5" />
            </Link>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/favorites">Favorites</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/my-recipes">My Recipes</Link>
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/logout">Logout</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm" className="bg-amber-600 hover:bg-amber-700">
                <Link href="/auth">Login / Register</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/search" className="text-gray-700 hover:text-amber-600">
              <Search className="h-5 w-5" />
            </Link>

            <button onClick={toggleMenu} className="text-gray-700 hover:text-amber-600">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 hover:bg-amber-100 ${
                    pathname === link.href ? "text-amber-600 font-medium" : "text-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 my-2"></div>
              {isLoggedIn ? (
                <>
                  <Link href="/profile" className="px-4 py-2 hover:bg-amber-100 text-gray-700">
                    Profile
                  </Link>
                  <Link href="/profile/favorites" className="px-4 py-2 hover:bg-amber-100 text-gray-700">
                    Favorites
                  </Link>
                  <Link href="/profile/my-recipes" className="px-4 py-2 hover:bg-amber-100 text-gray-700">
                    My Recipes
                  </Link>
                  {user?.isAdmin && (
                    <Link href="/admin/dashboard" className="px-4 py-2 hover:bg-amber-100 text-gray-700">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/auth/logout" className="px-4 py-2 hover:bg-amber-100 text-gray-700">
                    Logout
                  </Link>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 text-center mx-4"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export function Navbar() {
  const pathname = usePathname()
  
  return (
    <Suspense fallback={<div className="h-16 bg-white shadow-sm"></div>}>
      <NavbarContent key={pathname} />
    </Suspense>
  )
}
