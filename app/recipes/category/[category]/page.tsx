import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

// Sample recipe data organized by category
const recipesByCategory = {
  breakfast: [
    {
      id: 1,
      slug: "fluffy-pancakes",
      title: "Fluffy Pancakes",
      description: "Light and fluffy pancakes served with maple syrup and fresh berries.",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=2080&auto=format&fit=crop",
      time: "20 min",
      servings: 4,
      rating: 4.9,
    },
    {
      id: 2,
      slug: "avocado-toast",
      title: "Avocado Toast",
      description: "Creamy avocado on toasted sourdough with poached eggs and microgreens.",
      image: "https://images.unsplash.com/photo-1603046891744-76e6481cf539?q=80&w=1974&auto=format&fit=crop",
      time: "15 min",
      servings: 2,
      rating: 4.7,
    },
    {
      id: 3,
      slug: "breakfast-burrito",
      title: "Breakfast Burrito",
      description: "Hearty burrito filled with scrambled eggs, cheese, beans, and salsa.",
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1974&auto=format&fit=crop",
      time: "25 min",
      servings: 2,
      rating: 4.6,
    },
    {
      id: 4,
      slug: "greek-yogurt-parfait",
      title: "Greek Yogurt Parfait",
      description: "Layers of Greek yogurt, granola, and fresh fruit with a drizzle of honey.",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1974&auto=format&fit=crop",
      time: "10 min",
      servings: 1,
      rating: 4.8,
    },
    {
      id: 5,
      slug: "veggie-omelette",
      title: "Veggie Omelette",
      description: "Fluffy omelette packed with bell peppers, spinach, mushrooms, and cheese.",
      image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=2098&auto=format&fit=crop",
      time: "15 min",
      servings: 1,
      rating: 4.5,
    },
    {
      id: 6,
      slug: "french-toast",
      title: "French Toast",
      description: "Classic French toast with cinnamon, vanilla, and powdered sugar.",
      image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1547&auto=format&fit=crop",
      time: "20 min",
      servings: 4,
      rating: 4.7,
    },
  ],
  lunch: [
    {
      id: 1,
      slug: "classic-margherita-pizza",
      title: "Classic Margherita Pizza",
      description: "Traditional pizza with fresh mozzarella, tomatoes, and basil.",
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=2069&auto=format&fit=crop",
      time: "30 min",
      servings: 4,
      rating: 4.7,
    },
    {
      id: 2,
      slug: "chicken-caesar-salad",
      title: "Chicken Caesar Salad",
      description: "Crisp romaine lettuce with grilled chicken, croutons, and Caesar dressing.",
      image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=2070&auto=format&fit=crop",
      time: "20 min",
      servings: 2,
      rating: 4.6,
    },
    {
      id: 3,
      slug: "vegetable-wrap",
      title: "Vegetable Wrap",
      description: "Whole wheat wrap filled with hummus, fresh vegetables, and feta cheese.",
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1974&auto=format&fit=crop",
      time: "15 min",
      servings: 1,
      rating: 4.5,
    },
    {
      id: 4,
      slug: "tomato-soup",
      title: "Tomato Soup",
      description: "Creamy tomato soup served with grilled cheese croutons.",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop",
      time: "25 min",
      servings: 4,
      rating: 4.8,
    },
    {
      id: 5,
      slug: "quinoa-bowl",
      title: "Quinoa Bowl",
      description: "Nutritious bowl with quinoa, roasted vegetables, and tahini dressing.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop",
      time: "30 min",
      servings: 2,
      rating: 4.7,
    },
    {
      id: 6,
      slug: "club-sandwich",
      title: "Club Sandwich",
      description: "Triple-decker sandwich with turkey, bacon, lettuce, and tomato.",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1973&auto=format&fit=crop",
      time: "15 min",
      servings: 1,
      rating: 4.6,
    },
  ],
  dinner: [
    {
      id: 1,
      slug: "honey-garlic-salmon",
      title: "Honey Garlic Salmon",
      description: "Delicious salmon with sweet and savory honey garlic sauce.",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop",
      time: "25 min",
      servings: 4,
      rating: 4.8,
    },
    {
      id: 2,
      slug: "creamy-mushroom-risotto",
      title: "Creamy Mushroom Risotto",
      description: "Rich and creamy Italian risotto with earthy mushrooms.",
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=2070&auto=format&fit=crop",
      time: "40 min",
      servings: 4,
      rating: 4.9,
    },
    {
      id: 3,
      slug: "thai-green-curry",
      title: "Thai Green Curry",
      description: "Aromatic and spicy Thai curry with coconut milk.",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=2070&auto=format&fit=crop",
      time: "35 min",
      servings: 4,
      rating: 4.6,
    },
    {
      id: 4,
      slug: "beef-stir-fry",
      title: "Beef Stir Fry",
      description: "Quick and flavorful beef stir fry with colorful vegetables.",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=2072&auto=format&fit=crop",
      time: "20 min",
      servings: 4,
      rating: 4.7,
    },
    {
      id: 5,
      slug: "vegetable-lasagna",
      title: "Vegetable Lasagna",
      description: "Layers of pasta, ricotta, vegetables, and marinara sauce.",
      image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=2070&auto=format&fit=crop",
      time: "60 min",
      servings: 8,
      rating: 4.8,
    },
    {
      id: 6,
      slug: "chicken-parmesan",
      title: "Chicken Parmesan",
      description: "Crispy breaded chicken topped with marinara and melted mozzarella.",
      image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=1974&auto=format&fit=crop",
      time: "45 min",
      servings: 4,
      rating: 4.9,
    },
  ],
  desserts: [
    {
      id: 1,
      slug: "chocolate-chip-cookies",
      title: "Chocolate Chip Cookies",
      description: "Classic homemade cookies with a soft center and crisp edges.",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1999&auto=format&fit=crop",
      time: "30 min",
      servings: 24,
      rating: 4.9,
    },
    {
      id: 2,
      slug: "new-york-cheesecake",
      title: "New York Cheesecake",
      description: "Creamy, smooth cheesecake with a graham cracker crust.",
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=2070&auto=format&fit=crop",
      time: "90 min",
      servings: 12,
      rating: 4.8,
    },
    {
      id: 3,
      slug: "apple-pie",
      title: "Apple Pie",
      description: "Traditional apple pie with a flaky crust and cinnamon-spiced filling.",
      image: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=2070&auto=format&fit=crop",
      time: "75 min",
      servings: 8,
      rating: 4.7,
    },
    {
      id: 4,
      slug: "tiramisu",
      title: "Tiramisu",
      description: "Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1974&auto=format&fit=crop",
      time: "30 min",
      servings: 8,
      rating: 4.9,
    },
    {
      id: 5,
      slug: "chocolate-mousse",
      title: "Chocolate Mousse",
      description: "Light and airy chocolate mousse topped with whipped cream.",
      image: "https://images.unsplash.com/photo-1511715112108-9acc5793e1a3?q=80&w=1974&auto=format&fit=crop",
      time: "20 min",
      servings: 4,
      rating: 4.8,
    },
    {
      id: 6,
      slug: "strawberry-shortcake",
      title: "Strawberry Shortcake",
      description: "Sweet biscuits layered with fresh strawberries and whipped cream.",
      image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?q=80&w=2070&auto=format&fit=crop",
      time: "40 min",
      servings: 6,
      rating: 4.7,
    },
  ],
}

