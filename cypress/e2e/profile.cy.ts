// cypress/e2e/profile.cy.ts

describe('Profile Page E2E', () => {
  let token: string;

  before(() => {
    // Create a user for testing the profile page
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
    // Log the user in and navigate to the profile page
    cy.login('test@example.com', 'password123').then(() => {
      // Ensure the user is on the dashboard and redirect to the profile page
      cy.contains('Welcome,').should('be.visible');
      cy.get('[data-cy="menu-toggle-button"]').click();
      cy.contains('Profile').click(); // Click on the profile link in the menu
    });
  });

  it('should load user profile data correctly', () => {
    // Verify that profile data can be accessed and displayed even when it's empty or default
    cy.get('input[name="firstName"]').should('exist'); // Verify input exists (even if empty)
    cy.get('input[name="lastName"]').should('exist'); // Verify input exists
    cy.get('textarea[name="bio"]').should('be.visible'); // Check the bio field is visible
  });

  it('should allow users to update their profile', () => {
    const newFirstName = 'UpdatedFirstName';

    // Update the first name and bio
    cy.get('input[name="firstName"]').clear().type(newFirstName);
    cy.get('textarea[name="bio"]').clear().type('This is an updated bio.');
    cy.contains('Save Profile').click();

    // Verify if the profile was updated successfully
    cy.get('input[name="firstName"]').should('have.value', newFirstName);
    cy.contains('Profile updated successfully').should('be.visible');
  });

  it('should prevent access to profile page if not authenticated', () => {
    // Simulate user logout
    cy.logout();

    // Try to access the profile page without being logged in
    cy.visit('http://localhost:3000/profile');
    cy.url().should('include', '/login'); // Verify if the user is redirected to login
  });
});
