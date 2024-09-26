// app/api/auth/check/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      // Log and return 401 if authorization header is missing
      console.log('Authorization Header is missing');
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const token = authorization.split(' ')[1]; // Extract the token from the header
    
    if (!token) {
      // Return 401 if token is not present in the authorization header
      console.log('Token is missing in Authorization header');
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token); // Verify the token
    
    if (!decoded) {
      // Return 401 if token verification fails
      console.log('Token verification failed');
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    // Return success response with user information
    console.log('Token verified successfully:', decoded);
    return NextResponse.json({ success: true, message: 'Authenticated', user: decoded }, { status: 200 });
    
  } catch (error) {
    // Check if error is an instance of Error and log the error message if available
    if (error instanceof Error) {
      console.error('Error in token verification:', error.message); 
      return NextResponse.json({ success: false, message: 'Invalid token', error: error.message }, { status: 401 });
    } else {
      // Handle unknown error types
      console.error('Unknown error in token verification:', error);
      return NextResponse.json({ success: false, message: 'Unknown error' }, { status: 500 });
    }
  }
}
