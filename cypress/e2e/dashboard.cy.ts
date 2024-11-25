/// <reference types="cypress" />

import { navigateAndVerify, checkElementVisibility } from "../support/utils";

describe("Dashboard Page E2E", () => {
  let token;

  before(() => {
    // Create a user with custom profile data for testing the dashboard
    cy.resetUser("test@example.com", "password123", {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JaneS",
      username: "janesmith",
    }).then((response) => {
      token = response.body.token; // Store the token for API requests
    });
  });

  beforeEach(() => {
    // Intercept the login request before the test
    cy.intercept("POST", "/api/auth/login").as("loginRequest");

    // Use the custom login function
    cy.login("test@example.com", "password123", "/login");

    // Wait for the intercepted login request and assert the response
    cy.wait("@loginRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
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
  
    // Ensure the sidebar menu item is visible and scroll into view
    cy.get('[data-cy="sidebar-tasks-cards"]')
      .scrollIntoView()
      .should("be.visible")
      .click();
  
    checkElementVisibility(
      '[data-cy="todo-list"]',
      "Todo list component loaded successfully",
      "Todo list component did not load"
    );
  });

  it("should display categories component from the menu on dashboard", () => {
    // Click the menu toggle button and navigate to categories
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.get('[data-cy="sidebar-categories"]').click();
  
    // Check if the categories list is visible
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

  after(() => {
    cy.deleteUser("test@example.com", "password123");
  });
});
