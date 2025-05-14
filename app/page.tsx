import Hero from "@/components/hero"
import FeaturedRecipes from "@/components/featured-recipes"
import Categories from "@/components/categories"
import CookingTips from "@/components/cooking-tips"
import Community from "@/components/community"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedRecipes />
      <Categories />
      <CookingTips />
      <Community />
    </div>
  )
}
