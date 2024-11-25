/// <reference types="cypress" />

import { navigateAndVerify, checkElementVisibility } from "../support/utils";

describe("Filter Modal E2E", () => {
  let token;

  before(() => {
    // Resets the user before all tests
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
    // Login and navigate to the tasks page
    cy.intercept("POST", "/api/auth/login").as("loginRequest");
    cy.login("test@example.com", "password123", "/dashboard");
    cy.wait("@loginRequest").then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Open the menu and navigate to the tasks page
    cy.get('[data-cy="menu-toggle-button"]').click();
    cy.get('[data-cy="sidebar-view-tasks"]').click();
    cy.wait(500);
    cy.get('[data-cy="sidebar-tasks-cards"]').click();
    cy.wait(500);

    // Add a task with high priority
    const taskTitle = `High Priority Task ${Date.now()}`;
    const taskResume = `Resume for ${taskTitle}`;
    cy.get('[data-cy="button-add-task"]').click();
    cy.get('[data-cy="task-input"]').type(taskTitle);
    cy.get('[data-cy="resume-input"]').type(taskResume);

    cy.get('[data-cy="priority-dropdown-toggle"]').should("be.visible").click();
    cy.get('[data-cy="priority-dropdown-option-high"]').click();

    cy.wait(1000);
    cy.get('[data-cy="add-task-button"]').click({ force: true });
    checkElementVisibility(
      `[data-cy^="task-"]:contains("${taskTitle}")`,
      "Task with high priority added successfully",
      "Task with high priority was not added"
    );
  });

  it("should open the filter modal and apply a priority filter", () => {
    // Open the filter modal
    cy.wait(2000);
    cy.get('[data-cy="filter-modal-button"]').click();
    checkElementVisibility(
      '[data-cy="filter-modal"]',
      "Filter modal opened successfully",
      "Filter modal did not open"
    );

    // Apply the high-priority filter
    cy.get('[data-cy="priority-filter-high"]').click();
    cy.get('[data-cy="task-list"]')
      .find('[data-cy^="task-"]')
      .should("have.length.greaterThan", 0)
      .each(($task) => {
        cy.wrap($task).should("contain.text", "High");
      });

    // Close the modal and handle confirmation
    cy.get('[data-cy="close-modal-button"]').click();
    checkElementVisibility(
      '[data-cy="confirmation-modal"]',
      "Confirmation modal opened on close",
      "Confirmation modal did not open on close"
    );
    cy.get('[data-cy="cancel-clear-filters"]').click();
    cy.get('[data-cy="filter-modal"]').should("not.exist");
  });

  it("should show confirmation modal when closing and clear filters on confirm", () => {
    // Open the filter modal and apply a filter
    cy.get('[data-cy="filter-modal-button"]').click();
    cy.get('[data-cy="priority-filter-medium"]').click();

    // Close the modal and confirm filter clearing
    cy.get('[data-cy="close-modal-button"]').click();
    checkElementVisibility(
      '[data-cy="confirmation-modal"]',
      "Confirmation modal opened successfully",
      "Confirmation modal did not open"
    );
    cy.get('[data-cy="confirm-clear-filters"]').click();

    // Verify the filter modal closes and tasks are visible
    cy.get('[data-cy="filter-modal"]').should("not.exist");
    cy.get('[data-cy="task-list"]').within(() => {
      cy.get('[data-cy^="task-"]').should("exist");
    });
  });

  after(() => {
    cy.deleteUser("test@example.com", "password123");
  });
});
