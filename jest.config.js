// jest.config.js
process.env.SUPPRESS_JEST_WARNINGS = 'true';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',  // Ambiente principal
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testTimeout: 10000,
};
