import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Import MongoDB connection
import { ObjectId } from 'mongodb';
import { verifyToken } from '@/lib/auth'; // Import JWT token verification
import { ITask } from '@/models/Task'; // Import task model

// API route to handle dashboard data requests
export async function GET(req: Request) {
  try {
    // Get the JWT token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];

    // Verify the JWT token
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = verifyToken(token);

    // Connect to the database
    const db = await dbConnect();

    // Get collections for tasks and any other data you need
    const tasksCollection = db.collection<ITask>('tasks');

    // Query tasks for the authenticated user
    const tasks = await tasksCollection.find({ userId: new ObjectId(userId) }).toArray();

    // Separate tasks into completed and pending
    const completedTasks = tasks.filter((task) => task.completed);
    const pendingTasks = tasks.filter((task) => !task.completed);

    // Construct the dashboard data response
    const dashboardData = {
      tasksCompleted: completedTasks.length,
      tasksPending: pendingTasks.length,
      dueToday: pendingTasks.filter((task) => {
        const today = new Date().setHours(0, 0, 0, 0);
        return task.dueDate && new Date(task.dueDate).setHours(0, 0, 0, 0) === today;
      }).length,
      unreadMessages: 0, // Placeholder for unread messages (to be implemented)
    };

    return NextResponse.json({ success: true, dashboard: dashboardData });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
