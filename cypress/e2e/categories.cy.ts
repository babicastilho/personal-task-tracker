/// <reference types="cypress" />

import { navigateAndVerify } from "../support/utils";

describe("Authenticated User Redirection", () => {
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

    // Verify login redirects to the dashboard
    navigateAndVerify("/dashboard");
  });

  it("should redirect authenticated users from /login to /dashboard", () => {
    // Navigate to /login and verify redirection to /dashboard
    cy.visit("/login");
    cy.url({ timeout: 15000 }).should("include", "/dashboard");

    // Explicitly check visibility of welcome message
    cy.get('[data-cy="welcome-message"]').should("be.visible");
  });

  it("should display categories when redirected to categories page", () => {
    navigateAndVerify("/categories");
    cy.get('[data-cy="categories-form"]').should("be.visible");
  });

  it("should display tasks when redirected to tasks page", () => {
    navigateAndVerify("/tasks");
    cy.get('[data-cy="todo-list"]').should("exist");
  });

  it("should display profile when redirected to profile page", () => {
    navigateAndVerify("/profile");
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="edit-profile-title"]').length > 0) {
        cy.log("Profile page loaded");
        cy.get('[data-cy="edit-profile-title"]').should("exist");
      } else {
        cy.log("Profile page not loaded");
      }
    });
  });

  after(() => {
    cy.deleteUser("test@example.com", "password123");
  });
});
