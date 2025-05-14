import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Community() {
  return (
    <div className="bg-amber-500 py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-amber-900 mb-4">Join Our Culinary Community</h2>
        <p className="text-amber-900 mb-8 max-w-2xl mx-auto">
          Sign up today to save your favorite recipes, create meal plans, and receive personalized recipe
          recommendations.
        </p>
        <Link href="/auth">
          <Button className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-medium px-6 py-2">
            Create Account
          </Button>
        </Link>
      </div>
    </div>
  )
}
