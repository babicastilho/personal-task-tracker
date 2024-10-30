/// <reference types="cypress" />

/**
 * Custom command to reset a user. If the user already exists, they are deleted and recreated.
 * @param email - User's email
 * @param password - User's password
 * @param profileData - Additional profile data for the user
 */
Cypress.Commands.add("resetUser", (email: string, password: string, profileData: any = {}) => {
  // Step 1: Attempt to log in to check if the user already exists
  cy.request({
    method: "POST",
    url: "/api/auth/login", // Login URL (relative to baseUrl)
    body: { email, password },
    failOnStatusCode: false, // Ignore non-200 statuses (in case user doesn't exist)
  }).then((response) => {
    if (response.status === 200 && response.body?.token) {
      // User exists, proceed with deletion
      const token = response.body.token;

      // Step 2: Delete the user if they exist
      cy.request({
        method: "DELETE",
        url: "/api/users/delete",
        headers: {
          Authorization: `Bearer ${token}`, // Use token for authorization
        },
        failOnStatusCode: false, // Ignore errors if delete fails
      }).then(() => {
        // After deletion, register the user again
        registerUser(email, password, profileData);
      });
    } else {
      // User doesn't exist, register directly
      registerUser(email, password, profileData);
    }
  });
});

/**
 * Helper function to register the user and update their profile.
 * @param email - User's email
 * @param password - User's password
 * @param profileData - Additional profile data for the user
 */
const registerUser = (email: string, password: string, profileData: any) => {
  cy.request({
    method: "POST",
    url: "/api/auth/register", // Registration URL (relative to baseUrl)
    body: {
      username: profileData.username || "testuser", // Default username if not provided
      email,
      password,
    },
    failOnStatusCode: false,
  }).then((registerResponse) => {
    if (registerResponse.status === 201 && registerResponse.body?.token) {
      const token = registerResponse.body.token;

      // Step 4: Update the user's profile with additional data
      cy.request({
        method: "POST",
        url: "/api/users/profile",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          firstName: profileData.firstName || "John",
          lastName: profileData.lastName || "Doe",
          nickname: profileData.nickname || "JohnDoe",
          bio: profileData.bio || "This is a test bio",
        },
      }).then((profileUpdateResponse) => {
        expect(profileUpdateResponse.status).to.eq(200);
      });
    }
  });
};

/**
 * Custom command to delete a user after a test.
 * @param email - User's email
 * @param password - User's password
 */
Cypress.Commands.add("deleteUser", (email: string, password: string) => {
  cy.request({
    method: "POST",
    url: "/api/auth/login",
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200 && response.body?.token) {
      const token = response.body.token;

      cy.request({
        method: "DELETE",
        url: "/api/users/delete",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      });
    }
  });
});

/**
 * Custom command to log in a user.
 * Stores the authentication token in localStorage.
 * @param email - User's email
 * @param password - User's password
 * @param redirectUrl - URL to redirect after login
 */
Cypress.Commands.add("login", (email: string, password: string, redirectUrl: string = "/") => {
  cy.intercept("POST", "/api/auth/login").as("loginRequest");
  cy.visit("/login"); // Access the login page

  cy.get('input[id="email"]').type(email);
  cy.wait(1000);
  cy.get('input[id="password"]').type(password);

  cy.get('button[type="submit"]').click();
  cy.wait("@loginRequest").then((interception) => {
    expect(interception.response.statusCode).to.equal(200);
    cy.visit(redirectUrl); // Redirect after login
  });
});

/**
 * Custom command to log out the user.
 * Removes the authentication token from localStorage and redirects to the login page.
 */
Cypress.Commands.add("logout", () => {
  cy.window().then((win) => {
    win.localStorage.removeItem("token"); // Remove token from localStorage
  });

  cy.clearCookies();
  cy.clearLocalStorage();

  cy.visit("/login"); // Redirect to login page after logout
});
