// app/api/auth/check/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get('authorization');
    const token = authorization?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    return NextResponse.json({ success: true, message: 'Authenticated', user: decoded }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid token', error: (error as Error).message }, { status: 401 });
  }
}
