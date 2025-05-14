import mongoose from "mongoose"

const MONGODB_URI = "mongodb+srv://f223281:Emperor%403281@web.qolhn26.mongodb.net/tastybites?retryWrites=true&w=majority"

// Import models
const Blog = mongoose.models.Blog || mongoose.model('Blog', new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  summary: String,
  coverImage: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  category: String,
  status: String,
  featured: Boolean,
  views: Number,
  readTime: Number
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

const sampleBlogs = [
  {
    title: "The Art of Sourdough Bread Making",
    content: `Making sourdough bread is a journey into the ancient art of bread making. 
    It begins with creating a starter, a living culture of wild yeast and beneficial bacteria. 
    This process requires patience and attention, but the results are worth it. 
    The complex flavors and chewy texture of sourdough bread are unmatched by commercial yeast breads.
    
    Key steps in sourdough bread making:
    1. Maintaining a healthy starter
    2. Understanding fermentation
    3. Mastering the stretch and fold technique
    4. Proper shaping and scoring
    5. Baking with steam for the perfect crust`,
    summary: "Learn the fundamentals of making authentic sourdough bread at home",
    coverImage: "/images/blogs/sourdough-bread.jpg",
    tags: ["Baking", "Bread", "Sourdough", "Artisan"],
    category: "Baking",
    status: "published",
    featured: true
  },
  {
    title: "Essential Kitchen Tools for Every Home Chef",
    content: `Every home chef needs a well-equipped kitchen to create delicious meals. 
    This guide covers the must-have tools that will elevate your cooking game.
    
    Essential tools include:
    - A high-quality chef's knife
    - Sturdy cutting boards
    - Heavy-bottom pots and pans
    - Kitchen scale
    - Instant-read thermometer
    
    Investing in quality tools will make cooking more enjoyable and efficient.`,
    summary: "A comprehensive guide to must-have kitchen tools for home cooks",
    coverImage: "/images/blogs/kitchen-tools.jpg",
    tags: ["Kitchen", "Tools", "Equipment", "Cooking Basics"],
    category: "Kitchen Essentials",
    status: "published",
    featured: true
  },
  {
    title: "Seasonal Cooking: Spring Vegetables Guide",
    content: `Spring brings an abundance of fresh vegetables that can inspire your cooking. 
    Learn about selecting, storing, and preparing spring vegetables to make the most of seasonal produce.
    
    Featured spring vegetables:
    - Asparagus
    - Peas
    - Artichokes
    - Spring onions
    - Fresh herbs
    
    Includes recipes and cooking techniques for each vegetable.`,
    summary: "Make the most of spring vegetables with this seasonal cooking guide",
    coverImage: "/images/blogs/spring-vegetables.jpg",
    tags: ["Seasonal", "Vegetables", "Spring", "Fresh Produce"],
    category: "Seasonal Cooking",
    status: "published",
    featured: false
  },
  {
    title: "Mastering Food Photography",
    content: `Learn how to take stunning food photos for your blog or social media. 
    This guide covers lighting, composition, styling, and editing techniques.
    
    Key topics:
    - Natural light photography
    - Color theory in food styling
    - Props and backgrounds
    - Basic editing techniques
    - Mobile photography tips`,
    summary: "Tips and techniques for taking beautiful food photographs",
    coverImage: "/images/blogs/food-photography.jpg",
    tags: ["Photography", "Food Styling", "Social Media"],
    category: "Food Photography",
    status: "published",
    featured: true
  }
]

async function seedBlogs() {
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

    // Add blogs one by one, updating if they exist
    for (const blog of sampleBlogs) {
      const slug = generateSlug(blog.title)
      const blogWithAuthorAndSlug = {
        ...blog,
        author: adminUser._id,
        slug,
        views: Math.floor(Math.random() * 1000), // Random view count
        readTime: Math.ceil(blog.content.split(/\s+/).length / 200) // Estimate read time
      }

      // Try to find existing blog
      const existingBlog = await Blog.findOne({ slug })

      if (existingBlog) {
        // Update existing blog
        await Blog.findByIdAndUpdate(existingBlog._id, blogWithAuthorAndSlug)
        console.log(`Updated blog: ${blog.title}`)
      } else {
        // Insert new blog
        await Blog.create(blogWithAuthorAndSlug)
        console.log(`Created new blog: ${blog.title}`)
      }
    }

    console.log("Sample blogs seeded successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding blogs:", error)
    process.exit(1)
  }
}

seedBlogs() 