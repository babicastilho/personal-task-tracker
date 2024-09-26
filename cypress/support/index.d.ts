/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in a user.
     * @example cy.login('user@example.com', 'password123')
     * @param email - The email of the user to log in.
     * @param password - The password of the user to log in.
     * @returns {Chainable<any>} - The chainable Cypress object.
     */
    login(email: string, password: string, redirectUrl: string): Chainable<any>;

    /**
     * Custom command to log out a user.
     * @example cy.logout()
     * @returns {Chainable<any>} - The chainable Cypress object.
     */
    logout(): Chainable<any>;

    /**
     * Custom command to reset a user (delete and recreate).
     * @example cy.resetUser('user@example.com', 'password123')
     * @param email - The email of the user to reset.
     * @param password - The password of the user to reset.
     * @param profileData - Custom profile data, such firstName, lastName, etc.
     * @returns {Chainable<any>} - The chainable Cypress object.
     */
    resetUser(email: string, password: string, profileData: any): Chainable<any>;

    /**
     * Custom command to delete a user.
     * @example cy.deleteUser('user@example.com', 'password123')
     * @param email - The email of the user to delete.
     * @param password - The password of the user to delete.
     * @returns {Chainable<any>} - The chainable Cypress object.
     */
    deleteUser(email: string, password: string): Chainable<any>;
  }
}
