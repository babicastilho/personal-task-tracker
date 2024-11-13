describe("Profile Page E2E", () => {
  let token: string;

  before(() => {
    // Reset the user before tests
    cy.resetUser("test@example.com", "password123", {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JaneS",
      username: "janesmith",
    }).then((response) => {
      token = response.body.token;
    });
  });

  beforeEach(() => {
    // Intercept login request
    cy.intercept("POST", "/api/auth/login").as("loginRequest");

    // Perform login
    cy.login("test@example.com", "password123", "/login");

    // Wait for the login request and verify response
    cy.wait("@loginRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    // Open the profile page via sidebar
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.get('[data-cy="sidebar-profile"]').click();

    // Verify the profile edit form is visible
    cy.get('[data-cy="edit-profile"]').should("be.visible");
  });

  it("should load user profile data correctly", () => {
    // Verify essential input fields for profile data
    cy.get('[data-cy="first-name-input"]').should("exist");
    cy.get('[data-cy="last-name-input"]').should("exist");
    cy.get('[data-cy="bio-textarea"]').should("be.visible");
  });

  it("should allow users to update their profile", () => {
    const newFirstName = "UpdatedFirstName";

    // Update profile fields
    cy.get('[data-cy="first-name-input"]').clear().type(newFirstName);
    cy.get('[data-cy="bio-textarea"]').clear().type("This is an updated bio.");
    
    // Scroll to and click the "Save Profile" button
    cy.get('[data-cy="save-profile"]').scrollIntoView().should("be.visible").click();

    // Verify profile update success message
    cy.get('[data-cy="first-name-input"]').should("have.value", newFirstName);
    cy.get('[data-cy="status-message"]').should("contain", "Profile updated successfully");
  });

  it("should prevent access to profile page if not authenticated", () => {
    // Logout to test unauthorized access
    cy.logout();

    // Attempt to visit the profile page
    cy.visit("/profile");
    cy.url({ timeout: 5000 }).should("include", "/login?message=no_token"); 
  });

  after(() => {
    // Delete test user after tests
    cy.deleteUser("test@example.com", "password123");
  });
});
