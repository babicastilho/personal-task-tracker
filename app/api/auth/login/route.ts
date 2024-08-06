// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyPassword, IUser } from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    const db = await dbConnect();
    const usersCollection = db.collection<IUser>('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken(user._id.toString());
    return NextResponse.json({ success: true, token, message: 'Logged in successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
