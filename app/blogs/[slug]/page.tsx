import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Clock, Share2 } from "lucide-react"
import { BlogPost } from "@/models/BlogPost"
import { connectToDatabase } from "@/lib/mongodb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Comments } from "@/components/comments"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getBlogPost(slug: string) {
  await connectToDatabase()

  const post = await BlogPost.findOne({ slug }).populate("author").lean()

  if (!post) {
    return null
  }

  return {
    ...post,
    _id: post._id.toString(),
    author: {
      ...post.author,
      _id: post.author._id.toString(),
    },
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/blog/category/${post.category.slug}`}
            className="text-primary hover:underline mb-2 inline-block"
          >
            {post.category.name}
          </Link>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

          <div className="flex items-center gap-4 mb-6">
            <Avatar>
              <AvatarImage src={post.author.profilePicture || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-1 h-3 w-3" />
                <time dateTime={post.createdAt}>{format(new Date(post.createdAt), "MMMM d, yyyy")}</time>
                <span className="mx-1">•</span>
                <Clock className="mr-1 h-3 w-3" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
          <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
        </div>

        <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag: string) => (
            <Link key={tag} href={`/blog/tag/${tag.toLowerCase()}`}>
              <Badge variant="secondary" className="text-sm">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>

        <div className="flex justify-end mb-8">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <Separator className="mb-8" />

        <Suspense fallback={<div>Loading comments...</div>}>
          <Comments contentId={post._id} contentType="blog" />
        </Suspense>
      </div>
    </div>
  )
}
