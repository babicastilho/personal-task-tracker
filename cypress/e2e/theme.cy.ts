describe("Theme Toggle", () => {
  beforeEach(() => {
    // Garante que o tema comece como 'light' no início do teste
    cy.visit("/");
    cy.wait(500); // Pequeno delay para garantir que o Cypress carregue a página

    // Verifica se a classe inicial está como 'light' e clica se necessário
    cy.get("html").then(($html) => {
      if ($html.hasClass("dark")) {
        cy.get('[data-cy="toggle-button"]').click();
        cy.wait(500); // Pausa após o clique para garantir a atualização
      }
    });
    cy.get("html").should("not.have.class", "dark");
  });

  it("should toggle between light and dark modes and persist after reload", () => {
    // Clica no botão para alternar o tema para 'dark'
    cy.get('[data-cy="toggle-button"]').should("be.visible").click();
    cy.wait(500); // Pausa para garantir que a classe seja atualizada
    cy.get("html").should("have.class", "dark");

    // Recarrega a página e verifica se o tema persiste como 'dark'
    cy.reload();
    cy.get("html").should("have.class", "dark");

    // Clica novamente para voltar ao tema 'light'
    cy.get('[data-cy="toggle-button"]').click();
    cy.wait(500); // Pausa para garantir que a classe seja atualizada
    cy.get("html").should("not.have.class", "dark");

    // Recarrega novamente para verificar se o tema 'light' persiste
    cy.reload();
    cy.get("html").should("not.have.class", "dark");
  });
});
