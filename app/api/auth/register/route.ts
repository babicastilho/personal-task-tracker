// 
/**
 * app/api/auth/register/route.ts
 * Handles user registration by creating new user entries in the database and generating JWT tokens.
 * 
 * Validates username, email, and password fields, checks for existing users, creates new user entries,
 * and generates a JWT token upon successful registration.
 * 
 * @param request - The POST request containing username, email, and password in JSON format.
 * @returns A JSON response indicating registration success with a JWT token or an error message.
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { IUser, createUser } from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const db = await dbConnect();
    const usersCollection = db.collection<IUser>('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 409 });
    }

    const newUser: IUser = { username, email, password } as IUser;
    const createdUser = await createUser(usersCollection, newUser);

    const token = generateToken(createdUser._id!.toHexString());

    return NextResponse.json({ success: true, message: 'User registered successfully', token }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}

