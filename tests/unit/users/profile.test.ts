import { GET } from '@/app/api/users/profile/route';
import { createMocks } from 'node-mocks-http';
import { jest } from '@jest/globals'; // Ensure Jest is correctly imported

describe('User Profile API', () => {

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should handle invalid or missing tokens', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    // Simulating headers.get to return no authorization
    (req.headers as { get?: jest.Mock }).get = jest.fn().mockReturnValueOnce(null);

    await GET(req as unknown as Request, res);

    const statusCode = res._getStatusCode();
    console.log('Status Code returned:', statusCode); // Debug to check the status code

    expect(statusCode).toBe(401); // Expect 401 for missing token

    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe('No token provided');
  });

  it('should return 401 for an invalid token', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        Authorization: 'Bearer invalidToken',
      },
    });

    (req.headers as { get?: jest.Mock }).get = jest.fn().mockReturnValueOnce('Bearer invalidToken');

    // Mocking verifyToken to throw an error for an invalid token
    const verifyTokenMock = jest.spyOn(require('@/lib/auth'), 'verifyToken').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await GET(req as unknown as Request, res);

    expect(verifyTokenMock).toHaveBeenCalledWith('invalidToken');

    const statusCode = res._getStatusCode();
    console.log('Status Code returned:', statusCode); // Debug to check the status code

    expect(statusCode).toBe(401); // Expect 401 for invalid token

    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe('Invalid token');

    verifyTokenMock.mockRestore();
  });
});
