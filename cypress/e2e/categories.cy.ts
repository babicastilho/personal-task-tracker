// cypress/e2e/categories.cy.ts

describe("Categories Page", () => {
  let userId: string; // Variable to store the logged-in user's userId

  before(() => {
    // Use the resetUser command to clean up and create a new user for the tests
    cy.resetUser("test@example.com", "password123").then((response) => {
      userId = response.body.userId; // Store the userId of the created user
    });
  });

  beforeEach(() => {
    // Login with the newly created user before each test using the custom login function
    cy.login("test@example.com", "password123").then(() => {
      // Visit the home page after login
      cy.visit("http://localhost:3000");

      // Click on the menu toggle button to open the menu
      cy.get('[data-cy="menu-toggle-button"]').click();

      // Click on the "Categories" link to navigate to the categories page
      cy.contains("Categories").click();
    });
  });

  it("should display only the categories of the logged-in user", () => {
    // First, add the categories "Work" and "Personal"
    cy.get('input[placeholder="Category name"]').type("Work");
    cy.get('input[placeholder="Category description"]').type(
      "Work-related tasks"
    );
    cy.contains("Add Category").click();

    // Wait for the UI to update
    cy.wait(1000); // Add a small wait to ensure that the UI updates

    cy.get('input[placeholder="Category name"]').type("Personal");
    cy.get('input[placeholder="Category description"]').type("Personal tasks");
    cy.contains("Add Category").click();

    // Wait for the UI to update and check if the correct categories are displayed on the page
    cy.wait(1000); // Wait for DOM update
    cy.get(`[data-cy="category-tests-Work"]`).should("exist");
    cy.get(`[data-cy="category-tests-Personal"]`).should("exist");
  });

  it("should allow the user to add a new category", () => {
    cy.get('input[placeholder="Category name"]').type("New Category");
    cy.get('input[placeholder="Category description"]').type(
      "New Category Description"
    );
    cy.contains("Add Category").click();

    // Check if the new category is added to the list by waiting for the DOM update
    cy.wait(1000); // Wait for DOM update
    cy.get(`[data-cy="category-tests-New Category"]`).should("exist");
  });

  it("should allow the user to delete a category", () => {
    // Add a new category to delete
    cy.get('input[placeholder="Category name"]').type("Category to Delete");
    cy.get('input[placeholder="Category description"]').type(
      "Description to Delete"
    );
    cy.contains("Add Category").click();

    // Wait for the UI to update
    cy.wait(1000); // Wait for DOM update

    // Delete the newly created category
    cy.get("li")
      .contains("span", "Category to Delete")
      .parent()
      .within(() => {
        cy.contains("button", "Delete").click();
      });

    // Verify that the category is deleted by waiting for the DOM update
    cy.wait(1000); // Wait for DOM update
    cy.get(`[data-cy="category-tests-Category to Delete"]`).should("not.exist");
  });
});
