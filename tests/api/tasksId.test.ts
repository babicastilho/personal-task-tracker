import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/tasks/[id]/route';
import dbConnect from '@/lib/mongodb';
import Todo, { ITodo } from '@/models/Todo'; 
import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

describe('/api/tasks/[id] API Endpoint', () => {
  let taskId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await dbConnect();
  });

  beforeEach(async () => {
    // Create a task and assign its _id to taskId
    const task: ITodo = await Todo.create({ title: 'Task to Test', completed: false });
    taskId = task._id as mongoose.Types.ObjectId; // Explicitly typecast to ObjectId
  });

  afterEach(async () => {
    await Todo.deleteMany({});
  });

  it('should update a task', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
      query: { id: taskId.toString() }, // Convert ObjectId to string
      body: { completed: true },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const updatedTask = JSON.parse(res._getData());
    expect(updatedTask.data).toHaveProperty('completed', true);
  });

  it('should delete a task', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'DELETE',
      query: { id: taskId.toString() }, // Convert ObjectId to string
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    const responseData = JSON.parse(res._getData());
    expect(responseData).toEqual({ success: true, data: {} });
  });
});
