/**
 * @jest-environment node
 */

import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/auth/login/route';
import dbConnect from '@/lib/mongodb';
import { verifyPassword } from '@/models/User';
import { generateToken } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('@/lib/mongodb');
jest.mock('@/models/User');
jest.mock('@/lib/auth');

const mockDb = {
  collection: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
};

(dbConnect as jest.Mock).mockResolvedValue(mockDb);

describe('POST /api/auth/login', () => {
  it('should return 200 when login is successful', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    mockDb.collection.mockReturnValue({
      findOne: mockDb.findOne.mockResolvedValue({
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedpassword',
      }),
    });

    (verifyPassword as jest.Mock).mockResolvedValue(true);
    (generateToken as jest.Mock).mockReturnValue('token');

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      token: 'token',
      message: 'Logged in successfully',
    });
  });

  it('should return 401 when password is incorrect', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'wrongpassword',
      },
    });

    mockDb.collection.mockReturnValue({
      findOne: mockDb.findOne.mockResolvedValue({
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedpassword',
      }),
    });

    (verifyPassword as jest.Mock).mockResolvedValue(false);

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Invalid credentials',
    });
  });
});
