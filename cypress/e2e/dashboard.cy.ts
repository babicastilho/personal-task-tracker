describe("Dashboard Page E2E", () => {
  let token;

  before(() => {
    // Create a user with custom profile data for testing the dashboard
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
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  it("should display user information on the dashboard", () => {
    cy.get('[data-cy="welcome-message"]').should("exist");
    cy.get('[data-cy="preferred-name"]').should("exist");
    cy.get('[data-cy="dashboard-calendar"]').should("exist");
  });

  it("should display current date and time", () => {
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.get('[data-cy="sidebar-dashboard"]').click();
    cy.get('[data-cy="current-datetime"]').should("be.visible");
  });

  it("should display todo list component on dashboard", () => {
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.get('[data-cy="sidebar-view-tasks"]').click();
    cy.get('[data-cy="sidebar-tasks-cards"]').click();
    cy.get('[data-cy="todo-list"]').should("exist");
  });

  it("should display categories component from the menu on dashboard", () => {
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.get('[data-cy="sidebar-categories"]').click();
    cy.get('[data-cy="categories-list"]').should("exist");
  });

  it("should display profile component from the menu on dashboard", () => {
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.get('[data-cy="sidebar-profile"]').click();
    cy.get('[data-cy="edit-profile"]').should("exist");
  });

  after(() => {
    cy.deleteUser("test@example.com", "password123");
  });
});
