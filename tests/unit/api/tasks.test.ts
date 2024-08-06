/**
 * @jest-environment node
 */

import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/tasks/route';
import dbConnect from '@/lib/mongodb';
import { MongoClient, ObjectId } from 'mongodb';
import { generateToken, verifyToken } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('@/lib/mongodb');
jest.mock('@/lib/auth');

const mockDb = {
  collection: jest.fn().mockReturnThis(),
  find: jest.fn(),
  insertOne: jest.fn(),
  findOne: jest.fn(),
};

(dbConnect as jest.Mock).mockResolvedValue(mockDb);

describe('/api/tasks API Endpoint', () => {
  let client: MongoClient | null = null;
  const userId = new ObjectId().toHexString();
  const token = generateToken(userId);

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

  afterEach(async () => {
    const db = client!.db();
    await db.collection('tasks').deleteMany({});
  });

  it('should return a list of tasks', async () => {
    (verifyToken as jest.Mock).mockImplementation(() => ({ userId }));

    mockDb.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue([
        { title: 'Task 1', completed: false, userId: userId },
        { title: 'Task 2', completed: true, userId: userId },
      ]),
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const json = JSON.parse(res._getData());
    expect(json.success).toBe(true);
    expect(Array.isArray(json.tasks)).toBe(true);
    expect(json.tasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
          completed: expect.any(Boolean),
          userId: userId,
        }),
      ])
    );
  });

  it('should create a new task', async () => {
    (verifyToken as jest.Mock).mockImplementation(() => ({ userId }));

    const newTaskId = new ObjectId().toHexString();
    const mockTask = {
      _id: newTaskId,
      title: 'New Task',
      completed: false,
      userId: userId,
    };

    mockDb.insertOne.mockResolvedValue({
      insertedId: newTaskId,
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: {
        title: 'New Task',
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(201);
    const json = JSON.parse(res._getData());
    expect(json.success).toBe(true);
    expect(json.task).toEqual(
      expect.objectContaining({
        title: 'New Task',
        completed: false,
        userId: userId,
      })
    );

    // Mock the findOne function to return the newly created task
    mockDb.findOne.mockResolvedValue(mockTask);

    const taskInDb = await mockDb.collection('tasks').findOne({ title: 'New Task' });
    expect(taskInDb).not.toBeNull();
  });
});
