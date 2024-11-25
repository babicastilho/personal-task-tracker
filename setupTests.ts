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

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, 
  }),
}));


// Additional global setups can be added here if needed

// Mock global Request class for use in tests
(global as any).Request = class {
  url: string;
  method: string;
  headers: any;
  body: any;

  constructor(url: string, options: any) {
    this.url = url;
    this.method = options.method;
    this.headers = options.headers;
    this.body = options.body;
  }

  async json() {
    return JSON.parse(this.body);
  }
};
