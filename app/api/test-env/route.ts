import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set'
  };

  return NextResponse.json({
    message: 'Environment variables check',
    environment: process.env.NODE_ENV,
    variables: envVars
  });
} 