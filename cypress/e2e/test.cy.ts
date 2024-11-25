import { checkElementVisibility } from "../support/utils";

describe("Home Page", () => {
  it("should display sign-in message", () => {
    cy.visit("/");
    checkElementVisibility(
      '[data-cy="signin_message"]',
      "Sign-in message is displayed",
      "Sign-in message is missing"
    );
  });
});
