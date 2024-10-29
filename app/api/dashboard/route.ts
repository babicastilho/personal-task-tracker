//
// app/api/dashboard/route.ts
/**
 * Handles data requests for the dashboard, providing task counts and other metrics.
 * 
 * This endpoint connects to the MongoDB database, retrieves tasks for the authenticated user,
 * and compiles a summary of task data. Currently, it returns the total task count and a placeholder
 * for unread messages.
 * 
 * @param req - The HTTP request containing the user's authorization token.
 * @returns JSON response with the user's dashboard data or an error message.
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '@/lib/auth';
import { ITask } from '@/models/Task';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    // Verify if token exists and is valid
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = verifyToken(token);

    // Connect to the database
    const db = await dbConnect();
    const tasksCollection = db.collection<ITask>('tasks');

    // Retrieve tasks for the authenticated user
    const tasks = await tasksCollection.find({ userId: new ObjectId(userId) }).toArray();

    // Build the simplified dashboard data, currently without status separation
    const dashboardData = {
      totalTasks: tasks.length,
      unreadMessages: 0, // Placeholder for future unread messages feature
    };

    return NextResponse.json({ success: true, dashboard: dashboardData });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
