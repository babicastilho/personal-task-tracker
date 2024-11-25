/// <reference types="cypress" />

import { navigateAndVerify, checkElementVisibility } from "../support/utils";

/**
 * Simulates token expiry by intercepting API requests and returning a 401 status.
 */
function simulateTokenExpiry() {
  cy.intercept(
    {
      method: "*", // Capture all HTTP methods (GET, POST, etc.)
      url: "/api/*", // Capture all endpoints under /api
    },
    {
      statusCode: 401, // Return 401 Unauthorized to simulate token expiration
      body: { success: false, message: "Token expired" },
    }
  ).as("expiredSession");
}

// Array of protected routes to test
const protectedRoutes = ["/tasks", "/dashboard", "/categories", "/profile"];

describe("Token Expiry During Active Session", () => {
  before(() => {
    // Reset the user with a valid session before the tests
    cy.resetUser("test@example.com", "password123", {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JaneS",
      username: "janesmith",
    });
  });

  beforeEach(() => {
    // Log in before each test
    cy.login("test@example.com", "password123", "/dashboard");
  });

  protectedRoutes.forEach((route) => {
    it(`should redirect to /login with session expired message after token removal on ${route}`, function () {
      // Navigate to the protected route and verify it loads
      navigateAndVerify(route);

      // Simulate token expiry by intercepting API requests
      simulateTokenExpiry();

      // Wait briefly to ensure the intercept is active
      cy.wait(1000);

      // Invalidate the token by setting an invalid value in localStorage
      cy.window().then((win) => {
        cy.log(`Invalidating token for ${route}`);
        win.localStorage.setItem("token", "invalid_token_value");
      });

      // Reload the page to trigger token validation
      cy.wait(500);
      cy.reload();

      // Ensure the redirection happens to either session_expired or no_token
      navigateAndVerify(route, ["/login?message=session_expired", "/login?message=no_token"]);

      // Verify the session expired message is displayed
      checkElementVisibility(
        '[data-cy="session-expired-message"]',
        "Session expired message is displayed",
        "Session expired message not found"
      );
    });
  });

  after(() => {
    // Delete the test user after all tests
    cy.deleteUser("test@example.com", "password123");
  });
});
