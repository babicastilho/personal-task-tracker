import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/auth/login/route';
import dbConnect from '@/lib/mongodb';
import { verifyPassword } from '@/models/User';
import { ObjectId } from 'mongodb';

jest.mock('@/lib/mongodb');
jest.mock('@/models/User', () => ({
  ...jest.requireActual('@/models/User'),
  verifyPassword: jest.fn(),
}));
jest.mock('@/lib/auth');

const mockDb = {
  collection: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
};

(dbConnect as jest.Mock).mockResolvedValue(mockDb);

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if password is incorrect', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'wrongpassword',
      },
    });

    // Simular o usuário encontrado no banco de dados
    mockDb.collection.mockReturnValue({
      findOne: mockDb.findOne.mockResolvedValue({
        _id: new ObjectId(),
        email: 'test@example.com',
        password: 'hashedpassword',
      }),
    });

    // Simular verificação de senha incorreta
    (verifyPassword as jest.Mock).mockResolvedValue(false);

    const response = await POST(new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: req.headers as HeadersInit,
    }));

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      message: 'Invalid credentials',
    });
  });

  it('should return 500 if there is a server error', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    // Simular erro no banco de dados
    mockDb.collection.mockReturnValue({
      findOne: mockDb.findOne.mockRejectedValue(new Error('Internal server error')),
    });

    const response = await POST(new Request('http://localhost:3000/api/auth/login', {
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
