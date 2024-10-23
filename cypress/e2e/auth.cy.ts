/// <reference types="cypress" />

describe("Authentication E2E Tests", () => {
  before(() => {
    // Reseta o usuário antes dos testes
    cy.resetUser("test@example.com", "password123", {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JaneS",
      username: "janesmith",
    });
  });

  beforeEach(() => {
    // Command to log in before each test
    cy.login("test@example.com", "password123", "/login");
  });

  // Test cases for authenticated users
  context("Authenticated User Redirection", () => {
    it("should redirect authenticated users from /login to /dashboard", () => {
      cy.visit("http://localhost:3000/");
      cy.url({ timeout: 5000 }).should("include", "/dashboard"); // Check if redirected to dashboard
      cy.get('[data-cy="welcome-message"]').should("be.visible"); // Verifies that the welcome message is visible
    });

    it("should display categories when redirected to categories page", function () {
      cy.visit("http://localhost:3000/categories");
      cy.url({ timeout: 5000 }).should("include", "/categories");
      cy.get('[data-cy="categories-form"]', { timeout: 5000 }).should("be.visible");
    });
  
    it("should display tasks when redirected to tasks page", function () {
      cy.visit("http://localhost:3000/tasks");
      cy.url({ timeout: 5000 }).should("include", "/tasks");
      cy.contains("Your To-Do List").should("be.visible");
      cy.get('[data-cy="todo-list"]').should("exist");
    });
  
    it("should display profile page when accessed directly", function () {
      cy.visit("http://localhost:3000/profile");
      cy.url({ timeout: 5000 }).should("include", "/profile");
      cy.contains("Edit Profile", { timeout: 5000 }).should("be.visible");
    });
  });

  // Test cases for unauthenticated users
  context("Unauthenticated User Redirection", () => {
    it("should redirect unauthenticated users from /dashboard to /login with no_token message", () => {
      cy.logout(); // Ensure the user is logged out
      cy.wait(1000);
      cy.visit("http://localhost:3000/dashboard");
      
      // Verifica se a URL contém a mensagem de erro e redireciona adequadamente
      cy.url({ timeout: 5000 }).should("include", "/login?message=no_token");
    });

    it("should redirect unauthenticated users from /tasks to /login with no_token message", () => {
      cy.logout();
      cy.wait(1000);
      cy.visit("http://localhost:3000/tasks");
      cy.url({ timeout: 5000 }).should("include", "/login?message=no_token"); // Ensure redirected to login with no_token message
    });

    it("should redirect unauthenticated users from /categories to /login with no_token message", () => {
      cy.logout();
      cy.wait(1000);
      cy.visit("http://localhost:3000/categories");
      cy.url({ timeout: 5000 }).should("include", "/login?message=no_token"); // Ensure redirected to login with no_token message
    });

    it("should redirect unauthenticated users from /profile to /login with no_token message", () => {
      cy.logout();
      cy.wait(1000);
      cy.visit("http://localhost:3000/profile");
      cy.url({ timeout: 5000 }).should("include", "/login?message=no_token"); // Ensure redirected to login with no_token message
    });
  });

  // Test cases for session expiration
  context("Token Expiry During Active Session", function () {
    it("should redirect to /login with session expired message after token removal on /dashboard", function () {
      
      // Intercept the session check to simulate token expiration
      cy.intercept("GET", "/api/auth/check", {
        statusCode: 401, // Simulate 401 Unauthorized
        body: { success: false, message: "Token expired" },
      }).as("expiredSession");
  
      // Remove the token from localStorage
      cy.window().then((win) => {
        win.localStorage.removeItem("token");
      });
  
      // Reload the page to trigger the session check
      cy.reload();
      
      // Wait for the expired session request to be intercepted
      cy.wait("@expiredSession");
  
      // Assert that the user is redirected to the login page with the session expired message
      cy.url({ timeout: 5000 }).should("include", "/login?message=session_expired");
      cy.contains("Your session has expired. Please log in again.", { timeout: 5000 }).should("be.visible");
    });
  
    it("should redirect to /login with session expired message after token removal on /tasks", function () {
      // Go to tasks page
      cy.visit("http://localhost:3000/tasks");
  
      // Intercept the session check to simulate token expiration
      cy.intercept("GET", "/api/auth/check", {
        statusCode: 401, // Simulate 401 Unauthorized
        body: { success: false, message: "Token expired" },
      }).as("expiredSession");
  
      // Remove the token from localStorage
      cy.window().then((win) => {
        win.localStorage.removeItem("token");
      });
  
      // Reload the page to trigger the session check
      cy.reload();
  
      // Wait for the expired session request to be intercepted
      cy.wait("@expiredSession");
  
      // Assert that the user is redirected to the login page with the session expired message
      cy.url({ timeout: 5000 }).should("include", "/login?message=session_expired");
      cy.contains("Your session has expired. Please log in again.", { timeout: 5000 }).should("be.visible");
    });
  
    it("should redirect to /login with session expired message after token removal on /categories", function () {
      // Go to categories page
      cy.visit("http://localhost:3000/categories");
  
      // Intercept the session check to simulate token expiration
      cy.intercept("GET", "/api/auth/check", {
        statusCode: 401, // Simulate 401 Unauthorized
        body: { success: false, message: "Token expired" },
      }).as("expiredSession");
  
      // Remove the token from localStorage
      cy.window().then((win) => {
        win.localStorage.removeItem("token");
      });
  
      // Reload the page to trigger the session check
      cy.reload();
  
      // Wait for the expired session request to be intercepted
      cy.wait("@expiredSession");
  
      // Assert that the user is redirected to the login page with the session expired message
      cy.url({ timeout: 5000 }).should("include", "/login?message=session_expired");
      cy.contains("Your session has expired. Please log in again.", { timeout: 5000 }).should("be.visible");
    });
  
    it("should redirect to /login with session expired message after token removal on /profile", function () {
      // Go to profile page
      cy.visit("http://localhost:3000/profile");
  
      // Intercept the session check to simulate token expiration
      cy.intercept("GET", "/api/auth/check", {
        statusCode: 401, // Simulate 401 Unauthorized
        body: { success: false, message: "Token expired" },
      }).as("expiredSession");
  
      // Remove the token from localStorage
      cy.window().then((win) => {
        win.localStorage.removeItem("token");
      });
  
      // Reload the page to trigger the session check
      cy.reload();
  
      // Wait for the expired session request to be intercepted
      cy.wait("@expiredSession");
  
      // Assert that the user is redirected to the login page with the session expired message
      cy.url({ timeout: 5000 }).should("include", "/login?message=session_expired");
      cy.contains("Your session has expired. Please log in again.", { timeout: 5000 }).should("be.visible");
    });  
  });
});
