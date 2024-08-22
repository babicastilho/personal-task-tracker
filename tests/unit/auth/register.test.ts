import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/auth/register/route';
import dbConnect from '@/lib/mongodb';
import { generateToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

jest.mock('@/lib/mongodb');
jest.mock('@/lib/auth');

const mockDb = {
  collection: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
};

(dbConnect as jest.Mock).mockResolvedValue(mockDb);

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    const { req } = createMocks({
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

    (generateToken as jest.Mock).mockReturnValue('validtoken');

    const response = await POST(new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: req.headers as HeadersInit,
    }));

    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json).toEqual({
      success: true,
      message: 'User registered successfully',
      token: 'validtoken',
    });
  });

  it('should return 409 if user already exists', async () => {
    const { req } = createMocks({
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

    const response = await POST(new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: req.headers as HeadersInit,
    }));

    expect(response.status).toBe(409);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      message: 'User already exists',
    });
  });

  it('should return 400 if required fields are missing', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        username: 'testuser',
      },
    });

    const response = await POST(new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: req.headers as HeadersInit,
    }));

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      message: 'Missing required fields',
    });
  });

  it('should return 500 if there is a server error', async () => {
    const { req } = createMocks({
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

    const response = await POST(new Request('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: req.headers as HeadersInit,
    }));

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      message: 'Internal server error',
      error: 'Internal server error',
    });
  });
});
