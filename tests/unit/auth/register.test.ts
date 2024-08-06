/**
 * @jest-environment node
 */

import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/auth/register/route';
import dbConnect from '@/lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

jest.mock('@/lib/mongodb');

const mockDb = {
  collection: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
};

(dbConnect as jest.Mock).mockResolvedValue(mockDb);

describe('POST /api/auth/register', () => {
  it('should return 201 when user is registered successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      },
    });

    mockDb.collection.mockReturnValue({
      findOne: mockDb.findOne.mockResolvedValue(null),
      insertOne: mockDb.insertOne.mockResolvedValue({
        insertedId: new ObjectId(),
      }),
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    console.log('Response status:', res._getStatusCode());
    console.log('Response data:', res._getJSONData());

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'User registered successfully',
      token: expect.any(String),
    });
  });

  it('should return 409 when user already exists', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      },
    });

    mockDb.collection.mockReturnValue({
      findOne: mockDb.findOne.mockResolvedValue({ email: 'test@example.com' }),
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    console.log('Response status:', res._getStatusCode());
    console.log('Response data:', res._getJSONData());

    expect(res._getStatusCode()).toBe(409);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'User already exists',
    });
  });

  it('should return 500 when there is an internal server error', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      },
    });

    mockDb.collection.mockReturnValue({
      findOne: mockDb.findOne.mockRejectedValue(new Error('Internal server error')),
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    console.log('Response status:', res._getStatusCode());
    console.log('Response data:', res._getJSONData());

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Internal server error',
    });
  });
});
