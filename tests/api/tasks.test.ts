import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/tasks/route';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';
import type { NextApiRequest, NextApiResponse } from 'next';

describe('/api/tasks API Endpoint', () => {
  // Connect to the database before running the tests
  beforeAll(async () => {
    await dbConnect();
  });

  // Cleanup after all tests
  afterAll(async () => {
    await Todo.deleteMany({});
  });

  // Test for listing all tasks
  it('should return a list of tasks', async () => {
    // Create some tasks to test listing
    await Todo.create({ title: 'Task 1', completed: false });
    await Todo.create({ title: 'Task 2', completed: true });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const tasks = JSON.parse(res._getData());

    expect(Array.isArray(tasks.data)).toBe(true);
    expect(tasks.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
          completed: expect.any(Boolean),
        }),
      ])
    );
  });

  // Test for creating a new task
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

    expect(createdTask.data).toEqual(
      expect.objectContaining({
        title: 'New Task',
        completed: false,
      })
    );

    // Cleanup after the test
    await Todo.deleteOne({ title: 'New Task' });
  });
});
