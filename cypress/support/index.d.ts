/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to log in a user.
     * @example cy.login('user@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>;
  }
}

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Custom command to reset a user by deleting if exists and re-registering.
     * @example cy.resetUser('user@example.com', 'password123')
     */
    resetUser(email: string, password: string): Chainable<any>; 
    
    /**
     * Custom command to log in a user.
     * @example cy.login('user@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<any>; 
  }
}
