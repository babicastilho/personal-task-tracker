import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Add e2e node event listeners here if needed
    },
    //baseUrl: 'http://localhost:3000',  // Base URL for your Next.js app local
    baseUrl: 'https://personal-task-tracker-nine.vercel.app',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
  },
  component: {
    devServer: {
      framework: 'next',  // Use Next.js framework
      bundler: 'webpack',  // Bundler is Webpack by default with Next.js

    },
    specPattern: 'cypress/component/**/*.cy.ts',  // Pattern for component test files
    supportFile: 'cypress/support/component.ts',  // Optional: different support file for component tests
  },
});
