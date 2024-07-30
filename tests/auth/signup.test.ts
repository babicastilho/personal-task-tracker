// tests/auth/signup.test.ts

import handler from '@/app/api/auth/register/route'; 
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

jest.mock('@/lib/mongodb'); // Mock dbConnect function

describe('Signup Endpoint', () => {
  let req: any, res: any;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  it('should register a new user successfully', async () => {
    const mockSave = jest.fn().mockResolvedValue(undefined); // Mock saving user
    const mockUser = { ...req.body, save: mockSave };

    // Mock the User constructor to return the mock user
    jest.spyOn(User.prototype, 'save').mockImplementation(mockSave);
    jest.spyOn(User, 'findOne').mockResolvedValue(null); // Simular que o usuário não existe

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'User registered successfully',
    });
    expect(mockSave).toHaveBeenCalled();
  }, 10000); // Aumentar o tempo limite para 10 segundos

  it('should return 409 if user already exists', async () => {
    User.findOne = jest.fn().mockResolvedValue({}); // Simular que o usuário já existe

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User already exists',
    });
  });

  it('should handle internal server errors', async () => {
    User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error',
      error: 'Database error', // Inclua o campo de erro se necessário
    });
  });
});
