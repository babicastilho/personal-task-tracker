/**
 * authenticated_redirection.cy.ts
 *
 * Tests for authenticated user redirections and content verification with enhanced logging and reliability improvements.
 */

/// <reference types="cypress" />

import { checkElementVisibility } from "../support/utils";

describe("Authenticated User Redirection", () => {
  before(() => {
    // Reset the user before the tests
    cy.log("Resetting test user");
    cy.resetUser("test@example.com", "password123", {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JaneS",
      username: "janesmith",
    });
  });

  beforeEach(() => {
    // Log in before each test
    cy.log("Logging in the test user");
    cy.login("test@example.com", "password123", "/login");

    // Navigate to the dashboard without verifying specific elements
    cy.log("Navigating to /dashboard");
    cy.visit("/dashboard");
    cy.url({ timeout: 20000 }).should("include", "/dashboard");
  });

  it("should redirect authenticated users from /login to /dashboard", () => {
    cy.log("Verifying redirection from /login to /dashboard");
    cy.visit("/login");
    cy.url({ timeout: 20000 }).should("include", "/dashboard");

    cy.log("Checking if the welcome message is visible");
    checkElementVisibility(
      '[data-cy="welcome-message"]',
      "Welcome message is visible",
      "Welcome message is not visible"
    );
  });

  it("should display categories when redirected to categories page", () => {
    cy.log("Navigating to /categories");
    cy.visit("/categories");
    cy.url({ timeout: 20000 }).should("include", "/categories");

    cy.log("Checking if the categories form is visible");
    checkElementVisibility(
      '[data-cy="categories-form"]',
      "Categories form is visible",
      "Categories form is not visible"
    );
  });

  it("should display tasks when redirected to tasks page", () => {
    cy.log("Navigating to /tasks");
    cy.visit("/tasks");
    cy.url({ timeout: 20000 }).should("include", "/tasks");

    cy.log("Checking if the todo list is visible");
    checkElementVisibility(
      '[data-cy="todo-list"]',
      "Todo list is visible",
      "Todo list is not visible"
    );
  });

  it("should display profile when redirected to profile page", () => {
    cy.log("Navigating to /profile");
    cy.visit("/profile");
    cy.url({ timeout: 20000 }).should("include", "/profile");

    cy.log("Checking if the profile edit title is visible");
    checkElementVisibility(
      '[data-cy="edit-profile-title"]',
      "Edit profile title is visible",
      "Edit profile title is not visible"
    );
  });

  after(() => {
    cy.log("Deleting the test user");
    cy.deleteUser("test@example.com", "password123");
  });
});
