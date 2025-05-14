"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface ShareButtonProps {
  title: string
}

export function ShareButton({ title }: ShareButtonProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleShare = async (platform: string) => {
    try {
      switch (platform) {
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            "_blank"
          )
          break
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `Check out this recipe for ${title}!`
            )}&url=${encodeURIComponent(shareUrl)}`,
            "_blank"
          )
          break
        case "whatsapp":
          window.open(
            `https://wa.me/?text=${encodeURIComponent(
              `Check out this recipe for ${title}! ${shareUrl}`
            )}`,
            "_blank"
          )
          break
        case "copy":
          await navigator.clipboard.writeText(shareUrl)
          toast({
            title: "Link copied!",
            description: "The recipe link has been copied to your clipboard.",
          })
          break
      }
      setIsOpen(false)
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Error",
        description: "Failed to share recipe. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare("facebook")}>
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("twitter")}>
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("copy")}>
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
