// cypress/support/commands.ts
// Import necessary types from Cypress
/// <reference types="cypress" />


/**
 * Custom command to reset a user by deleting if exists and re-registering.
 * This command first attempts to log in the user. If successful, it deletes the user.
 * Then, it re-registers the user with the provided credentials.
 * @example cy.resetUser('user@example.com', 'password123')
 */
Cypress.Commands.add('resetUser', (email: string, password: string) => {
  // Send a POST request to log in the user
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/auth/login', // Specify the API endpoint for logging in
    body: {
      email: email,
      password: password,
    },
    failOnStatusCode: false, // Do not fail if the login request returns a non-200 status code
  }).then((response) => {
    if (response.status === 200) {
      const token = response.body.token; // Extract the token from the response

      // If the user exists, send a DELETE request to remove the user
      cy.request({
        method: 'DELETE',
        url: 'http://localhost:3000/api/users/delete', // Specify the API endpoint for deleting the user
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        failOnStatusCode: false, // Do not fail if the delete request returns a non-200 status code
      });
    }

    // Send a POST request to register a new user
    cy.request('POST', 'http://localhost:3000/api/auth/register', {
      username: 'testuser', // The username for the new user
      email: email,
      password: password,
    }).then((registerResponse) => {
      expect(registerResponse.status).to.eq(201); // Expect the registration to be successful
    });
  });
});

/**
 * Custom command to log in a user.
 * Stores the authentication token in localStorage for session management.
 * @example cy.login('user@example.com', 'password123')
 */
Cypress.Commands.add('login', (email: string, password: string) => {
  // Visit the login page or homepage where the login form is present
  cy.visit('http://localhost:3000'); // Ajuste a URL conforme necessário

  // Fill in the email and password fields
  cy.get('input[id="email"]').type(email);
  cy.get('input[id="password"]').type(password);

  // Submit the login form
  cy.get('button[type="submit"]').click();

  // Wait for a visible indicator that the user is logged in, such as a welcome message or a logout button
  cy.contains('Welcome,').should('be.visible'); // Ajuste o seletor para algo que indique que o login foi bem-sucedido
});


