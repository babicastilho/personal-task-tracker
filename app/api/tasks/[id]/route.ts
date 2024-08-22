// app/api/tasks/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await dbConnect();
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = new ObjectId(decoded.userId);
    const { completed } = await req.json();

    // Ensure the task belongs to the authenticated user before updating
    const task = await db.collection('tasks').findOne({ _id: new ObjectId(params.id), userId });

    if (!task) {
      return NextResponse.json({ success: false, message: 'Task not found or does not belong to the user' }, { status: 404 });
    }

    await db.collection('tasks').updateOne({ _id: new ObjectId(params.id), userId }, { $set: { completed } });

    const updatedTask = await db.collection('tasks').findOne({ _id: new ObjectId(params.id), userId });

    return NextResponse.json({ success: true, task: updatedTask }, { status: 200 });
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

    // Ensure the task to be deleted belongs to the authenticated user
    const deleteResult = await db.collection('tasks').deleteOne({ _id: new ObjectId(params.id), userId });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'Task not found or does not belong to the user' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
