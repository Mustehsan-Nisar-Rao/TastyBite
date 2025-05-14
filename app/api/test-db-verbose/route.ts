import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';

export async function GET() {
  try {
    // Log the MongoDB URI (with password masked)
    const mongoUri = process.env.MONGODB_URI || 'not set';
    const maskedUri = mongoUri.replace(/:([^@]+)@/, ':****@');
    console.log('Attempting to connect with URI:', maskedUri);

    const conn = await connectToDatabase();
    
    return NextResponse.json({ 
      message: 'Successfully connected to MongoDB',
      status: 'success',
      uri_used: maskedUri,
      env_vars_present: {
        mongodb_uri_set: !!process.env.MONGODB_URI
      }
    });
  } catch (error: any) {
    console.error('Detailed MongoDB Connection Error:', error);
    
    return NextResponse.json({ 
      message: 'Failed to connect to MongoDB',
      error: error?.message || 'Unknown error occurred',
      uri_used: process.env.MONGODB_URI ? 'URI is set' : 'URI is not set',
      env_vars_present: {
        mongodb_uri_set: !!process.env.MONGODB_URI
      }
    }, { status: 500 });
  }
} 