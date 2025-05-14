import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-amber-100 py-12">
      <div className="container mx-auto px-6">
        <Link href="/" className="inline-flex items-center text-amber-900 hover:text-amber-700 mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 mb-6">Sitemap</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h2 className="text-xl font-bold text-amber-900 mb-4">Main Pages</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-amber-800 hover:text-amber-600">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/recipes" className="text-amber-800 hover:text-amber-600">
                    Recipes
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-amber-800 hover:text-amber-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-amber-800 hover:text-amber-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-amber-800 hover:text-amber-600">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="text-amber-800 hover:text-amber-600">
                    Login/Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-amber-900 mb-4">Recipe Categories</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/recipes/category/breakfast" className="text-amber-800 hover:text-amber-600">
                    Breakfast
                  </Link>
                </li>
                <li>
                  <Link href="/recipes/category/lunch" className="text-amber-800 hover:text-amber-600">
                    Lunch
                  </Link>
                </li>
                <li>
                  <Link href="/recipes/category/dinner" className="text-amber-800 hover:text-amber-600">
                    Dinner
                  </Link>
                </li>
                <li>
                  <Link href="/recipes/category/desserts" className="text-amber-800 hover:text-amber-600">
                    Desserts
                  </Link>
                </li>
                <li>
                  <Link href="/recipes?filter=vegetarian" className="text-amber-800 hover:text-amber-600">
                    Vegetarian
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-amber-900 mb-4">Blog Categories</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog/category/cooking-tips" className="text-amber-800 hover:text-amber-600">
                    Cooking Tips
                  </Link>
                </li>
                <li>
                  <Link href="/blog/category/ingredients" className="text-amber-800 hover:text-amber-600">
                    Ingredients
                  </Link>
                </li>
                <li>
                  <Link href="/blog/category/baking" className="text-amber-800 hover:text-amber-600">
                    Baking
                  </Link>
                </li>
                <li>
                  <Link href="/blog/tag/seasonal-cooking" className="text-amber-800 hover:text-amber-600">
                    Seasonal Cooking
                  </Link>
                </li>
                <li>
                  <Link href="/blog/tag/global-cuisine" className="text-amber-800 hover:text-amber-600">
                    Global Cuisine
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-amber-900 mb-4">Legal Pages</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-amber-800 hover:text-amber-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-amber-800 hover:text-amber-600">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="text-amber-800 hover:text-amber-600">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-amber-900 mb-4">Featured Recipes</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/recipes/honey-garlic-salmon" className="text-amber-800 hover:text-amber-600">
                    Honey Garlic Salmon
                  </Link>
                </li>
                <li>
                  <Link href="/recipes/classic-margherita-pizza" className="text-amber-800 hover:text-amber-600">
                    Classic Margherita Pizza
                  </Link>
                </li>
                <li>
                  <Link href="/recipes/creamy-mushroom-risotto" className="text-amber-800 hover:text-amber-600">
                    Creamy Mushroom Risotto
                  </Link>
                </li>
                <li>
                  <Link href="/recipes/thai-green-curry" className="text-amber-800 hover:text-amber-600">
                    Thai Green Curry
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-amber-900 mb-4">Featured Blog Posts</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog/the-ultimate-guide-to-seasonal-produce"
                    className="text-amber-800 hover:text-amber-600"
                  >
                    The Ultimate Guide to Seasonal Produce
                  </Link>
                </li>
                <li>
                  <Link href="/blog/global-spices-beginners-guide" className="text-amber-800 hover:text-amber-600">
                    Global Spices: A Beginner's Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
