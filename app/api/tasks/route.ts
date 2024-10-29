//
// app/api/tasks/route.ts
/**
 * Handles task-related API requests, including retrieving and creating tasks for authenticated users.
 * 
 * - GET: Fetches all tasks for the authenticated user, marking overdue tasks based on their due dates.
 * - POST: Validates and creates a new task for the authenticated user, including optional due dates, times, and priorities.
 * 
 * @param req - The HTTP request object, containing headers and body data.
 * @returns JSON response with task data or error messages, depending on the operation and outcome.
 */

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { createTask } from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  console.log("API GET request initiated");
  try {
    const db = await dbConnect();
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const userId = new ObjectId(decoded.userId);

    // Fetch all tasks for the authenticated user
    const tasks = await db.collection("tasks").find({ userId }).toArray();

    // Log the tasks retrieved from the database
    console.log("Retrieved tasks:", tasks);

    const currentDate = new Date();
    const tasksWithOverdueStatus = tasks.map(task => ({
      ...task,
      overdue: task.dueDate && new Date(task.dueDate) < currentDate,
      dueDate: task.dueDate, // Ensure dueDate is returned
      dueTime: task.dueTime, // Ensure dueTime is returned
    }));

    // Log tasks after processing for overdue status
    console.log("Processed tasks with dueDate and dueTime:", tasksWithOverdueStatus);

    return NextResponse.json(
      { success: true, tasks: tasksWithOverdueStatus },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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

    // Extract task details from request body
    const { title, resume, description, dueDate, dueTime, priority } = await req.json();

    // Validate priority field
    const validPriorities = ['highest', 'high', 'medium', 'low', 'lowest'];
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { success: false, message: 'Invalid priority level' },
        { status: 400 }
      );
    }

    // Process dueDate and dueTime
    let processedDueDate: Date | undefined = undefined;
    if (dueDate) {
      processedDueDate = new Date(dueDate);

      if (dueTime) {
        const [hours, minutes] = dueTime.split(":").map(Number);
        processedDueDate.setHours(hours, minutes, 0);
      } else {
        processedDueDate.setHours(23, 59, 0); // Default to end of day
      }
    }

    // Create a new task with validated priority
    const newTask = createTask({
      title,
      resume,
      description,
      userId,
      dueDate: processedDueDate,
      dueTime: dueTime || undefined,
      priority
    });

    await db.collection('tasks').insertOne(newTask);

    return NextResponse.json(
      { success: true, task: { ...newTask, dueDate: newTask.dueDate || null, dueTime: newTask.dueTime || null } }, 
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

