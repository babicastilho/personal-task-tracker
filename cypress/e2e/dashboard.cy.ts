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
      // Ensure the login response was successful
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  it("should display user information on the dashboard", () => {
    // Verify if welcome message is displayed on the dashboard
    cy.get('[data-cy="welcome-message"]').should("exist");

    // Check if preferred name is displayed
    cy.get('[data-cy="preferred-name"]').should("exist");

    // Verify if the calendar is displayed
    cy.get('[data-cy="dashboard-calendar"]').should("exist");
  });

  it("should display current date and time", () => {
    // Going back to Dashboard
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.contains("Dashboard").click();

    // Verify if the current date and time are displayed correctly
    cy.get('[data-cy="current-datetime"]').should("be.visible");
  });

  it("should display todo list component on dashboard", () => {
    // Open the menu to access the Tasks page
    cy.get('[data-cy="menu-toggle-button"]').click(); // Open the menu

    // Click on the "Tasks" link to navigate to the tasks page
    cy.get('[data-cy="sidebar-view-tasks"]').click();
    cy.wait(500);
    cy.get('[data-cy="sidebar-tasks-cards"]').click();
    cy.wait(500);

    // Verify if the To-Do list is displayed on the dashboard
    cy.contains("Your To-Do List").should("be.visible");
    cy.wait(1000);
    cy.get('[data-cy="todo-list"]').should("exist");
  });

  it("should display categories component from the menu on dashboard", () => {
    // Open the menu to access the Categories page
    cy.get('[data-cy="menu-toggle-button"]').click(); // Open the menu

    // Click on the "Categories" link to navigate to the categories page
    cy.contains("Categories").click();

    // Verify that the categories component is loaded and displayed correctly
    cy.contains("Manage Categories").should("be.visible");
    cy.wait(2000); // Wait for DOM update

    // Correct selector to verify the categories list
    cy.get('[data-cy="categories-list"]').should("exist");
  });

  it("should display profile component from the menu on dashboard", () => {
    // Open the menu to access the Profile page
    cy.get('[data-cy="menu-toggle-button"]').click(); // Open the menu

    // Click on the "Profile" link to navigate to the profile page
    cy.contains("Profile").click();

    // Verify that the profile component is loaded and displayed correctly
    cy.contains("Edit Profile").should("be.visible");
    cy.wait(2000); // Wait for DOM update

    // Correct selector to verify the edit profile component
    cy.get('[data-cy="edit-profile"]').should("exist");
  });

  after(() => {
    cy.deleteUser("test@example.com", "password123");
  });
});
