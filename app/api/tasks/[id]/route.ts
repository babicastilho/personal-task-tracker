//
// app/api/tasks/[id]/route.ts
/**
 * Handles API requests for specific task operations, including fetching, updating, and deleting tasks
 * for authenticated users based on task ID.
 * 
 * - GET: Retrieves a specific task by ID for the authenticated user, ensuring ownership.
 * - PUT: Updates the task's details, such as title, description, priority, and due date, for the authenticated user.
 * - DELETE: Removes a specific task by ID for the authenticated user, confirming user ownership.
 * 
 * @param req - The HTTP request containing headers and data for task operations.
 * @param params - The URL parameters, including the task ID.
 * @returns JSON response indicating success or failure, including task data or error messages as needed.
 */

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
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const userId = new ObjectId(decoded.userId);

    // Extract updated task details from request body
    const { title, resume, description, categoryId, completed, priority, dueDate, dueTime } = await req.json();

    // Validate priority field for update
    const validPriorities = ['highest', 'high', 'medium', 'low', 'lowest'];
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { success: false, message: 'Invalid priority level' },
        { status: 400 }
      );
    }

    // Prepare fields to update
    const updateFields: any = {
      title,
      resume,
      categoryId,
      description,
      completed,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      dueTime,
    };

    Object.keys(updateFields).forEach(
      key => updateFields[key] === undefined && delete updateFields[key]
    );

    // Update the task in the database, ensuring ownership
    const task = await db.collection('tasks').findOne({ _id: new ObjectId(params.id), userId });
    if (!task) {
      return NextResponse.json(
        { success: false, message: 'Task not found or does not belong to the user' },
        { status: 404 }
      );
    }

    await db.collection('tasks').updateOne(
      { _id: new ObjectId(params.id), userId },
      { $set: updateFields }
    );

    const updatedTask = await db.collection('tasks').findOne({ _id: new ObjectId(params.id), userId });

    return NextResponse.json(
      { success: true, task: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: (error as Error).message },
      { status: 500 }
    );
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