// Category descriptions and images
const categoryInfo = {
  breakfast: {
    title: "Breakfast Recipes",
    description:
      "Start your day right with our delicious breakfast recipes. From quick and easy options to weekend brunch favorites.",
    image: "https://images.unsplash.com/photo-1533089860892-a9b969df67e3?q=80&w=2070&auto=format&fit=crop",
  },
  lunch: {
    title: "Lunch Recipes",
    description:
      "Discover satisfying lunch ideas perfect for work, school, or a relaxing meal at home. Quick, nutritious, and full of flavor.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070&auto=format&fit=crop",
  },
  dinner: {
    title: "Dinner Recipes",
    description:
      "Explore our collection of dinner recipes for every occasion. From quick weeknight meals to impressive dinner party dishes.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
  },
  desserts: {
    title: "Dessert Recipes",
    description:
      "Indulge your sweet tooth with our delectable dessert recipes. Perfect for special occasions or an everyday treat.",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=2070&auto=format&fit=crop",
  },
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category.toLowerCase()

  // Check if category exists
  if (!recipesByCategory[category]) {
    return (
      <div className="min-h-screen bg-amber-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">Category Not Found</h1>
          <p className="text-amber-800 mb-6">Sorry, we couldn't find the category you're looking for.</p>
          <Link href="/recipes">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">Back to All Recipes</Button>
          </Link>
        </div>
      </div>
    )
  }

  const recipes = recipesByCategory[category]
  const info = categoryInfo[category]

  return (
    <div className="min-h-screen bg-amber-100">
      {/* Hero Section */}
      <div className="relative w-full h-[30vh]">
        <Image
          src={info.image || "/placeholder.svg"}
          alt={info.title}
          fill
          className="object-cover brightness-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent">
          <div className="container mx-auto px-6 pt-8">
            <Link
              href="/recipes"
              className="inline-flex items-center text-white bg-amber-600/80 hover:bg-amber-600 px-3 py-1 rounded-md"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to All Recipes
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">{info.title}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-amber-800 text-lg max-w-3xl">{info.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardContent className="pt-4">
                <h3 className="text-xl font-bold text-amber-900 mb-2">{recipe.title}</h3>
                <p className="text-amber-800 mb-4">{recipe.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="inline-block mr-2">⏱️</span>
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block mr-2">👥</span>
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(recipe.rating) ? "fill-amber-500 text-amber-500" : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-amber-800">{recipe.rating}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/recipes/${recipe.slug}`} className="w-full">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">View Recipe</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
