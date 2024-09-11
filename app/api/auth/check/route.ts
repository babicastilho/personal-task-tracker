// app/api/auth/check/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get('authorization');
    console.log('Authorization Header:', authorization); // Log to check the authorization header

    const token = authorization?.split(' ')[1];
    console.log('Token:', token); // Log to check the token

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    console.log('Decoded Token:', decoded); // Log to ensure verifyToken is called

    return NextResponse.json({ success: true, message: 'Authenticated', user: decoded }, { status: 200 });
  } catch (error) {
    console.error('Error in GET handler:', error); // Detailed log for error
    return NextResponse.json({ success: false, message: 'Invalid token', error: (error as Error).message }, { status: 401 });
  }
}
