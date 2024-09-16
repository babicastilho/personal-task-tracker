// cypress/e2e/dashboard.cy.ts

describe('Dashboard Page E2E', () => {
  let token: string;

  before(() => {
    // Create a user with custom profile data for testing the dashboard
    cy.resetUser('test@example.com', 'password123', {
      firstName: 'Jane',
      lastName: 'Smith',
      nickname: 'JaneS',
      username: 'janesmith'
    }).then((response) => {
      token = response.body.token; // Store the token for API requests
    });
  });

  beforeEach(() => {
    // Log the user in and navigate to the dashboard
    cy.login('test@example.com', 'password123');
  });

  it('should display user information on the dashboard', () => {
    // Verify if the user's preferred name is displayed on the dashboard
    cy.contains('Welcome,').should('be.visible');
    cy.get('[data-cy="preferred-name"]').should('exist'); // Check if preferred name is displayed

    // Verify if the calendar is visible
    cy.contains('Your Calendar').should('be.visible');
  });

  it('should display todo list component on dashboard', () => {
    // Open the menu to access the Tasks page
    cy.get('[data-cy="menu-toggle-button"]').click(); // Open the menu

    // Click on the "Tasks" link to navigate to the tasks page
    cy.contains("Tasks").click();

    // Verify if the To-Do list is displayed on the dashboard
    cy.contains('Your To-Do List').should('be.visible');
    cy.get('[data-cy="todo-list"]').should('exist');
  });

  it('should display categories component from the menu on dashboard', () => {
    // Open the menu to access the Categories page
    cy.get('[data-cy="menu-toggle-button"]').click(); // Open the menu

    // Click on the "Categories" link to navigate to the categories page
    cy.contains("Categories").click();

    // Verify that the categories component is loaded and displayed correctly
    cy.contains('Manage Categories').should('be.visible');
    cy.get('data-cy="category-list"').should('exist');
  });

  it('should display current date and time', () => {
    // Going back to Dashboard
    cy.get('[data-cy="menu-toggle-button"]').click(); 
    cy.contains("Dashboard").click();

    // Verify if the current date and time are displayed correctly
    cy.get('[data-cy="current-datetime"]').should('be.visible');
  });
});
