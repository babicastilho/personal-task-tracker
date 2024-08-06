// app/api/tasks/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import { createTask, ITask } from '@/models/Task';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await dbConnect(); // Get the database connection

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  const userId = new ObjectId(decoded.userId);

  if (req.method === 'GET') {
    // Get tasks for the authenticated user
    const tasks = await db.collection('tasks').find({ userId }).toArray();
    return res.status(200).json({ success: true, tasks });
  } else if (req.method === 'POST') {
    // Add a new task for the authenticated user
    const { title } = req.body;
    const newTask = createTask({ title, userId });
    await db.collection('tasks').insertOne(newTask);
    return res.status(201).json({ success: true, task: newTask });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
