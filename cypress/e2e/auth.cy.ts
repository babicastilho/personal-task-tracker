/// <reference types="cypress" />

describe("Authentication E2E Tests", () => {
  before(() => {
    // Reset user before tests
    cy.resetUser("test@example.com", "password123", {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JaneS",
      username: "janesmith",
    });
  });

  beforeEach(() => {
    // Log in before each test
    cy.login("test@example.com", "password123", "/login");
  });

  context("Authenticated User Redirection", () => {
    it("should redirect authenticated users from /login to /dashboard", () => {
      cy.visit("/");
      cy.url({ timeout: 5000 }).should("include", "/dashboard");
      cy.get('[data-cy="welcome-message"]').should("be.visible");
    });

    it("should display categories when redirected to categories page", function () {
      cy.visit("/categories");
      cy.url({ timeout: 5000 }).should("include", "/categories");
      cy.get('[data-cy="categories-form"]').should("be.visible");
    });

    it("should display tasks when redirected to tasks page", function () {
      cy.visit("/tasks");
      cy.url({ timeout: 5000 }).should("include", "/tasks");
      cy.contains("Your To-Do List").should("be.visible");
      cy.get('[data-cy="todo-list"]').should("exist");
    });

    it("should display profile page when accessed directly", function () {
      cy.visit("/profile");
      cy.url({ timeout: 5000 }).should("include", "/profile");
      cy.contains("Edit Profile").should("be.visible");
    });
  });

  context("Unauthenticated User Redirection", () => {
    it("should redirect unauthenticated users from /dashboard to /login with no_token message", () => {
      cy.logout();
      cy.wait(1000);
      cy.visit("/dashboard");
      cy.url({ timeout: 5000 }).should("include", "/login?message=no_token");
    });

    it("should redirect unauthenticated users from /tasks to /login with no_token message", () => {
      cy.logout();
      cy.wait(1000);
      cy.visit("/tasks");
      cy.url({ timeout: 5000 }).should("include", "/login?message=no_token");
    });

    it("should redirect unauthenticated users from /categories to /login with no_token message", () => {
      cy.logout();
      cy.wait(1000);
      cy.visit("/categories");
      cy.url({ timeout: 5000 }).should("include", "/login?message=no_token");
    });

    it("should redirect unauthenticated users from /profile to /login with no_token message", () => {
      cy.logout();
      cy.wait(1000);
      cy.visit("/profile");
      cy.url({ timeout: 5000 }).should("include", "/login?message=no_token");
    });
  });

  context("Token Expiry During Active Session", function () {
    it("should redirect to /login with session expired message after token removal on /dashboard", function () {
      cy.intercept("GET", "/api/auth/check", {
        statusCode: 401,
        body: { success: false, message: "Token expired" },
      }).as("expiredSession");

      cy.window().then((win) => {
        win.localStorage.removeItem("token");
      });

      cy.reload();
      cy.wait("@expiredSession");
      cy.url({ timeout: 5000 }).should("include", "/login?message=session_expired");
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

      cy.reload();
      cy.wait("@expiredSession");
      cy.url({ timeout: 5000 }).should("include", "/login?message=session_expired");
      cy.contains("Your session has expired. Please log in again.").should("be.visible");
    });

    it("should redirect to /login with session expired message after token removal on /categories", function () {
      cy.visit("/categories");

      cy.intercept("GET", "/api/auth/check", {
        statusCode: 401,
        body: { success: false, message: "Token expired" },
      }).as("expiredSession");

      cy.window().then((win) => {
        win.localStorage.removeItem("token");
      });

      cy.reload();
      cy.wait("@expiredSession");
      cy.url({ timeout: 5000 }).should("include", "/login?message=session_expired");
      cy.contains("Your session has expired. Please log in again.").should("be.visible");
    });

    it("should redirect to /login with session expired message after token removal on /profile", function () {
      cy.visit("/profile");

      cy.intercept("GET", "/api/auth/check", {
        statusCode: 401,
        body: { success: false, message: "Token expired" },
      }).as("expiredSession");

      cy.window().then((win) => {
        win.localStorage.removeItem("token");
      });

      cy.reload();
      cy.wait("@expiredSession");
      cy.url({ timeout: 5000 }).should("include", "/login?message=session_expired");
      cy.contains("Your session has expired. Please log in again.").should("be.visible");
    });
  });
});
