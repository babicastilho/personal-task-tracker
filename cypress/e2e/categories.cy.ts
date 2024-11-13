/// <reference types="cypress" />

describe("Categories Page", () => {
  let userId;
  let token;

  // Reset user before all tests
  before(() => {
    cy.resetUser("test@example.com", "password123", {
      firstName: 'Jane',
      lastName: 'Smith',
      nickname: 'JaneS',
      username: 'janesmith',
    }).then((response) => {
      token = response.body.token;
      userId = response.body.userId;
    });
  });

  // Delete user after all tests
  after(() => {
    cy.deleteUser("test@example.com", "password123");
  });

  beforeEach(() => {
    // Intercept login request
    cy.intercept('POST', '/api/auth/login').as('loginRequest');
    
    // Login and assert success
    cy.login("test@example.com", "password123", "/login");
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      token = interception.response.body.token;
    });

    // Visit Categories page
    cy.visit('/categories');
    cy.intercept('GET', '/api/categories').as('categoriesRequest');
    cy.wait('@categoriesRequest');
  });

  it("should display only the categories of the logged-in user", () => {
    cy.get('input[placeholder="Category name"]').type("Work");
    cy.get('input[placeholder="Category description"]').type("Work-related tasks");
    cy.contains("Add Category").click();
    cy.wait(1000);

    cy.get('input[placeholder="Category name"]').type("Personal");
    cy.get('input[placeholder="Category description"]').type("Personal tasks");
    cy.contains("Add Category").click();
    cy.wait(1000);

    cy.get('[data-cy="category-tests-Work"]').should('exist');
    cy.get('[data-cy="category-tests-Personal"]').should('exist');
  });

  it("should allow the user to delete a category", () => {
    cy.get('input[placeholder="Category name"]').type("Category to Delete");
    cy.get('input[placeholder="Category description"]').type("Description to Delete");
    cy.contains("Add Category").click();
    cy.wait(2000);

    cy.get('[data-cy="category-tests-Category-to-Delete"]').should('exist');
    
    // Click delete button for "Category to Delete"
    cy.get('[data-cy="delete-category-Category-to-Delete"]').click();

    cy.wait(1000);
    cy.get('[data-cy="category-tests-Category-to-Delete"]').should('not.exist');
  });
});
