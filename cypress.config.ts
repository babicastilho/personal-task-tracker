import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'xp4y1p',
  e2e: {
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    viewportWidth: 1000, 
    viewportHeight: 750, 
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
