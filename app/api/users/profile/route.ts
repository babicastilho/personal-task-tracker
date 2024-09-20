import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth'; // Function to verify JWT
import dbConnect from '@/lib/mongodb'; // Function to connect to MongoDB
import { ObjectId } from 'mongodb';

// Function to send a response based on the environment (tests or production)
function sendResponse(res: any, body: any, status: number) {
  if (res && typeof res.statusCode !== 'undefined') {
    // Use res.statusCode and res.json in test environment
    res.statusCode = status;
    return res.json(body);
  } else {
    // Use NextResponse.json in production (Next.js)
    return NextResponse.json(body, { status });
  }
}

// GET request to fetch the user profile
export async function GET(request: Request, res?: any) {
  try {
    const authorization = request.headers.get('authorization');
    const token = authorization?.split(' ')[1];

    if (!token) {
      // Return a 401 response if the token is missing
      return sendResponse(res, { success: false, message: 'No token provided' }, 401);
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      // Return 401 if the token is invalid
      return sendResponse(res, { success: false, message: 'Invalid token' }, 401);
    }

    const db = await dbConnect();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      // Return a 404 response if the user is not found
      return sendResponse(res, { success: false, message: 'User not found' }, 404);
    }

    // Return the user profile data
    return sendResponse(res, { success: true, profile: user }, 200);
  } catch (error) {
    // Handle unexpected errors and return 500
    const message = error instanceof Error ? error.message : 'Unknown error';
    return sendResponse(res, { success: false, message: 'Failed to fetch profile', error: message }, 500);
  }
}


// POST request to update the user profile
export async function POST(request: Request, res?: any) {
  try {
    const authorization = request.headers.get('authorization');
    const token = authorization?.split(' ')[1];

    if (!token) {
      // Return a 401 response if the token is missing
      return sendResponse(res, { success: false, message: 'No token provided' }, 401);
    }

    const decoded = verifyToken(token);
    const db = await dbConnect();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      // Return a 404 response if the user is not found
      return sendResponse(res, { success: false, message: 'User not found' }, 404);
    }

    const { firstName, lastName, nickname, bio, profilePicture, preferredNameOption } = await request.json();

    // Update the user's profile in the database
    const updatedProfile = await usersCollection.updateOne(
      { _id: user._id }, 
      {
        $set: {
          firstName, 
          lastName, 
          nickname, 
          bio, 
          profilePicture, 
          preferredNameOption 
        },
      }
    );

    if (!updatedProfile.acknowledged) {
      // Return a 500 response if the update operation failed
      return sendResponse(res, { success: false, message: 'Failed to update profile' }, 500);
    }

    // Return a success response when the profile is successfully updated
    return sendResponse(res, { success: true, message: 'Profile updated successfully' }, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    // Return a 500 response in case of server errors
    return sendResponse(res, { success: false, message: 'Failed to update profile', error: message }, 500);
  }
}
