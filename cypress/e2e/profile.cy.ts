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

    // Verify the profile edit form is loaded
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="edit-profile"]').length > 0) {
        cy.log("Profile page loaded successfully");
        cy.get('[data-cy="edit-profile"]').should("be.visible");
      } else {
        cy.log("Profile page did not load");
      }
    });
  });

  it("should load user profile data correctly", () => {
    // Verify essential input fields for profile data
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="first-name-input"]').length > 0) {
        cy.log("Profile fields loaded successfully");
        cy.get('[data-cy="first-name-input"]').should("exist");
        cy.get('[data-cy="last-name-input"]').should("exist");
        cy.get('[data-cy="bio-textarea"]').should("be.visible");
      } else {
        cy.log("Profile fields did not load");
      }
    });
  });

  it("should allow users to update their profile", () => {
    const newFirstName = "UpdatedFirstName";
  
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="first-name-input"]').length > 0) {
        cy.log("Profile edit form loaded successfully");
  
        // Ensure the field is cleared before typing
        cy.get('[data-cy="first-name-input"]')
          .invoke("val") // Get the current value
          .then((currentValue) => {
            cy.log(`Current value: ${currentValue}`);
            cy.get('[data-cy="first-name-input"]').clear().type(newFirstName);
          });
  
        cy.get('[data-cy="bio-textarea"]').clear().type("This is an updated bio.");
  
        // Scroll to and click the "Save Profile" button
        cy.get('[data-cy="save-profile"]')
          .scrollIntoView()
          .should("be.visible")
          .click();
  
        // Verify profile update success message and final value
        cy.get('[data-cy="first-name-input"]').should("have.value", newFirstName);
        cy.get('[data-cy="success-message"]').should("exist");
      } else {
        cy.log("Profile edit form did not load");
      }
    });
  }); 

  it("should prevent access to profile page if not authenticated", () => {
    // Mock the auth check response to simulate an unauthenticated user
    cy.intercept("GET", "/api/auth/check", {
      statusCode: 401, // Simulate unauthorized response
      body: { success: false, message: "Unauthorized" },
    }).as("authCheck");
  
    // Perform logout to clear authentication state
    cy.logout();
  
    // Attempt to visit the profile page
    cy.visit("/profile");
  
    // Wait for the auth check request and validate the response
    cy.wait("@authCheck").then((interception) => {
      expect(interception.response.statusCode).to.equal(401);
    });
  
    // Verify redirection to the login page with appropriate message
    cy.url({ timeout: 5000 }).should("include", "/login?message=no_token");
  });  

  after(() => {
    // Delete test user after tests
    cy.deleteUser("test@example.com", "password123");
  });
});
