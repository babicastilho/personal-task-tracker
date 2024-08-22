import { createMocks } from 'node-mocks-http';
import { GET } from '@/app/api/auth/check/route';
import { verifyToken } from '@/lib/auth';

jest.mock('@/lib/auth');

describe('GET /api/auth/check', () => {
  it('should return 200 when token is valid', async () => {
    // Mock request with authorization header
    const { req } = createMocks({
      method: 'GET',
      headers: {
        authorization: 'Bearer validtoken',
      },
    });

    // Mock verifyToken to return a decoded user
    (verifyToken as jest.Mock).mockImplementation(() => ({ userId: 'userId' }));

    // Create a new Headers object to simulate correct header structure
    const headers = new Headers({
      authorization: 'Bearer validtoken',
    });

    // Convert mocked request to the expected Request object
    const request = new Request('http://localhost:3000/api/auth/check', {
      method: 'GET',
      headers: headers,
    });

    // Call the GET handler
    const response = await GET(request);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({
      success: true,
      message: 'Authenticated',
      user: { userId: 'userId' },
    });
  });

  it('should return 401 when token is invalid', async () => {
    // Mock request with invalid token
    const { req } = createMocks({
      method: 'GET',
      headers: {
        authorization: 'Bearer invalidtoken',
      },
    });

    // Mock verifyToken to throw an error
    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Create a new Headers object to simulate correct header structure
    const headers = new Headers({
      authorization: 'Bearer invalidtoken',
    });

    // Convert mocked request to the expected Request object
    const request = new Request('http://localhost:3000/api/auth/check', {
      method: 'GET',
      headers: headers,
    });

    // Call the GET handler
    const response = await GET(request);

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      message: 'Invalid token',
      error: 'Invalid token',
    });
  });

  it('should return 401 when no token is provided', async () => {
    // Mock request without any headers
    const { req } = createMocks({
      method: 'GET',
    });

    // Create an empty Headers object
    const headers = new Headers();

    // Convert mocked request to the expected Request object
    const request = new Request('http://localhost:3000/api/auth/check', {
      method: 'GET',
      headers: headers,
    });

    // Call the GET handler
    const response = await GET(request);

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      message: 'No token provided',
    });
  });
});
