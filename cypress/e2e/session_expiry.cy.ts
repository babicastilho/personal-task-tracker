/// <reference types="cypress" />

function simulateTokenExpiry() {
  // Intercept all API requests and force them to return 401 to simulate token expiry
  cy.intercept("GET", "/api/*", {
    statusCode: 401,
    body: { success: false, message: "Token expired" },
  }).as("expiredSession");
}

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

  it("should redirect to /login with session expired message after token removal on /tasks", function () {
    cy.visit("/tasks");

    // Set up the intercept for simulating token expiry
    simulateTokenExpiry();

    // Wait briefly to ensure intercept is fully registered
    cy.wait(1000);

    // Invalidate the token in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem("token", "invalid_token_value");
    });

    // Wait before reload to ensure token invalidation takes effect
    cy.wait(500);
    cy.reload();

    // Wait for the specific API call to be intercepted and respond with 401
    cy.wait("@expiredSession", { timeout: 15000 });
    
    // Verify redirection and message after session expiration
    cy.url({ timeout: 15000 }).should("include", "/login?message=session_expired");
    cy.contains("Your session has expired. Please log in again.").should("be.visible");
  });

  after(() => {
    cy.deleteUser("test@example.com", "password123");
  });
});
