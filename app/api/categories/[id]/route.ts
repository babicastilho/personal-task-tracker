// 
/**
 * app/api/categories/[id]/route.ts
 * Handles fetching and deletion of specific user categories by ID, with token-based authentication.
 * 
 * This module includes two primary operations:
 * - `GET`: Retrieves a category by its ID if it belongs to the authenticated user.
 * - `DELETE`: Deletes a category by its ID if it belongs to the authenticated user.
 * 
 * @param req - The incoming HTTP request containing an authorization token.
 * @param params - The request parameters, including the category `id`.
 * @returns JSON response indicating success with category data (for GET) or deletion confirmation (for DELETE),
 *           or an error message if access or the operation fails.
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await dbConnect();
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = new ObjectId(decoded.userId);

    // Fetch the category by ID and ensure it belongs to the authenticated user
    const category = await db.collection('categories').findOne({ _id: new ObjectId(params.id), userId });

    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found or does not belong to the user' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await dbConnect();
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = new ObjectId(decoded.userId);

    // Ensure the category to be deleted belongs to the authenticated user
    const deleteResult = await db.collection('categories').deleteOne({ _id: new ObjectId(params.id), userId });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'Category not found or does not belong to the user' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
