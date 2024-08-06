/**
 * @jest-environment node
 */

import { createMocks } from 'node-mocks-http';
import { GET } from '@/app/api/auth/check/route';
import { verifyToken } from '@/lib/auth';

jest.mock('@/lib/auth');

describe('GET /api/auth/check', () => {
  it('should return 200 when token is valid', async () => {
    const { req } = createMocks({
      method: 'GET',
      headers: {
        authorization: 'Bearer validtoken',
      },
    });

    (verifyToken as jest.Mock).mockImplementation(() => ({ userId: 'userId' }));

    const response = await GET(new Request('http://localhost:3000/api/auth/check', {
      method: 'GET',
      headers: req.headers as HeadersInit,
    }));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({
      success: true,
      message: 'Authenticated',
      user: { userId: 'userId' },
    });
  });

  it('should return 401 when token is invalid', async () => {
    const { req } = createMocks({
      method: 'GET',
      headers: {
        authorization: 'Bearer invalidtoken',
      },
    });

    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const response = await GET(new Request('http://localhost:3000/api/auth/check', {
      method: 'GET',
      headers: req.headers as HeadersInit,
    }));

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      message: 'Invalid token',
      error: 'Invalid token',
    });
  });

  it('should return 401 when no token is provided', async () => {
    const { req } = createMocks({
      method: 'GET',
    });

    const response = await GET(new Request('http://localhost:3000/api/auth/check', {
      method: 'GET',
    }));

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      message: 'No token provided',
    });
  });
});
