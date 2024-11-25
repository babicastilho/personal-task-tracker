/// <reference types="cypress" />

import { navigateAndVerify } from "../support/utils";

describe("Unauthenticated User Redirection", () => {
  before(() => {
    cy.task("log", "Resetting user for tests");
    cy.resetUser("test@example.com", "password123", {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JaneS",
      username: "janesmith",
    });
  });

  beforeEach(() => {
    cy.task("log", "Logging out and clearing storage");
    cy.logout();
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.reload();
    cy.wait(1000);
  });

  const unauthenticatedRoutes = [
    { route: "/dashboard", expectedRedirect: "/login?message=no_token" },
    { route: "/tasks", expectedRedirect: "/login?message=no_token" },
    { route: "/categories", expectedRedirect: "/login?message=no_token" },
    { route: "/profile", expectedRedirect: "/login?message=no_token" },
  ];

  unauthenticatedRoutes.forEach(({ route, expectedRedirect }) => {
    it(`should redirect unauthenticated users from ${route} to ${expectedRedirect}`, () => {
      cy.task("log", `Visiting ${route} as unauthenticated user`);
      cy.visit(route);
      cy.url({ timeout: 10000 }).should("include", expectedRedirect);
    });
  });

  after(() => {
    cy.task("log", "Deleting test user");
    cy.deleteUser("test@example.com", "password123");
  });
});
