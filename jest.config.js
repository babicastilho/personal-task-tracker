// jest.config.js
module.exports = {
  projects: [
    {
      displayName: 'unit',  // Unit tests
      preset: 'ts-jest',
      testEnvironment: 'node',  // Use node environment for unit tests
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.jest.json',  // Specific TypeScript config for Jest
        },
      },
      setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],  // Setup after environment files
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',  // Resolve alias '@/' to project root
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',  // Mock style imports
      },
      testPathIgnorePatterns: ['/node_modules/', '/.next/'],  // Ignore node_modules and Next.js build files
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // Use Babel for transpiling JS/TS files
      },
      testMatch: ['**/tests/unit/**/*.test.ts', '**/tests/unit/**/*.test.tsx'],  // Only run unit tests
    },
    {
      displayName: 'components',  // Component and page tests
      preset: 'ts-jest',
      testEnvironment: 'jsdom',  // Use jsdom for tests that involve the DOM
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.jest.json',  // Specific TypeScript config for Jest
        },
      },
      setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],  // Setup after environment files
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',  // Resolve alias '@/' to project root
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',  // Mock style imports
      },
      testPathIgnorePatterns: ['/node_modules/', '/.next/'],  // Ignore node_modules and Next.js build files
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // Use Babel for transpiling JS/TS files
      },
      testMatch: ['**/tests/components/**/*.test.tsx', '**/tests/pages/**/*.test.tsx'],  // Only run component and page tests
    },
  ],
};
