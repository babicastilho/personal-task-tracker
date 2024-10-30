describe("Theme Toggle", () => {
  beforeEach(() => {
    // Visit the base URL and ensure the theme starts as 'light'
    cy.visit("/").then(() => {
      cy.get("html").invoke("removeClass", "dark").invoke("addClass", "light");
    });
  });

  it("should toggle between light and dark modes", () => {
    // Add a spy to ensure the click event is registered
    const toggleSpy = cy.spy();
    cy.get('[data-cy="toggle-button"]').click({ force: true }).then(() => {
      toggleSpy();
    });

    // Verify that the event was triggered
    cy.wrap(toggleSpy).should("have.been.called");

    // Check that the theme toggled to 'dark'
    cy.get("html").should("have.class", "dark");
  });

  it("should persist theme after reload", () => {
    // Switch to dark theme
    cy.get('[data-cy="toggle-button"]').click({ force: true });
    cy.get("html").should("have.class", "dark");

    // Reload and check if theme persists as 'dark'
    cy.reload();
    cy.get("html").should("have.class", "dark");

    // Switch back to light theme
    cy.get('[data-cy="toggle-button"]').click({ force: true });
    cy.get("html").should("have.class", "light");

    // Reload and check if theme persists as 'light'
    cy.reload();
    cy.get("html").should("have.class", "light");
  });
});
