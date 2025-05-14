import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    id: 1,
    name: "Breakfast",
    count: 42,
    image: "https://images.unsplash.com/photo-1533089860892-a9b969df67e3?q=80&w=2070&auto=format&fit=crop",
    slug: "breakfast",
  },
  {
    id: 2,
    name: "Lunch",
    count: 57,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070&auto=format&fit=crop",
    slug: "lunch",
  },
  {
    id: 3,
    name: "Dinner",
    count: 86,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
    slug: "dinner",
  },
  {
    id: 4,
    name: "Desserts",
    count: 35,
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=2070&auto=format&fit=crop",
    slug: "desserts",
  },
]

export default function Categories() {
  return (
    <div className="bg-amber-500 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">Browse By Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/recipes/category/${category.slug}`}
              className="relative overflow-hidden rounded-lg group"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={400}
                height={300}
                className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                <p>{category.count} recipes</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
