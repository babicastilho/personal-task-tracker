describe("Categories Page", () => {
  let userId: string;
  let token: string;

  // Before all tests, reset user and login
  before(() => {
    // Use the resetUser command to create a new user for the tests
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

  // After all tests, delete the user
  after(() => {
    cy.deleteUser("test@example.com", "password123",);
  });

  beforeEach(() => {
    // Intercept the login request before the test
    cy.intercept('POST', '/api/auth/login').as('loginRequest');

    // Use the custom login function
    cy.login("test@example.com", "password123");

    // Wait for the intercepted login request and assert the response
    cy.wait('@loginRequest').then((interception) => {
      // Ensure the login response was successful
      expect(interception.response.statusCode).to.equal(200);
      token = interception.response.body.token;
    });

    // After login, navigate to the Categories page
    cy.visit('http://localhost:3000/categories');

    // Wait for the Categories page to load
    cy.intercept('GET', '/api/categories').as('categoriesRequest');
    cy.wait('@categoriesRequest');
  });

  it("should display only the categories of the logged-in user", () => {
    // First, add the categories "Work" and "Personal"
    cy.get('input[placeholder="Category name"]').should('be.visible').type("Work");
    cy.get('input[placeholder="Category description"]').type("Work-related tasks");
    cy.contains("Add Category").click();

    // Wait for the UI to update
    cy.wait(1000); 

    cy.get('input[placeholder="Category name"]').type("Personal");
    cy.get('input[placeholder="Category description"]').type("Personal tasks");
    cy.contains("Add Category").click();

    // Wait for the UI to update and check if the correct categories are displayed on the page
    cy.wait(1000); 
    cy.get('[data-cy="category-tests-Work"]').should('exist');
    cy.get('[data-cy="category-tests-Personal"]').should('exist');
  });

  it("should allow the user to delete a category", () => {
    // Add a new category to delete
    cy.get('input[placeholder="Category name"]').type("Category to Delete");
    cy.get('input[placeholder="Category description"]').type("Description to Delete");
    cy.contains("Add Category").click();
  
    // Wait for the category to be added
    cy.wait(2000); 
  
    // Ensure the category was added and the delete button is available
    cy.get('li')
      .contains('span', 'Category to Delete')
      .parent()
      .within(() => {
        cy.get('button').click(); // Click the button directly
      });
  
    // Verify that the category has been deleted
    cy.wait(1000); 
    cy.get('[data-cy="category-tests-Category to Delete"]').should('not.exist');
  });
  
});
