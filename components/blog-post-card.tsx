import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface BlogPostCardProps {
  id: string
  title: string
  excerpt: string
  coverImage: string
  category: string
  author: {
    name: string
    avatar?: string
  }
  publishedAt: string
  slug: string
  tags?: string[]
}

export function BlogPostCard({
  id,
  title,
  excerpt,
  coverImage,
  category,
  author,
  publishedAt,
  slug,
  tags = [],
}: BlogPostCardProps) {
  // Format date
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="group overflow-hidden rounded-lg border bg-white shadow transition-all hover:shadow-lg">
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={coverImage || `/placeholder.svg?height=400&width=600`}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            width={600}
            height={400}
          />
          <div className="absolute left-2 top-2">
            <Badge className="bg-primary text-primary-foreground">{category}</Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-xl font-semibold text-gray-900 line-clamp-2">{title}</h3>
          <p className="mb-4 text-gray-600 line-clamp-2">{excerpt}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{author.name}</span>
            </div>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
