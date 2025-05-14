import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, ArrowLeft } from "lucide-react"

// This would normally come from a database or CMS
const blogPostsByCategory = {
  "cooking-tips": [
    {
      title: "10 Essential Knife Skills Every Home Chef Should Know",
      slug: "essential-knife-skills",
      excerpt: "Master these fundamental cutting techniques to improve your efficiency and safety in the kitchen.",
      image: "https://images.unsplash.com/photo-1566454419290-57a0589c9b17?q=80&w=2070&auto=format&fit=crop",
      date: "November 5, 2023",
      readTime: 8,
      author: "Thomas Wright",
      authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
    },
    {
      title: "How to Properly Season Your Cast Iron Skillet",
      slug: "season-cast-iron-skillet",
      excerpt: "Learn the right way to season and maintain your cast iron cookware for a lifetime of use.",
      image: "https://images.unsplash.com/photo-1544794040-a6ab01756a18?q=80&w=2070&auto=format&fit=crop",
      date: "October 12, 2023",
      readTime: 6,
      author: "Maria Gardner",
      authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    },
  ],
  ingredients: [
    {
      title: "The Ultimate Guide to Seasonal Produce",
      slug: "the-ultimate-guide-to-seasonal-produce",
      excerpt: "Learn what fruits and vegetables are in season each month and how to cook them at their peak.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
      date: "October 23, 2023",
      readTime: 10,
      author: "Maria Gardner",
      authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    },
    {
      title: "Global Spices: A Beginner's Guide to Flavor Profiles",
      slug: "global-spices-beginners-guide",
      excerpt:
        "Explore the world of spices and learn how to use them to create authentic flavors from around the globe.",
      image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=2070&auto=format&fit=crop",
      date: "September 15, 2023",
      readTime: 8,
      author: "Maria Gardner",
      authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    },
    {
      title: "Understanding Different Types of Cooking Oils",
      slug: "understanding-different-types-cooking-oils",
      excerpt: "A comprehensive guide to cooking oils - from olive to avocado - and when to use each one.",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=2070&auto=format&fit=crop",
      date: "August 5, 2023",
      readTime: 7,
      author: "Thomas Wright",
      authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
    },
  ],
}

// Category descriptions
const categoryInfo = {
  "cooking-tips": {
    title: "Cooking Tips",
    description:
      "Improve your culinary skills with our expert cooking tips and techniques. From knife skills to temperature control, these articles will help you become a better home chef.",
  },
  ingredients: {
    title: "Ingredients",
    description:
      "Dive deep into the world of ingredients. Learn about seasonal produce, spices, oils, and more to make informed choices and enhance the flavors in your cooking.",
  },
  baking: {
    title: "Baking",
    description:
      "Discover the science and art of baking with our comprehensive guides. From bread to pastries, learn techniques and tips for perfect results every time.",
  },
}

export default function BlogCategoryPage({ params }: { params: { category: string } }) {
  const category = params.category
  const formattedCategory = category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  const posts = blogPostsByCategory[category] || []
  const info = categoryInfo[category] || {
    title: formattedCategory,
    description: `Explore our collection of articles about ${formattedCategory.toLowerCase()}.`,
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-amber-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">No Articles Found</h1>
          <p className="text-amber-800 mb-6">Sorry, we couldn't find any articles in this category.</p>
          <Link href="/blog">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-100">
      {/* Header */}
      <div className="bg-amber-500 py-12">
        <div className="container mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center text-amber-900 hover:text-amber-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">{info.title}</h1>

          <p className="text-amber-900 text-lg max-w-3xl">{info.description}</p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link key={index} href={`/blog/${post.slug}`} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-amber-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-amber-800 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Image
                        src={post.authorImage || "/placeholder.svg"}
                        alt={post.author}
                        width={24}
                        height={24}
                        className="rounded-full mr-2"
                      />
                      <span className="text-amber-700 text-sm">{post.author}</span>
                    </div>
                    <div className="flex items-center text-amber-700 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-amber-500 py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Stay Updated</h2>
          <p className="text-amber-900 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get weekly updates on new articles, recipes, and cooking tips.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow rounded-l-md border-amber-300 focus:border-amber-500 focus:ring-amber-500"
            />
            <Button className="rounded-l-none bg-amber-900 hover:bg-amber-800 text-white">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
