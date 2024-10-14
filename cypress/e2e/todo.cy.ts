import { formatForDataCy } from "@/lib/utils"; // Correctly import the utility function

describe("Todo App E2E", () => {
  let token;

  // Set up the user before all tests
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
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.contains("Tasks").click();
  });

  it("should load the app and display the task list", () => {
    cy.wait(1000);
    cy.contains("Your To-Do List").should("be.visible");
    cy.get('[data-cy="todo-list"]').should("exist");
  });

  it("should allow users to add a new task with priority, date, and time", () => {
    const taskTitle = `New Task ${Date.now()}`;
    const taskResume = `Resume for ${taskTitle}`;
    const formattedTitle = formatForDataCy(taskTitle);

    cy.get('[data-cy="button-add-task"]').click();
    cy.contains("Add a New Task").should("be.visible");

    // Fill in task details
    cy.get('[data-cy="task-input"]').type(taskTitle);
    cy.get('[data-cy="resume-input"]').type(taskResume);

    // Waits for the dropdown toggle to be visible, then clicks it
    cy.get('[data-cy="priority-dropdown-toggle"]').should('be.visible').click();
    cy.get('[data-cy="priority-dropdown-option-high"]').click();

    // Selects the date and time for the task
    cy.get('[data-cy="date-input"]').type("2024-12-31");
    cy.get('[data-cy="time-input"]').type("14:00");
    cy.get('[data-cy="add-task-button"]').click();

    // Asserts that the new task appears in the list
    cy.get(`[data-cy="task-${formattedTitle}"]`).should("be.visible");
  });

  it("should allow users to edit an existing task", () => {
    const taskTitle = `Task to Edit ${Date.now()}`;
    const taskResume = `Resume for ${taskTitle}`;
    const newTitle = `Edited Task ${Date.now()}`;
    const newResume = `Edited Resume for ${newTitle}`;
    const formattedTitle = formatForDataCy(taskTitle);

    // Adds a new task to be edited
    cy.get('[data-cy="button-add-task"]').click();
    cy.get('[data-cy="task-input"]').type(taskTitle);
    cy.get('[data-cy="resume-input"]').type(taskResume);
    cy.get('[data-cy="add-task-button"]').click();
    cy.contains(taskTitle).should("be.visible");

    // Opens the task edit form
    cy.get(`[data-cy="edit-task-${formattedTitle}"]`).click();

    // Updates the task title and description
    cy.get('[data-cy="task-input"]').clear().type(newTitle);
    cy.get('[data-cy="resume-input"]').clear().type(newResume);

    // Ensures the priority dropdown is visible, then selects a new priority
    cy.get('[data-cy="priority-dropdown-toggle"]').should('be.visible').click();
    cy.get('[data-cy="priority-dropdown-option-medium"]').click();

    // Saves the edited task
    cy.get('[data-cy="add-task-button"]').click();

    // Verifies that the new title appears and the old title no longer exists
    cy.contains(newTitle).should("be.visible");
    cy.contains(taskTitle).should("not.exist");
  }); 

  it("should allow users to cancel and confirm task deletion via the edit form", () => {
    const taskTitle = `Task to Delete ${Date.now()}`;
    const taskResume = `Resume for ${taskTitle}`;
    const formattedTitle = formatForDataCy(taskTitle);

    cy.get('[data-cy="button-add-task"]').click();
    cy.get('[data-cy="task-input"]').type(taskTitle);
    cy.get('[data-cy="resume-input"]').type(taskResume);
    cy.get('[data-cy="add-task-button"]').click();
    cy.contains(taskTitle).should("be.visible");

    cy.get(`[data-cy="edit-task-${formattedTitle}"]`).click();

    // Open delete confirmation modal and cancel deletion
    cy.get('[data-cy="task-form-delete"]').click();
    cy.get('[data-cy="task-delete-cancel-button"]').click();
    cy.contains(taskTitle).should("be.visible");

    // Re-open delete confirmation modal and confirm deletion
    cy.get('[data-cy="task-form-delete"]').click();
    cy.get('[data-cy="task-delete-confirm-button"]').click();
    cy.contains(taskTitle).should("not.exist");
  });

  // Clean up the created user after all tests
  after(() => {
    cy.request({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "test@example.com",
        password: "password123",
      },
    }).then((response) => {
      if (response.status === 200) {
        token = response.body.token;
        cy.request({
          method: "DELETE",
          url: "/api/users/delete",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    });
  });
});
