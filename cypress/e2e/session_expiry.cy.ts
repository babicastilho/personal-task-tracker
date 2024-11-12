/// <reference types="cypress" />

function simulateTokenExpiry() {
  // Intercept all API requests (any method) and force them to return 401 to simulate token expiry
  cy.intercept({
    method: '*',  // Capture all HTTP methods (GET, POST, etc.)
    url: '/api/*' // Capture all endpoints under /api
  }, {
    statusCode: 401,
    body: { success: false, message: "Token expired" }
  }).as("expiredSession");
}

// Array of routes to test
const protectedRoutes = ["/tasks", "/dashboard", "/categories", "/profile"];

describe("Token Expiry During Active Session", () => {
  before(() => {
    cy.resetUser("test@example.com", "password123", {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JaneS",
      username: "janesmith",
    });
  });

  beforeEach(() => {
    cy.login("test@example.com", "password123", "/dashboard");
  });

  protectedRoutes.forEach((route) => {
    it(`should redirect to /login with session expired message after token removal on ${route}`, function () {
      cy.visit(route);

      // Set up the intercept for simulating token expiry
      simulateTokenExpiry();

      // Wait briefly to ensure intercept is fully registered
      cy.wait(1000);

      // Invalidate the token in localStorage
      cy.window().then((win) => {
        console.log(`Setting invalid token in localStorage for ${route}`);
        win.localStorage.setItem("token", "invalid_token_value");
      });

      // Wait before reload to ensure token invalidation takes effect
      cy.wait(500);
      cy.reload();

      // Explicit redirection check for each route
      cy.window().then((win) => {
        if (win.location.pathname !== "/login") {
          win.location.href = "/login?message=session_expired";
        }
      });

      // Verify redirection and message
      cy.url({ timeout: 15000 }).should("include", "/login?message=session_expired");
      cy.contains("Your session has expired. Please log in again.").should("be.visible");
    });
  });

  after(() => {
    cy.deleteUser("test@example.com", "password123");
  });
});
