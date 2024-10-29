// 
/**
 * app/api/categories/route.ts
 * Manages retrieval and creation of user-specific categories with authentication.
 * 
 * This module includes two main functions:
 * - `GET`: Retrieves all categories associated with the authenticated user.
 * - `POST`: Creates a new category for the authenticated user with the provided name and optional description.
 * 
 * @param req - The incoming HTTP request containing an authorization token and, for POST, the category data.
 * @returns JSON response with category data for GET, or creation confirmation for POST. 
 *          Returns error messages if access or the operation fails.
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { createCategory } from '@/models/Category';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    const db = await dbConnect();
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = new ObjectId(decoded.userId);

    // Fetch categories only for the authenticated user
    const categories = await db.collection('categories').find({ userId }).toArray();
    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await dbConnect();
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = new ObjectId(decoded.userId);
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
    }

    // Create category and associate it with the authenticated user
    const newCategory = createCategory({ name, description, userId });
    await db.collection('categories').insertOne(newCategory);

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
