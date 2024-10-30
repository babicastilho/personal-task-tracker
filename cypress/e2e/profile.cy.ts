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

    // Login
    cy.login("test@example.com", "password123", "/login");

    cy.wait("@loginRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.contains("Profile").click();

    cy.contains("Edit Profile").should("be.visible");
    cy.wait(2000);

    cy.get('[data-cy="edit-profile"]').should("exist");
  });

  it("should load user profile data correctly", () => {
    cy.get('input[name="firstName"]').should("exist");
    cy.get('input[name="lastName"]').should("exist");
    cy.get('textarea[name="bio"]').should("be.visible");
  });

  it("should allow users to update their profile", () => {
    const newFirstName = "UpdatedFirstName";

    cy.get('input[name="firstName"]').clear().type(newFirstName);
    cy.get('textarea[name="bio"]').clear().type("This is an updated bio.");
    cy.contains("Save Profile").click();

    cy.get('input[name="firstName"]').should("have.value", newFirstName);
    cy.contains("Profile updated successfully").should("be.visible");
  });

  it("should prevent access to profile page if not authenticated", () => {
    cy.logout();

    cy.visit("/profile"); // Redireciona ao perfil sem autenticação
    cy.url({ timeout: 5000 }).should('include', '/login?message=no_token'); 
  });
});
