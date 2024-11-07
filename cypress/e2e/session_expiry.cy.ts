/// <reference types="cypress" />

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

  it("should redirect to /login with session expired message after token removal on /dashboard", function () {
    cy.intercept("GET", "/api/auth/check", {
      statusCode: 401,
      body: { success: false, message: "Token expired" },
    }).as("expiredSession");

    cy.window().then((win) => {
      win.localStorage.removeItem("token");
    });
    cy.wait(500);
    cy.reload();

    cy.wait("@expiredSession", { timeout: 15000 });
    cy.url({ timeout: 15000 }).should("include", "/login?message=session_expired");
    cy.contains("Your session has expired. Please log in again.").should("be.visible");
  });

  it("should redirect to /login with session expired message after token removal on /tasks", function () {
    cy.visit("/tasks");

    cy.intercept("GET", "/api/auth/check", {
      statusCode: 401,
      body: { success: false, message: "Token expired" },
    }).as("expiredSession");

    cy.window().then((win) => {
      win.localStorage.removeItem("token");
    });
    cy.wait(500);
    cy.reload();

    cy.wait("@expiredSession", { timeout: 15000 });
    cy.url({ timeout: 15000 }).should("include", "/login?message=session_expired");
    cy.contains("Your session has expired. Please log in again.").should("be.visible");
  });

  // Other token expiration tests in categories and profile
  // Can be added here in the same way if necessary

  after(() => {
    cy.deleteUser("test@example.com", "password123");
  });
});