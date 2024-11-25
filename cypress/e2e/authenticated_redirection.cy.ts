/**
 * authenticated_redirection.cy.ts
 *
 * Tests for authenticated user redirections and content verification.
 */

/// <reference types="cypress" />

import { navigateAndVerify, checkElementVisibility } from "../support/utils";

describe("Authenticated User Redirection", () => {
  before(() => {
    // Reset the user before the tests
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

    // Navigate to the dashboard without verifying any specific element
    cy.visit("/dashboard");
    cy.url({ timeout: 15000 }).should("include", "/dashboard");
  });

  it("should redirect authenticated users from /login to /dashboard", () => {
    // Navigate to /login and verify redirection to the dashboard
    navigateAndVerify("/login", "/dashboard", '[data-cy="welcome-message"]');

    // Check if the welcome message is visible on the dashboard
    checkElementVisibility(
      '[data-cy="welcome-message"]',
      "Welcome message is visible",
      "Welcome message is not visible"
    );
  });

  it("should display categories when redirected to categories page", () => {
    // Navigate to /categories and verify the page loads successfully
    navigateAndVerify(
      "/categories",
      "/categories",
      '[data-cy="categories-form"]'
    );

    // Check if the categories form is visible
    checkElementVisibility(
      '[data-cy="categories-form"]',
      "Categories form is visible",
      "Categories form is not visible"
    );
  });

  it("should display tasks when redirected to tasks page", () => {
    // Navigate to /tasks and verify the page loads successfully
    navigateAndVerify("/tasks", "/tasks", '[data-cy="todo-list"]');

    // Check if the todo list is visible
    checkElementVisibility(
      '[data-cy="todo-list"]',
      "Todo list is visible",
      "Todo list is not visible"
    );
  });

  it("should display profile when redirected to profile page", () => {
    // Navigate to /profile and verify the page loads successfully
    navigateAndVerify("/profile", "/profile", '[data-cy="edit-profile-title"]');

    // Check the visibility of the profile edit title element
    checkElementVisibility(
      '[data-cy="edit-profile-title"]',
      "Edit profile title is visible",
      "Edit profile title is not visible"
    );
  });

  after(() => {
    // Delete the test user after the tests
    cy.deleteUser("test@example.com", "password123");
  });
});
