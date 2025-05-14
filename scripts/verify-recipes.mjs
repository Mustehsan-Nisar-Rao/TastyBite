import mongoose from "mongoose"

const MONGODB_URI = "mongodb+srv://f223281:Emperor%403281@web.qolhn26.mongodb.net/tastybites?retryWrites=true&w=majority"

// Define the Recipe model
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

async function verifyRecipes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB Atlas')

    // Get total count
    const totalRecipes = await Recipe.countDocuments()
    console.log(`\nTotal recipes: ${totalRecipes}`)

    // Get count by meal type
    const mealTypeCounts = await Recipe.aggregate([
      { $group: { _id: "$mealType", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
    console.log('\nRecipes by meal type:')
    mealTypeCounts.forEach(({ _id, count }) => {
      console.log(`${_id}: ${count}`)
    })

    // Get count by difficulty
    const difficultyCounts = await Recipe.aggregate([
      { $group: { _id: "$difficulty", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
    console.log('\nRecipes by difficulty:')
    difficultyCounts.forEach(({ _id, count }) => {
      console.log(`${_id}: ${count}`)
    })

    // Get featured recipes
    const featuredRecipes = await Recipe.find({ featured: true })
    console.log('\nFeatured recipes:')
    featuredRecipes.forEach(recipe => {
      console.log(`- ${recipe.title} (${recipe.mealType})`)
    })

    // Get all recipes with basic info
    const allRecipes = await Recipe.find({}).select('title slug mealType cuisine difficulty')
    console.log('\nAll recipes:')
    allRecipes.forEach(recipe => {
      console.log(`- ${recipe.title}`)
      console.log(`  Slug: ${recipe.slug}`)
      console.log(`  Type: ${recipe.mealType}`)
      console.log(`  Cuisine: ${recipe.cuisine}`)
      console.log(`  Difficulty: ${recipe.difficulty}`)
      console.log('  ---')
    })

    // Verify ingredient structure
    const recipeWithIngredients = await Recipe.findOne({}).select('title ingredients')
    console.log('\nSample recipe ingredients structure:')
    console.log(`Recipe: ${recipeWithIngredients.title}`)
    console.log('Ingredients:')
    recipeWithIngredients.ingredients.forEach(ing => {
      console.log(`- ${ing.quantity} ${ing.unit} ${ing.name}`)
    })

    process.exit(0)
  } catch (error) {
    console.error('Error verifying recipes:', error)
    process.exit(1)
  }
}

verifyRecipes() 