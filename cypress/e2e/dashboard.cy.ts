/// <reference types="cypress" />

import { checkElementVisibility } from "../support/utils";

describe("Dashboard Page E2E", () => {
  beforeEach(() => {
    // Mock for login endpoint
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        success: true,
        token: "valid-token", // Simulates a valid authentication token
      },
    }).as("loginRequest");

    // Mock for authentication check endpoint
    cy.intercept("GET", "/api/auth/check", {
      statusCode: 200,
      body: { success: true }, // Indicates the session is valid
    }).as("authCheck");

    // Mock for user profile endpoint
    cy.intercept("GET", "/api/users/profile", {
      statusCode: 200,
      body: {
        success: true,
        user: {
          id: "123",
          name: "Test User",
          email: "test@example.com",
        },
      },
    }).as("userProfile");

    // Mock for fetching categories
    cy.intercept("GET", "/api/categories", {
      statusCode: 200,
      body: {
        success: true,
        categories: [
          { _id: "1", name: "Work", description: "Work-related tasks" },
          { _id: "2", name: "Personal", description: "Personal tasks" },
        ],
      },
    }).as("categoriesRequest");

    // Simulate login
    cy.visit("/login");
    cy.get('input[id="email"]').type("test@example.com");
    cy.get('input[id="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
  });

  it("should display user information on the dashboard", () => {
    checkElementVisibility(
      '[data-cy="welcome-message"]',
      "User information loaded successfully",
      "User information did not load"
    );
  });

  it("should display current date and time", () => {
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.get('[data-cy="sidebar-dashboard"]').click();
    checkElementVisibility(
      '[data-cy="current-datetime"]',
      "Current date and time loaded successfully",
      "Current date and time did not load"
    );
  });

  it("should display todo list component on dashboard", () => {
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.get('[data-cy="sidebar-view-tasks"]').click();
    cy.get('[data-cy="sidebar-tasks-cards"]').click();

    checkElementVisibility(
      '[data-cy="todo-list"]',
      "Todo list component loaded successfully",
      "Todo list component did not load"
    );
  });

  it("should display categories component from the menu on dashboard", () => {
    // Mock response ensures predictable data
    cy.intercept("GET", "/api/categories", {
      statusCode: 200,
      body: {
        success: true,
        categories: [
          { _id: "1", name: "Work", description: "Work-related tasks" },
          { _id: "2", name: "Personal", description: "Personal tasks" },
        ],
      },
    }).as("categoriesRequest");

    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.get('[data-cy="sidebar-categories"]').click();

    // Wait for the mocked API request
    cy.wait("@categoriesRequest").its("response.statusCode").should("eq", 200);

    checkElementVisibility(
      '[data-cy="category-list-items"]',
      "Categories component loaded successfully",
      "Categories component did not load"
    );
  });

  it("should display profile component from the menu on dashboard", () => {
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.get('[data-cy="sidebar-profile"]').click();
    checkElementVisibility(
      '[data-cy="edit-profile"]',
      "Profile component loaded successfully",
      "Profile component did not load"
    );
  });
});
