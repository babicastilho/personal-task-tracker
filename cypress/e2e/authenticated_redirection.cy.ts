/// <reference types="cypress" />

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
  });

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

  after(() => {
    cy.deleteUser("test@example.com", "password123");
  });
});
