const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://f223281:Emperor%403281@web.qolhn26.mongodb.net/tastybites";

async function viewBlogs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all blogs
    const blogs = await mongoose.connection.collection('blogs').find({}).toArray();
    
    // Print blogs in a readable format
    console.log('\nBlogs in database:');
    console.log('==================\n');
    
    blogs.forEach((blog, index) => {
      console.log(`Blog ${index + 1}:`);
      console.log('-------------');
      console.log(`ID: ${blog._id}`);
      console.log(`Title: ${blog.title}`);
      console.log(`Slug: ${blog.slug}`);
      console.log(`Summary: ${blog.summary}`);
      console.log(`Category: ${blog.category}`);
      console.log(`Tags: ${blog.tags.join(', ')}`);
      console.log(`Cover Image: ${blog.coverImage}`);
      console.log(`Author ID: ${blog.author}`);
      console.log(`Created At: ${blog.createdAt}`);
      console.log(`Updated At: ${blog.updatedAt}`);
      console.log('\n');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

viewBlogs(); 