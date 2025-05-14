import mongoose from "mongoose"

const MONGODB_URI = "mongodb+srv://f223281:Emperor%403281@web.qolhn26.mongodb.net/tastybites?retryWrites=true&w=majority"

// Import models
const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', new mongoose.Schema({
  title: String,
  slug: String,
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

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const additionalRecipes = [
  // Additional Breakfast Recipes
  {
    title: "Japanese Breakfast Bowl",
    description: "A traditional Japanese breakfast featuring steamed rice, grilled fish, miso soup, and various side dishes",
    ingredients: [
      { name: "Japanese rice", quantity: "1", unit: "cup" },
      { name: "Salmon fillet", quantity: "4", unit: "ounces" },
      { name: "Miso paste", quantity: "1", unit: "tablespoon" },
      { name: "Nori sheets", quantity: "1", unit: "sheet" },
      { name: "Soft-boiled egg", quantity: "1", unit: "piece" },
      { name: "Spinach", quantity: "1", unit: "cup" },
      { name: "Soy sauce", quantity: "1", unit: "tablespoon" },
    ],
    instructions: [
      "Cook rice according to package instructions",
      "Grill salmon with a touch of salt",
      "Prepare miso soup with dashi stock",
      "Steam spinach and season with soy sauce",
      "Serve with soft-boiled egg and nori",
    ],
    prepTime: 15,
    cookTime: 25,
    servings: 1,
    difficulty: "medium",
    cuisine: "Japanese",
    category: ["Breakfast", "Healthy", "Traditional"],
    mealType: "breakfast",
    images: ["/images/recipes/japanese-breakfast.jpg"],
    featured: false,
  },
  // Additional Lunch Recipe
  {
    title: "Vietnamese Banh Mi Sandwich",
    description: "A fusion sandwich featuring Vietnamese flavors with French influence",
    ingredients: [
      { name: "Baguette", quantity: "1", unit: "piece" },
      { name: "Grilled pork", quantity: "4", unit: "ounces" },
      { name: "Pickled carrots", quantity: "1/2", unit: "cup" },
      { name: "Cucumber", quantity: "1/2", unit: "piece" },
      { name: "Cilantro", quantity: "1/4", unit: "cup" },
      { name: "Pate", quantity: "2", unit: "tablespoons" },
      { name: "Mayonnaise", quantity: "1", unit: "tablespoon" },
    ],
    instructions: [
      "Toast baguette until crispy outside",
      "Spread pate and mayonnaise on bread",
      "Layer with grilled pork",
      "Add pickled carrots and cucumber",
      "Top with cilantro and serve",
    ],
    prepTime: 20,
    cookTime: 10,
    servings: 1,
    difficulty: "easy",
    cuisine: "Vietnamese",
    category: ["Lunch", "Sandwich", "Street Food"],
    mealType: "lunch",
    images: ["/images/recipes/banh-mi.jpg"],
    featured: true,
  },
  // Additional Dinner Recipe
  {
    title: "Spanish Seafood Paella",
    description: "Traditional Spanish rice dish with a variety of seafood and saffron",
    ingredients: [
      { name: "Bomba rice", quantity: "2", unit: "cups" },
      { name: "Shrimp", quantity: "8", unit: "pieces" },
      { name: "Mussels", quantity: "8", unit: "pieces" },
      { name: "Saffron threads", quantity: "1/2", unit: "teaspoon" },
      { name: "Fish stock", quantity: "4", unit: "cups" },
      { name: "Red bell pepper", quantity: "1", unit: "piece" },
      { name: "Tomatoes", quantity: "2", unit: "medium" },
    ],
    instructions: [
      "Toast rice in paella pan",
      "Add saffron-infused fish stock",
      "Add vegetables and cook partially",
      "Add seafood in proper order",
      "Create socarrat at the bottom",
    ],
    prepTime: 30,
    cookTime: 45,
    servings: 4,
    difficulty: "hard",
    cuisine: "Spanish",
    category: ["Dinner", "Seafood", "Traditional"],
    mealType: "dinner",
    images: ["/images/recipes/paella.jpg"],
    featured: true,
  },
  // Additional Dessert Recipe
  {
    title: "Mango Sticky Rice",
    description: "Thai dessert of sweet sticky rice with fresh mango and coconut sauce",
    ingredients: [
      { name: "Sticky rice", quantity: "1", unit: "cup" },
      { name: "Coconut milk", quantity: "1", unit: "cup" },
      { name: "Palm sugar", quantity: "1/4", unit: "cup" },
      { name: "Ripe mango", quantity: "1", unit: "piece" },
      { name: "Salt", quantity: "1/4", unit: "teaspoon" },
      { name: "Toasted sesame seeds", quantity: "1", unit: "tablespoon" },
    ],
    instructions: [
      "Soak sticky rice for 4 hours",
      "Steam rice until tender",
      "Make coconut sauce with palm sugar",
      "Mix rice with half the sauce",
      "Serve with mango and remaining sauce",
    ],
    prepTime: 20,
    cookTime: 25,
    servings: 2,
    difficulty: "medium",
    cuisine: "Thai",
    category: ["Dessert", "Fruit", "Traditional"],
    mealType: "dessert",
    images: ["/images/recipes/mango-sticky-rice.jpg"],
    featured: false,
  },
  // Additional Snack Recipe
  {
    title: "Mexican Street Corn (Elote)",
    description: "Grilled corn on the cob with spicy mayo, cheese, and lime",
    ingredients: [
      { name: "Corn on the cob", quantity: "4", unit: "pieces" },
      { name: "Mayonnaise", quantity: "1/4", unit: "cup" },
      { name: "Cotija cheese", quantity: "1/2", unit: "cup" },
      { name: "Chili powder", quantity: "1", unit: "tablespoon" },
      { name: "Lime", quantity: "2", unit: "pieces" },
      { name: "Cilantro", quantity: "1/4", unit: "cup" },
    ],
    instructions: [
      "Grill corn until charred",
      "Mix mayo with lime juice",
      "Spread mayo mixture on corn",
      "Sprinkle with cheese and chili powder",
      "Garnish with cilantro and serve with lime",
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "easy",
    cuisine: "Mexican",
    category: ["Snack", "Street Food", "Vegetarian"],
    mealType: "snack",
    images: ["/images/recipes/elote.jpg"],
    featured: false,
  }
]

async function seedAdditionalRecipes() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB Atlas')

    // Get admin user
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

    // Add recipes one by one, updating if they exist
    for (const recipe of additionalRecipes) {
      const slug = generateSlug(recipe.title)
      const recipeWithAuthorAndSlug = {
        ...recipe,
        author: adminUser._id,
        slug
      }

      // Try to find existing recipe
      const existingRecipe = await Recipe.findOne({ slug })

      if (existingRecipe) {
        // Update existing recipe
        await Recipe.findByIdAndUpdate(existingRecipe._id, recipeWithAuthorAndSlug)
        console.log(`Updated recipe: ${recipe.title}`)
      } else {
        // Insert new recipe
        await Recipe.create(recipeWithAuthorAndSlug)
        console.log(`Created new recipe: ${recipe.title}`)
      }
    }

    console.log("Additional recipes seeded successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding additional recipes:", error)
    process.exit(1)
  }
}

seedAdditionalRecipes() 