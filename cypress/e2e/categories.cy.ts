/// <reference types="cypress" />

import { checkElementVisibility } from "../support/utils";

describe("Categories Page", () => {
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

    // Mock for adding a category
    cy.intercept("POST", "/api/categories", {
      statusCode: 201,
      body: {
        success: true,
        category: { _id: "3", name: "New Category", description: "Test tasks" },
      },
    }).as("addCategoryRequest");

    // Mock for deleting a category
    cy.intercept("DELETE", "/api/categories/*", {
      statusCode: 200,
      body: { success: true }, // Indicates the category was successfully deleted
    }).as("deleteCategoryRequest");

    // Simulating login flow
    cy.log("Visiting login page...");
    cy.visit("/login");

    cy.log("Logging in user...");
    cy.get('input[id="email"]').type("test@example.com");
    cy.get('input[id="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

    // Navigating to the categories page
    cy.log("Visiting categories page...");
    cy.visit("/categories");
    cy.wait("@categoriesRequest").its("response.statusCode").should("eq", 200);
  });

  it("should display categories from API", () => {
    // Confirm the categories are loaded in the DOM
    checkElementVisibility(
      '[data-cy="category-name-1"]',
      "Category 'Work' is visible",
      "Category 'Work' is not visible"
    );
    checkElementVisibility(
      '[data-cy="category-name-2"]',
      "Category 'Personal' is visible",
      "Category 'Personal' is not visible"
    );
  });

  it("should allow adding a new category", () => {
    // Confirm the form for adding categories is visible
    checkElementVisibility(
      '[data-cy="category-name-input"]',
      "Category name input is visible",
      "Category name input is not visible"
    );
    checkElementVisibility(
      '[data-cy="category-description-input"]',
      "Category description input is visible",
      "Category description input is not visible"
    );
    checkElementVisibility(
      '[data-cy="category-add-button"]',
      "Add category button is visible",
      "Add category button is not visible"
    );

    // Add a new category
    cy.get('[data-cy="category-name-input"]').type("New Category");
    cy.get('[data-cy="category-description-input"]').type("Test tasks");
    cy.get('[data-cy="category-add-button"]').click();

    // Wait for the POST request and verify the new category is displayed
    cy.wait("@addCategoryRequest").its("response.statusCode").should("eq", 201);
    checkElementVisibility(
      '[data-cy="category-name-3"]',
      "New category is visible",
      "New category is not visible"
    );
  });

  it("should allow the user to delete a category", () => {
    // Confirm the category exists before deletion
    checkElementVisibility(
      '[data-cy="category-name-1"]',
      "Category 'Work' is visible before deletion",
      "Category 'Work' is not visible before deletion"
    );

    // Simulate deleting the category
    cy.get('[data-cy="delete-category-1"]').click();

    // Wait for the DELETE request and verify the category is removed
    cy.wait("@deleteCategoryRequest").its("response.statusCode").should("eq", 200);
    cy.get('[data-cy="category-name-1"]').should("not.exist");
  });

  after(() => {
    // Delete test user after tests
    cy.deleteUser("test@example.com", "password123");
  });
});
