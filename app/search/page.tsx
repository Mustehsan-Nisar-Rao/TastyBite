import { notFound } from "next/navigation"
import { Recipe } from "@/models/Recipe"
import { BlogPost } from "@/models/BlogPost"
import { connectToDatabase } from "@/lib/mongodb"
import { RecipeCard } from "@/components/recipe-card"
import { BlogPostCard } from "@/components/blog-post-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SearchPageProps {
  searchParams: { q?: string }
}

async function getSearchResults(query: string) {
  await connectToDatabase()

  // Search recipes
  const recipes = await Recipe.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { ingredients: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
      { "category.name": { $regex: query, $options: "i" } },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(20)

  // Search blog posts
  const blogPosts = await BlogPost.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { excerpt: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
      { "category.name": { $regex: query, $options: "i" } },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(20)

  return { recipes, blogPosts }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  if (!query) {
    notFound()
  }

  const { recipes, blogPosts } = await getSearchResults(query)
  const totalResults = recipes.length + blogPosts.length

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for &quot;{query}&quot;</h1>

      {totalResults === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">No results found</h2>
          <p className="text-muted-foreground">
            We couldn&apos;t find any matches for your search. Try different keywords or check for typos.
          </p>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-6">
            Found {totalResults} result{totalResults !== 1 ? "s" : ""}
          </p>

          <Tabs defaultValue="recipes" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="recipes">Recipes ({recipes.length})</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts ({blogPosts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="recipes">
              {recipes.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No recipe results found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe._id.toString()} recipe={recipe} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="blog">
              {blogPosts.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No blog post results found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogPosts.map((post) => (
                    <BlogPostCard key={post._id.toString()} post={post} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
