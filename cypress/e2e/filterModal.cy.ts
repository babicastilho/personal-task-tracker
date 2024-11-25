describe("Filter Modal E2E", () => {
  let token;

  // Sets up the user before all tests
  before(() => {
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
    cy.intercept("POST", "/api/auth/login").as("loginRequest");
    cy.login("test@example.com", "password123", "/dashboard");
    cy.wait("@loginRequest").then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Open the menu to access the Tasks page
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.get('[data-cy="sidebar-view-tasks"]').click();
    cy.wait(500);
    cy.get('[data-cy="sidebar-tasks-cards"]').click();
    cy.wait(500);

    // Adds a task with high priority
    const taskTitle = `High Priority Task ${Date.now()}`;
    const taskResume = `Resume for ${taskTitle}`;
    cy.get('[data-cy="button-add-task"]').click();
    cy.get('[data-cy="task-input"]').type(taskTitle);
    cy.get('[data-cy="resume-input"]').type(taskResume);

    cy.get('[data-cy="priority-dropdown-toggle"]').should("be.visible").click();
    cy.get('[data-cy="priority-dropdown-option-high"]').click();

    cy.wait(1000);
    cy.get('[data-cy="add-task-button"]').click({ force: true });
    cy.contains(taskTitle).should("be.visible");
  });

  it("should open the filter modal and apply a priority filter", () => {
    cy.wait(2000);
    cy.get('[data-cy="filter-modal-button"]').click();
    cy.get('[data-cy="filter-modal"]').should("be.visible");

    cy.get('[data-cy="priority-filter-high"]').click();

    cy.get('[data-cy="task-list"]')
      .find('[data-cy^="task-"]')
      .should("have.length.greaterThan", 0)
      .each(($task) => {
        cy.wrap($task).should("contain.text", "High");
      });

    cy.get('[data-cy="close-modal-button"]').click();
    cy.get('[data-cy="confirmation-modal"]').should("be.visible");
    cy.get('[data-cy="cancel-clear-filters"]').click();
    cy.get('[data-cy="filter-modal"]').should("not.exist");
  });

  it("should show confirmation modal when closing and clear filters on confirm", () => {
    cy.get('[data-cy="filter-modal-button"]').click();
    cy.get('[data-cy="priority-filter-medium"]').click();

    cy.get('[data-cy="close-modal-button"]').click();
    cy.get('[data-cy="confirmation-modal"]').should("be.visible");
    cy.get('[data-cy="confirm-clear-filters"]').click();

    cy.get('[data-cy="filter-modal"]').should("not.exist");
    cy.get('[data-cy="task-list"]').within(() => {
      cy.get('[data-cy^="task-"]').should("exist");
    });
  });

  after(() => {
    cy.deleteUser("test@example.com", "password123");
  });
});
