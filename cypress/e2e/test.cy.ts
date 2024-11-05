describe('Test baseUrl Configuration', () => {
  it('should visit the home page', () => {
    cy.visit('/');
    cy.contains('Sign In'); 
  });
});
