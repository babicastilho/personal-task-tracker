// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { createTask, ITask } from '@/models/Task';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  const db = await dbConnect();
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  const userId = new ObjectId(decoded.userId);

  const tasks = await db.collection('tasks').find({ userId }).toArray();
  return NextResponse.json({ success: true, tasks }, { status: 200 });
}

export async function POST(req: Request) {
  const db = await dbConnect();
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  const userId = new ObjectId(decoded.userId);
  const { title } = await req.json();

  if (!title) {
    return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
  }

  const newTask = createTask({ title, userId });
  await db.collection('tasks').insertOne(newTask);
  return NextResponse.json({ success: true, task: newTask }, { status: 201 });
}
