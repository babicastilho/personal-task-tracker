// setupTests.ts
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
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    query: {},
    pathname: '/',
  }),
}));

// Mock mongoose
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    __esModule: true,
    ...actualMongoose,
    connect: jest.fn(),
    connection: {
      on: jest.fn(),
      once: jest.fn(),
    },
    Types: {
      ObjectId: jest.fn(() => 'mocked_id'),
    },
  };
});

// Additional global setups can be added here if needed
