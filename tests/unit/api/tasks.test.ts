// tests/unit/api/tasks.test.ts

import { createMocks } from 'node-mocks-http';
import { GET, POST } from '@/app/api/tasks/route';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

jest.mock('@/lib/mongodb');
jest.mock('@/lib/auth');

const mockDb = {
  collection: jest.fn().mockReturnThis(),
  find: jest.fn(),
  insertOne: jest.fn(),
};

(dbConnect as jest.Mock).mockResolvedValue(mockDb);

describe('/api/tasks API Endpoint', () => {
  const userId = new ObjectId().toHexString();
  const token = `Bearer ${userId}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of tasks', async () => {
    (verifyToken as jest.Mock).mockImplementation(() => ({ userId }));

    mockDb.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue([
        { title: 'Task 1', completed: false, userId: userId },
        { title: 'Task 2', completed: true, userId: userId },
      ]),
    });

    // Creates Headers object correctly
    const headers = new Headers({
      authorization: `Bearer ${token}`,
    });

    // Create a Request for the test
    const request = new Request('http://localhost:3000/api/tasks', {
      method: 'GET',
      headers: headers,
    });

    const response = await GET(request);

    expect(response.status).toBe(200);
    const json = await response.json();
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
      resume: 'Task summary', // Campo resume
      userId: userId,
    };
  
    mockDb.insertOne.mockResolvedValue({
      insertedId: newTaskId,
    });
  
    const headers = new Headers({
      authorization: `Bearer ${token}`,
    });
  
    const request = new Request('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        title: 'New Task',
        resume: 'Task summary', 
      }),
    });
  
    const response = await POST(request);
  
    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.task).toEqual(
      expect.objectContaining({
        title: 'New Task',
        resume: 'Task summary', 
        userId: userId,
      })
    );
  });  
});
