import mongoose from "mongoose"
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Get the directory path
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Import models
const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', new mongoose.Schema({
  title: String,
  slug: {
    type: String,
    unique: true,
  },
  description: String,
  ingredients: [{
    name: String,
    quantity: String,
    unit: String
  }],
  instructions: [String],
  prepTime: Number,
  cookTime: Number,
  servings: Number,
  difficulty: String,
  cuisine: String,
  category: [String],
  mealType: String,
  images: [String],
  featured: Boolean,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true }))

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  role: String
}))

const mockRecipes = [
  // Breakfast Recipes
  {
    title: "Classic Pancakes",
    description: "Fluffy and delicious pancakes perfect for a weekend breakfast",
    ingredients: [
      { name: "All-purpose flour", quantity: "1.5", unit: "cups" },
      { name: "Baking powder", quantity: "3.5", unit: "teaspoons" },
      { name: "Salt", quantity: "1/4", unit: "teaspoon" },
      { name: "Sugar", quantity: "1", unit: "tablespoon" },
      { name: "Milk", quantity: "1.25", unit: "cups" },
      { name: "Egg", quantity: "1", unit: "piece" },
      { name: "Melted butter", quantity: "3", unit: "tablespoons" },
    ],
    instructions: [
      "Mix dry ingredients in a bowl",
      "Combine wet ingredients in another bowl",
      "Mix wet and dry ingredients until just combined",
      "Cook on a hot griddle until bubbles form",
      "Flip and cook other side until golden brown",
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "easy",
    cuisine: "American",
    category: ["Breakfast", "Sweet"],
    mealType: "breakfast",
    images: ["/images/recipes/pancakes.jpg"],
    featured: true,
  },
  // Lunch Recipes
  {
    title: "Mediterranean Quinoa Bowl",
    description: "A healthy and filling lunch bowl packed with Mediterranean flavors",
    ingredients: [
      { name: "Quinoa", quantity: "1", unit: "cup" },
      { name: "Cherry tomatoes", quantity: "1", unit: "cup" },
      { name: "Cucumber", quantity: "1", unit: "medium" },
      { name: "Kalamata olives", quantity: "1/2", unit: "cup" },
      { name: "Feta cheese", quantity: "1/2", unit: "cup" },
      { name: "Olive oil", quantity: "2", unit: "tablespoons" },
      { name: "Lemon juice", quantity: "1", unit: "tablespoon" },
    ],
    instructions: [
      "Cook quinoa according to package instructions",
      "Chop vegetables into bite-sized pieces",
      "Combine all ingredients in a bowl",
      "Drizzle with olive oil and lemon juice",
      "Season with salt and pepper to taste",
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    difficulty: "easy",
    cuisine: "Mediterranean",
    category: ["Lunch", "Healthy", "Vegetarian"],
    mealType: "lunch",
    images: ["/images/recipes/quinoa-bowl.jpg"],
    featured: true,
  },
  // Dinner Recipes
  {
    title: "Creamy Garlic Parmesan Pasta",
    description: "Rich and creamy pasta dish perfect for a cozy dinner",
    ingredients: [
      { name: "Fettuccine pasta", quantity: "1", unit: "pound" },
      { name: "Heavy cream", quantity: "2", unit: "cups" },
      { name: "Butter", quantity: "1/2", unit: "cup" },
      { name: "Garlic", quantity: "4", unit: "cloves" },
      { name: "Parmesan cheese", quantity: "1", unit: "cup" },
      { name: "Salt", quantity: "1", unit: "teaspoon" },
      { name: "Black pepper", quantity: "1/2", unit: "teaspoon" },
    ],
    instructions: [
      "Cook pasta according to package instructions",
      "Sauté minced garlic in butter",
      "Add heavy cream and bring to simmer",
      "Stir in parmesan cheese until melted",
      "Toss with cooked pasta and season",
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "medium",
    cuisine: "Italian",
    category: ["Dinner", "Pasta", "Vegetarian"],
    mealType: "dinner",
    images: ["/images/recipes/creamy-pasta.jpg"],
    featured: true,
  },
  // Dessert Recipes
  {
    title: "Chocolate Lava Cake",
    description: "Decadent chocolate dessert with a gooey center",
    ingredients: [
      { name: "Dark chocolate", quantity: "200", unit: "grams" },
      { name: "Butter", quantity: "1/2", unit: "cup" },
      { name: "Eggs", quantity: "4", unit: "large" },
      { name: "Sugar", quantity: "1/2", unit: "cup" },
      { name: "Flour", quantity: "1/4", unit: "cup" },
      { name: "Vanilla extract", quantity: "1", unit: "teaspoon" },
    ],
    instructions: [
      "Melt chocolate and butter together",
      "Whisk eggs and sugar until light and fluffy",
      "Fold in chocolate mixture and flour",
      "Pour into ramekins",
      "Bake at 425°F for 12-14 minutes",
    ],
    prepTime: 15,
    cookTime: 14,
    servings: 4,
    difficulty: "medium",
    cuisine: "French",
    category: ["Dessert", "Chocolate", "Baking"],
    mealType: "dessert",
    images: ["/images/recipes/lava-cake.jpg"],
    featured: true,
  },
  // More Breakfast Recipes
  {
    title: "Avocado Toast with Poached Eggs",
    description: "A healthy and trendy breakfast that's both nutritious and Instagram-worthy",
    ingredients: [
      { name: "Sourdough bread", quantity: "2", unit: "slices" },
      { name: "Ripe avocado", quantity: "1", unit: "large" },
      { name: "Eggs", quantity: "2", unit: "large" },
      { name: "Red pepper flakes", quantity: "1/4", unit: "teaspoon" },
      { name: "Lime", quantity: "1/2", unit: "piece" },
      { name: "Salt", quantity: "1/4", unit: "teaspoon" },
      { name: "Black pepper", quantity: "1/8", unit: "teaspoon" },
    ],
    instructions: [
      "Toast the sourdough bread until golden brown",
      "Mash the avocado with lime juice, salt, and pepper",
      "Spread mashed avocado on toast",
      "Poach eggs in simmering water for 3 minutes",
      "Top toast with poached eggs and red pepper flakes",
    ],
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    difficulty: "medium",
    cuisine: "Modern",
    category: ["Breakfast", "Healthy", "Vegetarian"],
    mealType: "breakfast",
    images: ["/images/recipes/avocado-toast.jpg"],
    featured: false,
  },
  // Asian Cuisine
  {
    title: "Spicy Korean Bibimbap",
    description: "A colorful and flavorful Korean rice bowl with vegetables and gochujang sauce",
    ingredients: [
      { name: "Cooked white rice", quantity: "2", unit: "cups" },
      { name: "Spinach", quantity: "2", unit: "cups" },
      { name: "Carrots", quantity: "2", unit: "medium" },
      { name: "Mushrooms", quantity: "1", unit: "cup" },
      { name: "Bean sprouts", quantity: "1", unit: "cup" },
      { name: "Ground beef", quantity: "1/2", unit: "pound" },
      { name: "Gochujang sauce", quantity: "2", unit: "tablespoons" },
    ],
    instructions: [
      "Cook rice according to package instructions",
      "Sauté vegetables separately with sesame oil",
      "Cook ground beef with soy sauce and garlic",
      "Arrange rice in bowls and top with vegetables and beef",
      "Serve with gochujang sauce and a fried egg",
    ],
    prepTime: 20,
    cookTime: 25,
    servings: 2,
    difficulty: "medium",
    cuisine: "Korean",
    category: ["Dinner", "Asian", "Spicy"],
    mealType: "dinner",
    images: ["/images/recipes/bibimbap.jpg"],
    featured: true,
  },
  // Italian Cuisine
  {
    title: "Homemade Margherita Pizza",
    description: "Classic Italian pizza with fresh basil, mozzarella, and tomatoes",
    ingredients: [
      { name: "Pizza dough", quantity: "1", unit: "pound" },
      { name: "San Marzano tomatoes", quantity: "1", unit: "can" },
      { name: "Fresh mozzarella", quantity: "8", unit: "ounces" },
      { name: "Fresh basil", quantity: "1", unit: "bunch" },
      { name: "Olive oil", quantity: "2", unit: "tablespoons" },
      { name: "Salt", quantity: "1", unit: "teaspoon" },
    ],
    instructions: [
      "Preheat oven to 500°F with pizza stone",
      "Stretch dough into a 12-inch circle",
      "Top with crushed tomatoes, torn mozzarella, and basil",
      "Drizzle with olive oil and sprinkle with salt",
      "Bake for 12-15 minutes until crust is golden",
    ],
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: "medium",
    cuisine: "Italian",
    category: ["Dinner", "Italian", "Vegetarian"],
    mealType: "dinner",
    images: ["/images/recipes/margherita-pizza.jpg"],
    featured: true,
  },
  // Healthy Lunch
  {
    title: "Grilled Chicken Buddha Bowl",
    description: "A nutritious bowl packed with protein, grains, and colorful vegetables",
    ingredients: [
      { name: "Chicken breast", quantity: "2", unit: "pieces" },
      { name: "Quinoa", quantity: "1", unit: "cup" },
      { name: "Sweet potato", quantity: "1", unit: "large" },
      { name: "Kale", quantity: "2", unit: "cups" },
      { name: "Chickpeas", quantity: "1", unit: "can" },
      { name: "Tahini", quantity: "2", unit: "tablespoons" },
      { name: "Lemon", quantity: "1", unit: "piece" },
    ],
    instructions: [
      "Cook quinoa and roast sweet potato cubes",
      "Grill chicken breast with herbs and spices",
      "Massage kale with olive oil and lemon juice",
      "Roast chickpeas with spices until crispy",
      "Assemble bowls and drizzle with tahini dressing",
    ],
    prepTime: 15,
    cookTime: 30,
    servings: 2,
    difficulty: "easy",
    cuisine: "Modern",
    category: ["Lunch", "Healthy", "High Protein"],
    mealType: "lunch",
    images: ["/images/recipes/buddha-bowl.jpg"],
    featured: false,
  },
  // Quick Snack
  {
    title: "Energy Protein Balls",
    description: "No-bake protein-packed snack balls perfect for pre or post-workout",
    ingredients: [
      { name: "Dates", quantity: "1", unit: "cup" },
      { name: "Almonds", quantity: "1", unit: "cup" },
      { name: "Protein powder", quantity: "1/2", unit: "cup" },
      { name: "Chia seeds", quantity: "2", unit: "tablespoons" },
      { name: "Cocoa powder", quantity: "2", unit: "tablespoons" },
      { name: "Honey", quantity: "2", unit: "tablespoons" },
    ],
    instructions: [
      "Process dates and almonds in food processor",
      "Add remaining ingredients and pulse until combined",
      "Roll mixture into 1-inch balls",
      "Coat with extra cocoa powder if desired",
      "Refrigerate for at least 30 minutes",
    ],
    prepTime: 15,
    cookTime: 0,
    servings: 12,
    difficulty: "easy",
    cuisine: "Modern",
    category: ["Snack", "Healthy", "No-Bake"],
    mealType: "snack",
    images: ["/images/recipes/protein-balls.jpg"],
    featured: false,
  },
]

async function connectToDatabase() {
  const MONGODB_URI = "mongodb+srv://f223281:Emperor%403281@web.qolhn26.mongodb.net/tastybites?retryWrites=true&w=majority"
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongoDB Atlas')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

async function seedRecipes() {
  try {
    await connectToDatabase()

    // Get the first admin user to set as author
    let adminUser = await User.findOne({ role: "admin" })

    if (!adminUser) {
      console.log("No admin user found. Creating a default admin user...")
      adminUser = await User.create({
        name: "Admin User",
        email: "admin@tastybites.com",
        role: "admin"
      })
      console.log("Created default admin user")
    }

    // Clear existing recipes
    await Recipe.deleteMany({})
    console.log("Cleared existing recipes")

    // Add author and generate slugs for each recipe
    const recipesWithAuthorAndSlug = mockRecipes.map(recipe => ({
      ...recipe,
      author: adminUser._id,
      slug: generateSlug(recipe.title),
    }))

    // Insert recipes
    await Recipe.insertMany(recipesWithAuthorAndSlug)
    console.log("Inserted new recipes")

    console.log("Database seeded successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seedRecipes() 