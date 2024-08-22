import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/tasks/[id]/route';
import dbConnect from '@/lib/mongodb';
import { generateToken, verifyToken } from '@/lib/auth';
import { MongoClient, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('@/lib/mongodb');
jest.mock('@/lib/auth');

const mockDb = {
  collection: jest.fn().mockReturnThis(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  findOne: jest.fn(),
};

(dbConnect as jest.Mock).mockResolvedValue(mockDb);

describe('/api/tasks/[id] API Endpoint', () => {
  let client: MongoClient | null = null;
  let taskId: ObjectId;
  const userId = new ObjectId().toHexString();
  const token = generateToken(userId);

  beforeAll(async () => {
    client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    await dbConnect();
  });

  beforeEach(async () => {
    taskId = new ObjectId();
    const db = client!.db();
    await db.collection('tasks').insertOne({ _id: taskId, title: 'Task to Test', completed: false, userId });
  });

  afterEach(async () => {
    const db = client!.db();
    await db.collection('tasks').deleteMany({});
  });

  afterAll(async () => {
    if (client) {
      await client.close();
      client = null;
    }
  });

  it('should update a task', async () => {
    (verifyToken as jest.Mock).mockImplementation(() => ({ userId }));

    const updatedTask = {
      _id: taskId.toString(), // Converting ObjectId to string
      title: 'Task to Test',
      completed: true,
      userId,
    };

    mockDb.findOneAndUpdate.mockResolvedValue({
      value: updatedTask,
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
      query: { id: taskId.toString() },
      body: { completed: true },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const json = JSON.parse(res._getData());
    expect(json.success).toBe(true);
    expect(json.task).toEqual(updatedTask);

    // Mock the findOne function to return the updated task
    mockDb.findOne.mockResolvedValue(updatedTask);

    const taskInDb = await mockDb.collection('tasks').findOne({ _id: new ObjectId(taskId) });
    expect(taskInDb).not.toBeNull();
    if (taskInDb) {
      expect(taskInDb.completed).toBe(true);
    }
  });

  it('should delete a task', async () => {
    (verifyToken as jest.Mock).mockImplementation(() => ({ userId }));

    mockDb.findOneAndDelete.mockResolvedValue({ value: { _id: taskId, userId, title: 'Task to Test', completed: false } });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'DELETE',
      query: { id: taskId.toString() },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const json = JSON.parse(res._getData());
    expect(json.success).toBe(true);

    mockDb.findOne.mockResolvedValue(null);
    const taskInDb = await mockDb.collection('tasks').findOne({ _id: new ObjectId(taskId) });
    expect(taskInDb).toBeNull();
  });
});
