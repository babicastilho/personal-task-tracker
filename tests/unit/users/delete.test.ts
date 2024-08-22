import { createMocks } from 'node-mocks-http';
import { DELETE } from '@/app/api/users/delete/route';
import dbConnect from '@/lib/mongodb';
import { generateToken, verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

jest.mock('@/lib/mongodb');
jest.mock('@/lib/auth');

const mockDb = {
  collection: jest.fn().mockReturnThis(),
  deleteOne: jest.fn(),
};

(dbConnect as jest.Mock).mockResolvedValue(mockDb);

describe('DELETE /api/users/delete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the user when authenticated', async () => {
    const userId = new ObjectId().toHexString();
    const token = generateToken(userId);

    (verifyToken as jest.Mock).mockImplementation(() => ({ userId }));

    // Create a new Headers object to simulate correct header structure
    const headers = new Headers({
      authorization: `Bearer ${token}`,
    });

    // Convert mocked request to the expected Request object
    const request = new Request('http://localhost:3000/api/users/delete', {
      method: 'DELETE',
      headers: headers,
    });

    mockDb.collection.mockReturnValue({
      deleteOne: mockDb.deleteOne.mockResolvedValue({ deletedCount: 1 }),
    });

    const response = await DELETE(request);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({
      success: true,
      message: 'User deleted successfully',
    });
  });

  it('should return 401 if no token is provided', async () => {
    // Create an empty Headers object for no token
    const headers = new Headers();

    // Convert mocked request to the expected Request object
    const request = new Request('http://localhost:3000/api/users/delete', {
      method: 'DELETE',
      headers: headers,
    });

    const response = await DELETE(request);

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      message: 'No token provided',
    });
  });

  it('should return 500 if there is a server error', async () => {
    const userId = new ObjectId().toHexString();
    const token = generateToken(userId);

    (verifyToken as jest.Mock).mockImplementation(() => ({ userId }));

    // Create a new Headers object to simulate correct header structure
    const headers = new Headers({
      authorization: `Bearer ${token}`,
    });

    // Convert mocked request to the expected Request object
    const request = new Request('http://localhost:3000/api/users/delete', {
      method: 'DELETE',
      headers: headers,
    });

    mockDb.collection.mockReturnValue({
      deleteOne: mockDb.deleteOne.mockRejectedValue(new Error('Internal server error')),
    });

    const response = await DELETE(request);

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      message: 'Internal server error',
      error: 'Internal server error',
    });
  });
});
