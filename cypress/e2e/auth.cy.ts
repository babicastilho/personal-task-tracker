describe('Authentication', () => {
  before(() => {
    // Use the resetUser command to clean up and create a new user for the tests
    cy.resetUser('test@example.com', 'password123');
  });

  it('should login and redirect to dashboard', () => {
    // Visit the full URL directly
    cy.visit('http://localhost:3000');

    // Simulate user login
    cy.get('input[id="email"]').type('test@example.com');
    cy.get('input[id="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Check that the user is redirected to the dashboard
    cy.contains('Welcome,').should('be.visible');
    cy.contains('Your Calendar').should('be.visible');
  });
});
