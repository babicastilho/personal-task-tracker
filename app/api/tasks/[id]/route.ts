// app/api/tasks/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await dbConnect();
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = new ObjectId(decoded.userId);

    // Fetch the task by id and userId to ensure ownership
    const task = await db.collection("tasks").findOne({ _id: new ObjectId(params.id), userId });

    if (!task) {
      return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, task }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error", error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await dbConnect();
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Get the token from the request headers

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token); // Verify the token using JWT
    const userId = new ObjectId(decoded.userId);

    // Extract the updated task details, including resume and description
    const { title, resume, description, completed, priority, dueDate } = await req.json(); 

    // Find the task to be updated and verify that it belongs to the user
    const task = await db.collection('tasks').findOne({ _id: new ObjectId(params.id), userId });

    if (!task) {
      return NextResponse.json({ success: false, message: 'Task not found or does not belong to the user' }, { status: 404 });
    }

    // Build the update object, including resume, description, title, priority, and completed status
    const updateFields: any = {
      title,
      resume,        // Add resume to the update
      description,   // Add description to the update
      completed,
      priority,
    };

    if (dueDate) {
      updateFields.dueDate = new Date(dueDate); // Update dueDate if provided
    }

    await db.collection('tasks').updateOne(
      { _id: new ObjectId(params.id), userId },
      { $set: updateFields }
    );

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
