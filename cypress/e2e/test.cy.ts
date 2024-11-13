describe('Test baseUrl Configuration', () => {
  it('should visit the home page', () => {
    cy.visit('/');
    cy.get('[data-cy="signin_message"]').should('be.visible');
  });
});
