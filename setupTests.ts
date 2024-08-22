import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => Promise.resolve('mocked_hash')),
  compare: jest.fn(() => Promise.resolve(true)),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked_token'),
  verify: jest.fn(() => ({ userId: 'mocked_user_id' })),
}));



// Mock global fetch to return a Response-like object
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ message: 'mocked response' }),
    headers: {
      get: jest.fn().mockReturnValue('application/json'),
    },
  } as unknown as Response)
);

// Additional global setups can be added here if needed
