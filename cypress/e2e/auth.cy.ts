describe('Authentication', () => {
  before(() => {
    // Reset the user before tests, this could be a custom command that clears and recreates the user
    cy.resetUser('test@example.com', 'password123', {
      firstName: 'Jane',
      lastName: 'Smith',
      nickname: 'JaneS',
      username: 'janesmith',
    });
  });

  it('should login and redirect to dashboard', () => {
    // Intercept the login request before the test
    cy.intercept('POST', '/api/auth/login').as('loginRequest');

    // Use the custom login function
    cy.login('test@example.com', 'password123');

    // Wait for the intercepted login request and assert the response
    cy.wait('@loginRequest').then((interception) => {
      // Ensure the login response was successful
      expect(interception.response.statusCode).to.equal(200);
    });

    // Verify the user is redirected to the dashboard
    cy.url().should('include', '/dashboard');

    // Wait for a known element to appear in the dashboard, ensuring it's visible
    cy.wait(2000);
    cy.contains('Welcome,').should('be.visible');
  });

  it('should handle session expiration gracefully', () => {
    // Simulate session expiration by clearing the authToken from localStorage
    cy.visit('http://localhost:3000/dashboard');
    cy.clearLocalStorage('authToken');
  
    // Wait a little to ensure the session expiration is processed before reloading
    cy.wait(1000);
  
    // Reload the page after the session has expired
    cy.reload();
  
    // Increase the wait time to ensure the redirection happens
    cy.url({ timeout: 10000 }).should('include', '/login?message=session_expired');
    
    // Verify that the session expired message is visible
    cy.contains('Your session has expired. Please log in again.').should('be.visible');
  });  
});
