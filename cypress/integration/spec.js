import "@testing-library/cypress/add-commands";

import "cypress-iframe";

it("loads the page", () => {
  cy.visit("/");
  cy.contains("Kitty Items").should("be.visible");
});

