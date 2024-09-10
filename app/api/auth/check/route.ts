// app/api/auth/check/route.ts

import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth'; // JWT verification function
import dbConnect from '@/lib/mongodb'; // MongoDB connection
import { ObjectId } from 'mongodb'; // For querying the database with ObjectId

export async function GET(request: Request) {
  try {
    // Extract the authorization header from the request
    const authorization = request.headers.get('authorization');
    // Extract the token from the authorization header
    const token = authorization?.split(' ')[1];

    // If the token is not provided, return a 401 Unauthorized response
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    // Verify the token and extract the user information from the payload
    const decoded = verifyToken(token);

    // Connect to the MongoDB database
    const db = await dbConnect();
    const usersCollection = db.collection('users');

    // Find the user in the database using the decoded userId
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

    // If the user is not found, return a 404 Not Found response
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Extract relevant user information from the database response
    const { _id, username, firstName, lastName, nickname, profilePicture, preferredNameOption } = user;

    // Return the user information (without sensitive data like password)
    return NextResponse.json({
      success: true,
      message: 'Authenticated',
      user: {
        _id,               // User ID
        username,          // Username of the user
        firstName,         // First name of the user
        lastName,          // Last name of the user
        nickname,          // Nickname of the user
        profilePicture,    // Profile picture URL
        preferredNameOption, // Option for how the user prefers to be addressed
      },
    }, { status: 200 });
  } catch (error) {
    // Return a 401 Unauthorized response if token verification fails or other errors occur
    return NextResponse.json({ success: false, message: 'Invalid token', error: (error as Error).message }, { status: 401 });
  }
}
