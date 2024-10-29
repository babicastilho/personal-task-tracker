//
// app/api/users/delete/route.ts
/**
 * Deletes a user account associated with the provided authentication token.
 * 
 * - DELETE: Verifies the user's authentication token, connects to the database, and deletes the user account
 *   associated with the token's user ID.
 * 
 * @param request - The HTTP DELETE request containing the authorization header with the token.
 * @returns JSON response with a success message upon user deletion or an error message if unauthorized or if an issue occurs.
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function DELETE(request: Request) {
  try {
    const authorization = request.headers.get('authorization');
    const token = authorization?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    const db = await dbConnect();
    const usersCollection = db.collection('users');

    await usersCollection.deleteOne({ _id: new ObjectId(decoded.userId) });

    return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
