import { formatForDataCy } from "@/lib/utils";

describe("Todo App E2E", () => {
  let token;

  before(() => {
    // Reset the user before tests
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

    // Access the Tasks page
    cy.get('[data-cy="menu-toggle-button"]').click();
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

    cy.get('[data-cy="task-input"]').type(taskTitle);
    cy.get('[data-cy="resume-input"]').type(taskResume);

    cy.get('[data-cy="priority-dropdown-toggle"]').click();
    cy.get('[data-cy="priority-dropdown-option-high"]').click();

    cy.get('[data-cy="date-input"]').type("2024-12-31");
    cy.get('[data-cy="time-input"]').type("14:00");
    cy.get('[data-cy="add-task-button"]').scrollIntoView().click();

    cy.get(`[data-cy="task-card-${formattedTitle}"]`).should("be.visible");
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
    cy.get('[data-cy="add-task-button"]').scrollIntoView().click();
    cy.contains(taskTitle).should("be.visible");

    cy.get(`[data-cy="edit-task-${formattedTitle}"]`).click();

    cy.get('[data-cy="task-input"]').clear().type(newTitle);
    cy.get('[data-cy="resume-input"]').clear().type(newResume);

    cy.get('[data-cy="priority-dropdown-toggle"]').click();
    cy.get('[data-cy="priority-dropdown-option-medium"]').click();

    cy.get('[data-cy="add-task-button"]').scrollIntoView().click();

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
    cy.get('[data-cy="add-task-button"]').scrollIntoView().click();

    cy.contains(taskTitle).should("be.visible");

    cy.get(`[data-cy="edit-task-${formattedTitle}"]`).click();
    cy.wait(1000);

    cy.get('[data-cy="task-form-delete"]').click();
    cy.wait(1000);

    cy.get('[data-cy="task-delete-cancel-button"]').click();
    cy.contains(taskTitle).should("be.visible");

    cy.get('[data-cy="task-form-delete"]').click();
    cy.wait(1000);

    cy.get('[data-cy="task-delete-confirm-button"]').scrollIntoView().click();
    cy.contains(taskTitle).should("not.exist");
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
