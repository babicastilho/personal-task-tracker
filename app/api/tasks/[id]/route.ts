// app/api/tasks/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log("PUT request received");
    const db = await dbConnect();
    const token = req.headers.get('Authorization')?.split(' ')[1];
    console.log("Token:", token);

    if (!token) {
      console.log("No token provided");
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = new ObjectId(decoded.userId);
    const { id } = params;
    const { completed } = await req.json();
    console.log("Task ID:", id, "User ID:", userId, "Completed:", completed);

    const task = await db.collection('tasks').findOne({ _id: new ObjectId(id), userId });
    console.log("Task found:", task);

    if (!task) {
      console.log("Task not found or user mismatch");
      return NextResponse.json({ success: false, message: 'Task not found or user mismatch' }, { status: 404 });
    }

    const updateResult = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { completed } }
    );

    console.log("Update result:", updateResult);

    if (updateResult.matchedCount === 0) {
      console.log("Update failed: Task not found or user mismatch");
      return NextResponse.json({ success: false, message: 'Failed to update task' }, { status: 500 });
    }

    const updatedTask = await db.collection('tasks').findOne({ _id: new ObjectId(id), userId });
    console.log("Updated task:", updatedTask);

    return NextResponse.json({ success: true, task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log("DELETE request received");
    const db = await dbConnect();
    const token = req.headers.get('Authorization')?.split(' ')[1];
    console.log("Token:", token);

    if (!token) {
      console.log("No token provided");
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = new ObjectId(decoded.userId);
    const { id } = params;
    console.log("Task ID:", id, "User ID:", userId);

    const task = await db.collection('tasks').findOne({ _id: new ObjectId(id), userId });
    console.log("Task found:", task);

    if (!task) {
      console.log("Task not found or user mismatch");
      return NextResponse.json({ success: false, message: 'Task not found or user mismatch' }, { status: 404 });
    }

    const deleteResult = await db.collection('tasks').deleteOne({ _id: new ObjectId(id), userId });
    console.log("Delete result:", deleteResult);

    if (deleteResult.deletedCount === 0) {
      console.log("Delete failed: Task not found or user mismatch");
      return NextResponse.json({ success: false, message: 'Failed to delete task' }, { status: 500 });
    }

    console.log("Task deleted successfully");
    return NextResponse.json({ success: true, message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json({ success: false, message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
