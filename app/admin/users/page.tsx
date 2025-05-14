"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Search, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [users, setUsers] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [userToDelete, setUserToDelete] = useState(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    } else if (!isLoading && user && user.role !== "admin") {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = searchTerm ? `/api/admin/users?search=${searchTerm}` : "/api/admin/users"
        const response = await fetch(url)
        const data = await response.json()

        if (response.ok) {
          setUsers(data.users)
        } else {
          setError(data.message || "Failed to load users")
        }
      } catch (error) {
        setError("An error occurred. Please try again.")
      } finally {
        setIsLoadingUsers(false)
      }
    }

    if (user && user.role === "admin") {
      fetchUsers()
    }
  }, [user, searchTerm])

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      const response = await fetch(`/api/admin/users/${userToDelete}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "User Deleted",
          description: data.message,
        })
        setUsers((prev) => prev.filter((user) => user._id !== userToDelete))
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUserToDelete(null)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // The search is already handled by the useEffect
  }

  if (isLoading || isLoadingUsers) {
    return (
      <div className="min-h-screen bg-amber-100 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-amber-200 rounded w-1/3"></div>
                <div className="h-4 bg-amber-200 rounded w-1/2"></div>
                <div className="h-64 bg-amber-200 rounded"></div>
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
          <Link href="/admin/dashboard" className="inline-flex items-center text-amber-900 hover:text-amber-700 mb-8">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-amber-500 p-6">
              <h1 className="text-2xl font-bold text-amber-900">Manage Users</h1>
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
                  {/* Search */}
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                      <Input
                        type="search"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-amber-500" />
                      </div>
                    </div>
                  </form>

                  {/* Users Table */}
                  <div className="rounded-md border border-amber-200">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              No users found
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.map((userData) => (
                            <TableRow key={userData._id}>
                              <TableCell className="font-medium">{userData.name}</TableCell>
                              <TableCell>{userData.email}</TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    userData.role === "admin"
                                      ? "bg-purple-100 text-purple-800"
                                      : userData.role === "editor"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {userData.role}
                                </span>
                              </TableCell>
                              <TableCell>{new Date(userData.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Link href={`/admin/users/edit/${userData._id}`}>
                                    <Button variant="outline" size="sm" className="border-amber-300 text-amber-800">
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                  </Link>
                                  {userData._id !== user.id && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="border-red-300 text-red-600 hover:bg-red-50"
                                          onClick={() => setUserToDelete(userData._id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          <span className="sr-only">Delete</span>
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the user account
                                            and all associated data.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel onClick={() => setUserToDelete(null)}>
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={handleDeleteUser}
                                            className="bg-red-500 hover:bg-red-600 text-white"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
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
