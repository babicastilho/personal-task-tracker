/**
 * @jest-environment node
 */

import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/auth/check/route';
import { verifyToken } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('@/lib/auth');

describe('GET /api/auth/check', () => {
  it('should return 200 when token is valid', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        authorization: 'Bearer validtoken',
      },
    });

    (verifyToken as jest.Mock).mockImplementation(() => ({ userId: 'userId' }));

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      success: true,
      message: 'Authenticated',
      user: { userId: 'userId' },
    });
  });

  it('should return 401 when token is invalid', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        authorization: 'Bearer invalidtoken',
      },
    });

    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({
      success: false,
      message: 'Invalid token',
      error: 'Invalid token',
    });
  });
});
