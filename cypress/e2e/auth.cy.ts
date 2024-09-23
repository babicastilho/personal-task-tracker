describe('Authentication', () => {
  before(() => {
    // Reset the user before tests
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
    // Login and navigate to the dashboard
    cy.login('test@example.com', 'password123');
    cy.visit('http://localhost:3000/dashboard');

    // Intercept the session check request to simulate session expiration
    cy.intercept('GET', '/api/auth/check', {
      statusCode: 401, // Simulate a 401 Unauthorized response
      body: { success: false, message: 'Token expired' },
    }).as('expiredSession');

    // Reload the page to trigger the session check
    cy.reload();

    // Wait for the session check request to occur
    cy.wait('@expiredSession');
    
    // Ensure the user is redirected to the login page with a session expired message
    cy.url({ timeout: 10000 }).should('include', '/login?message=session_expired');
    
    // Verify that the session expired message is visible
    cy.contains('Your session has expired. Please log in again.').should('be.visible');
  });
});
