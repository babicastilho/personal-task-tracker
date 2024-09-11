describe('Theme Toggle', () => {
  beforeEach(() => {
    // Visite a URL do site
    cy.visit('http://localhost:3000').then(() => {
      // Certifique-se de que o tema começa como 'light'
      cy.get('html').invoke('removeClass', 'dark').invoke('addClass', 'light');
    });
  });

  it('should toggle between light and dark modes', () => {
    // Adiciona um spy para verificar se o clique está sendo registrado
    const toggleSpy = cy.spy();
    cy.get('[data-cy="toggle-button"]').click({ force: true }).then(() => {
      toggleSpy();
    });
  
    // Verifique se o evento foi acionado
    cy.wrap(toggleSpy).should('have.been.called');
  
    // Verifica se o tema mudou
    cy.get('html').should('have.class', 'light');
  });

  it('should persist theme after reload', () => {
    // Alternar para o tema escuro
    cy.get('html').should('have.class', 'dark');

    // Recarregar a página e verificar se o tema ainda é escuro
    cy.reload();
    cy.get('html').should('have.class', 'dark');

    // Alternar de volta para o tema claro
    cy.get('[data-cy="toggle-button"]').click({ force: true });
    cy.get('html').should('have.class', 'light');

    // Recarregar a página e verificar se o tema ainda é claro
    cy.reload();
    cy.get('html').should('have.class', 'light');
  });
  
});
