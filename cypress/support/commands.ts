/// <reference types="cypress" />

/**
 * Custom command to reset a user by deleting if exists and re-registering.
 */
Cypress.Commands.add("resetUser", (email: string, password: string, profileData: any = {}) => {
  // Step 1: Try to log in the user to check if they already exist
  cy.request({
    method: "POST",
    url: "http://localhost:3000/api/auth/login",
    body: { email, password },
    failOnStatusCode: false, // Ignore non-200 status codes (in case user doesn't exist)
  }).then((response) => {
    if (response.status === 200 && response.body?.token) {
      // User exists, proceed to delete
      const token = response.body.token; // Extract token from login response

      // Step 2: Delete the user if they exist
      cy.request({
        method: "DELETE",
        url: "http://localhost:3000/api/users/delete",
        headers: {
          Authorization: `Bearer ${token}`, // Use token for authorization
        },
        failOnStatusCode: false, // Ignore errors if delete fails
      }).then(() => {
        // After deletion, register the user
        registerUser(email, password, profileData); // Call helper function to register user
      });
    } else {
      // User doesn't exist, directly register the user
      registerUser(email, password, profileData); // Call helper function to register user
    }
  });
});

// Helper function to handle user registration and profile update
const registerUser = (email: string, password: string, profileData: any) => {
  // Step 3: Register the user after ensuring deletion
  cy.request({
    method: "POST",
    url: "http://localhost:3000/api/auth/register",
    body: {
      username: profileData.username || "testuser", // Default username if not provided
      email,
      password,
    },
    failOnStatusCode: false, // Do not fail on 409 Conflict errors
  }).then((registerResponse) => {
    if (registerResponse.status === 409) {
      // If user already exists, log an appropriate message and continue
      cy.log('User already exists, skipping registration');
    } else if (registerResponse.status === 201 && registerResponse.body?.token) {
      expect(registerResponse.status).to.eq(201); // Ensure registration success
      const token = registerResponse.body.token; // Extract token from the registration

      // Step 4: Update the user's profile
      cy.request({
        method: "POST",
        url: "http://localhost:3000/api/users/profile",
        headers: {
          Authorization: `Bearer ${token}`, // Use the newly generated token
        },
        body: {
          firstName: profileData.firstName || "John",
          lastName: profileData.lastName || "Doe",
          nickname: profileData.nickname || "JohnDoe",
          bio: profileData.bio || "This is a test bio",
        },
      }).then((profileUpdateResponse) => {
        expect(profileUpdateResponse.status).to.eq(200); // Ensure profile update success
      });
    } else {
      cy.log('User registration failed or unexpected response.');
    }
  });
};

/**
 * Custom command to delete a user at the end of the test.
 * @example cy.deleteUser('user@example.com', 'password123')
 */
Cypress.Commands.add("deleteUser", (email: string, password: string) => {
  // Log in the user to get the token
  cy.request({
    method: "POST",
    url: "http://localhost:3000/api/auth/login",
    body: { email, password },
    failOnStatusCode: false, // Ignore non-200 status codes
  }).then((response) => {
    if (response.status === 200 && response.body?.token) {
      const token = response.body.token; // Extract the token from the login response

      // Send a DELETE request to remove the user
      cy.request({
        method: "DELETE",
        url: "http://localhost:3000/api/users/delete",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        failOnStatusCode: false, // Ignore errors if delete fails
      });
    } else {
      cy.log('User deletion failed or user does not exist.');
    }
  });
});

/**
 * Custom command to log in a user.
 * Stores the authentication token in localStorage for session management.
 * @example cy.login('user@example.com', 'password123')
 */
Cypress.Commands.add("login", (email: string, password: string) => {
  // Intercept the login request
  cy.intercept("POST", "/api/auth/login").as("loginRequest");

  // Visit the login page or homepage where the login form is present
  cy.visit("http://localhost:3000/");

  // Fill in the email and password fields
  cy.get('input[id="email"]').type(email);
  cy.wait(1000);
  cy.get('input[id="password"]').type(password);

  // Submit the login form
  cy.get('button[type="submit"]').click();

  // Wait for the login request and check if it succeeds
  cy.wait("@loginRequest").then((interception) => {
    expect(interception.response.statusCode).to.equal(200);
  });
});

/**
 * Custom command to log out a user.
 * This command removes the auth token from cookies or localStorage and redirects to the login page.
 * @example cy.logout()
 */
Cypress.Commands.add("logout", () => {
  // Remove the token from localStorage (if applicable)
  cy.window().then((win) => {
    win.localStorage.removeItem("token"); // Adjust the key name if it's different in your app
  });

  // Optionally, you can clear cookies or sessionStorage if needed
  cy.clearCookies();
  cy.clearLocalStorage();

  // Optionally, you could visit the logout route if your app has one or redirect to the login page
  cy.visit("http://localhost:3000/login"); // Redirect to the login page after logout
});
