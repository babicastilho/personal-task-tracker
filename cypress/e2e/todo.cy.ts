import { formatForDataCy } from "@/lib/utils"; 

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
        
    // Open the menu to access the Tasks page
    cy.get('[data-cy="menu-toggle-button"]').click(); // Open the menu

    // Click on the "Tasks" link to navigate to the tasks page
    cy.get('[data-cy="sidebar-view-tasks"]').click();
    cy.wait(500);
    cy.get('[data-cy="sidebar-tasks-cards"]').click();
    cy.wait(500);
  });

  it("should load the app and display the task list", () => {
    cy.wait(1000);
    cy.contains("Your To-Do List").should("be.visible");
    cy.get('[data-cy="todo-list-title"]').should("exist");
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
    cy.get('[data-cy="priority-dropdown-toggle"]').should("be.visible").click();
    cy.get('[data-cy="priority-dropdown-option-high"]').click();

    // Selects the date and time for the task
    cy.get('[data-cy="date-input"]').type("2024-12-31");
    cy.get('[data-cy="time-input"]').type("14:00");
    cy.get('[data-cy="add-task-button"]').scrollIntoView().click();

    // Asserts that the new task appears in the list using formattedTitle
    cy.get(`[data-cy="task-card-${formattedTitle}"]`).should("be.visible");
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
    cy.get('[data-cy="add-task-button"]').scrollIntoView().click();
    cy.contains(taskTitle).should("be.visible");

    // Opens the task edit form
    cy.get(`[data-cy="edit-task-${formattedTitle}"]`).click();

    // Updates the task title and description
    cy.get('[data-cy="task-input"]').clear().type(newTitle);
    cy.get('[data-cy="resume-input"]').clear().type(newResume);

    // Ensures the priority dropdown is visible, then selects a new priority
    cy.get('[data-cy="priority-dropdown-toggle"]').should("be.visible").click();
    cy.get('[data-cy="priority-dropdown-option-medium"]').click();

    // Saves the edited task
    cy.get('[data-cy="add-task-button"]').scrollIntoView().click();

    // Verifies that the new title appears and the old title no longer exists
    cy.contains(newTitle).should("be.visible");
    cy.contains(taskTitle).should("not.exist");
  });

  it("should allow users to cancel and confirm task deletion via the edit form", () => {
    const taskTitle = `Task to Delete ${Date.now()}`;
    const taskResume = `Resume for ${taskTitle}`;
    const formattedTitle = formatForDataCy(taskTitle);

    // Add a new task to be deleted
    cy.get('[data-cy="button-add-task"]').click();
    cy.get('[data-cy="task-input"]').type(taskTitle);
    cy.get('[data-cy="resume-input"]').type(taskResume);
    cy.get('[data-cy="add-task-button"]').scrollIntoView().click();

    // Verify the new task is visible in the list
    cy.contains(taskTitle).should("be.visible");

    // Open the edit form for the task
    cy.get(`[data-cy="edit-task-${formattedTitle}"]`).click();
    cy.wait(1000); // Increase wait to ensure modal is fully loaded

    // Open the delete confirmation modal and wait for it to appear
    cy.get('[data-cy="task-form-delete"]').scrollIntoView().should('be.visible').click();
    cy.wait(1000); // Increase wait to ensure modal is fully rendered

    // Ensure the delete confirmation modal and buttons are visible
    cy.get('[data-cy="task-delete-confirm-button"]').should('be.visible');
    cy.get('[data-cy="task-delete-cancel-button"]').should('be.visible');
    cy.wait(1000); // Additional wait to ensure the modal is fully rendered

    // Cancel deletion and verify the task is still present
    cy.get('[data-cy="task-delete-cancel-button"]').click();
    cy.contains(taskTitle).should("be.visible");

    // Reopen the delete confirmation modal and confirm deletion
    cy.get('[data-cy="task-form-delete"]').click();
    cy.wait(1000); // Wait for the modal to reappear

    // Confirm deletion and verify the task is deleted
    cy.get('[data-cy="task-delete-confirm-button"]').scrollIntoView().click();
    cy.wait(1000); // Final wait to ensure the deletion is processed
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
