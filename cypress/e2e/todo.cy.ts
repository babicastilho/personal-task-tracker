import { formatForDataCy } from "@/lib/utils"; // Importe a função corretamente

describe("Todo App E2E", () => {
  let token;

  before(() => {
    cy.resetUser("test@example.com", "password123", {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JaneS",
      username: "janesmith",
    });
  });

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
    cy.contains("Your To-Do List").should("be.visible");
    cy.get('[data-cy="todo-list"]').should("exist");
  });

  it("should allow users to add a new task with priority, date, and time", () => {
    const taskTitle = `New Task ${Date.now()}`;
    const taskResume = `Resume for ${taskTitle}`;
    const formattedTitle = formatForDataCy(taskTitle);

    cy.get('[data-cy="button-add-task"]').click();
    cy.contains("Add a New Task").should("be.visible");

    cy.get('[data-cy="task-input"]').type(taskTitle);
    cy.get('[data-cy="resume-input"]').type(taskResume);
    cy.get('[data-cy="priority-select"]').select("high");
    cy.get('[data-cy="date-input"]').type("2024-12-31");
    cy.get('[data-cy="time-input"]').type("14:00");
    cy.get('[data-cy="add-task-button"]').click();

    cy.get(`[data-cy="task-${formattedTitle}"]`).should("be.visible");
  });

  it("should allow users to edit an existing task", () => {
    const taskTitle = `Task to Edit ${Date.now()}`;
    const taskResume = `Resume for ${taskTitle}`;
    const newTitle = `Edited Task ${Date.now()}`;
    const newResume = `Edited Resume for ${newTitle}`;
    const formattedTitle = formatForDataCy(taskTitle);

    cy.get('[data-cy="button-add-task"]').click();
    cy.get('[data-cy="task-input"]').type(taskTitle);
    cy.get('[data-cy="resume-input"]').type(taskResume);
    cy.get('[data-cy="add-task-button"]').click();
    cy.contains(taskTitle).should("be.visible");

    cy.get(`[data-cy="edit-task-${formattedTitle}"]`).click();

    cy.get('[data-cy="task-input"]').clear().type(newTitle);
    cy.get('[data-cy="resume-input"]').clear().type(newResume);
    cy.get('[data-cy="add-task-button"]').click();

    cy.contains(newTitle).should("be.visible");
    cy.contains(taskTitle).should("not.exist");
  });

  it("should allow users to cancel and confirm task deletion via the edit form", () => {
    const taskTitle = `Task to Delete ${Date.now()}`;
    const taskResume = `Resume for ${taskTitle}`;
    const formattedTitle = formatForDataCy(taskTitle);

    cy.get('[data-cy="button-add-task"]').click(); // Click 'Add Task' button
    cy.get('[data-cy="task-input"]').type(taskTitle); // Type task title
    cy.get('[data-cy="resume-input"]').type(taskResume); // Type task resume
    cy.get('[data-cy="add-task-button"]').click(); // Click 'Add Task' button to submit
    cy.contains(taskTitle).should("be.visible"); // Ensure task is visible after creation

    // Enter edit mode for the task
    cy.get(`[data-cy="edit-task-${formattedTitle}"]`).click(); // Click on edit button to open edit form

    // Open delete confirmation modal
    cy.get('[data-cy="task-form-delete"]').click(); // Click 'Delete Task' button to open modal
    cy.get('[data-cy="task-delete-cancel-button"]').click(); // Click 'Cancel' button in modal
    cy.contains(taskTitle).should("be.visible"); // Ensure task is still visible after canceling delete

    // Re-open delete confirmation modal to confirm deletion
    cy.get('[data-cy="task-form-delete"]').click(); // Click 'Delete Task' button again
    cy.get('[data-cy="task-delete-confirm-button"]').click(); // Click 'Confirm Delete' button
    cy.contains(taskTitle).should("not.exist"); // Ensure task is no longer visible after deletion
  });
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
