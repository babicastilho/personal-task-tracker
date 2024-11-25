/// <reference types="cypress" />

import { checkElementVisibility } from "../support/utils";

/**
 * Toggles the theme and verifies the applied class.
 *
 * @param {string} expectedClass - The expected class to be applied ("dark" or not "dark").
 * @param {string} logMessage - The log message to indicate the action performed.
 */
const toggleThemeAndVerify = (expectedClass: string, logMessage: string) => {
  cy.get('[data-cy="toggle-button"]').should("be.visible").click();
  cy.log(logMessage);
  cy.wait(500); // Allow time for the class to update
  if (expectedClass === "dark") {
    cy.get("html").should("have.class", "dark");
  } else {
    cy.get("html").should("not.have.class", "dark");
  }
};

describe("Theme Toggle", () => {
  beforeEach(() => {
    // Ensure the theme starts as 'light' at the beginning of the test
    cy.visit("/");
    cy.wait(500); // Ensure the page fully loads

    // Verify initial theme and toggle if needed
    cy.get("html").then(($html) => {
      if ($html.hasClass("dark")) {
        toggleThemeAndVerify("light", "Switching to light mode for consistent testing");
      }
    });

    // Ensure the theme is set to 'light'
    cy.get("html").should("not.have.class", "dark");
  });

  it("should toggle between light and dark modes and persist after reload", () => {
    // Toggle to 'dark' mode
    toggleThemeAndVerify("dark", "Switching to dark mode");

    // Reload and verify 'dark' mode persists
    cy.reload();
    cy.get("html").should("have.class", "dark");
    cy.log("Dark mode persisted after reload");

    // Toggle back to 'light' mode
    toggleThemeAndVerify("light", "Switching back to light mode");

    // Reload and verify 'light' mode persists
    cy.reload();
    cy.get("html").should("not.have.class", "dark");
    cy.log("Light mode persisted after reload");
  });
});
