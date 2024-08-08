describe('Theme Toggle', () => {
  beforeEach(() => {
    // Visit the full URL directly
    cy.visit('http://localhost:3000');
  });

  it('should toggle between light and dark modes', () => {
    // Check initial theme (assume it's light)
    cy.get('html').should('have.class', 'light');

    // Toggle to dark mode
    cy.get('.toggle-button').click();
    cy.get('html').should('have.class', 'dark');

    // Toggle back to light mode
    cy.get('.toggle-button').click();
    cy.get('html').should('have.class', 'light');
  });

  it('should persist theme after reload', () => {
    // Toggle to dark mode
    cy.get('.toggle-button').click();
    cy.get('html').should('have.class', 'dark');

    // Reload the page and check if the theme is still dark
    cy.reload();
    cy.get('html').should('have.class', 'dark');

    // Toggle back to light mode
    cy.get('.toggle-button').click();
    cy.get('html').should('have.class', 'light');

    // Reload the page and check if the theme is still light
    cy.reload();
    cy.get('html').should('have.class', 'light');
  });
});
