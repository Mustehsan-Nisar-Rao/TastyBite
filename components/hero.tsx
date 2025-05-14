import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="bg-amber-500 py-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-5xl font-bold text-amber-900 mb-4">
            Discover Delicious Recipes
            <br />
            For Every Taste
          </h1>
          <p className="text-amber-900 mb-8 text-lg">
            Explore our collection of mouthwatering recipes from around the world. From quick weekday meals to
            impressive dinner party dishes, we've got you covered.
          </p>
          <div className="flex space-x-4">
            <Link href="/recipes">
              <Button className="bg-amber-900 hover:bg-amber-800 text-white">Browse Recipes</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="border-amber-900 text-amber-900 hover:bg-amber-100">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <Image
            src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2070&auto=format&fit=crop"
            alt="Delicious food spread"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
            priority
          />
        </div>
      </div>
    </div>
  )
}
