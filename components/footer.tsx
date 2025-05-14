import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-amber-200 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-amber-700 text-2xl font-bold mb-4">TastyBites</h3>
            <p className="text-amber-800 mb-4">
              Your source for delicious recipes and cooking inspiration. Discover meals that bring joy to your table.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-amber-700 hover:text-amber-500">
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-amber-700 hover:text-amber-500">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-amber-700 hover:text-amber-500">
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-amber-700 hover:text-amber-500">
                <Youtube className="w-5 h-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-amber-900 font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-amber-800 hover:text-amber-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="text-amber-800 hover:text-amber-600">
                  All Recipes
                </Link>
              </li>
              <li>
                <Link href="/recipes/category/breakfast" className="text-amber-800 hover:text-amber-600">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-amber-800 hover:text-amber-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-amber-800 hover:text-amber-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-amber-900 font-bold mb-4">Recipe Categories</h3>
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
        </div>

        <div className="mt-12 pt-8 border-t border-amber-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-amber-900 font-bold mb-4">Subscribe</h3>
              <p className="text-amber-800 mb-4">Join our newsletter to get weekly recipe inspiration.</p>
              <div className="flex space-x-2">
                <Input type="email" placeholder="Your email address" className="bg-white border-amber-300" />
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-amber-300 text-center">
          <p className="text-amber-800">© 2025 TastyBites. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/privacy-policy" className="text-amber-800 hover:text-amber-600 text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-amber-800 hover:text-amber-600 text-sm">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-amber-800 hover:text-amber-600 text-sm">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
