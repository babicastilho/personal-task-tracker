import { GET, POST } from '@/app/api/users/profile/route';
import { DELETE } from '@/app/api/users/delete/route';
import { createMocks } from 'node-mocks-http';
import { generateToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * Helper function to simulate a Next.js request and response.
 */
const mockRequestResponse = (method: 'GET' | 'POST', url: string, token?: string, body?: any) => {
  const { req, res } = createMocks({
    method,
    url,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    body,
  });

  return { req, res };
};

describe('User Profile API', () => {
  let token: string;
  let userId: ObjectId;

  beforeAll(async () => {
    // Connect to the database and create a user for testing
    const db = await dbConnect();
    const usersCollection = db.collection('users');

    // Create a new user in the database
    const newUser = await usersCollection.insertOne({
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      bio: 'This is a test user.',
      preferredNameOption: 'name',
    });

    userId = newUser.insertedId;

    // Generate a token for the created user
    token = generateToken(userId.toString());

    console.log('Generated Token:', token);
  });

  it('should return correct user profile with GET', async () => {
    const { req, res } = mockRequestResponse('GET', '/api/users/profile', token);

    // Call the GET handler directly
    await GET(req, res);

    const statusCode = res._getStatusCode();
    console.log('GET Profile Status:', statusCode);
    expect(statusCode).toBe(200);

    const responseData = res._getData();
    console.log('GET Profile Response Data:', responseData);
    expect(responseData).toBeTruthy();

    const parsedData = JSON.parse(responseData);
    expect(parsedData.success).toBe(true);
    expect(parsedData.profile).toHaveProperty('username', 'testuser');
  });

  it('should update user profile with POST', async () => {
    const updatedProfile = {
      firstName: 'NewName',
      lastName: 'NewLastName',
      bio: 'Updated Bio',
    };

    const { req, res } = mockRequestResponse('POST', '/api/users/profile', token, updatedProfile);

    // Call the POST handler directly
    await POST(req, res);

    const statusCode = res._getStatusCode();
    console.log('POST Profile Update Status:', statusCode);
    expect(statusCode).toBe(200);

    const responseData = res._getData();
    console.log('POST Profile Update Response Data:', responseData);
    expect(responseData).toBeTruthy();

    const parsedData = JSON.parse(responseData);
    expect(parsedData.success).toBe(true);
    expect(parsedData.message).toBe('Profile updated successfully');
  });

  it('should handle invalid or missing tokens', async () => {
    const { req, res } = mockRequestResponse('GET', '/api/users/profile');

    // Call the GET handler directly without a token
    await GET(req, res);

    const statusCode = res._getStatusCode();
    console.log('GET Profile with Missing Token Status:', statusCode);
    expect(statusCode).toBe(401);

    const responseData = res._getData();
    expect(responseData).toBeTruthy();

    const parsedData = JSON.parse(responseData);
    expect(parsedData.success).toBe(false);
    expect(parsedData.message).toBe('No token provided');
  });

  it('should return preferred name correctly based on preference', async () => {
    const { req, res } = mockRequestResponse('GET', '/api/users/profile', token);

    await GET(req, res);

    const responseData = res._getData();
    console.log('GET Profile Preferred Name Response Data:', responseData);
    expect(responseData).toBeTruthy();

    const parsedData = JSON.parse(responseData);
    expect(parsedData.profile).toHaveProperty('preferredNameOption', 'name');
  });

  // Clean up the user after the tests
  afterAll(async () => {
    const { req, res } = mockRequestResponse('DELETE', '/api/users/delete', token);

    await DELETE(req, res);

    const statusCode = res._getStatusCode();
    console.log('DELETE User Status:', statusCode);
    expect(statusCode).toBe(200);

    const responseData = res._getData();
    const parsedData = JSON.parse(responseData);
    expect(parsedData.success).toBe(true);
    expect(parsedData.message).toBe('User deleted successfully');
  });
});
