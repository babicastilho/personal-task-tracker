// tests/unit/api/tasksId.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/tasks/[id]/route';
import { MongoClient, ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongodb';
import { addTodo } from '@/lib/todo';
import type { NextApiRequest, NextApiResponse } from 'next';

let client: MongoClient | null = null;

describe('/api/tasks/[id] API Endpoint', () => {
  let taskId: ObjectId;

  beforeAll(async () => {
    client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    await dbConnect();
  });

  beforeEach(async () => {
    const db = client!.db();
    const result = await db.collection('todos').insertOne({ title: 'Task to Test', completed: false });
    taskId = result.insertedId;
  });

  afterEach(async () => {
    const db = client!.db();
    await db.collection('todos').deleteMany({});
  });

  afterAll(async () => {
    if (client) {
      await client.close();
      client = null;
    }
  });

  it('should update a task', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
      query: { id: taskId.toString() },
      body: { completed: true },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const updatedTask = JSON.parse(res._getData());
    expect(updatedTask.success).toBe(true);

    const db = client!.db();
    const task = await db.collection('todos').findOne({ _id: taskId });
    expect(task).not.toBeNull();
    if (task) {
      expect(task.completed).toBe(true);
    }
  });

  it('should delete a task', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'DELETE',
      query: { id: taskId.toString() },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(true);

    const db = client!.db();
    const task = await db.collection('todos').findOne({ _id: taskId });
    expect(task).toBeNull();
  });
});
