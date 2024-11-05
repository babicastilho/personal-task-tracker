# TypeScript Configuration for Jest and Cypress

This project uses separate TypeScript configurations for Jest and Cypress to avoid type conflicts and ensure smooth testing experiences.

**These configurations provide a reliable and conflict-free setup for projects that use both Jest and Cypress with TypeScript. By isolating TypeScript environments, we avoid type conflicts and improve the developer experience within VSCode.**

## 1. Jest
- **Configuration file**: `tsconfig.jest.json`
- Jest-specific types are included to prevent conflicts with Cypress.
- Configured in `jest.config.js` to use `tsconfig.jest.json` specifically for unit and component tests.

### Example of `tsconfig.jest.json`:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom"], // Jest-specific types
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react",
    "incremental": true,
    "baseUrl": ".", // Base directory is the project root
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["tests/**/*.ts", "tests/**/*.tsx", "setupTests.ts"],
  "exclude": [
    "node_modules",
    "cypress" // Exclude Cypress folder to avoid conflicts
  ]
}
```

### Example of `jest.config.js`:

```javascript
require('dotenv').config({ path: '.env.test' });

module.exports = {
  projects: [
    {
      displayName: 'unit',  // Unit tests
      preset: 'ts-jest',
      testEnvironment: 'node',
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.jest.json' // Jest-specific TypeScript config
        }
      },
      setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
      },
      testPathIgnorePatterns: ['/node_modules/', '/.next/'],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
      },
      testMatch: ['**/tests/unit/**/*.test.ts', '**/tests/unit/**/*.test.tsx']
    }
  ]
};
```
## 2. Cypress
- **Configuration file**: `cypress/tsconfig.json`
- Cypress-specific types are used to avoid conflicts with Jest.
- Configured in `.vscode/settings.json` to isolate the Cypress environment in VSCode.

### Example of `cypress/tsconfig.json`:
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "types": ["cypress", "node"],  // Include only Cypress types
    "isolatedModules": false,
    "resolveJsonModule": true,
    "lib": ["dom", "esnext"],
    "allowJs": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": "../",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "cypress/**/*.ts",
    "cypress/**/*.tsx"
  ],
  "exclude": [
    "../node_modules",
    "../tests"  // Exclude Jest tests to avoid conflicts
  ]
}
```

### Example of `cypress.config.ts`:
```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Setup event listeners here if needed
    },
    baseUrl: "http://localhost:3000",
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts'
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    },
    specPattern: 'cypress/component/**/*.cy.ts',
    supportFile: 'cypress/support/component.ts'
  }
});
```

## 3. VSCode Workspace Setup
- **Configuration file**: `.vscode/settings.json`
- Specifies `tsconfigPath` for Jest and Cypress folders, ensuring that VSCode uses the correct TypeScript configuration in each environment, reducing false-positive type errors.

### Example of `.vscode/settings.json`:
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "folders": [
    {
      "path": ".",
      "settings": {
        "typescript.tsconfigPath": "./tsconfig.json"  // Use main tsconfig for the project
      }
    },
    {
      "path": "./tests",
      "settings": {
        "typescript.tsconfigPath": "./tsconfig.jest.json"  // Use Jest-specific tsconfig for tests
      }
    },
    {
      "path": "./cypress",
      "settings": {
        "typescript.tsconfigPath": "./cypress/tsconfig.json"  // Use Cypress-specific tsconfig for Cypress
      }
    }
  ]
}
```
