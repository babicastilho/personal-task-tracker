// Adjusts the E2E test to match exact selectors
describe("Filter Modal E2E", () => {
  let token;

  // Sets up the user before all tests
  before(() => {
    cy.resetUser("test@example.com", "password123", {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JaneS",
      username: "janesmith",
    });
  });

  // Set up login and navigation to Tasks page before each test
  beforeEach(() => {
    cy.intercept("POST", "/api/auth/login").as("loginRequest");
    cy.login("test@example.com", "password123", "/dashboard");
    cy.wait("@loginRequest").then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });
    // Open the menu to access the Tasks page
    cy.get('[data-cy="menu-toggle-button"]').click(); // Open the menu

    // Click on the "Tasks" link to navigate to the tasks page
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

    // Selects high priority in the priority dropdown
    cy.get('[data-cy="priority-dropdown-toggle"]').should("be.visible").click();
    cy.get('[data-cy="priority-dropdown-option-high"]').click();

    // Saves the new task and verifies it appears in the list
    cy.wait(1000);
    cy.get('[data-cy="add-task-button"]').click({ force: true });

    cy.contains(taskTitle).should("be.visible");
  });

  it("should open the filter modal and apply a priority filter", () => {
    cy.wait(2000);
    cy.get('[data-cy="filter-modal-button"]').click();
    cy.get('[data-cy="filter-modal"]').should("be.visible");

    // Applies the priority filter
    cy.get('[data-cy="priority-filter-high"]').click();

    // Verifies that there are visible tasks that match the applied filter
    cy.get('[data-cy="task-list"]')
      .find('[data-cy^="task-"]') // Selects all tasks with data-cy starting with 'task-'
      .should("have.length.greaterThan", 0) // Ensures there are tasks displayed
      .each(($task) => {
        // Checks if each task contains the text "High", indicating the correct priority filter
        cy.wrap($task).should("contain.text", "High");
      });

    // Closes the filter modal and cancels clearing filters in the confirmation modal
    cy.get('[data-cy="close-modal-button"]').click();
    cy.get('[data-cy="confirmation-modal"]').should("be.visible");
    cy.get('[data-cy="cancel-clear-filters"]').click();
    cy.get('[data-cy="filter-modal"]').should("not.exist");
  });

  it("should show confirmation modal when closing and clear filters on confirm", () => {
    // Opens the filter modal and applies the medium priority filter
    cy.get('[data-cy="filter-modal-button"]').click();
    cy.get('[data-cy="priority-filter-medium"]').click();

    // Attempts to close the filter modal and confirms clearing filters
    cy.get('[data-cy="close-modal-button"]').click();
    cy.get('[data-cy="confirmation-modal"]').should("be.visible");
    cy.get('[data-cy="confirm-clear-filters"]').click();

    // Verifies that the modal is closed and tasks are reloaded
    cy.get('[data-cy="filter-modal"]').should("not.exist");
    // Verifies that tasks are displayed within the task list container
    cy.get('[data-cy="task-list"]').within(() => {
      cy.get('[data-cy^="task-"]').should("exist"); // Selects any task element with data-cy starting with 'task-'
    });
  });
});
