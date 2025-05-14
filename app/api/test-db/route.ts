import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    return NextResponse.json({ 
      message: 'Successfully connected to MongoDB',
      status: 'success'
    });
  } catch (error: any) {
    console.error('MongoDB Connection Error:', error);
    return NextResponse.json({ 
      message: 'Failed to connect to MongoDB',
      error: error?.message || 'Unknown error occurred'
    }, { status: 500 });
  }
} 