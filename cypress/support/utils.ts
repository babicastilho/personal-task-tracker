/**
 * utils.ts
 *
 * Utility functions for Cypress tests to promote reusability and maintain consistency.
 */

/**
 * Checks the visibility of an element on the page.
 * Logs success or failure based on the presence of the element.
 * 
 * @param {string} selector - The data-cy selector of the element to check.
 * @param {string} logMessage - The message to log if the element exists.
 * @param {string} [notFoundMessage] - Optional message to log if the element is not found.
 */
export const checkElementVisibility = (
  selector: string, 
  logMessage: string, 
  notFoundMessage: string = "Element not found"
) => {
  cy.get("body").then(($body) => {
    if ($body.find(selector).length > 0) {
      cy.log(logMessage);
      cy.get(selector).should("be.visible");
    } else {
      cy.log(notFoundMessage);
    }
  });
};

/**
 * Checks if multiple elements are visible on the page.
 * Logs success or failure for each element based on its presence.
 * 
 * @param {Array<{ selector: string, logMessage: string, notFoundMessage?: string }>} elements
 *  - List of selectors and their log messages.
 *  - Each element should have a selector and a corresponding log message.
 *  - Optional: A custom notFoundMessage for elements not found.
 */
export const checkMultipleElementsVisibility = (
  elements: Array<{
    selector: string;
    logMessage: string;
    notFoundMessage?: string;
  }>
) => {
  elements.forEach(({ selector, logMessage, notFoundMessage }) => {
    checkElementVisibility(selector, logMessage, notFoundMessage);
  });
};

/**
 * Navigates to a URL and verifies the presence of an expected URL or element on the page.
 * Supports multiple expected URLs for flexibility.
 *
 * @param {string} url - The URL to visit.
 * @param {string | string[]} [expectedUrl=url] - The expected URL(s) to validate.
 * @param {string} [selector] - The optional selector to check for element presence.
 * @param {number} [timeout=15000] - Timeout for the URL and element checks.
 */
export const navigateAndVerify = (
  url: string,
  expectedUrl: string | string[] = url,
  selector?: string,
  timeout = 15000
) => {
  cy.visit(url);

  // Convert expectedUrl to an array for consistent handling of multiple values
  const expectedUrls = Array.isArray(expectedUrl) ? expectedUrl : [expectedUrl];

  // Verify the current URL matches any of the expected URLs
  cy.url({ timeout }).should((currentUrl) => {
    const match = expectedUrls.some((expected) => currentUrl.includes(expected));
    expect(match, `Expected one of ${expectedUrls}, but got ${currentUrl}`).to.be.true;
  });

  // Optionally check for an element on the page
  if (selector) {
    cy.get("body").then(($body) => {
      if ($body.find(selector).length > 0) {
        cy.log(`Page at ${expectedUrls} loaded successfully`);
        cy.get(selector).should("exist");
      } else {
        cy.log(`Page at ${expectedUrls} failed to load`);
      }
    });
  }
};
