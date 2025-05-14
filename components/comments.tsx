"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Trash2, Edit, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Comment {
  _id: string
  content: string
  user: {
    _id: string
    name: string
    profilePicture?: string
  }
  createdAt: string
  updatedAt: string
}

interface CommentsProps {
  contentId: string
  contentType: "recipe" | "blog"
}

export function Comments({ contentId, contentType }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchComments()
  }, [contentId, contentType])

  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/comments/${contentType}/${contentId}`)
      if (!response.ok) throw new Error("Failed to fetch comments")

      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast({
        title: "Error",
        description: "Failed to load comments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push("/auth")
      return
    }

    if (!newComment.trim()) return

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          contentId,
          contentType,
        }),
      })

      if (!response.ok) throw new Error("Failed to post comment")

      setNewComment("")
      fetchComments()
      toast({
        title: "Success",
        description: "Your comment has been posted.",
      })
    } catch (error) {
      console.error("Error posting comment:", error)
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editContent,
        }),
      })

      if (!response.ok) throw new Error("Failed to update comment")

      setEditingComment(null)
      fetchComments()
      toast({
        title: "Success",
        description: "Your comment has been updated.",
      })
    } catch (error) {
      console.error("Error updating comment:", error)
      toast({
        title: "Error",
        description: "Failed to update your comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteCommentId) return

    try {
      const response = await fetch(`/api/comments/${deleteCommentId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete comment")

      setDeleteCommentId(null)
      fetchComments()
      toast({
        title: "Success",
        description: "Your comment has been deleted.",
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: "Failed to delete your comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const startEditing = (comment: Comment) => {
    setEditingComment(comment._id)
    setEditContent(comment.content)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Comments</h3>
        <span className="text-muted-foreground">({comments.length})</span>
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profilePicture || ""} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      )}

      {!user && (
        <div className="rounded-md bg-muted p-4 text-center">
          <p className="mb-2">Please sign in to leave a comment</p>
          <Button asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <p className="text-center py-4 text-muted-foreground">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.user.profilePicture || ""} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{comment.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {user && user._id === comment.user._id && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => startEditing(comment)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteCommentId(comment._id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  )}
                </div>

                {editingComment === comment._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingComment(null)}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEdit(comment._id)}
                        disabled={isSubmitting || !editContent.trim()}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{comment.content}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <AlertDialog open={!!deleteCommentId} onOpenChange={(open) => !open && setDeleteCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
