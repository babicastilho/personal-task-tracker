/// <reference types="cypress" />

describe("Unauthenticated User Redirection", () => {
  before(() => {
    cy.task('log', 'Reseting user for tests');
    cy.resetUser("test@example.com", "password123", {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JaneS",
      username: "janesmith",
    });
  });

  beforeEach(() => {
    cy.task('log', 'Logging out and clearing storage');
    cy.logout();
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.reload();
    cy.wait(1000);
  });

  it("should redirect unauthenticated users from /dashboard to /login with no_token message", () => {
    cy.task('log', 'Visiting /dashboard as unauthenticated user');
    cy.visit("/dashboard");
    cy.url({ timeout: 10000 }).should("include", "/login?message=no_token");
  });

  it("should redirect unauthenticated users from /tasks to /login with no_token message", () => {
    cy.task('log', 'Visiting /tasks as unauthenticated user');
    cy.visit("/tasks");
    cy.url({ timeout: 10000 }).should("include", "/login?message=no_token");

    // cy.url({ timeout: 10000 }).should(($url) => {
    //   expect($url).to.satisfy((url) =>
    //     url.includes("/login?message=no_token") || url.includes("/login?message=session_expired")
    //   );
    // });
    
  });

  it("should redirect unauthenticated users from /categories to /login with no_token message", () => {
    cy.task('log', 'Visiting /categories as unauthenticated user');
    cy.visit("/categories");
    cy.url({ timeout: 10000 }).should("include", "/login?message=no_token");
  });

  it("should redirect unauthenticated users from /profile to /login with no_token message", () => {
    cy.task('log', 'Visiting /profile as unauthenticated user');
    cy.visit("/profile");
    cy.url({ timeout: 10000 }).should("include", "/login?message=no_token");
  });

  after(() => {
    cy.task('log', 'Deleting test user');
    cy.deleteUser("test@example.com", "password123");
  });
});
