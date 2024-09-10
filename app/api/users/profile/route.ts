import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth'; // Function to verify JWT
import dbConnect from '@/lib/mongodb'; // Function to connect to MongoDB
import { ObjectId } from 'mongodb';

// GET request to fetch the user profile
export async function GET(request: Request) {
  try {
    // Get the authorization token from the request header
    const authorization = request.headers.get('authorization');
    const token = authorization?.split(' ')[1];

    if (!token) {
      // Return a 401 response if the token is missing
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    // Verify the token and extract the user ID from the payload
    const decoded = verifyToken(token);
    const db = await dbConnect();
    const usersCollection = db.collection('users');

    // Find the user in the database by the decoded user ID
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      // Return a 404 response if the user is not found
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Return the user profile data
    return NextResponse.json({ success: true, profile: user }, { status: 200 });
  } catch (error) {
    // Safely check if the error is an instance of Error before accessing the message property
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: 'Failed to fetch profile', error: error.message }, { status: 500 });
    } else {
      // Handle unknown error types
      return NextResponse.json({ success: false, message: 'Unknown error occurred', error: 'Unknown error' }, { status: 500 });
    }
  }
}

// POST request to update the user profile
export async function POST(request: Request) {
  try {
    // Get the authorization token from the request header
    const authorization = request.headers.get('authorization');
    const token = authorization?.split(' ')[1];

    if (!token) {
      // Return a 401 response if the token is missing
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    // Verify the token and extract the user ID from the payload
    const decoded = verifyToken(token);
    const db = await dbConnect();
    const usersCollection = db.collection('users');

    // Find the user in the database by the decoded user ID
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      // Return a 404 response if the user is not found
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Get the updated profile data from the request body
    const { firstName, lastName, nickname, bio, profilePicture, preferredNameOption } = await request.json();

    // Update the user's profile in the database
    const updatedProfile = await usersCollection.updateOne(
      { _id: user._id }, // Query to find the user by their ID
      {
        $set: {
          firstName,        // Update first name
          lastName,         // Update last name
          nickname,         // Update nickname
          bio,              // Update bio
          profilePicture,   // Update profile picture
          preferredNameOption // Update preferred name option
        },
      }
    );

    if (!updatedProfile.acknowledged) {
      // Return a 500 response if the update operation failed
      return NextResponse.json({ success: false, message: 'Failed to update profile' }, { status: 500 });
    }

    // Return a success response when the profile is successfully updated
    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    // Safely check if the error is an instance of Error before accessing the message property
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: 'Failed to update profile', error: error.message }, { status: 500 });
    } else {
      // Handle unknown error types
      return NextResponse.json({ success: false, message: 'Unknown error occurred', error: 'Unknown error' }, { status: 500 });
    }
  }
}
