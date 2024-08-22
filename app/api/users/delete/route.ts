// app/api/users/delete/route.ts
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
