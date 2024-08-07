# API Endpoints Documentation

## `/api/auth/check`

**GET** - Check authentication status

```javascript
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  try {
    const decoded = verifyToken(token);
    return NextResponse.json({ authenticated: true, user: decoded }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
```


## `/api/users/delete`

**DELETE** - Handle user deletion

```javascript
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function DELETE(req: Request) {
  const db = await dbConnect();
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  const userId = new ObjectId(decoded.userId);

  const deleteResult = await db.collection('users').deleteOne({ _id: userId });

  if (deleteResult.deletedCount === 0) {
    return NextResponse.json({ success: false, message: 'Failed to delete user' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
}
```


## `/api/auth/login`

**POST** - Handle user login

```javascript
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyUser } from '@/lib/auth';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const db = await dbConnect();
  const user = await db.collection('users').findOne({ email });

  if (!user || !verifyUser(user, password)) {
    return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

  return NextResponse.json({ success: true, token }, { status: 200 });
}
```


## `/api/auth/register`

**POST** - Handle user registration

```javascript
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  const { username, email, password } = await req.json();
  const db = await dbConnect();
  const existingUser = await db.collection('users').findOne({ email });

  if (existingUser) {
    return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);
  const newUser = {
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection('users').insertOne(newUser);

  return NextResponse.json({ success: true, user: newUser }, { status: 201 });
}
```


## `/api/tasks`

**GET** - Retrieve all tasks

**POST** - Retrieve all tasks

```javascript
import { NextApiRequest, NextApiResponse } from 'next';
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
```

## `/api/tasks/[id]`

**GET** - Retrieve a specific task by ID

**PUT** - Update a task by ID

**DELETE** - Delete a task by ID

```javascript
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
```

