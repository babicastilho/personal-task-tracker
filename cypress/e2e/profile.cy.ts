// cypress/e2e/profile.cy.ts

describe("Profile Page E2E", () => {
  let token: string;

  before(() => {
    // Reset the user before tests, this could be a custom command that clears and recreates the user
    cy.resetUser("test@example.com", "password123", {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JaneS",
      username: "janesmith",
    }).then((response) => {
      token = response.body.token; // Store the token for API requests
    });
  });

  beforeEach(() => {
    // Intercept the login request before the test
    cy.intercept("POST", "/api/auth/login").as("loginRequest");

    // Use the custom login function
    cy.login("test@example.com", "password123", "/login");

    // Wait for the intercepted login request and assert the response
    cy.wait("@loginRequest").then((interception) => {
      // Ensure the login response was successful
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.contains("Profile").click(); // Click on the profile link in the menu

    // Verify that the profile component is loaded and displayed correctly
    cy.contains("Edit Profile").should("be.visible");
    cy.wait(2000); // Wait for DOM update

    // Correct selector to verify the edit profile component
    cy.get('[data-cy="edit-profile"]').should("exist");
  });

  it("should load user profile data correctly", () => {
    // Verify that profile data can be accessed and displayed even when it's empty or default
    cy.get('input[name="firstName"]').should("exist"); // Verify input exists (even if empty)
    cy.get('input[name="lastName"]').should("exist"); // Verify input exists
    cy.get('textarea[name="bio"]').should("be.visible"); // Check the bio field is visible
  });

  it("should allow users to update their profile", () => {
    const newFirstName = "UpdatedFirstName";

    // Update the first name and bio
    cy.get('input[name="firstName"]').clear().type(newFirstName);
    cy.get('textarea[name="bio"]').clear().type("This is an updated bio.");
    cy.contains("Save Profile").click();

    // Verify if the profile was updated successfully
    cy.get('input[name="firstName"]').should("have.value", newFirstName);
    cy.contains("Profile updated successfully").should("be.visible");
  });

  it("should prevent access to profile page if not authenticated", () => {
    // Simulate user logout
    cy.logout();

    // Try to access the profile page without being logged in
    cy.visit("http://localhost:3000/profile");
    // Increase the wait time to ensure the redirection happens
    cy.url({ timeout: 5000 }).should('include', '/login?message=no_token'); 
  });
});
