// tests/auth/login.test.ts

import handler from '@/app/api/auth/login'; 
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('@/lib/mongodb'); // Mock dbConnect function
jest.mock('jsonwebtoken'); // Mock jsonwebtoken

describe('Login Endpoint', () => {
  let req: any, res: any;
  
  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  it('should login successfully with correct credentials', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const mockUser = { _id: 'mocked_id', password: hashedPassword };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    jwt.sign = jest.fn().mockReturnValue('mocked_token');

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: 'mocked_token',
      message: 'Logged in successfully',
    });
  });

  it('should return 404 if user not found', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found',
    });
  });

  it('should return 401 if password is incorrect', async () => {
    const hashedPassword = await bcrypt.hash('correctpassword', 10);
    const mockUser = { _id: 'mocked_id', password: hashedPassword };
    User.findOne = jest.fn().mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(false); // Simular senha incorreta

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid credentials',
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
