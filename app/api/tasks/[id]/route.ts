// app/api/tasks/[id]/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// Handler to update and delete a task
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await dbConnect(); // Get the database connection

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  const userId = new ObjectId(decoded.userId);
  const { id } = req.query;

  if (req.method === 'PUT') {
    // Update a task
    const { completed } = req.body;
    const result = await db.collection('tasks').findOneAndUpdate(
      { _id: new ObjectId(id as string), userId },
      { $set: { completed } },
      { returnDocument: 'after' }
    );
    if (!result) {
      return res.status(500).json({ success: false, message: 'Failed to update task' });
    }
    const updatedTask = result.value;
    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return res.status(200).json({ success: true, task: updatedTask });
  } else if (req.method === 'DELETE') {
    // Delete a task
    const result = await db.collection('tasks').findOneAndDelete({ _id: new ObjectId(id as string), userId });
    if (!result) {
      return res.status(500).json({ success: false, message: 'Failed to delete task' });
    }
    const deletedTask = result.value;
    if (!deletedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return res.status(200).json({ success: true, task: deletedTask });
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


