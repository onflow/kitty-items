/// <reference types="cypress-iframe" />
require("cypress-iframe");

it("loads the page", () => {
  cy.visit("/");
  cy.contains("Kitty Items").should("be.visible");
});

it("Opens the dev-wallet UI on Login", () => {
  cy.visit("/");
  cy.contains("Log In").click();
  cy.wait(10000);
  cy.frameLoaded();
  cy.iframe().find("h3");
});
