import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import Recipe from "@/models/Recipe";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get total count
    const totalRecipes = await Recipe.countDocuments();
    
    // Get a sample of recipes
    const recipes = await Recipe.find()
      .limit(5)
      .select('title slug description');
    
    return NextResponse.json({ 
      message: 'Recipe check successful',
      totalRecipes,
      sampleRecipes: recipes,
      status: 'success'
    });
  } catch (error: any) {
    console.error('Recipe Check Error:', error);
    return NextResponse.json({ 
      message: 'Failed to check recipes',
      error: error?.message || 'Unknown error occurred'
    }, { status: 500 });
  }
} 