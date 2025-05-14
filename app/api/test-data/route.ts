import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

// Define the User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Define the Recipe Schema
const RecipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: [String],
  instructions: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export async function GET() {
  try {
    await connectToDatabase();
    
    // Create models
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

    // Add sample user
    const sampleUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    });

    // Add sample recipe
    const sampleRecipe = await Recipe.create({
      title: 'Chocolate Chip Cookies',
      description: 'Classic homemade chocolate chip cookies',
      ingredients: [
        '2 1/4 cups flour',
        '1 cup butter',
        '3/4 cup sugar',
        '2 eggs',
        '2 cups chocolate chips'
      ],
      instructions: [
        'Preheat oven to 375°F',
        'Mix ingredients',
        'Bake for 10-12 minutes'
      ]
    });

    return NextResponse.json({
      message: 'Sample data created successfully',
      user: sampleUser,
      recipe: sampleRecipe
    });

  } catch (error: any) {
    console.error('Error creating sample data:', error);
    return NextResponse.json({
      message: 'Failed to create sample data',
      error: error.message
    }, { status: 500 });
  }
} 