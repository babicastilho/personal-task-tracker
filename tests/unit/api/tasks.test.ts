// tests/unit/api/tasks.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/tasks/route';
import { MongoClient } from 'mongodb';
import dbConnect from '@/lib/mongodb';
import { addTodo } from '@/lib/todo';
import type { NextApiRequest, NextApiResponse } from 'next';

let client: MongoClient | null = null;

beforeAll(async () => {
  client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  await dbConnect();
});

afterAll(async () => {
  if (client) {
    await client.close();
    client = null;
  }
});

describe('/api/tasks API Endpoint', () => {
  afterEach(async () => {
    const db = client!.db();
    await db.collection('todos').deleteMany({});
  });

  it('should return a list of tasks', async () => {
    const db = client!.db();
    await db.collection('todos').insertMany([
      { title: 'Task 1', completed: false },
      { title: 'Task 2', completed: true },
    ]);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const tasks = JSON.parse(res._getData());

    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
          completed: expect.any(Boolean),
        }),
      ])
    );
  });

  it('should create a new task', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        title: 'New Task',
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(201);
    const createdTask = JSON.parse(res._getData());

    expect(createdTask).toEqual(
      expect.objectContaining({
        title: 'New Task',
        completed: false,
      })
    );

    const db = client!.db();
    const taskInDb = await db.collection('todos').findOne({ title: 'New Task' });
    expect(taskInDb).not.toBeNull();
  });
});
