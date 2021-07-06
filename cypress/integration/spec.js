it("loads the page", () => {
  cy.visit("/");
  cy.contains("Kitty Items").should("be.visible");
});
